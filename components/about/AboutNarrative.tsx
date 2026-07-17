"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface CmsAbout {
  title: string | null;
  description: string | null;
  image: string | null;
}

function resolveImageSrc(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
}

export default function AboutNarrative({ cms }: { cms?: CmsAbout | null }) {
  // Use backend values if available, otherwise fall back to static
  const title = cms?.title ?? "Our Vision & Clinical Excellence";
  const description = cms?.description ?? null;
  const image = resolveImageSrc(cms?.image ?? null) ?? "/about-page/p-couple.png";

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
    <section className="relative w-full bg-[#FCFAFD] py-20 lg:py-28">
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
            fill="#FCFAFD"
          />
          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-40"
            transform="translate(0, 3)"
          />
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
              repeatType: "reverse",
            }}
          />
        </svg>
      </div>
      <GoldenDragonWave className="opacity-20" />

      <motion.div
        className="container relative z-10 mx-auto grid grid-cols-1 gap-12 px-6 md:grid-cols-12 lg:px-12 items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        {/* LEFT SIDE */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-start justify-center md:col-span-7 lg:pr-8"
        >
          <span className="mb-4 inline-block rounded-full bg-[#1E227D]/10 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-[#1E227D]">
            Compassionate &amp; Holistic Care
          </span>

          {/* Title from CMS backend */}
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
            {title}
          </h2>

          {/* Description: from CMS rich-text if available, else static fallback */}
          <div className="mt-8 flex flex-col gap-5 font-body text-[16px] leading-relaxed text-[#2D2136]/80">
            {description ? (
              <div
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <>
                <p>
                  Insight Health Services is a CQC Regulated independent clinic
                  in Walsall, providing a wide range of healthcare services
                  including physiotherapy, diagnostic ultrasound, and blood
                  tests.
                </p>
                <p>
                  Our Physiotherapists will assess and evaluate your need for an
                  ultrasound study through a clinical physical examination to
                  enhance a diagnosis. Once a diagnosis has been made in the
                  first session, we will then move on to create an active
                  treatment plan that suits your needs.
                </p>
                <p>
                  We also liaise with leading insurance providers in the UK to
                  arrange complete coverage of expenses for the treatment.
                </p>
              </>
            )}
          </div>

          {/* Professional Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-8 bg-zinc-50/50 border border-zinc-200/60 p-6 rounded-[2rem]">
            <Image
              src="/reg-logos/CQC-Logo 1.png"
              alt="Care Quality Commission Registered"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/reg-logos/HCPC-Registration1.png"
              alt="Health and Care Professions Council Registered"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/reg-logos/NMC-Logo.png"
              alt="Nursing and Midwifery Council Registered"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/reg-logos/SoR-Logo 1.png"
              alt="Society of Radiographers"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/reg-logos/Disclosure_and_Barring_Service.png"
              alt="Disclosure and Barring Service Registered"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
            <Image
              src="/reg-logos/General Electric.png"
              alt="General Electric"
              width={100}
              height={35}
              className="h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-end justify-center md:col-span-5 w-full min-h-[350px] md:h-full overflow-hidden rounded-[2.5rem] bg-[#E7BEF8]/30 border border-white/50"
        >
          <GoldenDragonWave className="opacity-10" />
          <div className="relative z-10 w-full h-[320px] md:h-[600px]">
            <Image
              src={image}
              alt="Clinical Care Specialists"
              fill
              className="object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105"
              sizes="(max-width: 768px) 100vw, 30vw"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
