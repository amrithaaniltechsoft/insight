"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface Category {
  id: number;
  name: string;
  slug: string | null;
}


export default function AboutDirectory() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

  const [categoriesData, setCategoriesData] = useState<{ slug: string; name: string; items: string[] }[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const catRes = await fetch(`${API_URL}/categories`);
        if (!catRes.ok) return;
        const cats: Category[] = await catRes.json();

        const targetSlugs = ["pregnancy-scans", "diagnostics", "physiotherapy"];

        const results = await Promise.allSettled(
          targetSlugs.map(async (slug) => {
            const cat = cats.find((c) => c.slug === slug);
            const svcRes = await fetch(`${API_URL}/services/category/${slug}`);
            const data = svcRes.ok ? await svcRes.json() : { services: [] };
            const services: { title?: string; service_name?: string }[] = data.services || [];
            return {
              slug,
              name: cat?.name ?? slug,
              items: services.map((s) => s.title || s.service_name || "").filter(Boolean),
            };
          })
        );

        const resolved: { slug: string; name: string; items: string[] }[] = [];
        for (const r of results) {
          if (r.status === "fulfilled") resolved.push(r.value);
        }
        setCategoriesData(resolved);
      } catch {}
    };

    run();
  }, [API_URL]);

  const categoryConfig = [
    { slug: "pregnancy-scans", image: "/services/pregnancy-scans3.png", bgColor: "#F6F0F9" },
    { slug: "diagnostics", image: "/services/clinical-diagnostics.png", bgColor: "#ffffff" },
    { slug: "physiotherapy", image: "/services/physiotherapy.png", bgColor: "#FCFAFD" },
  ];

  const specificServices = categoryConfig.map((cfg) => {
    const found = categoriesData.find((c) => c.slug === cfg.slug);
    return {
      category: found?.name ?? cfg.slug,
      image: cfg.image,
      href: `/serviceslisting/${cfg.slug}`,
      bgColor: cfg.bgColor,
      items: found?.items ?? [],
    };
  });

  return (
    <section className="relative w-full bg-[#FCFAFD] py-24 lg:py-32">
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

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">
            Clinical Services
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
            Our Services Include
          </h2>
          <p className="mt-4 font-body text-[15px] text-[#2D2136]/70">
            We offer many high quality health services to patients. Below are some of the popular services we provide.
          </p>
        </div>

        {/* 3-Column Services-Style Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-stretch">
          {specificServices.map((service, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              <Link
                href={service.href}
                className="group relative flex h-[680px] flex-col overflow-hidden rounded-[2.5rem] p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#2D2136]/10"
                style={{
                  background: `linear-gradient(${service.bgColor}, ${service.bgColor}) padding-box, linear-gradient(135deg, #1E227D, #F000E2) border-box`,
                  border: "3px solid transparent"
                }}
              >
                {/* Dragon Wave Background (Behind content & image) */}
                <GoldenDragonWave className="opacity-30 transition-opacity duration-500 group-hover:opacity-50" />

                {/* TOP: Content & Features */}
                <div className="relative z-20 flex flex-col">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[#2D2136] group-hover:text-[#1E227D] transition-colors">
                    {service.category}
                  </h3>
                  
                  {/* Integrated Features List */}
                  {service.items.length > 0 && (
                    <ul className="mt-6 flex flex-col gap-3">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <div className="mt-1 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-[#E0A2F5]/20 text-[#F000E2]">
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className="font-body text-[13.5px] font-semibold text-[#2D2136]/90 leading-snug">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                </div>

                {/* Interactive Arrow Indicator */}
                <div className="relative z-20 mt-8 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110">
                  <ArrowRight size={18} className="text-[#2D2136] transition-transform duration-500 group-hover:translate-x-1" />
                </div>

                {/* BOTTOM: Transparent PNG Container */}
                <div className="absolute bottom-0 left-0 right-0 z-10 h-[240px] w-full">
                  <Image
                    src={service.image}
                    alt={service.category}
                    fill
                    className="object-contain object-bottom transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
