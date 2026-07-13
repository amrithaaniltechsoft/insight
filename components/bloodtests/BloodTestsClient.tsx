"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight, Activity, Heart,
  Baby, Shield, Droplets, ArrowRight,
  FlaskConical, FileText, Stethoscope, Check, Mars, Venus,
} from "lucide-react";
import Button from "@/components/ui/Button";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";
import ServiceSearchBar from "@/components/ui/ServiceSearchBar";

// Shape from the API (mirrors ServiceController@getPublicServicesBySlug)
export interface BloodTest {
  id: number;
  slug: string;
  title: string;
  service_name: string;     // sub-category / group name
  service_overview: string | null;
  price: string | null;
  appointment: string | null;
  description1: string | null;
  package_include: string | null;
  turn_around_time: string | null;
  image: string | null;
  category_slug: string;
}

// Static categories with icons — order & icons are fixed, counts are dynamic
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "general health":      Activity,
  "heart & cardio":      Heart,
  "fertility & hormones": Baby,
  "men's health":        Mars,
  "women's health":      Venus,
  "infection & immune":  Shield,
  "organ function":      Droplets,
};

function iconFor(name: string): React.ElementType {
  return CATEGORY_ICONS[name.toLowerCase()] ?? Activity;
}

// Strip HTML tags from package_include / description1
function stripHtml(html: string | null): string[] {
  if (!html) return [];
  return html
    .replace(/<[^>]*>/g, "\n")
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);
}

interface BloodTestsClientProps {
  tests: BloodTest[];
}

