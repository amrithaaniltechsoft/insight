"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

interface ApiService {
  id: number;
  slug: string;
  title: string;
  service_name: string;
}

export default function ScanCalculatorSection() {
  const [weeks, setWeeks] = useState(12);
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const pct = ((weeks - 6) / (40 - 6)) * 100;

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_URL}/services/category/pregnancy-scans`)
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section
      id="scan-calculator"
      className="relative w-full bg-[#E7BEF8] py-24 lg:py-32"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.18)' stroke-width='1.5'/%3e%3c/svg%3e")`,
      }}
    >
      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#E7BEF8"
          />

          {/* Faint Background Track for the Stroke */}
          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          />

          {/* Animated Wave Stroke */}
          <motion.path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            transform="translate(0, 3)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>

      <motion.div
        className="container relative z-10 mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div
          variants={itemVariants}
          className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1E227D] to-[#F000E2] border border-white/20 backdrop-blur-md shadow-2xl p-8 md:p-12 relative group"
        >
          {/* Dragon Wave Background */}
          <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

          <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-12 relative z-10 w-full">
            <div className="lg:col-span-6 relative z-10">
              <span className="font-display text-xs font-bold uppercase tracking-widest text-[#E0A2F5] bg-white/10 px-3 py-1 rounded-full">Interactive Assessment</span>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">Find Your Perfect Scan by Gestation Week</h2>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-white/80">Every scan in your pregnancy has an optimal clinical timing window. Adjust the week indicator to discover recommended packages for your current stage.</p>
              <div className="mt-6 flex items-center gap-3 text-xs text-white/60">
                <Clock size={16} className="text-[#E0A2F5]" />
                Select a parameter to view matching recommendations immediately.
              </div>
            </div>

            <div className="lg:col-span-6 max-w-lg lg:ml-auto w-full rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-xl shadow-[#2D2136]/5 md:p-8 relative z-10">
              <div className="flex flex-col items-center gap-6 border-b border-zinc-100 pb-8">
                <span className="font-display text-sm font-semibold text-[#2D2136]/60">My Pregnancy Gestation:</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-5xl font-black text-[#F000E2]">{weeks}</span>
                  <span className="font-display text-lg font-bold text-[#2D2136]/80">Weeks</span>
                </div>
                <div className="w-full flex items-center gap-4">
                  <span className="font-body text-xs font-bold text-[#2D2136]/50">6w</span>
                  <input
                    type="range"
                    min={6}
                    max={40}
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-100 accent-[#F000E2]"
                    style={{
                      background: `linear-gradient(to right, rgb(240, 0, 226) 0%, rgb(240, 0, 226) ${pct}%, rgb(244, 244, 245) ${pct}%, rgb(244, 244, 245) 100%)`,
                    }}
                  />
                  <span className="font-body text-xs font-bold text-[#2D2136]/50">40w</span>
                </div>
              </div>
              <div className="pt-6">
                <h4 className="font-display text-sm font-bold text-[#2D2136] mb-4">Recommended Scan Packages:</h4>
                <div className="flex flex-col gap-4">
                  {loading ? (
                    <div className="text-center text-sm text-[#2D2136]/50 py-4">Loading services...</div>
                  ) : services.length === 0 ? (
                    <div className="text-center text-sm text-[#2D2136]/50 py-4">No services available for this stage.</div>
                  ) : (
                    services.slice(0, 1).map((svc) => {
                      const slug = svc.slug || svc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
                      return (
                        <div
                          key={svc.id}
                          className="flex items-center justify-between rounded-xl bg-[#FCFAFD] border border-zinc-200/50 p-4 hover:border-[#E0A2F5]/40"
                        >
                          <h5 className="font-display text-[14.5px] font-bold text-[#2D2136]">{svc.title || svc.service_name}</h5>
                          <Link
                            href={`/services/pregnancy-scans/${slug}`}
                            className="flex items-center gap-1 font-body text-xs font-bold text-[#F000E2] hover:text-[#E0A2F5]"
                          >
                            View Scan <ChevronRight size={14} />
                          </Link>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
