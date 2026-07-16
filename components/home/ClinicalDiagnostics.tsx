"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
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

                {/* Animated Wave Background (Behind image and content) */}
                <GoldenDragonWave className="opacity-40 transition-opacity duration-500 group-hover:opacity-60" />

                {/* TOP: Content & Features */}
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

                {/* Interactive Arrow Indicator */}
                <div className="relative z-20 mt-8 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110">
                  <ArrowRight size={20} className="text-[#2D2136] transition-transform duration-500 group-hover:translate-x-1" />
                </div>

                {/* 
                  BOTTOM: Transparent PNG Container 
                  Relative positioning to sit in flow, but negative margins breakout of card padding.
                */}
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

        {/* Bottom Urgent Banner */}
        <motion.div variants={itemVariants as any} className="group relative mt-12 flex flex-col overflow-hidden rounded-[2rem] bg-white md:flex-row lg:mt-16">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 transition-opacity duration-500 group-hover:opacity-60">
            <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff8af7ff" />
                  <stop offset="50%" stopColor="#E0A2F5" />
                  <stop offset="100%" stopColor="#fd7cf5ff" />
                </linearGradient>
                <linearGradient id="lilacGradient" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E0A2F5" />
                  <stop offset="50%" stopColor="#F5E6FB" />
                  <stop offset="100%" stopColor="#B67BCB" />
                </linearGradient>
              </defs>
              <g>
                <path d="M -200 600 C 200 300, 600 700, 1000 400 C 1400 100, 1600 600, 1800 300" stroke="url(#lilacGradient)" strokeWidth="20" strokeLinecap="round" opacity="0.8" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
                <path d="M -200 500 C 300 200, 500 800, 900 500 C 1300 200, 1500 700, 1800 400" stroke="url(#purpleGradient)" strokeWidth="45" strokeLinecap="round" opacity="1" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
                <path d="M -200 550 C 400 150, 400 850, 950 450 C 1400 50,  1400 750, 1800 350" stroke="url(#lilacGradient)" strokeWidth="12" strokeLinecap="round" opacity="0.9" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
              </g>
            </svg>
          </div>
          <div className="relative z-10 flex flex-col justify-center p-8 md:w-2/3 lg:p-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#F4C7D4]/20">
                <ShieldAlert size={28} className="text-[#E8B8C7]" />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-display text-2xl font-bold tracking-tight text-[#2D2136]">Urgent DVT Scans Available</h4>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-[#2D2136]/70 lg:max-w-xl">Deep Vein Thrombosis screenings with same-day reports. Immediate clinical appointments for your absolute peace of mind.</p>
                <div className="mt-6">
                  <button className="group cursor-pointer rounded-full font-body text-[15px] font-semibold transition-all active:scale-95 inline-flex justify-center bg-gradient-to-b from-[#5839E8] to-[#2D10AD] hover:brightness-105 border border-white text-[#FCFAFD] font-bold px-7 py-3.5 w-full sm:w-auto !bg-[#F4C7D4] !border-transparent !text-[#ffff] hover:!bg-[#E8B8C7]">
                    <div className="relative flex items-center justify-center overflow-hidden">
                      <span className="absolute top-0 left-0 z-10 h-full w-1/2 -skew-x-[30deg] bg-gradient-to-r from-transparent via-white/80 to-transparent" style={{ transform: 'translateX(250%)' }} />
                      <div className="flex items-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-10">
                        <span>Book Urgent Scan</span>
                      </div>
                      <div className="absolute top-10 left-0 flex w-full items-center justify-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0">
                        <span>Book Urgent Scan</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 min-h-[240px] w-full md:min-h-[auto] md:w-1/3">
            <Image
              src="/services/DVT-Scans.png"
              alt="Urgent DVT Scan"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </motion.div>

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