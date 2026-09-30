import { NextRequest } from "next/server";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { dbFailureResponse, getDb } from "@/lib/db";
import {
  EMAIL_PATTERN,
  GENDERS,
  PatientInput,
  asNullable,
  asString,
  findExistingPatient,
  formatDate,
  isDuplicateKeyError,
  joinAddress,
  normaliseDate,
  pad2,
  readPatientById,
  serialisePatient,
  writePatient,
} from "@/lib/patients";

export const dynamic = "force-dynamic";

interface CustomerRow extends RowDataPacket {
  id: number;
  customer_code: string | null;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  title: string | null;
  // mysql2 hydrates DATE/TIMESTAMP columns into JS Date objects by default.
  dob: Date | string;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  suburb: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

function generateCustomerCode(): string {
  // Mirrors the Laravel register() format but uses a wider range to lower
  // collision odds — customer_code has no unique index on the table.
  return `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Converts a slot time to MySQL TIME ("HH:MM:SS"). The wizard offers slots as
 * "09:00 AM", but 24-hour values are accepted too so a future caller is not
 * forced into a single format.
 */
function normaliseTime(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;

  const twentyFourHour = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (twentyFourHour) {
    const hours = Number(twentyFourHour[1]);
    const minutes = Number(twentyFourHour[2]);
    const seconds = Number(twentyFourHour[3] ?? 0);
    if (hours > 23 || minutes > 59 || seconds > 59) return null;
    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  }

  const twelveHour = raw.match(/^(\d{1,2}):(\d{2})\s*([AaPp])\.?[Mm]\.?$/);
  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2]);
    const meridiem = twelveHour[3].toUpperCase();
    if (hours < 1 || hours > 12 || minutes > 59) return null;
    // 12 AM is midnight and 12 PM is noon, so only the other values shift.
    if (meridiem === "P" && hours !== 12) hours += 12;
    if (meridiem === "A" && hours === 12) hours = 0;
    return `${pad2(hours)}:${pad2(minutes)}:00`;
  }

  return null;
}

interface AppointmentRow extends RowDataPacket {
  id: number;
  appointment_code: string;
  patient_id: number;
  clinic_id: number | null;
  service_id: number | null;
  staff_id: number | null;
  appointment_date: Date | string;
  // TIME columns come back as strings, but mysql2 can hydrate them as Date
  // depending on the connection config, so both are handled.
  start_time: Date | string;
  end_time: Date | string | null;
  status: string;
  payment_status: string;
  source: string;
  notes: string | null;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

interface AppointmentInput {
  patientId: number;
  appointmentDate: string;
  startTime: string;
  serviceId: number | null;
  notes: string | null;
}

function generateAppointmentCode(): string {
  // Same 'APT-' + digits shape the admin portal generates, widened to six digits
  // because appointment_code carries a unique index and rand(1000, 9999) in the
  // admin controller collides easily at scale.
  return `APT-${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Looks for an appointment already booked for this patient at this slot, so
 * pressing Continue twice does not create two rows. `appointments` has no unique
 * index on that trio, only on appointment_code, so this has to be an explicit
 * lookup.
 */
async function findExistingAppointment(
  conn: PoolConnection,
  patientId: number,
  appointmentDate: string,
  startTime: string
): Promise<number | null> {
  const [rows] = await conn.query<RowDataPacket[]>(
    `SELECT id FROM appointments
      WHERE patient_id = ?
        AND appointment_date = ?
        AND start_time = ?
      ORDER BY id ASC
      LIMIT 1`,
    [patientId, appointmentDate, startTime]
  );
  return rows.length ? Number(rows[0].id) : null;
}

async function writeAppointment(
  conn: PoolConnection,
  input: AppointmentInput,
  existingAppointmentId: number | null
): Promise<number> {
  if (existingAppointmentId !== null) {
    await conn.query<ResultSetHeader>(
      `UPDATE appointments
          SET service_id      = ?,
              notes           = ?,
              status          = 'Scheduled',
              payment_status  = 'Pending',
              updated_at      = NOW()
        WHERE id = ?`,
      [input.serviceId, input.notes, existingAppointmentId]
    );
    return existingAppointmentId;
  }

  // Retry on appointment_code collision, which concurrent requests can cause.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const [result] = await conn.query<ResultSetHeader>(
        `INSERT INTO appointments
           (appointment_code, patient_id, clinic_id, service_id, staff_id,
            appointment_date, start_time, end_time, status, payment_status,
            source, notes, created_at, updated_at)
         VALUES (?, ?, NULL, ?, NULL, ?, ?, NULL, 'Scheduled', 'Pending',
                 'web_frontend', ?, NOW(), NOW())`,
        [
          generateAppointmentCode(),
          input.patientId,
          input.serviceId,
          input.appointmentDate,
          input.startTime,
          input.notes,
        ]
      );
      return result.insertId;
    } catch (error) {
      if (!isDuplicateKeyError(error) || attempt === 2) throw error;
    }
  }

