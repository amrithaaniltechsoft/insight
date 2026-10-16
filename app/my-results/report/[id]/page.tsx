"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchReport, reportPdfUrl, type PatientReport } from "@/lib/reports";
import "./report.css";

/** Reads a stored form value as display text. */
function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

/** ISO (YYYY-MM-DD) -> DD/MM/YYYY for the printed report. */
function formatDisplayDate(value: string | null | undefined): string {
  if (!value) return "";
  const parts = value.slice(0, 10).split("-");
  if (parts.length !== 3) return value;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/** Strips the " (PDF)" suffix the admin portal appends to stored titles. */
function cleanTitle(title: string): string {
  return (title || "").replace(/\s*\(PDF\)\s*$/i, "");
}

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [report, setReport] = useState<PatientReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (localStorage.getItem("is_signed_in") !== "true") {
      router.push("/");
      return;
    }

    const customerEmail = localStorage.getItem("user_email") || "";

    let cancelled = false;
    (async () => {
      try {
        if (!customerEmail || !reportId) {
          if (!cancelled) setError("Report not found.");
          return;
        }

        const found = await fetchReport(customerEmail, reportId);
        if (cancelled) return;
        if (!found) {
          setError("Report not found.");
        } else {
          setReport(found);
        }
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load this report."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportId, router]);

  const downloadPDF = () => {
    const customerEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("user_email") || ""
        : "";

    if (!customerEmail || !report) {
      alert("Unable to locate your report. Please sign in again.");
      return;
    }

    // Prefer the direct stored-PDF URL; fall back to the ownership-checked API.
    window.location.href = report.pdf_url || reportPdfUrl(customerEmail, report.id);
  };

  if (loading) {
    return (
      <main className="report-page">
        <p className="report-status">Loading report&hellip;</p>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="report-page">
        <div className="report-toolbar">
          <button className="back-btn" onClick={() => router.push("/my-results")}>
            &larr; Back to My Results
          </button>
        </div>
        <p className="report-status">{error || "Report not found."}</p>
      </main>
    );
  }

  const data = (report.report_data ?? {}) as Record<string, unknown>;
  const isMultiple = text(data.fetalNumber).toLowerCase() === "multiple";
  const title = cleanTitle(report.display_title);
  const studyDate = formatDisplayDate(
    text(data.studyDate) || report.created_at
  );
  const patientId = report.patient_code || "IHSUS";

  return (
    <main className="report-page">
      <div className="report-toolbar">
        <button className="back-btn" onClick={() => router.push("/my-results")}>
          &larr; Back to My Results
        </button>
        <button className="download-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="report">
        {/* Letterhead */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/reports/letterhead.jpg"
          alt="Insight Health Services"
          className="report-letterhead"
        />

        {/* Title bar */}
        <div className="report-title-bar">{title}</div>

        {/* Patient information */}
        <table>
          <colgroup>
            <col style={{ width: "10.12%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "8.44%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "10.42%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "13.05%" }} />
          </colgroup>

          <tbody>
            <tr>
              <td className="lbl" colSpan={2}>
                Patient Name
              </td>
              <td colSpan={3}>{report.patient_name || ""}</td>
              <td className="lbl">DOB</td>
              <td colSpan={2}>{formatDisplayDate(report.dob)}</td>
              <td className="lbl">Patient ID</td>
              <td colSpan={2}>{patientId}</td>
            </tr>

            <tr>
              <td className="lbl">Study Date</td>
              <td colSpan={2}>{studyDate}</td>
              <td className="lbl" colSpan={2}>
                Contact No
              </td>
              <td colSpan={2}>{text(data.contactNo)}</td>
              <td className="lbl" colSpan={2}>
                Consent to Scan
              </td>
              <td colSpan={2}>{text(data.consentToScan) || "Yes"}</td>
            </tr>

            <tr>
              <td className="lbl" colSpan={3}>
                Clinical Indication
              </td>
              <td colSpan={7}>{text(data.clinicalIndication)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Findings title bar */}
        <div className="report-findings-title">{title}</div>

        {/* Findings */}
        <table>
          <colgroup>
            <col style={{ width: "10.12%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "8.44%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "10.42%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "13.05%" }} />
          </colgroup>

          <tbody>
            <tr>
              <td className="lbl" colSpan={2}>
                SCAN METHOD
              </td>
              <td colSpan={3}>{text(data.scanMethod) || "Transabdominal"}</td>
              <td colSpan={6}></td>
            </tr>

            <tr className="gap">
              <td colSpan={11}></td>
            </tr>

            <tr>
              <td className="lbl" colSpan={2}>
                FETAL HEART
              </td>
              <td colSpan={3}>{text(data.fetalHeart) || "Present"}</td>
              <td className="gap-col"></td>
              <td className="lbl" colSpan={2}>
                PLACENTA
              </td>
              <td colSpan={2}>{text(data.placenta)}</td>
              <td></td>
            </tr>

            <tr className="gap">
              <td colSpan={11}></td>
            </tr>

            <tr>
              <td className="lbl" colSpan={2}>
                SINGLETON
              </td>
              <td>{isMultiple ? "No" : "Yes"}</td>
              <td className="lbl" colSpan={2}>
                MULTIPLE
              </td>
              <td>{isMultiple ? text(data.fetalNumber) : ""}</td>
              <td className="lbl" colSpan={2}>
                PLACENTAL POSITION
              </td>
              <td colSpan={2}>{text(data.placentalPosition)}</td>
              <td></td>
            </tr>

            <tr className="gap">
              <td colSpan={11}></td>
            </tr>

            <tr>
              <td className="lbl" colSpan={2}>
                GESTATION
              </td>
              <td>{text(data.gestationWeeks)}</td>
              <td>Weeks</td>
              <td>and</td>
              <td>{text(data.gestationDays)}</td>
              <td>Days</td>
              <td colSpan={4}></td>
            </tr>

            <tr className="gap">
              <td colSpan={11}></td>
            </tr>

            <tr>
              <td className="lbl" colSpan={2}>
                ESTIMATED DUE DATE
              </td>
              <td colSpan={3}>{formatDisplayDate(text(data.edd))}</td>
              <td colSpan={6}></td>
            </tr>

            <tr className="gap">
              <td colSpan={11}></td>
            </tr>
          </tbody>
        </table>

        {/* Comments */}
        <table>
          <tbody>
            <tr>
              <td className="comments-label" colSpan={11}>
                COMMENTS
              </td>
            </tr>
            <tr>
              <td className="comments-body" colSpan={11}>
                {text(data.comments)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <table>
          <colgroup>
            <col style={{ width: "10.12%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "8.44%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "7.36%" }} />
            <col style={{ width: "10.42%" }} />
            <col style={{ width: "9.51%" }} />
            <col style={{ width: "13.05%" }} />
          </colgroup>

          <tbody>
            <tr>
              <td className="lbl" colSpan={2}>
                Sonographer
              </td>
              <td colSpan={3}>{text(data.sonographer)}</td>
              <td className="lbl" colSpan={2}>
                Chaperone
              </td>
              <td colSpan={4}>{text(data.chaperone)}</td>
            </tr>

            <tr>
              <td className="verified" colSpan={11}>
                Electronically Verified: {report.status || ""}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer band */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/reports/footer-band.jpg"
          alt=""
          className="report-footer-band"
        />
      </div>
    </main>
  );
}