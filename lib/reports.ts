/**
 * Client helper for reading a customer's clinical reports from the
 * `patient_clinical_reports` table via the Laravel API's `GET /reports`.
 *
 * Reports are created in the admin portal and tied to a patient. The customer
 * email stored in localStorage identifies every patient that customer owns, so
 * the same lookup used for appointments also works here.
 */

export interface PatientReport {
  id: number;
  report_code: string;
  patient_id: number;
  patient_code: string | null;
  patient_name: string | null;
  dob: string | null;
  appointment_id: number | null;
  report_type: string;
  display_title: string;
  report_data: Record<string, unknown> | null;
  summary_findings: string | null;
  recommendations: string | null;
  status: string;
  signed_at: string | null;
  created_at: string | null;
  pdf_url?: string | null;
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
 * Lists clinical reports for a customer, optionally narrowed to one patient.
 * `patientId` is the `patients.id` as a string.
 */
export async function fetchReports(
  customerEmail: string,
  patientId?: string
): Promise<PatientReport[]> {
  const query = new URLSearchParams({ customer_email: customerEmail });
  if (patientId) query.set("patient_id", patientId);

  // The Laravel API rather than a Next.js route: the database is on the Laravel
  // host, where DB_HOST is 127.0.0.1, so a Vercel function cannot reach it.
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const response = await fetch(`${API_URL}/reports?${query.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Failed to load your reports.")
    );
  }

  const data = (await response.json()) as { reports: PatientReport[] };
  return data.reports ?? [];
}

/** Looks up a single report for a customer by its id or report code. */
export async function fetchReport(
  customerEmail: string,
  reportId: string
): Promise<PatientReport | null> {
  const reports = await fetchReports(customerEmail);
  return (
    reports.find((report) => String(report.id) === String(reportId)) ??
    reports.find((report) => report.report_code === reportId) ??
    null
  );
}

/**
 * URL of a report's PDF, generated server-side when the report was saved (and
 * regenerated on demand if it is missing). Pointing the browser at this URL
 * downloads the stored file, so no client-side PDF rendering is needed.
 */
export function reportPdfUrl(
  customerEmail: string,
  reportId: number | string
): string {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  const query = new URLSearchParams({ customer_email: customerEmail });
  return `${API_URL}/reports/${encodeURIComponent(
    String(reportId)
  )}/pdf?${query.toString()}`;
}
