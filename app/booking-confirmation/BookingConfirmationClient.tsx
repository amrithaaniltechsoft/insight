"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, Clock, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { servicesData } from "@/components/servicelistingpage/servicesData";

export default function BookingConfirmationClient() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service") || "";
  const dateStr = searchParams.get("date") || "";
  const timeStr = searchParams.get("time") || "";

  /**
   * The service name the wizard actually resolved, passed through the URL.
   *
   * The static `servicesData` catalog only holds a handful of services, so
   * resolving the slug here showed "General Consultation" for everything else —
   * every blood test in particular. The wizard already has the real title
   * (fetched from the API), so that is preferred and the catalog is only the
   * fallback for a link that arrives without it.
   */
  const resolvedName = searchParams.get("name") || "";

  let serviceName = resolvedName;
  if (!serviceName) {
    serviceName = "General Consultation";
    if (serviceSlug) {
      for (const categoryKey in servicesData) {
        const category = servicesData[categoryKey];
        const foundScan = category.scans.find((s) => s.slug === serviceSlug);
        if (foundScan) {
          serviceName = foundScan.title;
          break;
        }
      }
    }
  }

  // Format date nicely (e.g. Wednesday, 8 July 2026)
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
    <main className="w-full bg-[#FCFAFD] min-h-screen py-16 lg:py-12 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 right-0 z-0 h-[40rem] w-[40rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#F000E2]/5 blur-[100px]" />
      <div className="absolute bottom-0 left-0 z-0 h-[40rem] w-[40rem] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#1E227D]/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12 flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-[#1E227D]/5 border border-zinc-100 p-10 text-center">

          {/* Animated Green Check Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 mb-6 shadow-inner"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 12,
                delay: 0.2,
              }}
            >
              <CheckCircle size={32} strokeWidth={2.5} />
            </motion.div>
          </motion.div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1E227D] md:text-4xl mb-4">
            Booking Confirmed!
          </h1>

          {/* <p className="font-body text-base text-zinc-600 mb-8 max-w-lg mx-auto leading-relaxed">
            Thank you for booking with Insight Health Services. Your appointment details have been saved, and our team will be expecting you. A confirmation email with further instructions will be sent shortly.
          </p> */}

          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto shadow-sm">
            {/* <div className="flex items-center gap-4 mb-6 pb-4 border-b border-zinc-200">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#1E227D]/10 text-[#1E227D]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-[#2D2136]">Appointment Secured</p>
                <p className="font-body text-xs text-zinc-500 font-medium">Please arrive 10 minutes early.</p>
              </div>
            </div> */}

            {/* Appointment Summary Box */}
            <div className="flex flex-col gap-3.5 mb-4">
              <div className="flex justify-between items-start py-1 border-b border-dashed border-zinc-200 pb-2">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-[#1E227D]" />
                  <span className="font-body text-xs text-zinc-500 font-medium">Service</span>
                </div>
                <span className="font-body text-xs text-[#2D2136] font-bold text-right max-w-[200px]">{serviceName}</span>
              </div>
              {dateStr && (
                <div className="flex justify-between items-center py-1 border-b border-dashed border-zinc-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-[#1E227D]" />
                    <span className="font-body text-xs text-zinc-500 font-medium">Date</span>
                  </div>
                  <span className="font-body text-xs text-[#2D2136] font-bold">{formatDate(dateStr)}</span>
                </div>
              )}
              {timeStr && (
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#1E227D]" />
                    <span className="font-body text-xs text-zinc-500 font-medium">Time</span>
                  </div>
                  <span className="font-body text-xs text-[#2D2136] font-bold">{timeStr}</span>
                </div>
              )}
            </div>

            <p className="font-body text-normal text-zinc-150 text-center leading-relaxed bg-[#1E227D]/5 p-3 rounded-xl border border-[#1E227D]/10">
              Please arrive 10 minutes early.
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Link href="/">
              <Button variant="primary" className="!px-10 !py-3.5 shadow-lg shadow-[#5839E8]/20">
                Return Home
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
