"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

interface DiagnosticCard {
  title: string;
  description: string;
  image: string;
  description1: string;
  href: string;
  bgColor: string;
}

interface ClinicalDiagnosticsProps {
  diagnostics?: DiagnosticCard[];
}

const FALLBACK_DIAGNOSTICS: DiagnosticCard[] = [
  {
    title: "Early Reassurance Scan",
    description: "Private early pregnancy scan for reassurance in the first trimester, pain or bleeding concerns, or confirmation of pregnancy development.",
    image: "/sub-service/gynecologist-performing-ultrasound-consultation.jpg",
    description1: "Early pregnancy confirmation\nHeartbeat detection\nGestational age assessment",
    href: "/services/pregnancy-scans/early-reassurance-scan",
    bgColor: "bg-[#FCFAFD]",
  },
  {
    title: "Dating Scan",
    description: "Determine your estimated due date accurately with professional crown-rump length measurements and early development check.",
    image: "/services/pregnancy-scans3.png",
    description1: "Accurate due-date calculation\nCrown-rump length measurements\nSingle/multiple pregnancy verification",
    href: "/services/pregnancy-scans/dating-scan",
    bgColor: "bg-white",
  }
];

export default function ClinicalDiagnostics({ diagnostics }: ClinicalDiagnosticsProps) {
  const items = diagnostics && diagnostics.length > 0 ? diagnostics : FALLBACK_DIAGNOSTICS;

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
          <defs>
            <linearGradient id="topWaveGradCD" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#E7BEF8"
          />

          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          />

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
        className="container mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2 variants={itemVariants} className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
            Pregnancy <span className="text-[#2D2136]/80">Ultrasound</span> Scans
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-5 max-w-2xl font-body text-lg text-[#2D2136]/80">
            Premium private pregnancy scans in a warm, professional setting. Book directly without a GP referral.
          </motion.p>
        </div>

        {/* 2-Column Services-Style Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {items.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                href={item.href}
                className={`group relative flex h-[550px] flex-col overflow-hidden rounded-[2.5rem] ${item.bgColor} p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2D2136]/10 lg:p-10`}
              >
                <GoldenDragonWave className="opacity-40 transition-opacity duration-500 group-hover:opacity-60" />

                <div className="relative z-20 flex flex-col">
                  <h3 className="font-display text-3xl font-bold tracking-tight text-[#2D2136]">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-[#2D2136]/80">
                    {item.description}
                  </p>

                  {item.description1 && (() => {
                    const iconSvg = '<div class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#E0A2F5]/20 text-[#E0A2F5]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg></div>';
                    const html = item.description1.replace(/<li>/g, '<li>' + iconSvg);
                    return <div className="mt-4 font-body text-[15px] font-semibold text-[#2D2136] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_li]:flex [&_li]:items-center [&_li]:gap-3" dangerouslySetInnerHTML={{ __html: html }} />;
                  })()}
                </div>

                <div className="relative z-20 mt-8 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110">
                  <ArrowRight size={20} className="text-[#2D2136] transition-transform duration-500 group-hover:translate-x-1" />
                </div>

                <div className="relative z-10 -mx-8 -mb-8 lg:-mx-10 lg:-mb-10 h-[340px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* BOTTOM WAVE DIVIDER */}
      <div className="absolute left-0 bottom-0 z-10 w-full translate-y-[99%] leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradPremium" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#E7BEF8"
          />
          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          />
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
    </section>
  );
}