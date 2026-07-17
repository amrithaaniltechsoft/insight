"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";

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

  return (
    <section id="scan-calculator" className="relative py-20 bg-gradient-to-r from-[#1E227D] to-[#F000E2]">
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-[40px] w-full max-w-none lg:h-[70px]">
          <defs>
            <linearGradient id="topWaveGradCalculator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="url(#topWaveGradCalculator)" />
          <path d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3" fill="none" stroke="#ffffff" strokeWidth="3" className="opacity-20" transform="translate(0, 3)" />
          <path d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" transform="translate(0, 3)" pathLength="1" strokeDashoffset="0" strokeDasharray="0.5936221852607559 1" />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden scale-x-[-1] opacity-20">
        <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="calcPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff8af7ff" />
              <stop offset="50%" stopColor="#E0A2F5" />
              <stop offset="100%" stopColor="#fd7cf5ff" />
            </linearGradient>
            <linearGradient id="calcLilacGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0A2F5" />
              <stop offset="50%" stopColor="#F5E6FB" />
              <stop offset="100%" stopColor="#B67BCB" />
            </linearGradient>
          </defs>
          <g>
            <path d="M -200 600 C 200 300, 600 700, 1000 400 C 1400 100, 1600 600, 1800 300" stroke="url(#calcLilacGrad)" strokeWidth="20" strokeLinecap="round" opacity="0.8" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
            <path d="M -200 500 C 300 200, 500 800, 900 500 C 1300 200, 1500 700, 1800 400" stroke="url(#calcPurpleGrad)" strokeWidth="45" strokeLinecap="round" opacity="1" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
            <path d="M -200 550 C 400 150, 400 850, 950 450 C 1400 50, 1400 750, 1800 350" stroke="url(#calcLilacGrad)" strokeWidth="12" strokeLinecap="round" opacity="0.9" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
          </g>
        </svg>
      </div>

      <div className="max-w-5xl relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-12">
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
      </div>
    </section>
  );
}
