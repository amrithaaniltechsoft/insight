import { Suspense } from "react";
import BookingConfirmationClient from "./BookingConfirmationClient";

export const metadata = {
  title: "Booking Confirmed | Insight Health Services",
  description: "Your appointment booking is confirmed.",
};

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F000E2]"></div></div>}>
      <BookingConfirmationClient />
    </Suspense>
  );
}
