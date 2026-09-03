"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, ArrowUpRight, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";

interface TestResult {
  id: string;
  serviceName: string;
  category: string;
  date: string;
  pdfUrl: string;
  status: "Completed" | "Pending";
}

export default function MyResultsPage() {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    // Premium medical results mockup
    const mockResults: TestResult[] = [
      {
        id: "res-1",
        serviceName: "Well Woman Blood Profile",
        category: "Blood Tests",
        date: "2026-04-18",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "Completed",
      },
      {
        id: "res-2",
        serviceName: "Early Reassurance Scan Report",
        category: "Pregnancy Scans",
        date: "2026-05-02",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "Completed",
      },
    ];
    setResults(mockResults);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);
      return localDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E227D] mb-1">
            My Medical Results
          </h2>
          <p className="font-body text-xs text-zinc-500">
            Access, view, and print your laboratory results and scan reports securely.
          </p>
        </div>

        {/* <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3 text-left">
          <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <h4 className="font-display text-xs font-bold text-green-800">Secure Laboratory Connection</h4>
            <p className="font-body text-[11px] text-green-700/90 mt-1 leading-relaxed">
              All clinical laboratory tests and ultrasound scans undergo rigorous doctor review. All PDF records are fully encrypted.
            </p>
          </div>
        </div> */}

        {results.length === 0 ? (
          <div className="border border-zinc-200 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
            No test results available.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white shadow-none transition-colors hover:border-[#1E227D]/30"
              >
                {/* Details Section */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#1E227D]/5 flex items-center justify-center text-[#1E227D] shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider leading-none">
                        {result.category}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700">
                        {result.status}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[#1E227D] mt-2 leading-tight">
                      {result.serviceName}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-2.5 font-body text-xs text-zinc-600">
                      <Calendar size={14} className="text-[#1E227D]/70" />
                      <span>Released: {formatDate(result.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Button Link Section */}
                <div className="shrink-0 flex sm:justify-end">
                  <a
                    href={result.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-bold text-[#2D2136] bg-white hover:border-[#1E227D] hover:text-[#1E227D] transition-all w-full sm:w-auto hover:bg-zinc-50"
                  >
                    <span>View Result</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
