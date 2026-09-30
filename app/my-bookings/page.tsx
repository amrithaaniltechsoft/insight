"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Tag, Stethoscope, User } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";
import {
  fetchAppointments,
  formatDate,
  formatPrice,
  formatTime,
  resolveServiceSlug,
} from "@/lib/appointments";

interface Booking {
  id: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  price: string;
  patientName?: string;
  appointmentCode: string;
  status: string;
  paymentStatus: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Appointments are read from the `appointments` table, which is written when
  // the booking wizard reaches Continue. The previous localStorage read only
  // ever saw bookings the user finished in that browser session.
  useEffect(() => {
    const customerEmail =
      localStorage.getItem("is_signed_in") === "true"
        ? localStorage.getItem("user_email") || ""
        : "";

    let cancelled = false;
    (async () => {
      try {
        const appointments = customerEmail
          ? await fetchAppointments(customerEmail)
          : [];
        if (cancelled) return;
        setBookings(
          appointments.map((appointment) => ({
            id: String(appointment.id),
            serviceSlug: resolveServiceSlug(appointment),
            serviceName: appointment.service_name || "General Consultation",
            category: appointment.category_name || "Consultations",
            date: appointment.appointment_date,
            time: formatTime(appointment.start_time),
            price: formatPrice(appointment.service_price),
            patientName: appointment.patient_name,
            appointmentCode: appointment.appointment_code,
            status: appointment.status,
            paymentStatus: appointment.payment_status,
          }))
        );
      } catch (loadError) {
        if (cancelled) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load your bookings."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBookAgain = (slug: string) => {
    router.push(`/book-appointment?service=${slug}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 text-left">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1E227D] mb-1">
            My Bookings
          </h2>
          <p className="font-body text-xs text-zinc-500">
            View your active and past appointments with Insight Health Services.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-body text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
            Loading your bookings&hellip;
          </div>
        ) : bookings.length === 0 ? (
          <div className="border border-dashed border-zinc-300 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
            No bookings found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="border border-zinc-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white shadow-none transition-colors hover:border-[#1E227D]/30"
              >
                {/* Details Section */}
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-[#1E227D]/5 flex items-center justify-center text-[#1E227D] shrink-0">
                    <Stethoscope size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider leading-none">
                      {booking.category}
                    </span>
                    <h3 className="font-display text-base font-bold text-[#1E227D] mt-1.5 leading-tight">
                      {booking.serviceName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1E227D]/5 text-[10px] font-bold tracking-wider text-[#1E227D]">
                        {booking.appointmentCode}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold tracking-wider text-emerald-700">
                        {booking.status}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-50 text-[10px] font-bold tracking-wider text-amber-700">
                        {booking.paymentStatus}
                      </span>
                    </div>

                    {/* Icons Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 font-body text-xs text-zinc-600">
                      {booking.patientName && (
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-[#1E227D]/70" />
                          <span>{booking.patientName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#1E227D]/70" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#1E227D]/70" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-[#1E227D]">
                        <Tag size={14} className="text-[#1E227D]/70" />
                        <span>{booking.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Button Section */}
                <div className="shrink-0 flex sm:justify-end">
                  <Button
                    variant="primary"
                    className="!px-5 !py-2.5 !text-xs font-bold shadow-none w-full sm:w-auto"
                    onClick={() => handleBookAgain(booking.serviceSlug)}
                  >
                    Book Again
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
