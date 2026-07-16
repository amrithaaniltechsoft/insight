"use client";

import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

export default function CTASection({ contact2 = '07777 138 166' }: { contact2?: string }) {
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
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#1E227D] to-[#F000E2] pt-8 pb-0 lg:pt-8 lg:pb-0">

      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradCTA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradCTA)"
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

        <motion.div variants={itemVariants} className="relative mx-auto flex w-full max-w-5xl flex-col md:flex-row">

          {/* LEFT CONTENT */}
          <div className="relative z-10 flex w-full max-w-2xl flex-col items-start justify-center text-left p-10 md:w-3/5 md:p-16 lg:p-20">
            <h2 className="font-display text-3xl font-medium tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Get the premium healthcare you want and need with Insight Health.
            </h2>

            <p className="mt-6 font-body text-[15px] text-white/80">
              Still have questions about our services? Call our Walsall clinic at <strong className="font-bold text-white">{contact2}</strong>
            </p>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row mb-12">
              <a
                href="#"
                className="group cursor-pointer rounded-full font-body text-[15px] font-semibold transition-all active:scale-95 inline-flex justify-center bg-gradient-to-b from-[#5839E8] to-[#2D10AD] hover:brightness-105 border border-white text-[#FCFAFD] font-bold px-7 py-3.5 !bg-white !text-[#FFFF] hover:!bg-white/90"
              >
                <div className="relative flex items-center justify-center overflow-hidden">
                  <span
                    className="absolute top-0 left-0 z-10 h-full w-1/2 -skew-x-[30deg] bg-gradient-to-r from-transparent via-white/80 to-transparent"
                    style={{ transform: 'translateX(250%)' }}
                  />
                  <div className="flex items-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-10">
                    <span className="flex items-center"><CalendarDays size={18} /></span>
                    <span>Book Appointment</span>
                  </div>
                  <div className="absolute top-10 left-0 flex w-full items-center justify-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0">
                    <span className="flex items-center"><CalendarDays size={18} /></span>
                    <span>Book Appointment</span>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative z-10 min-h-[340px] sm:min-h-[380px] md:min-h-[auto] md:w-2/5 lg:min-h-[360px]">
            <Image
              src="/cta/cta.png"
              alt="Medical Professional"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          {/* RIGHT DECORATION */}
          <div className="pointer-events-none absolute -right-[40px] top-1/2 hidden h-[1200px] w-[1200px] -translate-y-1/2 md:block">
            <GoldenDragonWave className="rotate-[100deg] scale-y-[-1] opacity-40" />
            <GoldenDragonWave className="rotate-[125deg] scale-y-[-1] opacity-50" />
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}
