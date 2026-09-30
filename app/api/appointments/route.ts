import { NextRequest } from "next/server";
import type { PoolConnection, RowDataPacket } from "mysql2/promise";
import { dbFailureResponse, getDb } from "@/lib/db";
import { hasTitleColumn } from "@/lib/patients";
import {
  EMAIL_PATTERN,
  asId,
  asString,
  findCustomerIdByEmail,
  formatDate,
} from "@/lib/patients";

export const dynamic = "force-dynamic";

interface AppointmentRow extends RowDataPacket {
  id: number;
  appointment_code: string;
  patient_id: number;
  patient_code: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_title: string | null;
  service_id: number | null;
  service_name: string | null;
  service_title: string | null;
  service_price: string | null;
  category_name: string | null;
  category_slug: string | null;
  // DATE and TIME columns; mysql2 can hydrate either as a Date or a string.
  appointment_date: Date | string;
  start_time: Date | string;
  end_time: Date | string | null;
  status: string;
  payment_status: string;
  source: string;
  notes: string | null;
  created_at: Date | string | null;
}

/**
 * `patients.title` is only selected when the column is actually there; see
 * hasTitleColumn in lib/patients. Naming a column the database does not have
 * would fail the whole query, taking the booking list down over a title.
 */
const selectAppointments = (withTitle: boolean) => `
  SELECT a.id, a.appointment_code, a.patient_id,
         p.patient_code, p.first_name AS patient_first_name,
         p.last_name AS patient_last_name,
         ${withTitle ? "p.title AS patient_title," : ""}
         a.service_id, s.service_name, s.title AS service_title,
         s.price AS service_price, c.name AS category_name, c.slug AS category_slug,
         a.appointment_date, a.start_time, a.end_time,
         a.status, a.payment_status, a.source, a.notes, a.created_at
    FROM appointments a
    JOIN patients p ON p.id = a.patient_id
    LEFT JOIN services s ON s.id = a.service_id
    LEFT JOIN categories c ON c.id = s.category_id`;

/** MySQL TIME comes back as "HH:MM:SS"; trim it to "HH:MM" for display. */
function formatTime(value: Date | string | null): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toTimeString().slice(0, 5);
  }
  return String(value).slice(0, 5);
}

function serialise(row: AppointmentRow) {
  return {
    id: row.id,
    appointment_code: row.appointment_code,
    patient_id: row.patient_id,
    patient_code: row.patient_code,
    patient_title: row.patient_title ?? null,
    patient_name: [row.patient_title, row.patient_first_name, row.patient_last_name]
      .filter(Boolean)
      .join(" "),
    service_id: row.service_id,
    // `title` is the specific test or scan; `service_name` is the broader
    // service it sits under. Either can be null, so both are returned.
    service_name: row.service_title || row.service_name,
    service_group: row.service_name,
    service_price: row.service_price,
    category_name: row.category_name,
    category_slug: row.category_slug,
    appointment_date: formatDate(row.appointment_date),
    start_time: formatTime(row.start_time),
    end_time: formatTime(row.end_time),
    status: row.status,
    payment_status: row.payment_status,
    source: row.source,
    notes: row.notes,
    created_at: row.created_at,
  };
}

/**
 * Reads a customer's appointments from the `appointments` table.
 *
 * Every row is written when the booking wizard reaches Continue, so this is the
 * record of truth for what someone has booked — the browser copy in
 * localStorage is only a cache of the confirmation step.
 *
 * Access is always scoped to one customer: `customer_email` identifies whose
 * appointments are being read, and `patient_id` narrows to one person within
 * that customer. Asking for a patient who belongs to somebody else returns an
 * empty list rather than their data.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const customerEmail = asString(params.get("customer_email")).toLowerCase();
  const patientId = asId(params.get("patient_id"));

  if (!EMAIL_PATTERN.test(customerEmail)) {
    return Response.json(
      { message: "A valid email address is required." },
      { status: 422 }
    );
  }

  let conn: PoolConnection;
  try {
    conn = await getDb().getConnection();
  } catch (error) {
    return dbFailureResponse(
      "List appointments API error:",
      error,
      "Failed to load appointments."
    );
  }

  try {
    const customerId = await findCustomerIdByEmail(conn, customerEmail);

    // No customer record means no appointments — a guest, or someone who has
    // not booked. That is an empty list, not an error.
    if (customerId === null) {
      return Response.json({ appointments: [], customer_found: false });
    }

    const select = selectAppointments(await hasTitleColumn(conn));

    let rows: AppointmentRow[];

    if (patientId !== null) {
      // The patient_id is matched against this customer in the same query, so
      // one account can never read another account's appointments.
      [rows] = await conn.query<AppointmentRow[]>(
        `${select}
          WHERE p.customer_id = ? AND a.patient_id = ?
          ORDER BY a.appointment_date DESC, a.start_time DESC, a.id DESC`,
        [customerId, patientId]
      );
    } else {
      [rows] = await conn.query<AppointmentRow[]>(
        `${select}
          WHERE p.customer_id = ?
          ORDER BY a.appointment_date DESC, a.start_time DESC, a.id DESC`,
        [customerId]
      );
    }

    return Response.json({
      appointments: rows.map(serialise),
      customer_found: true,
    });
  } catch (error) {
    return dbFailureResponse(
      "List appointments API error:",
      error,
      "Failed to load appointments."
    );
  } finally {
    conn.release();
  }
}
