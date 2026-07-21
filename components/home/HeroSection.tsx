"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Quote, Star } from "lucide-react";
import Button from "@/components/ui/Button";

const services = [
  {
    title: "4D Pregnancy Scans",
    description: "Premium baby bonding with HD-Live technology, including keepsake images and a digital portfolio.",
    category: "Maternity",
    image: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Clinical Diagnostics",
    description: "Rapid private ultrasounds for abdomen, kidneys, and more. Skip the waiting lists and get immediate insights.",
    category: "Medical",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Expert Physiotherapy",
    description: "Personalized manual therapy, acupuncture, and injection therapy for sports injuries and chronic pain.",
    category: "Rehab",
    image: "https://images.unsplash.com/photo-1579126038374-6064e9370f0f?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Comprehensive Bloods",
    description: "Detailed wellness, fertility, and allergy blood profiles with rapid, comfortable service.",
    category: "Diagnostics",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop",
  },
];

const LaurelBranch = ({ className, right }: { className?: string; right?: boolean }) => (
  <svg
    className={className}
    width="30" height="80" viewBox="0 0 30 80" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ transform: right ? 'scaleX(-1)' : undefined }}
  >
    <path d="M15 75C15 75 5 56 5 37C5 18 20 5 20 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 60C7 56 3 50 3 43C3 43 9 45 12 60Z" fill="currentColor" />
    <path d="M10 43C5 39 2 33 2 27C2 27 8 28 10 43Z" fill="currentColor" />
    <path d="M8 27C4 23 2 17 2 11C2 11 8 12 8 27Z" fill="currentColor" />
    <path d="M20 5C17 10 13 15 13 21C13 21 21 17 20 5Z" fill="currentColor" />
    <path d="M16 22C13 27 9 32 9 38C9 38 17 35 16 22Z" fill="currentColor" />
    <path d="M13 38C10 43 6 48 6 55C6 55 14 51 13 38Z" fill="currentColor" />
  </svg>
);

const trustAnchorVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
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

