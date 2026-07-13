"use client";

import { ArrowRight, Activity, ShieldCheck, CalendarDays } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import GoldenDragonWave from "./GoldenDragonWave";

interface CmsItem {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

interface AboutSectionProps {
  cms?: CmsItem | null;
  cmsFeatures?: CmsItem[];
}

const FEATURE_ICONS = [Activity, ShieldCheck, CalendarDays];

export default function AboutSection({ cms, cmsFeatures }: AboutSectionProps) {
  const features = cmsFeatures && cmsFeatures.length > 0
    ? cmsFeatures.map((item, i) => {
        const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
        return {
          title: item.title || "Feature",
          description: item.description ? item.description.replace(/<[^>]*>/g, '') : "",
          icon: <Icon size={24} className="text-[#E0A2F5]" />,
        };
      })
    : [
    {
      title: "Personalized Physiotherapy",
      description: "As an established private physiotherapy clinic in Walsall, we have a highly skilled team dedicated to your recovery.",
      icon: <Activity size={24} className="text-[#E0A2F5]" />,
    },
    {
      title: "Trusted Professionals",
      description: "We work only with fully certified professionals who excel in providing quality patient care and accurate diagnostics.",
      icon: <ShieldCheck size={24} className="text-[#E0A2F5]" />,
    },
    {
      title: "Path To Better Health",
      description: "We offer a flexible schedule for appointments that easily fit around your daily routines and commitments.",
      icon: <CalendarDays size={24} className="text-[#E0A2F5]" />,
    },
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
    <section
      className="relative w-full bg-gradient-to-r from-[#1E227D] to-[#F000E2] py-24 lg:py-32"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(255,255,255,0.15)' stroke-width='1.5'/%3e%3c/svg%3e"), linear-gradient(to right, #1E227D, #F000E2)`,
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
            <linearGradient id="topWaveGradAbout" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradAbout)"
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
        className="container mx-auto flex flex-col gap-16 px-6 lg:flex-row lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >

        {/* LEFT SIDE: Brand Narrative */}
        <motion.div variants={itemVariants} className="flex flex-col items-start justify-center lg:w-1/2 lg:pr-10">
          {/* <span className="mb-4 inline-block rounded-full bg-[#F000E2]/10 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-[#E0A2F5]">
            Compassionate & Holistic Care
          </span> */}

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white md:text-5xl">
            {cms?.title || "About Insight Health"}
          </h2>

          <div className="mt-8 flex flex-col gap-5 font-body text-[16px] leading-relaxed text-white/80">
            {cms?.description ? (
              cms.description.replace(/<[^>]*>/g, '').split('\n').filter(p => p.trim()).map((p, i) => (
                <span key={i}>{p}</span>
              ))
            ) : (
              <>
                <span>
                  Insight Health Services is a CQC Regulated independent clinic in Walsall, providing a wide range of healthcare services including physiotherapy, diagnostic ultrasound and blood tests.
                </span>
                <span>
                  Our Physiotherapists will assess and evaluate your need for an ultrasound study through a clinical physical examination to enhance a diagnosis. Once a diagnosis has been made in the first session, we will then move on to create an active treatment plan that suits your needs.
                </span>
                <span>
                  We also liaise with leading insurance providers in UK to arrange complete coverage of expenses for the treatment.
                </span>
              </>
            )}
          </div>

          <div className="mt-10">
            <Link href="/about">
              <Button
                variant="secondary"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                className="!bg-white/10 !text-white !border-white/50 hover:!bg-white/20"
              >
                Read More About Us
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Value Propositions (The 3 Cards) */}
        <motion.div variants={itemVariants} className="relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm lg:w-1/2 lg:p-12">

          <GoldenDragonWave className="opacity-20" />

          <div className="relative z-10">
            <h3 className="mb-10 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-[#2D2136]">
              We Offer <span className="text-[#F000E2]">High Quality</span> Health Services
            </h3>

            <div className="flex flex-col gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group flex items-start gap-6">

                  {/* Icon Container */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110">
                    {feature.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex flex-col pt-1">
                    <h4 className="font-display text-xl font-bold tracking-tight text-[#2D2136]">
                      {feature.title}
                    </h4>
                    <p className="mt-2 font-body text-[14.5px] leading-relaxed text-[#2D2136]/70">
                      {feature.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </motion.div>

      </motion.div>
    </section>
  );
}