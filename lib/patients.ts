import type {
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

/**
 * Shared patient helpers for the frontend booking and profile APIs.
 *
 * Both `app/api/customers` (the booking wizard's Continue action) and
 * `app/api/patients` (the "My People" list) create and update rows in the same
 * two tables, so the write path lives here once rather than being copied.
 */

export const GENDERS = ["Male", "Female", "Other"];
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface PatientRow extends RowDataPacket {
  id: number;
  patient_code: string;
  customer_id: number | null;
  first_name: string;
  last_name: string;
  title: string | null;
  // mysql2 hydrates DATE/TIMESTAMP columns into JS Date objects by default.
  dob: Date | string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  status: string;
  /**
   * How many appointments reference this patient. Used to decide whether the
   * record may be removed, so the value must be selected alongside the row.
   */
  appointment_count?: number;
  created_at: Date | string | null;
  updated_at: Date | string | null;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  title: string | null;
  gender: string;
  dob: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Reads an identifier that may arrive as either a JSON string or a JSON number.
 * `asString` alone would silently drop `{"patient_id": 14}`, which would turn an
 * intended edit into a duplicate insert.
 */
export function asId(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }
  const str = asString(value);
  if (!/^\d+$/.test(str)) return null;
  const parsed = Number.parseInt(str, 10);
  return parsed > 0 ? parsed : null;
}

export function asNullable(value: unknown, maxLength: number): string | null {
  const str = asString(value);
  if (!str) return null;
  return str.slice(0, maxLength);
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

/** Accepts YYYY-MM-DD only, and rejects impossible dates such as 2026-02-31. */
export function normaliseDate(value: unknown): string | null {
  const str = asString(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;

  const [year, month, day] = str.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;

  return isRealDate ? str : null;
}

/** Formats a mysql2 DATE column as YYYY-MM-DD regardless of hydration mode. */
export function formatDate(value: Date | string | null): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    // DATE columns come back at local midnight, so read local components.
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
}

export function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "ER_DUP_ENTRY"
  );
}

/**
 * `patients` has one free-text `address` column, so the seven address fields the
 * forms collect have to be packed into that single string. `customers` does keep
 * them in separate columns, but `patients` cannot, and the schema is not to be
 * altered.
 *
 * The parts are therefore joined with a separator rather than a comma, and empty
 * positions are kept, so the original fields survive the round trip and the
 * booking wizard can pre-fill Address Line 1, City and Post Code separately.
 * The earlier `", "` join dropped the empty parts, which made the stored value
 * ambiguous — `Ernakulam, 644444, United Kingdom` gave no way to tell the city
 * from the postcode.
 */
const ADDRESS_SEPARATOR = " ~ ";

/** Stored order. Changing this invalidates every address already written. */
const ADDRESS_PART_KEYS = [
  "address1",
  "address2",
  "suburb",
  "city",
  "state",
  "zipCode",
  "country",
] as const;

export type AddressPartKey = (typeof ADDRESS_PART_KEYS)[number];

export type AddressParts = Record<AddressPartKey, string>;

