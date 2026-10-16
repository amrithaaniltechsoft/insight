"use client";

import DashboardLayout from "@/components/profile/DashboardLayout";
import MedicalReports from "@/components/profile/MedicalReports";

export default function MyResultsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E227D] mb-1">
            My Medical Results
          </h2>
          <p className="font-body text-xs text-zinc-500">
            Access, view, and print your laboratory results and scan reports
            securely.
          </p>
        </div>

        <MedicalReports />
      </div>
    </DashboardLayout>
  );
}
