"use client";

import { motion } from "framer-motion";

export default function TopWaveDivider() {
  return (
    <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
      >
        <defs>
          <linearGradient id="topWaveGradPremium" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F000E2" />
            <stop offset="100%" stopColor="#1E227D" />
          </linearGradient>
        </defs>
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="#FFF"
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
  );
}
