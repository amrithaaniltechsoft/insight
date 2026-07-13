"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import GoldenDragonWave from "./GoldenDragonWave";

export default function GoogleReviews() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      date: "2 weeks ago",
      text: "Absolutely phenomenal experience. The 4D scan was incredibly clear, and the sonographer was so warm and reassuring. The clinic feels like a premium spa.",
      rating: "5.0",
    },
    {
      name: "David Aris",
      date: "1 month ago",
      text: "I needed an urgent DVT scan and was seen within 2 hours. The medical team was highly professional, and getting the report immediately gave me absolute peace of mind.",
      rating: "5.0",
    },
    {
      name: "Emily R.",
      date: "2 months ago",
      text: "The best physiotherapy I’ve ever received. After months of chronic back pain, their ultrasound-guided injections completely changed my daily life. Highly recommended.",
      rating: "5.0",
    },
    {
      name: "Chloe T.",
      date: "3 months ago",
      text: "Booked an early reassurance scan. The staff went above and beyond to make my husband and I feel comfortable. Spotlessly clean clinic and top-tier equipment.",
      rating: "5.0",
    },
    {
      name: "Michael B.",
      date: "4 months ago",
      text: "Extremely efficient well-man blood tests. No NHS waiting lists, incredibly professional phlebotomists, and my detailed results were back the next morning.",
      rating: "5.0",
    },
  ];

  const [width, setWidth] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Dynamically measure the exact pixel width of one block of reviews to ensure a mathematically perfect loop
  useEffect(() => {
    const measure = () => {
      if (measureRef.current) {
        // offsetWidth captures the width + the padding-right (which acts as our gap)
        setWidth(measureRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // The physics loop: constantly moves the carousel left, unless hovered or dragged
  useAnimationFrame((t, delta) => {
    if (isHovered || isDragging || width === 0) return;
    // Adjust the 0.05 multiplier to change the auto-scroll speed
    baseX.set(baseX.get() - 0.05 * delta);
  });

  // Mathematically wrap the continuously decreasing baseX value so it snaps back seamlessly
  const wrapPixels = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  const x = useTransform(baseX, (v) => {
    if (width === 0) return "0px";
    return `${wrapPixels(-width, 0, v)}px`;
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
          <defs>
            <linearGradient id="topWaveGradReviews" x1="0%" y1="0%" x2="100%" y2="0%">
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

      {/* The 3D Animated Background Wave (Flipped completely for variety) */}
      <GoldenDragonWave className="rotate-180 opacity-80" />

      <motion.div className="container relative z-10 mx-auto mb-16 flex flex-col items-center px-6 text-center lg:px-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}>
        <motion.h2 variants={itemVariants} className="font-display text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
          Trusted by <span className="text-[#2D2136]/80">Hundreds</span> of Patients
        </motion.h2>
        <motion.p variants={itemVariants} className="mt-5 max-w-2xl font-body text-lg text-[#2D2136]/80">
          Do not just take our word for it. Read what our patients have to say about their private healthcare experiences.
        </motion.p>
      </motion.div>

      {/* The Carousel Wrapper */}
      <div
        className="relative z-10 flex w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fade gradients for the edges */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-[#E7BEF8] to-transparent md:w-40" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-[#E7BEF8] to-transparent md:w-40" />

        <motion.div
          className="flex w-max cursor-grab items-stretch active:cursor-grabbing"
          style={{ x }}
          drag="x"
          // We set constraints to 0 so the element doesn't physically pull away from the wrapper
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          // Inject the raw drag delta directly into our physics loop
          onDrag={(e, info) => {
            baseX.set(baseX.get() + info.delta.x);
          }}
          onDragEnd={() => setIsDragging(false)}
        >
          {/* 
            Block 1 (Used for measuring)
            pr-8 acts as the gap between Block 1 and Block 2 
          */}
          <div className="flex w-max gap-8 pr-8" ref={measureRef}>
            {reviews.map((review, index) => (
              <ReviewCard key={`block1-${index}`} review={review} />
            ))}
          </div>

          {/* Block 2 (The seamless loop tail) */}
          <div className="flex w-max gap-8 pr-8">
            {reviews.map((review, index) => (
              <ReviewCard key={`block2-${index}`} review={review} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Sub-component for the individual review card
function ReviewCard({ review }: { review: any }) {
  return (
    <div className="relative overflow-hidden group flex w-[320px] flex-col justify-between rounded-[2rem] border border-zinc-200 bg-[#FCFAFD] p-8 transition-colors hover:border-zinc-300 md:w-[400px] lg:p-10">
      {/* Dragon Wave Background */}
      <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

      <div className="flex flex-col">
        {/* Five Star Rating */}
        <div className="flex items-center gap-1">
          {[...Array(1)].map((_, i) => (
            <Star key={i} size={14} className="fill-[#E1BE03] text-[#E1BE03]" />
          ))}
          <span className="ml-1 font-display text-sm font-bold text-[#2D2136]">{review.rating}</span>
        </div>

        {/* Review Text */}
        <p className="mt-6 font-body text-[15px] leading-relaxed text-[#2D2136]/80">
          "{review.text}"
        </p>
      </div>

      {/* Patient Identity & Google Badge */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-200/80 pt-6">
        <div className="flex flex-col">
          <span className="font-display text-base font-bold text-[#2D2136]">
            {review.name}
          </span>
          <span className="font-body text-xs font-medium text-[#2D2136]/50">
            {review.date}
          </span>
        </div>

        {/* Custom Google 'G' Logo SVG for absolute fidelity */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        </div>
      </div>

    </div>
  );
}