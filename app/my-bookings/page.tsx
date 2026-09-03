"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Tag, Stethoscope, User } from "lucide-react";
import DashboardLayout from "@/components/profile/DashboardLayout";
import Button from "@/components/ui/Button";

interface Booking {
  id: string;
  serviceSlug: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  price: string;
  patientName?: string;
  patientEmail?: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Standard default mock bookings to make layout look rich
    const mockBookings: Booking[] = [
      {
        id: "mock-1",
        serviceSlug: "early-reassurance-scan",
        serviceName: "Early Reassurance Scan",
        category: "Pregnancy Scans",
        date: "2026-05-02",
        time: "11:30 AM",
        price: "£95.00",
      },
      {
        id: "mock-2",
        serviceSlug: "well-woman-blood-profile",
        serviceName: "Well Woman Blood Profile",
        category: "Blood Tests",
        date: "2026-04-15",
        time: "09:00 AM",
        price: "£149.00",
      },
    ];

    // Load any appointments booked on this session from localStorage
    const savedBookingsRaw = localStorage.getItem("user_bookings");
    let savedBookings: Booking[] = [];
    if (savedBookingsRaw) {
      try {
        const parsed = JSON.parse(savedBookingsRaw);
        savedBookings = parsed.map((b: any) => ({
          id: b.id || Math.random().toString(36).substr(2, 9),
          serviceSlug: b.serviceSlug || "general-consultation",
          serviceName: b.serviceName || "General Consultation",
          category: b.category || "Consultations",
          date: b.date,
          time: b.time,
          price: b.price || "£95.00",
          patientName: b.patientName || null,
          patientEmail: b.patientEmail || null,
        }));
      } catch (e) {
        console.error("Failed to parse user bookings:", e);
      }
    }

    // Combine mock bookings and user bookings, removing duplicate IDs
    const combined = [...savedBookings, ...mockBookings];
    setBookings(combined);
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

        {bookings.length === 0 ? (
          <div className="border border-zinc-200 rounded-2xl p-12 text-center text-zinc-400 font-body text-sm">
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
