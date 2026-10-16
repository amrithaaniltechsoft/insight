"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User, FileText } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/appointments";
import { fetchReports, type PatientReport } from "@/lib/reports";

/**
 * The clinical reports created through the admin portal, as a list of cards.
 * Shared by "My Bookings" and "My Results" so both pages read the same live
 * data from `patient_clinical_reports`.
 *
 * "View Report" opens the printable report document at
 * `/my-results/report/[id]`, which can also be downloaded as a PDF.
 */

/** Strips the " (PDF)" suffix the admin portal appends to stored titles. */
function cleanTitle(title: string): string {
  return (title || "").replace(/\s*\(PDF\)\s*$/i, "");
}

export default function MedicalReports() {
  const router = useRouter();
  const [reports, setReports] = useState<PatientReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const customerEmail =
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "";

    let cancelled = false;
    (async () => {
      try {
        const patientReports = customerEmail
          ? await fetchReports(customerEmail)
          : [];
        if (cancelled) return;
        setReports(patientReports);
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load your reports."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
        Loading your reports&hellip;
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
        No reports available yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((report) => (
        <div
          key={report.id}
          className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white shadow-none transition-colors hover:border-[#1E227D]/30"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-[#1E227D]/5 flex items-center justify-center text-[#1E227D] shrink-0">
              <FileText size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider leading-none">
                {report.report_type}
              </span>
              <h3 className="font-display text-base font-bold text-[#1E227D] mt-1.5 leading-tight">
                {cleanTitle(report.display_title)}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1E227D]/5 text-[10px] font-bold tracking-wider text-[#1E227D]">
                  {report.report_code}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold tracking-wider text-emerald-700">
                  {report.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 font-body text-xs text-zinc-600">
                {report.patient_name && (
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-[#1E227D]/70" />
                    <span>{report.patient_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#1E227D]/70" />
                  <span>
                    {formatDate(report.created_at || report.signed_at || "")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex sm:justify-end">
            <Button
              variant="primary"
              className="!px-5 !py-2.5 !text-xs font-bold shadow-none w-full sm:w-auto"
              onClick={() => router.push(`/my-results/report/${report.id}`)}
              icon={<FileText size={14} />}
              iconPosition="left"
            >
              View Report
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
