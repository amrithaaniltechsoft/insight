import { servicesData } from "@/components/servicelistingpage/servicesData";

/**
 * Client helper for reading a customer's appointments from the `appointments`
 * table via `app/api/appointments`.
 *
 * The `services` table has no slug column, so the "book again" link is resolved
 * here instead: `categories.slug` is the key into `servicesData`, and the scan's
 * title is matched against the service name the table stores.
 */

export interface Appointment {
  id: number;
  appointment_code: string;
  patient_id: number;
  patient_code: string;
  patient_name: string;
  service_id: number | null;
  service_name: string | null;
  service_group: string | null;
  service_price: string | null;
  category_name: string | null;
  category_slug: string | null;
  /** YYYY-MM-DD */
  appointment_date: string;
  /** HH:MM */
  start_time: string | null;
  end_time: string | null;
  status: string;
  payment_status: string;
  source: string;
  notes: string | null;
}

/** Resolves the booking wizard slug for an appointment's service. */
export function resolveServiceSlug(appointment: Appointment): string {
  const category = appointment.category_slug
    ? servicesData[appointment.category_slug]
    : undefined;
  if (!category) return "general-consultation";

  const candidates = [appointment.service_name, appointment.service_group]
    .filter((name): name is string => Boolean(name))
    .map((name) => name.trim().toLowerCase());

  const match = category.scans.find((scan) =>
    candidates.includes(scan.title.trim().toLowerCase())
  );

  return match?.slug ?? "general-consultation";
}

/** "12:00" -> "12:00 PM". */
export function formatTime(value: string | null): string {
  if (!value) return "";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  if (Number.isNaN(hour)) return value;

  const meridiem = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minutes || "00"} ${meridiem}`;
}

/** 40 -> "£40.00" */
export function formatPrice(value: string | null): string {
  const amount = Number(value);
  if (!value || Number.isNaN(amount)) return "";
  return `£${amount.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Lists appointments for a customer, optionally narrowed to one patient.
 * `patientId` is the `patients.id` as a string.
 */
export async function fetchAppointments(
  customerEmail: string,
  patientId?: string
): Promise<Appointment[]> {
  const query = new URLSearchParams({ customer_email: customerEmail });
  if (patientId) query.set("patient_id", patientId);

  const response = await fetch(`/api/appointments?${query.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to load appointments.")
    );
  }

  const data = (await response.json()) as { appointments: Appointment[] };
  return data.appointments ?? [];
}
