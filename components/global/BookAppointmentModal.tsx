"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Baby, Stethoscope, Bone, Activity, Droplet, Syringe, Target, ShieldCheck, LucideIcon } from "lucide-react";
import Link from "next/link";

interface BookingCategory {
  label: string;
  icon: LucideIcon;
  href: string;
}

const bookingCategories: BookingCategory[] = [
  { label: "Pregnancy Scan", icon: Baby, href: "/services/pregnancy-scans" },
  { label: "General Ultrasound Scans", icon: Stethoscope, href: "/services/diagnostics" },
  { label: "MSK Scans", icon: Bone, href: "/services/msk-scans" },
  { label: "Physiotherapy", icon: Activity, href: "/services/physiotherapy" },
  { label: "Blood Tests", icon: Droplet, href: "/services/blood-tests" },
  { label: "Acupuncture", icon: Syringe, href: "/services/acupuncture" },
  { label: "Joint Injections", icon: Target, href: "/services/joint-injections" },
  { label: "Cervical Screening", icon: ShieldCheck, href: "/services/cervical-screening" },
];

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookAppointmentModal({ isOpen, onClose }: BookAppointmentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-1/2 z-[210] mx-auto -translate-y-1/2 max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-2 mb-5">
              <h2 className="font-display text-xl font-bold text-[#1E227D]">
                Book an Appointment
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-[#2D2136] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <p className="font-body text-sm text-[#2D2136]/70 mb-2">
                Please select a category to proceed with your booking:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {bookingCategories.map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={idx}
                      href={category.href}
                      onClick={onClose}
                      className="group flex flex-col items-center justify-center text-center rounded-2xl border border-zinc-100 bg-zinc-50/50 p-5 transition-all hover:bg-[#1E227D]/5 hover:border-[#1E227D]/20 hover:-translate-y-1"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1E227D] shadow-sm transition-colors group-hover:bg-[#1E227D] group-hover:text-white mb-3">
                        <Icon size={22} />
                      </div>
                      <span className="font-display text-sm font-bold text-[#2D2136] group-hover:text-[#1E227D] transition-colors">
                        {category.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
