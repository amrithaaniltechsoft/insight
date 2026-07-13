"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaqItem } from "./servicesData";

interface ServiceFaqsProps {
  faqs: FaqItem[];
  categoryName: string;
}

export default function ServiceFaqs({ faqs, categoryName }: ServiceFaqsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      className="relative py-20 lg:py-28 bg-[#E7BEF8]"
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
            <linearGradient id="topWaveGradFaqs" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E7BEF8" />
              <stop offset="100%" stopColor="#E7BEF8" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradFaqs)"
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

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="mx-auto max-w-4xl">

          <div className="mb-12 text-center">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">
              Patient Information
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
              {categoryName} <span className="text-[#F000E2]">FAQs</span>
            </h2>
            <p className="mt-4 font-body text-[15px] text-[#2D2136]/75">
              Quick answers to the most common queries about our private clinical pathways.
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-zinc-200/70 bg-white overflow-hidden transition-all duration-300 hover:border-[#E0A2F5]/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-display text-[15.5px] font-bold text-[#2D2136]">
                      {faq.q}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-50 text-[#2D2136]/50">
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
                        <div className="border-t border-zinc-100 p-6 pt-4 font-body text-[13.5px] leading-relaxed text-[#2D2136]/70">
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
