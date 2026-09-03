import { Suspense } from "react";
import BookAppointmentWizard from "@/components/book-appointment/BookAppointmentWizard";

export const metadata = {
  title: "Book Appointment | Insight Health Services",
  description: "Book your private clinical appointment with Insight Health Services today.",
};

export default function BookAppointmentPage() {
  return (
    <main className="w-full bg-[#FCFAFD] min-h-screen py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 z-0 h-[40rem] w-[40rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#F000E2]/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 z-0 h-[40rem] w-[40rem] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#1E227D]/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1E227D] md:text-4xl mb-8 text-center">Book Your Appointment</h1>

        <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F000E2]"></div></div>}>
          <BookAppointmentWizard />
        </Suspense>
      </div>
    </main>
  );
}