  throw new Error("Could not allocate an appointment_code after three attempts.");
}

async function readAppointmentById(
  conn: PoolConnection,
  appointmentId: number
): Promise<AppointmentRow> {
  const [rows] = await conn.query<AppointmentRow[]>(
    `SELECT id, appointment_code, patient_id, clinic_id, service_id, staff_id,
            appointment_date, start_time, end_time, status, payment_status,
            source, notes, created_at, updated_at
       FROM appointments
      WHERE id = ?
      LIMIT 1`,
    [appointmentId]
  );
  return rows[0];
}

function serialiseAppointment(appointment: AppointmentRow) {
  return {
    id: appointment.id,
    appointment_code: appointment.appointment_code,
    patient_id: appointment.patient_id,
    clinic_id: appointment.clinic_id,
    service_id: appointment.service_id,
    staff_id: appointment.staff_id,
    appointment_date: formatDate(appointment.appointment_date),
    start_time:
      appointment.start_time instanceof Date
        ? appointment.start_time.toTimeString().slice(0, 8)
        : String(appointment.start_time).slice(0, 8),
    end_time: appointment.end_time
      ? String(appointment.end_time).slice(0, 8)
      : null,
    status: appointment.status,
    payment_status: appointment.payment_status,
    source: appointment.source,
    notes: appointment.notes,
    created_at: appointment.created_at,
    updated_at: appointment.updated_at,
  };
}

function serialiseCustomer(customer: CustomerRow) {
  return {
    id: customer.id,
    customer_code: customer.customer_code,
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email,
    gender: customer.gender,
    title: customer.title,
    dob: formatDate(customer.dob),
    phone: customer.phone,
    address_line_1: customer.address_line_1,
    address_line_2: customer.address_line_2,
    suburb: customer.suburb,
    city: customer.city,
    state: customer.state,
    zip_code: customer.zip_code,
    country: customer.country,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
  };
}