export const EMPTY_ADDRESS: AddressParts = {
  address1: "",
  address2: "",
  suburb: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

/**
 * Packs the address fields into the single column, keeping every position so
 * `splitAddress` can recover them. Returns null when nothing was entered.
 *
 * A single field is stored bare, without the trailing separators. That keeps an
 * address which only ever had a Line 1 — including one saved before this format
 * existed and re-saved untouched — readable as an unsplit single line, instead of
 * claiming to be field-separated while all of it sits in the first field.
 */
export function joinAddress(parts: (string | null | undefined)[]): string | null {
  const ordered = ADDRESS_PART_KEYS.map((_, index) => asString(parts[index]));
  const filled = ordered.filter(Boolean);
  if (!filled.length) return null;
  if (filled.length === 1) return filled[0];
  return ordered.join(ADDRESS_SEPARATOR);
}

/**
 * Recovers the address fields from the stored string.
 *
 * Values written before the separator existed are joined with ", " and have no
 * recoverable boundaries, so they are reported as a single unsplit line with
 * `isSplit: false`. The wizard uses that to tell the user the address is on file
 * as one string instead of silently guessing which token is the city.
 */
export function splitAddress(
  stored: string | null | undefined
): AddressParts & { isSplit: boolean } {
  const value = asString(stored);
  if (!value) return { ...EMPTY_ADDRESS, isSplit: false };

  const parts = value.split(ADDRESS_SEPARATOR);
  if (parts.length === ADDRESS_PART_KEYS.length) {
    const result = { ...EMPTY_ADDRESS };
    ADDRESS_PART_KEYS.forEach((key, index) => {
      result[key] = asString(parts[index]);
    });
    return { ...result, isSplit: true };
  }

  return { ...EMPTY_ADDRESS, address1: value, isSplit: false };
}

/** The stored string as one readable line, for display. */
export function formatAddress(stored: string | null | undefined): string {
  const { isSplit, ...parts } = splitAddress(stored);
  if (!isSplit) return parts.address1;
  return ADDRESS_PART_KEYS.map((key) => parts[key]).filter(Boolean).join(", ");
}

/**
 * Reproduces Patient::generateNextPatientCode() from the Laravel backend
 * (`PAT-` + 4-digit zero-padded sequential) so codes minted here stay in step
 * with the ones the admin portal generates. The table's only unique index is
 * patient_code, so a colliding code is what we guard against.
 */
export async function generatePatientCode(
  conn: PoolConnection
): Promise<string> {
  const [codeRows] = await conn.query<RowDataPacket[]>(
    "SELECT patient_code FROM patients WHERE patient_code LIKE 'PAT-%'"
  );

  let maxCodeNumber = 0;
  for (const row of codeRows) {
    const digits = String(row.patient_code).replace(/[^0-9]/g, "");
    const value = Number.parseInt(digits, 10);
    if (!Number.isNaN(value) && value > maxCodeNumber) {
      maxCodeNumber = value;
    }
  }

  const [maxIdRows] = await conn.query<RowDataPacket[]>(
    "SELECT COALESCE(MAX(id), 0) AS max_id FROM patients"
  );
  const nextId = Number(maxIdRows[0].max_id) + 1;
  const nextNumber = maxCodeNumber >= nextId ? maxCodeNumber + 1 : nextId;

  return `PAT-${String(nextNumber).padStart(4, "0")}`;
}

/**
 * Finds an existing patient to update.
 *
 * The patients table has no unique index on customer_id or email — only on
 * patient_code — so dedup has to be an explicit lookup. Email is the strongest
 * signal when the person has one; otherwise we fall back to name + date of
 * birth within the same booker's scope.
 */
export async function findExistingPatient(
  conn: PoolConnection,
  customerId: number | null,
  input: PatientInput
): Promise<number | null> {
  let rows: RowDataPacket[];

  if (input.email) {
    [rows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM patients
        WHERE email = ? AND customer_id <=> ?
        ORDER BY id ASC
        LIMIT 1`,
      [input.email, customerId]
    );
  } else {
    [rows] = await conn.query<RowDataPacket[]>(
      `SELECT id FROM patients
        WHERE first_name = ?
          AND last_name = ?
          AND dob = ?
          AND customer_id <=> ?
        ORDER BY id ASC
        LIMIT 1`,
      [input.firstName, input.lastName, input.dob, customerId]
    );
  }

  return rows.length ? Number(rows[0].id) : null;
}

export async function writePatient(
  conn: PoolConnection,
  customerId: number | null,
  input: PatientInput,
  existingPatientId: number | null
): Promise<number> {
  if (existingPatientId !== null) {
    await conn.query<ResultSetHeader>(
      `UPDATE patients
          SET customer_id = ?,
              first_name  = ?,
              last_name   = ?,
              title       = ?,
              dob         = ?,
              gender      = ?,
              email       = ?,
              phone       = ?,
              address     = ?,
              updated_at  = NOW()
        WHERE id = ?`,
      [
        customerId,
        input.firstName,
        input.lastName,
        input.title,
        input.dob,
        input.gender,
        input.email,
        input.phone,
        input.address,
        existingPatientId,
      ]
    );
    return existingPatientId;
  }

  // Retry on patient_code collision, which two concurrent requests can cause.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const [result] = await conn.query<ResultSetHeader>(
        `INSERT INTO patients
           (patient_code, customer_id, first_name, last_name, title, dob, gender,
            email, phone, address, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
        [
          await generatePatientCode(conn),
          customerId,
          input.firstName,
          input.lastName,
          input.title,
          input.dob,
          input.gender,
          input.email,
          input.phone,
          input.address,
        ]
      );
      return result.insertId;
    } catch (error) {
      if (!isDuplicateKeyError(error) || attempt === 2) throw error;
    }
  }

  throw new Error("Could not allocate a patient_code after three attempts.");
}

export async function readPatientById(
  conn: PoolConnection,
  patientId: number
): Promise<PatientRow> {
  const [rows] = await conn.query<PatientRow[]>(
    `SELECT p.id, p.patient_code, p.customer_id, p.first_name, p.last_name, p.title,
            p.dob, p.gender, p.email, p.phone, p.address, p.status, p.created_at,
            p.updated_at,
            (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id)
              AS appointment_count
       FROM patients p
      WHERE p.id = ?
      LIMIT 1`,
    [patientId]
  );
  return rows[0];
}

export function serialisePatient(patient: PatientRow) {
  const { isSplit, ...addressParts } = splitAddress(patient.address);
  return {
    id: patient.id,
    patient_code: patient.patient_code,
    customer_id: patient.customer_id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    title: patient.title ?? null,
    dob: formatDate(patient.dob),
    gender: patient.gender,
    email: patient.email,
    phone: patient.phone,
    // One readable line for display, plus the individual fields so forms can
    // pre-fill Address Line 1, City and Post Code separately.
    address: formatAddress(patient.address),
    address_parts: addressParts,
    // False for addresses stored before the separator existed, where the line
    // boundaries cannot be recovered.
    address_is_split: isSplit,
    status: patient.status,
    appointment_count: Number(patient.appointment_count ?? 0),
    created_at: patient.created_at,
    updated_at: patient.updated_at,
  };
}

/** Resolves a customer by their unique email. Returns null when unknown. */
export async function findCustomerIdByEmail(
  conn: PoolConnection,
  email: string
): Promise<number | null> {
  const normalised = asString(email).toLowerCase();
  if (!normalised || !EMAIL_PATTERN.test(normalised)) return null;

  const [rows] = await conn.query<RowDataPacket[]>(
    "SELECT id FROM customers WHERE email = ? LIMIT 1",
    [normalised]
  );
  return rows.length ? Number(rows[0].id) : null;
}
