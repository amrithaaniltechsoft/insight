"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export interface PackageData {
  name: string;
  category: string;
  price: string;
  description: string;
  features: string[];
}

interface PremiumPackagesProps {
  packages: PackageData[];
  eyebrow?: string;
  title?: string;
  description?: string;
}

const THEME_KEYS = ["bronze", "silver", "gold"];

const themeStyles: Record<string, {
  cardBg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  btnStyle: string;
  priceText: string;
  iconBg: string;
  iconText: string;
}> = {
  bronze: {
    cardBg: "bg-gradient-to-b from-[#FFFDFB] to-[#F7ECE1]",
    border: "border-[#CD7F32]/30 hover:border-[#CD7F32]/60 shadow-sm",
    badgeBg: "bg-[#CD7F32]/10",
    badgeText: "text-[#CD7F32]",
    btnStyle: "!bg-[#CD7F32] hover:!bg-[#B26E2B] !text-white !border-transparent",
    priceText: "text-[#8C5220]",
    iconBg: "bg-[#CD7F32]/10",
    iconText: "text-[#CD7F32]",
  },
  silver: {
    cardBg: "bg-gradient-to-b from-[#F9F9FA] to-[#EAEBED]",
    border: "border-[#A8A9AD]/40 hover:border-[#A8A9AD]/60 shadow-md",
    badgeBg: "bg-[#707175]/10",
    badgeText: "text-[#707175]",
    btnStyle: "!bg-[#707175] hover:!bg-[#5C5D60] !text-white !border-transparent",
    priceText: "text-[#5C5D60]",
    iconBg: "bg-[#707175]/10",
    iconText: "text-[#707175]",
  },
  gold: {
    cardBg: "bg-gradient-to-b from-[#FFFDF0] to-[#FAF3D1]",
    border: "border-[#D4AF37]/50 hover:border-[#D4AF37]/80 shadow-sm",
    badgeBg: "bg-[#D4AF37]/15",
    badgeText: "text-[#B49221]",
    btnStyle: "!bg-[#D4AF37] hover:!bg-[#B59522] !text-white !border-transparent",
    priceText: "text-[#E0B624] drop-shadow-sm",
    iconBg: "bg-[#D4AF37]/15",
    iconText: "text-[#B49221]",
  }
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

function DragonWaveBackground() {
  return (
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
          <path d="M -200 600 C 200 300, 600 700, 1000 400 C 1400 100, 1600 600, 1800 300" stroke="url(#lilacGradient)" strokeWidth="20" strokeLinecap="round" opacity="0.8" />
          <path d="M -200 500 C 300 200, 500 800, 900 500 C 1300 200, 1500 700, 1800 400" stroke="url(#purpleGradient)" strokeWidth="45" strokeLinecap="round" opacity="1" />
          <path d="M -200 550 C 400 150, 400 850, 950 450 C 1400 50, 1400 750, 1800 350" stroke="url(#lilacGradient)" strokeWidth="12" strokeLinecap="round" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
}

export default function PremiumPackages({ packages, eyebrow, title, description }: PremiumPackagesProps) {
  const pkgList = packages.map((pkg, i) => ({
    name: pkg.name,
    category: pkg.category,
    price: pkg.price,
    description: pkg.description,
    features: pkg.features,
    theme: THEME_KEYS[i % THEME_KEYS.length],
    badgeText: i === 1 ? "Best Value" : "",
    highlighted: i === 1,
  }));

  return (
    <section
      className="relative w-full bg-[#E7BEF8] py-16 lg:py-20"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.18)' stroke-width='1.5'/%3e%3c/svg%3e")`,
      }}
    >
      <motion.div
        className="container relative z-10 mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.span variants={itemVariants} className="mb-2 font-display text-[12px] font-bold uppercase tracking-widest text-[#2D2136]/90">
            {eyebrow || "Blood Tests"}
          </motion.span>
          <motion.h2 variants={itemVariants} className="font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
            {title || "Blood Test Packages"}
          </motion.h2>
          <motion.p variants={itemVariants} className="mt-4 max-w-xl font-body text-sm text-[#2D2136]/80">
            {description || "Confidential wellness blood profiling with rapid results from our accredited lab."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {pkgList.map((pkg, index) => {
            const styles = themeStyles[pkg.theme];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative group overflow-hidden flex flex-col rounded-2xl p-6 transition-all duration-300 border ${styles.cardBg} ${styles.border}`}
              >
                <DragonWaveBackground />

                {pkg.highlighted && (
                  <div className={`absolute right-4 top-4 flex items-center gap-1 rounded-full ${styles.badgeBg} px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider ${styles.badgeText}`}>
                    <Sparkles size={10} className="fill-current" />
                    {pkg.badgeText}
                  </div>
                )}

                <div className="flex flex-col border-b border-zinc-100 pb-5 text-left">
                  <span className="font-display text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {pkg.category}
                  </span>
                  <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-[#2D2136]">
                    {pkg.name}
                  </h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className={`font-display text-3xl font-extrabold tracking-tight ${styles.priceText}`}>
                      {pkg.price}
                    </span>
                  </div>
                  <p className="mt-2 font-body text-xs leading-relaxed text-[#2D2136]/75">
                    {pkg.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-2.5 py-5 flex-grow text-left">
                  {pkg.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <div className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} ${styles.iconText}`}>
                        <Check size={9} strokeWidth={3} />
                      </div>
                      <span className="font-body text-xs text-[#2D2136]/80 font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Button className={`w-full !py-2.5 !text-xs ${styles.btnStyle}`}>
                    <div className="relative flex items-center justify-center overflow-hidden">
                      <span className="absolute top-0 left-0 z-10 h-full w-1/2 -skew-x-[30deg] bg-gradient-to-r from-transparent via-white/80 to-transparent" style={{ transform: "translateX(250%)" }} />
                      <div className="flex items-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-10">
                        <span>Book Scan</span>
                        <ArrowRight size={14} />
                      </div>
                      <div className="absolute top-10 left-0 flex w-full items-center justify-center gap-2 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:top-0">
                        <span>Book Scan</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}