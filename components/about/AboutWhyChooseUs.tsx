"use client";

import { Activity, ShieldCheck, CalendarDays, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface CmsWhyChooseUs {
  title: string | null;
  description: string | null;
  image: string | null;
}

function stripHtml(input: string | null): string | null {
  if (!input) return null;
  const cleaned = input
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length ? cleaned : null;
}

function extractListItems(input: string | null): string[] {
  if (!input) return [];
  const matches = [...input.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  return matches
    .map((match) => stripHtml(match[1] ?? null))
    .filter((item): item is string => Boolean(item));
}

export default function AboutWhyChooseUs({
  cms,
  premiumCards,
}: {
  cms?: CmsWhyChooseUs | null;
  premiumCards?: Array<CmsWhyChooseUs | null>;
}) {
  const defaultWhyChooseUs = [
    "CQC regulated clinic ensuring high standards of safety and care are given to patients",
    "Highly experienced clinicians providing the best care and accurate diagnosis",
    "Same day appointments available",
    "Fast track scan reports",
    "Modern and latest ultrasound machine",
    "Flexible and convenient appointment times",
    "Latest 4D/HD Live ultrasound equipment"
  ];
  const whyChooseUs = extractListItems(cms?.description ?? null);
  const sectionTitle =
    stripHtml(cms?.title ?? null) ?? "Why Choose Insight Health Services";

  const defaultFeatures = [
    {
      title: "Accredited Partners",
      description: "All scans and tests are performed in clinical partnership with CQC regulated laboratories.",
      icon: <ShieldCheck size={24} className="text-[#F000E2]" />,
    },
    {
      title: "Expert MSK Clinicians",
      description: "Our team includes CSP Chartered Physiotherapists and HCPC registered Senior Sonographers.",
      icon: <Activity size={24} className="text-[#F000E2]" />,
    },
    {
      title: "Same-Day Bookings",
      description: "Flexible appointment slots with rapid turnaround times for typed clinical reports.",
      icon: <CalendarDays size={24} className="text-[#F000E2]" />,
    },
  ];
  const features = defaultFeatures.map((feature, index) => {
    const cmsCard = premiumCards?.[index] ?? null;
    return {
      ...feature,
      title: stripHtml(cmsCard?.title ?? null) ?? feature.title,
      description: stripHtml(cmsCard?.description ?? null) ?? feature.description,
    };
  });

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

      <motion.div 
        className="container mx-auto flex flex-col gap-16 px-6 lg:flex-row lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        
        {/* LEFT SIDE: Brand Narrative & Principles list */}
        <motion.div variants={itemVariants} className="flex flex-col items-start justify-center lg:w-1/2 lg:pr-10">
          <span className="mb-4 inline-block rounded-full bg-[#1E227D]/10 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-[#1E227D]">
            Core Principles
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
            {sectionTitle}
          </h2>

          <ul className="mt-8 flex flex-col gap-4">
            {(whyChooseUs.length ? whyChooseUs : defaultWhyChooseUs).map((reason, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1E227D]/10 text-[#1E227D]">
                  <Check size={11} strokeWidth={3} />
                </div>
                <span className="font-body text-[15px] leading-relaxed text-[#2D2136]/80 font-medium">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* RIGHT SIDE: Value Propositions Card Container */}
        <motion.div 
          variants={itemVariants} 
          className="relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-sm lg:w-1/2 lg:p-12"
        >
          <GoldenDragonWave className="opacity-20" />

          <div className="relative z-10">
            <h3 className="mb-10 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-[#2D2136]">
              Experience <span className="text-[#F000E2]">Premium</span> Care
            </h3>

            <div className="flex flex-col gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group flex items-start gap-6">
                  {/* Icon badge */}
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

            <div className="mt-10">
              <Button
                variant="primary"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="w-full sm:w-auto !bg-gradient-to-b !from-[#5839E8] !to-[#2D10AD] !text-white !border-transparent hover:brightness-110 transition-all"
              >
                Book Your Visit Today
              </Button>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
