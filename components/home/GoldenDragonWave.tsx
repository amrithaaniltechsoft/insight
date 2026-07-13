"use client";

import { motion } from "framer-motion";

export default function GoldenDragonWave({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-1/2 top-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Primary Purple metallic gradient */}
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff8af7ff" />
            <stop offset="50%" stopColor="#E0A2F5" />
            <stop offset="100%" stopColor="#fd7cf5ff" />
          </linearGradient>

          {/* Alternating Lilac metallic gradient */}
          <linearGradient id="lilacGradient" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0A2F5" />
            <stop offset="50%" stopColor="#F5E6FB" />
            <stop offset="100%" stopColor="#B67BCB" />
          </linearGradient>
        </defs>

        <motion.g>
          {/* Back strand */}
          <motion.path
            d="M -200 600 C 200 300, 600 700, 1000 400 C 1400 100, 1600 600, 1800 300"
            stroke="url(#lilacGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          {/* Middle strand (Thickest body of the wave) */}
          <motion.path
            d="M -200 500 C 300 200, 500 800, 900 500 C 1300 200, 1500 700, 1800 400"
            stroke="url(#purpleGradient)"
            strokeWidth="45"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.1 }}
          />
          {/* Front overlapping strand */}
          <motion.path
            d="M -200 550 C 400 150, 400 850, 950 450 C 1400 50,  1400 750, 1800 350"
            stroke="url(#lilacGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.9 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.2 }}
          />
        </motion.g>
      </svg>
    </div>
  );
}