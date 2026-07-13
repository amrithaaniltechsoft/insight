"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";
import { ScanService } from "./servicesData";
import ServiceSearchBar from "@/components/ui/ServiceSearchBar";
import { navigationData } from "@/components/global/navigation";

interface ServiceListingProps {
  scans: ScanService[];
  slug: string;
}

export default function ServiceListing({ scans, slug }: ServiceListingProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(slug === "all" ? "" : slug);
  const [selectedService, setSelectedService] = useState<{ slug: string; title: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = navigationData.map((item) => ({
    slug: item.href.split("/").pop() || "",
    title: item.label,
  }));

  const activeCategory = slug === "all" ? selectedCategory : slug;

  const servicesForCategory = scans
    .filter((scan) => {
      if (!activeCategory) return false;
      return (scan.categorySlug || slug) === activeCategory;
    })
    .map((scan) => ({
      title: scan.title,
      slug: scan.slug,
    }));

  const filteredServices = servicesForCategory.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resolvedService =
    selectedService ??
    (() => {
      const normalizedTerm = searchTerm.trim().toLowerCase();
      if (!normalizedTerm) return null;

      const exactMatch = servicesForCategory.find(
        (service) => service.title.toLowerCase() === normalizedTerm
      );
      if (exactMatch) return exactMatch;

      if (filteredServices.length === 1) {
        return filteredServices[0];
      }

      return null;
    })();

  const handleCategoryChange = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setSelectedService(null);
    setSearchTerm("");
  };

  const handleServiceSelect = (service: { slug: string; title: string }) => {
    setSelectedService(service);
    setSearchTerm(service.title);
  };

  const handleSearch = () => {
    const cat = activeCategory || scans.find(s => s.slug === resolvedService?.slug)?.categorySlug;
    if (!cat || !resolvedService) return;
    if (cat === "blood-tests") {
      router.push(`/blood-tests#${resolvedService.slug}`);
    } else {
      router.push(`/serviceslisting/${cat}/${resolvedService.slug}`);
    }
  };

  return (
    <section
      id="scans-listing"
      className="relative w-full bg-[#E7BEF8] pt-8 lg:pt-12 pb-12 lg:pb-24"
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
        {/* Search Bar */}
        <div className="mb-12 flex justify-center relative z-50 max-w-2xl mx-auto w-full">
          <ServiceSearchBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchTerm={searchTerm}
            onSearchTermChange={(val) => {
              setSearchTerm(val);
              setSelectedService(null);
            }}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
            filteredServices={filteredServices}
            onSearch={handleSearch}
            hideCategorySelect={slug !== "all"}
            canSearch={Boolean(resolvedService)}
          />
        </div>

        {/* Sub-Services Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {scans.map((scan, scanIdx) => {
            const IconComp = scan.icon;
            return (
              <motion.div
                key={scanIdx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: scanIdx * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D2136]/5"
                style={{
                  background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #1E227D, #F000E2) border-box",
                  border: "3px solid transparent"
                }}
              >
                {/* Dragon Wave Background */}
                <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

                {/* Header Info */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    {/* Icon badge */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E0A2F5]/10 text-[#F000E2] transition-colors group-hover:bg-[#F000E2] group-hover:text-white">
                      <IconComp size={22} />
                    </div>
                    <span className="font-display text-xs font-bold text-[#F000E2] bg-zinc-50 border border-zinc-200/50 px-2.5 py-1 rounded-md">
                      {scan.weeks}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-[#2D2136] group-hover:text-[#F000E2] transition-colors">
                    {scan.title}
                  </h3>

                  <p className="mt-3 font-body text-[13.5px] leading-relaxed text-[#2D2136]/70">
                    {scan.description}
                  </p>

                  {/* Quick inclusions details */}
                  <div className="mt-6 border-t border-zinc-100 pt-5">
                    <span className="font-display text-[11px] font-bold uppercase tracking-wider text-[#2D2136]/40">What&apos;s Included:</span>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {scan.inclusions.map((inc, incIdx) => (
                        <li key={incIdx} className="flex items-start gap-2">
                          <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E0A2F5]/10 text-[#F000E2]">
                            <Check size={9} strokeWidth={3} />
                          </div>
                          <span className="font-body text-[12.5px] leading-relaxed text-[#2D2136]/80">
                            {inc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price and Action CTAs */}
                <div className="relative z-10 mt-8 border-t border-zinc-100 pt-5">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-body text-xs text-[#2D2136]/50">Package Price</span>
                    <span className="font-display text-2xl font-bold text-[#F000E2]">{scan.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="primary"
                      className="!px-3 !py-2.5 !text-xs !bg-gradient-to-b !from-[#5839E8] !to-[#2D10AD] w-full"
                    >
                      Book Now
                    </Button>
                    <Link
                      href={`/serviceslisting/${scan.categorySlug || slug}/${scan.slug}`}
                      className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-3 py-2.5 font-body text-xs font-semibold text-[#2D2136] hover:border-[#F000E2] hover:text-[#F000E2] transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
