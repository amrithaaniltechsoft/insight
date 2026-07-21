"use client";

import { Activity, ShieldCheck, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface CmsPillar {
  title: string | null;
  description: string | null;
}

function stripHtml(input: string | null): string | null {
  if (!input) return null;
  const cleaned = input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned : null;
}

export default function AboutPillars({
  pillars,
}: {
  pillars?: Array<CmsPillar | null>;
}) {
  const defaultPillars = [
    {
      title: "Personalised Physiotherapy",
      description: "As an established private physiotherapy clinic in Walsall, we have a highly skilled team dedicated to your recovery.",
      icon: <Activity size={22} />,
    },
    {
      title: "Trusted Professionals",
      description: "We work only with fully certified professionals who excel in providing quality patient care and accurate diagnostics.",
      icon: <ShieldCheck size={22} />,
    },
    {
      title: "Path To Better Health",
      description: "We offer a flexible schedule for appointments that easily fit around your daily routines and commitments.",
      icon: <CalendarDays size={22} />,
    },
  ];

  const mergedPillars = defaultPillars.map((pillar, index) => {
    const cmsPillar = pillars?.[index] ?? null;
    return {
      ...pillar,
      title: stripHtml(cmsPillar?.title ?? null) ?? pillar.title,
      description: stripHtml(cmsPillar?.description ?? null) ?? pillar.description,
    };
  });

  return (
    <section
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
            className="opacity-40"
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

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">
            Our Core Strengths
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
            We Offer High Quality Health Services
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {mergedPillars.map((pillar, index) => (
            <motion.div
              key={index}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D2136]/5"
              style={{
                background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #1E227D, #F000E2) border-box",
                border: "3px solid transparent"
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Dragon Wave Background */}
              <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0A2F5]/10 text-[#F000E2] transition-colors group-hover:bg-[#F000E2] group-hover:text-white">
                  {pillar.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-[#2D2136] group-hover:text-[#F000E2] transition-colors">{pillar.title}</h3>
                <p className="mt-4 font-body text-[13.5px] leading-relaxed text-[#2D2136]/70">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
