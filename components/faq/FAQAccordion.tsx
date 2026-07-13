"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import GoldenDragonWave from "../home/GoldenDragonWave";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  initialCategory?: string;
}

export default function FAQAccordion({ faqs, initialCategory }: FAQAccordionProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory || "All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = faqs.filter(
    (faq) => activeCategory === "All" || faq.category === activeCategory
  );

  return (
    <section
      className="relative py-20 lg:py-28 bg-[#FCFAFD]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.06)' stroke-width='1.5'/%3e%3c/svg%3e")`,
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
            fill="#FCFAFD"
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
      <GoldenDragonWave className="opacity-30" />
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenFaq(null);
              }}
              className={`rounded-full px-5 py-2.5 font-display text-[13.5px] font-bold transition-all ${activeCategory === category
                  ? "bg-[#1E227D] text-white shadow-md"
                  : "bg-white text-[#2D2136] border border-zinc-200/80 hover:border-[#E0A2F5]/50 hover:bg-zinc-50"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-300 bg-white overflow-hidden transition-all duration-300 hover:border-[#E0A2F5]/90"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <div className="flex flex-col gap-1 pr-4">
                      <span className="font-display text-xs font-bold uppercase tracking-wider text-[#F000E2]/80">
                        {faq.category}
                      </span>
                      <span className="font-display text-[15.5px] font-bold text-[#2D2136]">
                        {faq.q}
                      </span>
                    </div>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-[#2D2136]/50">
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-zinc-100 p-6 pt-4 font-body text-[14px] leading-relaxed text-[#2D2136]/70">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
