"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

export default function ServicesSection() {
  const services = [
    {
      title: "Pregnancy Scans",
      description: "From early reassurance to premium 4D HD-Live bonding experiences. Discover the joy of seeing your baby in a warm, welcoming environment.",
      // Replace with a transparent PNG, e.g., a pregnant mother or a 4D ultrasound machine
      image: "/services/pregnancy-scans3.png",
      href: "/serviceslisting/pregnancy-scans",
      bgColor: "bg-[#FCFAFD]", // Matches Pearl White
    },
    {
      title: "Clinical Diagnostics",
      description: "Rapid, accurate private ultrasounds and blood profiles without the wait. Immediate answers from senior clinical sonographers.",
      // Replace with a transparent PNG, e.g., a stethoscope or medical professional
      image: "/services/clinical-diagnostics.png",
      href: "/serviceslisting/diagnostics",
      bgColor: "bg-[#F6F0F9]", // Light shade of Purple (#F000E2)
    },
    {
      title: "Physiotherapy",
      description: "Targeted rehabilitation, ultrasound-guided injections, and manual therapy to get you back to your peak physical health.",
      // Replace with a transparent PNG, e.g., a physical therapy exercise or joint graphic
      image: "/services/physiotherapy2.png",
      href: "/serviceslisting/physiotherapy",
      bgColor: "bg-[#EAE6EF]", // Muted Mauve to match palette
    }
  ];

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
    <section className="relative w-full bg-gradient-to-r from-[#1E227D] to-[#F000E2] py-16 lg:py-26">
      {/* The 3D Animated Background Wave */}
      <GoldenDragonWave className="opacity-100" />

      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradServices" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradServices)"
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
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >

        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <motion.h2 variants={itemVariants} className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Specialist Care <span className="text-white/80">Pathways</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-5 max-w-2xl font-body text-lg text-white/80">
            Choose a dedicated service below. Every pathway is designed to offer rapid access to industry-leading medical professionals.
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                href={service.href}
                className={`group relative flex h-[480px] flex-col overflow-hidden rounded-[2.5rem] ${service.bgColor} p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2D2136]/10 lg:p-10`}
              >
                {/* Dragon Wave Background */}
                <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

                {/* TOP: Title & Description */}
                <div className="relative z-10 flex flex-col">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#2D2136]">
                    {service.title}
                  </h3>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-[#2D2136]/80">
                    {service.description}
                  </p>
                </div>

                {/* Interactive Arrow Indicator */}
                <div className="relative z-10 mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110">
                  <ArrowRight size={20} className="text-[#2D2136] transition-transform duration-500 group-hover:translate-x-1" />
                </div>

                {/* 
                  BOTTOM: The Transparent PNG Container 
                  Absolute positioning anchors the container to the bottom.
                  object-bottom ensures the base of your PNG sits perfectly flush.
                */}
                <div className="absolute bottom-0 left-0 right-0 h-[240px] w-full">
                  {/* 
                    Note: For transparent PNGs, 'object-contain' is crucial to prevent 
                    stretching, while 'object-bottom' pins it to the floor of the card.
                  */}
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}