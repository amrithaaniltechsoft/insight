import { NextRequest } from "next/server";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getDb } from "@/lib/db";
import {
  EMAIL_PATTERN,
  GENDERS,
  PatientInput,
  PatientRow,
  asId,
  asNullable,
  asString,
  findCustomerIdByEmail,
  findExistingPatient,
  joinAddress,
  normaliseDate,
  readPatientById,
  serialisePatient,
  writePatient,
} from "@/lib/patients";

export const dynamic = "force-dynamic";

/**
 * Reads and writes the people a customer books for, i.e. the "My People" list on
 * the profile page and the person chips in the booking wizard.
 *
 * These are real `patients` rows rather than browser-local entries, so the same
 * list follows the customer across devices. Family members are patients, never
 * customers, so nothing here writes to `customers`.
 *
 * Deleting is possible only for a person with no appointments, because
 * `appointments.patient_id` cascades. See the DELETE handler below.
 */
export async function GET(request: NextRequest) {
  const customerEmail = request.nextUrl.searchParams.get("customer_email") ?? "";
  const conn = await getDb().getConnection();

  try {
    const customerId = await findCustomerIdByEmail(conn, customerEmail);

    // An unknown email is not an error — it just means this visitor has no
    // customer record yet (a guest, or someone who has not booked). Returning an
    // empty list lets the page render its empty state instead of an error.
    if (customerId === null) {
      return Response.json({ people: [], customer_found: false });
    }

    const [rows] = await conn.query<PatientRow[]>(
      `SELECT p.id, p.patient_code, p.customer_id, p.first_name, p.last_name, p.title,
              p.dob, p.gender, p.email, p.phone, p.address, p.status, p.created_at,
              p.updated_at,
              (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id)
                AS appointment_count
         FROM patients p
         JOIN customers c ON c.id = p.customer_id
        WHERE p.customer_id = ?
          AND NOT (p.email IS NOT NULL AND LOWER(p.email) = LOWER(c.email))
        ORDER BY p.created_at DESC, p.id DESC`,
      [customerId]
    );

    return Response.json({
      people: rows.map(serialisePatient),
      customer_found: true,
    });
  } catch (error) {
    console.error("List patients API error:", error);
    return Response.json(
      { message: "Failed to load your people." },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

/**
 * Creates or updates one of the customer's people. Used by "Add Person" on the
 * profile page and by the booking wizard's inline "Add Person".
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const customerEmail = asString(body.customer_email).toLowerCase();
  if (!EMAIL_PATTERN.test(customerEmail)) {
    return Response.json(
      { message: "A valid email address is required to save this person." },
      { status: 422 }
    );
  }

  const firstName = asString(body.first_name);
  const lastName = asString(body.last_name);
  if (!firstName || !lastName) {
    return Response.json(
      { message: "First name and last name are required." },
      { status: 422 }
    );
  }

  const gender = asString(body.gender);
  if (!GENDERS.includes(gender)) {
    return Response.json(
      { message: `Gender must be one of: ${GENDERS.join(", ")}.` },
      { status: 422 }
    );
  }

  const dob = normaliseDate(body.dob);
  if (!dob) {
    return Response.json(
      { message: "A valid date of birth is required." },
      { status: 422 }
    );
  }

  // A relative or friend often has no email of their own, so it stays optional
  // here. Rejecting a malformed one still matters, because that string is the
  // primary key we dedupe on.
  const email = asString(body.email).toLowerCase();
  if (email && !EMAIL_PATTERN.test(email)) {
    return Response.json(
      { message: "Please provide a valid email address." },
      { status: 422 }
    );
  }

  const input: PatientInput = {
    firstName,
    lastName,
    title: asNullable(body.title, 255),
    gender,
    dob,
    email: email || null,
    phone: asNullable(body.phone, 50),
    address: joinAddress([
      asString(body.address_line_1),
      asString(body.address_line_2),
      asString(body.suburb),
      asString(body.city),
      asString(body.state),
      asString(body.zip_code),
      asString(body.country),
    ]),
  };

  const conn = await getDb().getConnection();

  try {
    await conn.beginTransaction();

    const customerId = await findCustomerIdByEmail(conn, customerEmail);
    if (customerId === null) {
      await conn.rollback();
      return Response.json(
        {
          message:
            "We could not find your account. Please sign in and try again.",
        },
        { status: 404 }
      );
    }

    // Editing an existing person passes their id. It is scoped to the customer
    // so one account can never overwrite another account's patient row.
    const requestedPatientId = asId(body.patient_id);
    let existingPatientId: number | null = null;

    if (requestedPatientId !== null) {
      const [owned] = await conn.query<RowDataPacket[]>(
        "SELECT id FROM patients WHERE id = ? AND customer_id = ? LIMIT 1",
        [requestedPatientId, customerId]
      );
      if (owned.length) existingPatientId = Number(owned[0].id);
    }

    if (existingPatientId === null) {
      existingPatientId = await findExistingPatient(conn, customerId, input);
    }

    const patientExisted = existingPatientId !== null;
    const savedPatientId = await writePatient(
      conn,
      customerId,
      input,
      existingPatientId
    );
    const patient = await readPatientById(conn, savedPatientId);

    await conn.commit();

    return Response.json({
      message: patientExisted
        ? "Person updated successfully."
        : "Person added successfully.",
      created: !patientExisted,
      person: serialisePatient(patient),
    });
  } catch (error) {
    await conn.rollback();
    console.error("Save patient API error:", error);
    return Response.json(
      { message: "Failed to save this person." },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}

/**
 * Removes one of the customer's people, but only while they have no
 * appointments.
 *
 * `appointments.patient_id` is declared ON DELETE CASCADE, so deleting a
 * patient who has ever booked would silently delete their appointment history
 * too. The schema cannot be changed to add a RESTRICT constraint, so that check
 * is enforced here instead — the UI hides the button, but this is what actually
 * prevents the cascade.
 */
export async function DELETE(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const customerEmail = asString(params.get("customer_email")).toLowerCase();
  const patientId = asId(params.get("patient_id"));

  if (!EMAIL_PATTERN.test(customerEmail)) {
    return Response.json(
      { message: "A valid email address is required." },
      { status: 422 }
    );
  }

  if (patientId === null) {
    return Response.json(
      { message: "A valid person is required." },
      { status: 422 }
    );
  }

  const conn = await getDb().getConnection();

  try {
    await conn.beginTransaction();

    const customerId = await findCustomerIdByEmail(conn, customerEmail);
    if (customerId === null) {
      await conn.rollback();
      return Response.json(
        { message: "We could not find your account." },
        { status: 404 }
      );
    }

    // Scoped to the customer, so one account cannot delete another account's
    // patient row.
    const [owned] = await conn.query<RowDataPacket[]>(
      `SELECT p.id, p.patient_code, p.first_name, p.last_name,
              (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id)
                AS appointment_count
         FROM patients p
        WHERE p.id = ? AND p.customer_id = ?
        LIMIT 1`,
      [patientId, customerId]
    );

    if (!owned.length) {
      await conn.rollback();
      return Response.json(
        { message: "We could not find that person on your account." },
        { status: 404 }
      );
    }

    const appointmentCount = Number(owned[0].appointment_count ?? 0);

    if (appointmentCount > 0) {
      await conn.rollback();
      return Response.json(
        {
          message:
            "This person has bookings, so their record cannot be removed. Please contact the clinic if it needs to be corrected.",
          appointment_count: appointmentCount,
        },
        { status: 409 }
      );
    }

    const [result] = await conn.query<ResultSetHeader>(
      "DELETE FROM patients WHERE id = ? AND customer_id = ?",
      [patientId, customerId]
    );

    if (!result.affectedRows) {
      await conn.rollback();
      return Response.json(
        { message: "That person was already removed." },
        { status: 404 }
      );
    }

    await conn.commit();

    return Response.json({
      message: "Person removed successfully.",
      deleted: {
        id: Number(owned[0].id),
        patient_code: owned[0].patient_code,
        name: [owned[0].first_name, owned[0].last_name].filter(Boolean).join(" "),
      },
    });
  } catch (error) {
    await conn.rollback();
    console.error("Delete patient API error:", error);
    return Response.json(
      { message: "Failed to remove this person." },
      { status: 500 }
    );
  } finally {
    conn.release();
  }
}