export default function BloodTestsClient({ tests }: BloodTestsClientProps) {
  // Group tests by service_name (sub-category)
  const grouped = tests.reduce<Record<string, BloodTest[]>>((acc, t) => {
    const key = t.service_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  // Unique category names in insertion order
  const categoryNames = Object.keys(grouped);

  // Build category cards for quick-nav
  const categories = categoryNames.map((name) => ({
    title: name,
    icon: iconFor(name),
    tests: `${grouped[name].length} TEST${grouped[name].length !== 1 ? "S" : ""} AVAILABLE`,
  }));

  // Search state
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState<{ slug: string; title: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const searchCategories = [
    { slug: "all", title: "All Tests" },
    ...categoryNames.map((name) => ({
      slug: name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-"),
      title: name,
    })),
  ];

  const allTestsFlat = tests.map((t) => ({
    slug: t.slug,
    title: t.title,
    category: t.service_name,
  }));

  const filteredServices = allTestsFlat.filter((s) => {
    const catMatch =
      selectedCategory === "all" ||
      s.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === selectedCategory;
    const termMatch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    return catMatch && termMatch;
  });

  const handleSearch = () => {
    if (selectedService) {
      // Scroll to the specific selected test card
      const el = document.getElementById(selectedService.slug);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else if (searchTerm.trim()) {
      // Scroll to the first card whose title matches the typed term
      const match = allTestsFlat.find((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (match) {
        const el = document.getElementById(match.slug);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    } else if (selectedCategory !== "all") {
      // Scroll to the category section anchor
      const el = document.getElementById(selectedCategory);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Button is active when a specific category is chosen OR the user has typed something
  const canSearch = searchTerm.trim().length > 0 || selectedCategory !== "all";

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative overflow-visible bg-gradient-to-br from-[#1E227D] to-[#F000E2] py-20 text-white lg:py-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 h-[25rem] w-[35rem] rounded-tl-full bg-white/5" />
          <GoldenDragonWave className="opacity-30" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <nav className="mb-6 flex items-center gap-2 font-body text-xs font-medium text-white/70">
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight size={10} />
              <Link href="/serviceslisting/all" className="transition-colors hover:text-white">Services</Link>
              <ChevronRight size={10} />
              <span className="text-white">Blood Tests</span>
            </nav>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl mb-6">
              Expert Blood<br />
              <span className="text-[#E0A2F5]">Diagnostics Clinic</span>
            </h1>
            <p className="font-body text-base text-white/80 max-w-lg">
              Comprehensive private blood profiling from UKAS accredited laboratories. No NHS waiting lists — rapid results delivered directly to you.
            </p>
          </div>

          {/* SEARCH WIDGET */}
          <div className="relative z-50 w-full max-w-xl">
            <ServiceSearchBar
              categories={searchCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={(slug) => {
                setSelectedCategory(slug);
                setSelectedService(null);
                setSearchTerm("");
              }}
              searchTerm={searchTerm}
              onSearchTermChange={(val) => {
                setSearchTerm(val);
                setSelectedService(null);
              }}
              selectedService={selectedService}
              onServiceSelect={(svc) => {
                setSelectedService(svc);
                setSearchTerm(svc.title);
              }}
              filteredServices={filteredServices}
              onSearch={handleSearch}
              canSearch={canSearch}
            />
          </div>
        </div>
      </section>

      {/* ── QUICK NAV ──────────────────────────────────── */}
      <section
        className="relative w-full bg-[#E7BEF8] pt-16 pb-32"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.18)' stroke-width='1.5'/%3e%3c/svg%3e")` }}
      >
        {/* Wave top */}
        <div className="absolute left-0 top-0 w-full -translate-y-[99%] rotate-180 leading-[0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"
            className="relative block h-[40px] w-full max-w-none lg:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#E7BEF8" />
          </svg>
        </div>

        <div className="container relative mx-auto px-6 lg:px-12">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
              Quick <span className="text-[#2D2136]/80">Navigation</span>
            </h2>
            <p className="mt-5 max-w-2xl font-body text-lg text-[#2D2136]/80">
              Select a category to jump directly
            </p>
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-[#2D2136]/60 font-body">No blood test categories found.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {categories.map((cat, idx) => {
                const IconComp = cat.icon;
                const anchorId = cat.title.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                const isLast = idx === categories.length - 1 && categories.length % 4 !== 0;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className={`${isLast ? "w-full md:w-[calc(33.33%-11px)]" : "w-[calc(50%-8px)] md:w-[calc(33.33%-11px)]"} lg:w-[calc(25%-12px)]`}
                  >
                    <Link
                      href={`/blood-tests#${anchorId}`}
                      className="group relative flex flex-col bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-[#F000E2]/30 hover:bg-gradient-to-br hover:from-white hover:to-[#fdeffc] overflow-hidden h-full"
                    >
                      <GoldenDragonWave className="opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1E227D] text-white transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#5839E8] group-hover:to-[#F000E2] group-hover:scale-105">
                          <IconComp size={24} />
                        </div>
                        <h3 className="font-display text-base sm:text-xl font-bold text-[#2D2136] leading-snug">{cat.title}</h3>
                        <span className="font-body text-[11px] sm:text-[12px] font-bold uppercase tracking-wider text-[#2D2136]/60 mt-1 block">
                          {cat.tests}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── ALL TESTS DIRECTORY ────────────────────────── */}
      <section className="relative w-full bg-[#FCFAFD] pt-20 pb-32">
        {/* Wave top */}
        <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"
            className="relative block h-[40px] w-full max-w-none lg:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FCFAFD" />
          </svg>
        </div>

        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
              Browse <span className="text-[#2D2136]/80">All Blood Tests</span>
            </h2>
            <p className="mt-5 max-w-2xl font-body text-lg text-[#2D2136]/80">
              Explore our comprehensive range of private blood tests. Click any test to book your appointment.
            </p>
          </div>

          {tests.length === 0 ? (
            <p className="text-center text-[#2D2136]/60 font-body py-16">
              No blood tests available at the moment. Please check back soon.
            </p>
          ) : (
            <div className="flex flex-col gap-16">
              {categoryNames.map((catName, groupIdx) => {
                const IconComp = iconFor(catName);
                const anchorId = catName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");

                // Filter tests in this group based on active search/category
                const groupTests = grouped[catName].filter((t) => {
                  const catSlug = catName.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
                  const catMatch = selectedCategory === "all" || catSlug === selectedCategory;
                  const termMatch = searchTerm.trim() === "" || t.title.toLowerCase().includes(searchTerm.toLowerCase());
                  return catMatch && termMatch;
                });

                // Hide entire group if no tests match
                if (groupTests.length === 0) return null;

                return (
                  <div key={groupIdx} id={anchorId} className="flex flex-col gap-6 scroll-mt-24">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E227D] text-white">
                        <IconComp size={16} />
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#2D2136]">{catName}</h3>
                    </div>

                    <div className="flex flex-wrap justify-start gap-4">
                      {groupTests.map((test, idx) => {
                        const inclusions = stripHtml(test.package_include);
                        return (
                          <div
                            key={idx}
                            id={test.slug}
                            className="group relative flex flex-col rounded-3xl p-4 sm:p-8 shadow-sm hover:shadow-lg transition-all scroll-mt-24 overflow-hidden hover:-translate-y-1 w-[calc(50%-8px)] lg:w-[calc(33.33%-11px)]"
                            style={{
                              background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #1E227D, #F000E2) border-box",
                              border: "2px solid transparent",
                            }}
                          >
                            <GoldenDragonWave className="opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col flex-grow">
                              {/* Title + Price */}
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4 mb-4">
                                <h4 className="font-display text-sm sm:text-lg font-bold text-[#2D2136] leading-tight">
                                  {test.title}
                                </h4>
                                {test.price && (
                                  <span className="font-display text-base sm:text-xl font-bold text-[#F000E2] shrink-0">
                                    {test.price}
                                  </span>
                                )}
                              </div>

                              {/* Overview */}
                              {test.service_overview && (
                                <p className="font-body text-[11px] sm:text-[13px] text-[#2D2136]/70 mb-4 sm:mb-6 flex-grow">
                                  {test.service_overview}
                                </p>
                              )}

                              {/* TAT */}
                              {test.turn_around_time && (
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                  <span className="font-body text-[9px] sm:text-[10px] font-bold tracking-widest uppercase bg-zinc-100 text-[#2D2136] py-1 px-2 rounded">
                                    {test.turn_around_time} TAT
                                  </span>
                                </div>
                              )}

                              {/* Description (from backend description1 field) */}
                              {test.description1 && (
                                <div 
                                  className="font-body text-[11px] sm:text-[13px] text-[#2D2136]/80 mb-4 sm:mb-6 rich-text-content"
                                  dangerouslySetInnerHTML={{ __html: test.description1 }}
                                />
                              )}

                              {/* Inclusions */}
                              {inclusions.length > 0 && (
                                <div className="border-t border-zinc-100 pt-4 sm:pt-5 mb-4 sm:mb-6">
                                  <span className="block font-display text-[9px] sm:text-[10px] font-bold uppercase text-[#2D2136]/60 mb-2 sm:mb-3">
                                    MARKERS INCLUDED
                                  </span>
                                  <ul className="flex flex-col gap-1.5 sm:gap-2">
                                    {inclusions.map((marker, mIdx) => (
                                      <li key={mIdx} className="flex items-start gap-1.5 sm:gap-2">
                                        <Check size={12} className="text-[#F000E2] shrink-0 mt-0.5" />
                                        <span className="font-body text-[11px] sm:text-[13px] text-[#2D2136]/80 leading-normal">
                                          {marker}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <Link
                                href={`/contact?enquiry=${encodeURIComponent(test.title)}`}
                                className="mt-auto"
                              >
                                <Button
                                  variant="primary"
                                  icon={<ArrowRight size={12} />}
                                  iconPosition="right"
                                  className="w-full !text-[10px] sm:!text-xs !py-2.5 sm:!py-3"
                                >
                                  BOOK <span className="hidden sm:inline">DIAGNOSTICS</span>
                                  <span className="inline sm:hidden">NOW</span>
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST FEATURES ─────────────────────────────── */}
      <section
        className="relative w-full bg-[#E7BEF8] py-24 lg:py-32"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.18)' stroke-width='1.5'/%3e%3c/svg%3e")` }}
      >
        {/* Wave top */}
        <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"
            className="relative block h-[40px] w-full max-w-none lg:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#E7BEF8" />
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <div className="mb-16 text-center">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">
              Our Commitment to Quality
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
              Why Trust Our Diagnostic Process?
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { title: "UKAS Laboratory", description: "All samples are analyzed in high security, UKAS accredited clinical facilities.", icon: <FlaskConical size={22} /> },
              { title: "Rapid Validation", description: "Validated medical reports delivered securely to your digital portal with clinical oversight.", icon: <FileText size={22} /> },
              { title: "Doctor Reviewed", description: "Optional clinical consultation available for complex diagnostic profiles and markers.", icon: <Stethoscope size={22} /> },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-white p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2D2136]/5 w-[calc(50%-12px)] md:w-[calc(33.33%-16px)]"
                style={{
                  background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #1E227D, #F000E2) border-box",
                  border: "3px solid transparent",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GoldenDragonWave className="opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#E0A2F5]/10 text-[#F000E2] transition-colors group-hover:bg-[#F000E2] group-hover:text-white">
                    {pillar.icon}
                  </div>
                  <h3 className="font-display text-base sm:text-xl font-bold text-[#2D2136] group-hover:text-[#F000E2] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-4 font-body text-[12px] sm:text-[13.5px] leading-relaxed text-[#2D2136]/70">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