/**
 * Books a patient record, and decides whether the booker should also be
 * written to `customers`.
 *
 * - `booking_for: "self"` — the person booking is the patient. Their details
 *   are upserted into `customers` (keyed on its unique email) and a patient row
 *   is linked to it. This is the guest-booking path as well as the returning
 *   customer's.
 * - `booking_for: "other"` — the booker is paying for a relative or friend.
 *   `customers` is left completely untouched: a family member is a patient, not
 *   a customer. The patient is attached to the booker's customer record so the
 *   clinic can see who arranged it.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const bookingFor = asString(body.booking_for) === "other" ? "other" : "self";

  const firstName = asString(body.first_name);
  const lastName = asString(body.last_name);
  if (!firstName || !lastName) {
    return Response.json({ message: "First name and last name are required." }, { status: 422 });
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
    return Response.json({ message: "A valid date of birth is required." }, { status: 422 });
  }

  // The appointment slot is chosen in step 1, so by the time the user reaches
  // Continue it is always present.
  const appointmentDate = normaliseDate(body.appointment_date);
  if (!appointmentDate) {
    return Response.json({ message: "A valid appointment date is required." }, { status: 422 });
  }

  const startTime = normaliseTime(body.start_time);
  if (!startTime) {
    return Response.json({ message: "A valid appointment time is required." }, { status: 422 });
  }

  // A customer's email is the unique key they are matched on, so a self-booking
  // must have one. A relative or friend often has no email of their own, so it
  // stays optional on that path.
  const rawEmail = asString(body.email).toLowerCase();
  if (rawEmail && !EMAIL_PATTERN.test(rawEmail)) {
    return Response.json({ message: "Please provide a valid email address." }, { status: 422 });
  }
  if (bookingFor === "self" && !rawEmail) {
    return Response.json({ message: "A valid email address is required." }, { status: 422 });
  }

  const title = asNullable(body.title, 20);
  const phone = asNullable(body.phone, 50);
  const addressLine1 = asNullable(body.address_line_1, 255);
  const addressLine2 = asNullable(body.address_line_2, 255);
  const suburb = asNullable(body.suburb, 255);
  const city = asNullable(body.city, 255);
  const state = asNullable(body.state, 255);
  const zipCode = asNullable(body.zip_code, 50);
  const country = asNullable(body.country, 255);

  // `patients.address` is a single free-text column, so the address lines the
  // customer table splits out get joined back into one string here.
  const address = joinAddress([
    addressLine1,
    addressLine2,
    suburb,
    city,
    state,
    zipCode,
    country,
  ]);

  const patientInput: PatientInput = {
    firstName,
    lastName,
    // The booking is for this person, so the same title the customers row gets
    // is stored against the patient too.
    title,
    gender,
    dob,
    email: rawEmail || null,
    phone,
    address,
  };

  // A `const` because recordAppointment below closes over it; a mutable binding
  // would widen back to `PoolConnection | null` inside that closure.
  let conn: PoolConnection;
  try {
    conn = await getDb().getConnection();
  } catch (error) {
    return dbFailureResponse(
      "Booking customer/patient API error:",
      error,
      "Failed to save the booking details."
    );
  }

  try {
    await conn.beginTransaction();

    // Resolve the service so the appointment points at the right row. The
    // frontend names a scan by its title, which lands in either service_name or
    // title depending on the category. If that is ambiguous we leave service_id
    // null rather than guess — the column is nullable and clinic_id/staff_id are
    // assigned by staff later.
    const serviceName = asString(body.service_name);
    let serviceId: number | null = null;
    if (serviceName) {
      const [serviceRows] = await conn.query<RowDataPacket[]>(
        "SELECT id FROM services WHERE service_name = ? OR title = ? LIMIT 2",
        [serviceName, serviceName]
      );
      if (serviceRows.length === 1) {
        serviceId = Number(serviceRows[0].id);
      }
    }

    const notes = asNullable(body.notes, 2000);

    /** Saves the appointment for whichever patient we just wrote. */
    const recordAppointment = async (patientId: number) => {
      const existingAppointmentId = await findExistingAppointment(
        conn,
        patientId,
        appointmentDate,
        startTime
      );
      const appointmentExisted = existingAppointmentId !== null;
      const savedId = await writeAppointment(
        conn,
        { patientId, appointmentDate, startTime, serviceId, notes },
        existingAppointmentId
      );
      const appointment = await readAppointmentById(conn, savedId);
      return { appointment, appointmentExisted };
    };

    if (bookingFor === "other") {
      // Resolve the booker so the patient can be attached to them. The booker is
      // the signed-in customer; a guest booking for someone else simply has no
      // customer record yet, which leaves customer_id null rather than inventing
      // a customer for the relative.
      const bookedByEmail = asString(body.booked_by_email).toLowerCase();
      let bookerCustomerId: number | null = null;

      if (bookedByEmail && EMAIL_PATTERN.test(bookedByEmail)) {
        const [bookerRows] = await conn.query<RowDataPacket[]>(
          "SELECT id FROM customers WHERE email = ? LIMIT 1",
          [bookedByEmail]
        );
        if (bookerRows.length) bookerCustomerId = Number(bookerRows[0].id);
      }

      const existingPatientId = await findExistingPatient(conn, bookerCustomerId, patientInput);
      const patientExisted = existingPatientId !== null;

      const savedPatientId = await writePatient(
        conn,
        bookerCustomerId,
        patientInput,
        existingPatientId
      );
      const patient = await readPatientById(conn, savedPatientId);
      const { appointment, appointmentExisted } = await recordAppointment(savedPatientId);

      await conn.commit();

      return Response.json({
        message: patientExisted
          ? "Patient updated successfully."
          : "Patient created successfully.",
        booking_for: "other",
        customer_touched: false,
        patient_created: !patientExisted,
        patient: serialisePatient(patient),
        appointment_created: !appointmentExisted,
        appointment: serialiseAppointment(appointment),
      });
    }

    // bookingFor === "self"
    // `created` reflects whether the customer row was inserted rather than
    // updated. updated_at is only bumped on the update path so an existing
    // record keeps its original created_at.
    const [existing] = await conn.query<RowDataPacket[]>(
      "SELECT id FROM customers WHERE email = ? LIMIT 1",
      [rawEmail]
    );
    const customerAlreadyExisted = existing.length > 0;

    await conn.query<ResultSetHeader>(
      `INSERT INTO customers
         (customer_code, email, first_name, last_name, gender, dob, title, phone,
          address_line_1, address_line_2, suburb, city, state, zip_code, country,
          status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         first_name    = VALUES(first_name),
         last_name     = VALUES(last_name),
         gender        = VALUES(gender),
         dob           = VALUES(dob),
         title         = VALUES(title),
         phone         = VALUES(phone),
         address_line_1 = VALUES(address_line_1),
         address_line_2 = VALUES(address_line_2),
         suburb        = VALUES(suburb),
         city          = VALUES(city),
         state         = VALUES(state),
         zip_code      = VALUES(zip_code),
         country       = VALUES(country),
         updated_at    = NOW()`,
      [
        generateCustomerCode(),
        rawEmail,
        firstName,
        lastName,
        gender,
        dob,
        title,
        phone,
        addressLine1,
        addressLine2,
        suburb,
        city,
        state,
        zipCode,
        country,
      ]
    );

    const [customerRows] = await conn.query<CustomerRow[]>(
      `SELECT id, customer_code, first_name, last_name, email, gender, title, dob,
              phone, address_line_1, address_line_2, suburb, city, state, zip_code,
              country, created_at, updated_at
         FROM customers
        WHERE email = ?
        LIMIT 1`,
      [rawEmail]
    );
    const customer = customerRows[0];

    const existingPatientId = await findExistingPatient(conn, customer.id, patientInput);
    const patientExisted = existingPatientId !== null;

    const savedPatientId = await writePatient(
      conn,
      customer.id,
      patientInput,
      existingPatientId
    );
    const patient = await readPatientById(conn, savedPatientId);
    const { appointment, appointmentExisted } = await recordAppointment(savedPatientId);

    await conn.commit();

    return Response.json({
      message: patientExisted
        ? "Customer and patient updated successfully."
        : "Customer and patient created successfully.",
      booking_for: "self",
      created: !customerAlreadyExisted,
      customer_touched: true,
      patient_created: !patientExisted,
      appointment_created: !appointmentExisted,
      customer: serialiseCustomer(customer),
      patient: serialisePatient(patient),
      appointment: serialiseAppointment(appointment),
    });
  } catch (error) {
    await conn.rollback().catch(() => {});
    return dbFailureResponse(
      "Booking customer/patient API error:",
      error,
      "Failed to save the booking details."
    );
  } finally {
    conn.release();
  }
}
