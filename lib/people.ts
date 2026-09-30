/**
 * The "My People" list: the family members and friends a customer books for.
 *
 * These are `patients` rows, not browser-local entries, so the same list follows
 * the customer across devices. The API is `app/api/patients`.
 *
 * The `relationship` label ("Family", "Friend") is the one field that is not
 * persisted: `patients` has no column for it and the schema is not to be
 * altered, so it is kept in localStorage purely as a display label.
 */

export interface PersonAddressParts {
  address1: string;
  address2: string;
  suburb: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const EMPTY_PARTS: PersonAddressParts = {
  address1: "",
  address2: "",
  suburb: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
};

export interface Person {
  id: string;
  /** `patients.id`, as a string so it can be used directly in a route segment. */
  patientId: string;
  patientCode: string;
  title: string;
  firstName: string;
  lastName: string;
  gender: string;
  /** YYYY-MM-DD */
  dob: string;
  email: string;
  mobile: string;
  /** The whole address as one readable line, for display. */
  address: string;
  /** The individual address fields, for pre-filling and editing. */
  addressParts: PersonAddressParts;
  /**
   * False when the stored address predates the field-separated format and its
   * line boundaries cannot be recovered, so forms must not pretend otherwise.
   */
  addressIsSplit: boolean;
  relationship: string;
  /**
   * Appointments referencing this person. Zero means the record can be removed;
   * anything else means it is a clinical history and must be kept.
   */
  appointmentCount: number;
}

/**
 * `patients` has no `relationship` column, so the Family/Friend label is kept
 * here instead, keyed on the patient id. It follows the person on this browser
 * only: it does not appear on another device and is lost if site data is
 * cleared. (`title` used to live here too, but it is a real column now.)
 */
const PERSON_META_KEY = "profile_people_meta";

/** The relationship-only map this replaced; kept so existing labels survive. */
const LEGACY_RELATIONSHIP_KEY = "profile_people_relationships";

interface PersonMeta {
  relationship?: string;
}

interface PatientPayload {
  id: number;
  patient_code: string;
  first_name: string;
  last_name: string;
  title: string | null;
  dob: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  address_parts?: Partial<PersonAddressParts> | null;
  address_is_split?: boolean;
  appointment_count?: number;
}

let legacyMetaRead = false;

/**
 * Folds the relationship-only map into the combined one, the first time this
 * browser is opened after the change, so labels already saved are not lost.
 */
function migrateLegacyMeta(): void {
  if (legacyMetaRead || typeof window === "undefined") return;
  legacyMetaRead = true;
  try {
    const raw = localStorage.getItem(LEGACY_RELATIONSHIP_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    localStorage.removeItem(LEGACY_RELATIONSHIP_KEY);
    if (!parsed || typeof parsed !== "object") return;

    const merged = { ...readPersonMeta() };
    let changed = false;
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof value !== "string" || !value) continue;
      const existing = merged[id] ?? {};
      if (existing.relationship) continue;
      merged[id] = { ...existing, relationship: value };
      changed = true;
    }
    if (changed) writePersonMeta(merged);
  } catch {
    // A corrupt legacy entry must not stop the page working.
  }
}

function readPersonMeta(): Record<string, PersonMeta> {
  if (typeof window === "undefined") return {};
  migrateLegacyMeta();
  try {
    const raw = localStorage.getItem(PERSON_META_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    // Drop anything that is not an object so one bad entry cannot break the
    // whole map when it is read back.
    const map: Record<string, PersonMeta> = {};
    for (const [id, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value && typeof value === "object") map[id] = value as PersonMeta;
    }
    return map;
  } catch {
    return {};
  }
}

function writePersonMeta(map: Record<string, PersonMeta>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PERSON_META_KEY, JSON.stringify(map));
  } catch {
    // A full or disabled localStorage must not break saving a person.
  }
}

function toPerson(patient: PatientPayload): Person {
  const id = String(patient.id);
  const meta = readPersonMeta()[id] ?? {};
  return {
    id,
    patientId: id,
    patientCode: patient.patient_code,
    title: patient.title ?? "",
    firstName: patient.first_name,
    lastName: patient.last_name,
    gender: patient.gender ?? "",
    dob: patient.dob ?? "",
    email: patient.email ?? "",
    mobile: patient.phone ?? "",
    address: patient.address ?? "",
    addressParts: { ...EMPTY_PARTS, ...(patient.address_parts ?? {}) },
    addressIsSplit: Boolean(patient.address_is_split),
    relationship: meta.relationship ?? "Family",
    appointmentCount: Number(patient.appointment_count ?? 0),
  };
}

