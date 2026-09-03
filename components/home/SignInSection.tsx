"use client";

import { User, ShieldCheck, CalendarDays, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function SignInSection() {
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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

  const features = [
    {
      icon: CalendarDays,
      title: "Book Appointments",
      desc: "Schedule and manage your scans and consultations online.",
    },
    {
      icon: ClipboardList,
      title: "Health Profile",
      desc: "Keep your medical history and test results in one secure place.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      desc: "Your data is protected with industry-standard encryption.",
    },
  ];

  return (
    <section className="relative w-full bg-[#FCFAFD] py-16 lg:py-24">
      <motion.div
        className="container mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants} className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1E227D] to-[#F000E2] text-white shadow-lg shadow-[#F000E2]/20">
            <User size={28} strokeWidth={2} />
          </div>

          <h2 className="font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
            Sign In to Your Account
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-body text-[15px] leading-relaxed text-[#2D2136]/70">
            Create your free account to book appointments, track your health history, and receive personalised care — all in one place.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E227D]/10 text-[#1E227D]">
                  <feat.icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-display text-sm font-bold text-[#2D2136]">{feat.title}</h3>
                <p className="font-body text-xs leading-relaxed text-[#2D2136]/60">{feat.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants} className="mt-10">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-signin-modal"));
              }}
              className="group relative cursor-pointer overflow-hidden rounded-full bg-gradient-to-b from-[#5839E8] to-[#2D10AD] px-8 py-4 font-body text-[15px] font-bold text-white shadow-lg shadow-[#1E227D]/25 transition-all hover:brightness-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                <User size={18} />
                Get Started — It&apos;s Free
              </span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
