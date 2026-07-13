"use client";

import Image from "next/image";
import { Award, HeartPulse, Quote } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

export default function TrustAnchor() {
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
            <linearGradient id="topWaveGradTrust" x1="0%" y1="0%" x2="100%" y2="0%">
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
        className="container relative z-10 mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >

        {/* 
          THE FLAT CARD
          Notice: shadow-none, pure flat background color, structured border-radius.
        */}
        <motion.div variants={itemVariants} className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1E227D] to-[#F000E2] border border-white/20 backdrop-blur-md shadow-2xl md:flex-row group">
          {/* Dragon Wave Background */}
          <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

          {/* LEFT SIDE: The Trust Content */}
          <div className="flex w-full flex-col justify-center p-8 md:w-3/5 lg:p-10">
            <div className="flex flex-col gap-5">

              {/* Patient Trust Quote */}
              <div className="relative flex flex-col gap-2">
                <Quote className="h-6 w-6 text-white" />
                <h2 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">
                  "We believe every patient deserves clinical excellence delivered with rapid, compassionate care."
                </h2>
              </div>

              {/* Flat Divider Line */}
              <div className="h-px w-full bg-white/20" />

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Award size={24} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      HCPC Registered
                    </h3>
                    <p className="font-body text-sm font-medium text-white/80">
                      Senior Sonographers
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                    <HeartPulse size={24} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      CSP Chartered
                    </h3>
                    <p className="font-body text-sm font-medium text-white/80">
                      Expert Physiotherapists
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 
            RIGHT SIDE: The Image Container
            Ready for a transparent PNG. The background inherits the card's color.
          */}
          <div className="relative min-h-[240px] w-full bg-white/5 md:w-2/5 flex items-end justify-center">
            <Image
              src="/asset-images/physiotherapist-helping-nobg.png"
              alt="Medical Professional"
              width={1000}
              height={1000}
              className="h-auto max-h-[200px] md:max-h-[440px] w-auto object-contain object-bottom"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

        </motion.div>
      </motion.div>

      {/* BOTTOM WAVE DIVIDER */}
      <div className="absolute bottom-0 left-0 z-0 w-full leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          {/* Fill color should match the background of the NEXT section below this one (assuming white) */}
          {/* <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#F6F0F9"
          /> */}

          {/* Faint Background Track for the Stroke */}
          {/* <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#E0A2F5"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          /> */}

          {/* Animated Wave Stroke */}
          {/* <motion.path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#E0A2F5"
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
          /> */}
        </svg>
      </div>

    </section>
  );
}