export interface SavePersonInput {
  customerEmail: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  email?: string;
  mobile?: string;
  /**
   * The address fields are sent individually. Sending the joined line instead
   * would store the whole address as Line 1 and bury the rest of it.
   */
  address?: PersonAddressParts;
  /** Stored in the `patients` table. */
  title?: string;
  relationship?: string;
  /** Omit to create; pass to update that person. */
  patientId?: string;
}

/**
 * Where the people endpoints live.
 *
 * The database is on the Laravel host, and a Vercel function cannot open a MySQL
 * connection to it — `DB_HOST` there is `127.0.0.1`, meaning "this machine". So
 * the reads and writes go through the Laravel API, which runs on that host and
 * reaches the database over localhost.
 *
 * `/api/patients` is still there and still works against a reachable database
 * (it is what `next dev` uses, and it is the faster path if a shared database is
 * ever configured on Vercel). It is not used in production, because on Vercel it
 * cannot reach the data.
 */
const PEOPLE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function peopleEndpoint(query = "") {
  return `${PEOPLE_API_URL}/people${query}`;
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

/** Lists the customer saved people, newest first. */
export async function fetchPeople(customerEmail: string): Promise<Person[]> {
  const query = new URLSearchParams({ customer_email: customerEmail });
  const response = await fetch(peopleEndpoint(`?${query.toString()}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to load your people.")
    );
  }

  const data = (await response.json()) as { people: PatientPayload[] };
  return (data.people ?? []).map(toPerson);
}

/** Creates or updates one person, and remembers their relationship label. */
export async function savePerson(input: SavePersonInput): Promise<Person> {
  const parts = input.address ?? EMPTY_PARTS;
  const response = await fetch(peopleEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer_email: input.customerEmail,
      patient_id: input.patientId,
      first_name: input.firstName,
      last_name: input.lastName,
      title: input.title ?? "",
      gender: input.gender,
      dob: input.dob,
      email: input.email ?? "",
      phone: input.mobile ?? "",
      address_line_1: parts.address1,
      address_line_2: parts.address2,
      suburb: parts.suburb,
      city: parts.city,
      state: parts.state,
      zip_code: parts.zipCode,
      country: parts.country,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to save this person.")
    );
  }

  const data = (await response.json()) as { person: PatientPayload };
  const person = toPerson(data.person);

  // The relationship label has no column in `patients`, so it is kept in this
  // browser rather than dropped, and echoed back onto the returned person so the
  // caller can render it straight away. The title is a real column and comes
  // back with the row.
  if (input.relationship !== undefined) {
    const meta = { ...readPersonMeta() };
    meta[person.patientId] = { relationship: input.relationship };
    writePersonMeta(meta);
    person.relationship = input.relationship;
  }

  return person;
}

/**
 * Removes a person who has no appointments.
 *
 * The server enforces the same rule and answers 409 if they have any, so this
 * is safe to call without checking first — but callers should hide the action
 * for a person with bookings rather than let the user hit the refusal.
 */
export async function deletePerson(
  customerEmail: string,
  patientId: string
): Promise<void> {
  const query = new URLSearchParams({
    customer_email: customerEmail,
    patient_id: patientId,
  });

  const response = await fetch(peopleEndpoint(`?${query.toString()}`), {
    method: "DELETE",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to remove this person.")
    );
  }

  // The relationship label is keyed on the patient id, which is about to stop
  // meaning anything, so it is cleared rather than left to leak onto whoever
  // gets that id next. The title is a real column and goes with the row.
  const meta = readPersonMeta();
  if (patientId in meta) {
    delete meta[patientId];
    writePersonMeta(meta);
  }
}

export function getPersonFullName(person: Person): string {
  return [person.firstName, person.lastName].filter(Boolean).join(" ");
}

/** "Akhil Vinod" -> "AV", used for the avatar initials. */
export function getPersonInitials(person: Person): string {
  return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
}