const AngelWings = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-full h-[95%] max-w-[500px] flex justify-between px-2 bottom-[8%]">
        {/* Left Wing */}
        <motion.div
          className="w-[48%] h-full origin-bottom-right"
          animate={{
            rotate: [-4, 6, -4],
            scale: [0.96, 1.04, 0.96],
            y: [0, -8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-full h-full text-white/30 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" viewBox="0 0 200 300" fill="currentColor">
            {/* Top primary feathers */}
            <path d="M200,200 C170,120 120,40 80,20 C70,15 50,10 40,35 C30,60 35,110 70,160 C100,200 150,220 200,230 Z" />
            {/* Mid feathers */}
            <path d="M200,220 C170,160 110,90 70,80 C60,78 45,85 40,105 C35,125 45,160 80,195 C110,220 150,235 200,240 Z" opacity="0.8" />
            {/* Lower feathers */}
            <path d="M200,235 C175,195 120,140 80,135 C70,133 60,140 55,155 C50,170 60,195 90,215 C120,230 160,240 200,245 Z" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Right Wing */}
        <motion.div
          className="w-[48%] h-full origin-bottom-left"
          animate={{
            rotate: [4, -6, 4],
            scale: [0.96, 1.04, 0.96],
            y: [0, -8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="w-full h-full text-white/30 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" viewBox="0 0 200 300" fill="currentColor" style={{ transform: 'scaleX(-1)' }}>
            {/* Top primary feathers */}
            <path d="M200,200 C170,120 120,40 80,20 C70,15 50,10 40,35 C30,60 35,110 70,160 C100,200 150,220 200,230 Z" />
            {/* Mid feathers */}
            <path d="M200,220 C170,160 110,90 70,80 C60,78 45,85 40,105 C35,125 45,160 80,195 C110,220 150,235 200,240 Z" opacity="0.8" />
            {/* Lower feathers */}
            <path d="M200,235 C175,195 120,140 80,135 C70,133 60,140 55,155 C50,170 60,195 90,215 C120,230 160,240 200,245 Z" opacity="0.6" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

const AngelComet = ({ duration, delay, size = 28 }: { duration: number; delay: number; size?: number }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        offsetPath: `path('M 900,350 C 1020,400 1020,200 900,200 C 780,200 780,450 850,520 C 750,550 680,280 550,280 C 420,280 320,480 220,380 C 120,280 180,180 400,180 C 600,180 750,280 900,350')`,
        transformOrigin: "center center",
      }}
      animate={{ offsetDistance: "100%" }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Particle Light Trail (Beam of light moving in opposite direction / trailing) */}
        {Array.from({ length: 15 }).map((_, index) => {
          const sinVal = Math.sin(index);
          const cosVal = Math.cos(index);

          // Deterministic pseudo-random offsets to prevent SSR hydration mismatch
          const maxParticleSize = size * 0.22;
          const particleSize = Math.max(1.5, maxParticleSize - index * 0.15);
          const randomWiggleY = sinVal * 12;
          const maxTravelDistance = -120 - (index * 6); // particles travel backwards

          // Stagger delay for a continuous stream
          const particleDuration = 1.2 + Math.abs(sinVal) * 0.4;
          const particleDelay = index * 0.1;

          return (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]"
              style={{
                width: particleSize,
                height: particleSize,
                left: "50%",
                top: "50%",
                transformOrigin: "center",
              }}
              animate={{
                x: [0, maxTravelDistance],
                y: [0, randomWiggleY * 0.5, randomWiggleY, randomWiggleY * 0.5],
                scale: [1, 1.4, 0.6, 0],
                opacity: [0, 0.9, 0.5, 0],
              }}
              transition={{
                duration: particleDuration,
                delay: particleDelay,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          );
        })}

        {/* Soft glowing aura around the wings */}
        <div className="absolute inset-[-6px] rounded-full bg-white/20 blur-sm animate-pulse" />

        {/* Flapping Wings SVG instead of the angel */}
        <motion.svg
          className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
          viewBox="0 0 400 300"
          fill="currentColor"
          animate={{
            scaleY: [1, 0.6, 1],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "center center" }}
        >
          {/* Left Wing (Original Path) */}
          <g>
            <path d="M200,200 C170,120 120,40 80,20 C70,15 50,10 40,35 C30,60 35,110 70,160 C100,200 150,220 200,230 Z" />
            <path d="M200,220 C170,160 110,90 70,80 C60,78 45,85 40,105 C35,125 45,160 80,195 C110,220 150,235 200,240 Z" opacity="0.8" />
            <path d="M200,235 C175,195 120,140 80,135 C70,133 60,140 55,155 C50,170 60,195 90,215 C120,230 160,240 200,245 Z" opacity="0.6" />
          </g>

          {/* Right Wing (Horizontally Mirrored) */}
          <g transform="translate(400, 0) scale(-1, 1)">
            <path d="M200,200 C170,120 120,40 80,20 C70,15 50,10 40,35 C30,60 35,110 70,160 C100,200 150,220 200,230 Z" />
            <path d="M200,220 C170,160 110,90 70,80 C60,78 45,85 40,105 C35,125 45,160 80,195 C110,220 150,235 200,240 Z" opacity="0.8" />
            <path d="M200,235 C175,195 120,140 80,135 C70,133 60,140 55,155 C50,170 60,195 90,215 C120,230 160,240 200,245 Z" opacity="0.6" />
          </g>
        </motion.svg>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const duplicatedServices = [...services, ...services];

  return (
    <section className="relative flex h-auto lg:h-[calc(100vh-104px)] lg:min-h-[700px] w-full items-end justify-center overflow-hidden bg-gradient-to-r from-[#1E227D] to-[#F000E2] px-4 pt-8 sm:px-6 sm:pt-12 md:px-8 md:pt-4">

      {/* Solid Curved Background Shapes (No Gradients/Blurs) */}
      <div className="absolute -left-32 top-0 z-0 h-[40rem] w-[40rem] rounded-full bg-[#E0A2F5]/10" />
      <div className="absolute bottom-0 right-0 z-0 h-[35rem] w-[50rem] rounded-tl-full bg-[#DFD8E3]/30" />
      <div className="absolute right-1/4 top-[-10rem] z-0 h-[25rem] w-[25rem] rounded-full bg-[#F4C7D4]/15" />

      {/* Boxed Container */}
      <div className="relative z-10 mx-auto grid h-auto lg:h-full lg:max-h-[800px] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-t-[2.5rem] lg:grid-cols-12">

        {/* Angel Comet Animation Container spanning across the entire hero grid */}
        <div className="absolute inset-0 z-20 pointer-events-none hidden lg:block">
          <AngelComet duration={10} delay={0} size={28} />
          <AngelComet duration={12} delay={3} size={24} />
          <AngelComet duration={14} delay={6} size={20} />
        </div>

        {/* LEFT SIDE: Heavy Copy & CTA */}
        <div className="flex h-auto lg:h-full flex-col justify-center p-8 lg:col-span-7 lg:p-12 xl:p-16">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.1 },
              },
            }}
          >
            {/* Reduced size and boldness, highly contrasted dark color */}
            <motion.h1 variants={itemVariants} className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
              Your Health. Your Journey. <br />
              <span className="text-white/80">Expertly</span> Guided.
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 max-w-2xl font-body text-base leading-relaxed text-white/80 md:text-lg">
              From reassuring pregnancy scans and diagnostic ultrasound to blood tests and physiotherapy, experience trusted private healthcare delivered with compassion, clarity and confidence.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Button
                variant="primary"
                icon={<CalendarDays size={20} />}
                iconPosition="left"
                className="!px-8 !py-4 !text-base !bg-white !text-[#FFFF] hover:!bg-white/90"
              >
                Book Appointment
              </Button>
              <Link href="/services/all" passHref>
                <Button
                  variant="secondary"
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                  className="!px-8 !py-4 !text-base !bg-white/10 !text-white !border-white/50 hover:!bg-white/20"
                >
                  View Services
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="mt-8 flex items-center gap-4 border-t border-white/20 pt-6"
              variants={trustAnchorVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div variants={itemVariants as import("framer-motion").Variants}>
                <LaurelBranch className="h-20 w-auto text-white" />
              </motion.div>
              <motion.div variants={itemVariants as import("framer-motion").Variants} className="flex items-center gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="font-display text-2xl font-bold text-white">5.0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-[#FBBC05] fill-[#FBBC05]" />
                    <Star size={16} className="text-[#FBBC05] fill-[#FBBC05]" />
                    <Star size={16} className="text-[#FBBC05] fill-[#FBBC05]" />
                    <Star size={16} className="text-[#FBBC05] fill-[#FBBC05]" />
                    <Star size={16} className="text-[#FBBC05] fill-[#FBBC05]" />
                  </div>
                  <span className="font-body text-[11px] font-bold uppercase tracking-wider text-white/80">Google Reviews</span>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div className="flex flex-col items-center gap-1.5">
                  <Image src="/reg-logos/Annotation 2026-07-20 115730.png" alt="CQC Registered" width={56} height={56} className="h-14 w-auto object-contain" />

                </div>
              </motion.div>
              <motion.div variants={itemVariants as import("framer-motion").Variants}>
                <LaurelBranch right className="h-20 w-auto text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Image and Comet Animation */}
        <div className="relative flex items-start justify-center lg:col-span-5 h-full w-full max-w-lg mx-auto">
          <div className="relative h-full w-full">
            {/* Animated Angel Wings (Placed exactly behind the woman, appearing with the woman) */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <AngelWings />
            </motion.div>

            {/* The Pregnant Woman Image */}
            <motion.div
              className="relative z-10 h-full w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            >
              <Image
                src="/hero-sec/p-w.png"
                alt="Pregnant woman holding ultrasound scans"
                fill
                priority
                className="object-cover object-top drop-shadow-2xl"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}