"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, CalendarDays, ArrowRight, Clock, Coins, Check, ShieldCheck, Award, HeartPulse, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";
import { servicesData, FaqItem } from "./servicesData";
import ServiceFaqs from "./ServiceFaqs";
import { notFound } from "next/navigation";

// Shape returned by Laravel API
interface ApiService {
  id: number;
  slug: string;
  title: string;
  service_name: string;
  service_overview: string | null;
  price: string | null;
  appointment: string | null;
  description1: string | null;
  description2: string | null;
  package_include: string | null;
  inclusions: string[];
  turn_around_time: string | null;
  video_link: string | null;
  faq_link: string | null;
  image: string | null;
  category_slug: string;
}

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

interface ServiceDetailClientProps {
  slug: string;
  serviceSlug: string;
  apiService?: ApiService | null;
  apiCategory?: ApiCategory | null;
  apiFaqs?: FaqItem[];
}

// Strip HTML tags from a string
function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function ServiceDetailClient({
  slug,
  serviceSlug,
  apiService,
  apiCategory,
  apiFaqs = [],
}: ServiceDetailClientProps) {

  // ── Data resolution ─────────────────────────────────────────────────────────
  // Prefer API data; fall back to static servicesData
  const staticCategory = servicesData[slug];
  const staticScan = staticCategory?.scans.find((s) => s.slug === serviceSlug);

  if (!apiService && !staticScan) {
    notFound();
  }

  // Unified fields — API takes priority, with safe fallbacks
  const title       = apiService?.title       ?? staticScan?.title ?? "Service";
  const price       = apiService?.price       ?? staticScan?.price ?? "POA";
  const appointment = apiService?.appointment ?? staticScan?.duration ?? "—";
  const overview    = apiService?.service_overview ?? staticScan?.description ?? "";
  const videoLink   = apiService?.video_link  ?? null;
  const image       = apiService?.image       ?? null;
  const catName     = apiCategory?.name       ?? (staticCategory ? `${staticCategory.title} ${staticCategory.highlightedTitle}` : "");
  const catSlug     = apiCategory?.slug       ?? slug;

  // description1 / description2 (API only; static doesn't have separate fields)
  const desc1 = stripHtml(apiService?.description1);
  const desc2 = stripHtml(apiService?.description2);

  // FAQs — API first (no fallback if loaded from API), then static fallback
  const faqs: FaqItem[] =
    apiService
      ? apiFaqs
      : staticCategory?.faqs ?? [];

  // ── Animations ──────────────────────────────────────────────────────────────
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E227D] to-[#F000E2] py-20 text-white lg:py-28">
        <div className="absolute -left-32 top-0 z-0 h-[30rem] w-[30rem] rounded-full bg-white/5" />
        <div className="absolute bottom-0 right-0 z-0 h-[25rem] w-[35rem] rounded-tl-full bg-white/5" />
        <GoldenDragonWave className="opacity-30" />

        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          <nav className="mb-6 flex items-center gap-2 font-body text-xs font-medium text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight size={10} />
            <Link href={`/serviceslisting/${catSlug}`} className="transition-colors hover:text-white">
              {catName}
            </Link>
            <ChevronRight size={10} />
            <span className="text-white">{title}</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#FCFAFD] py-20 lg:py-28">
        {/* Wave */}
        <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"
            className="relative block h-[40px] w-full max-w-none lg:h-[70px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#FCFAFD" />
            <path d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
              fill="none" stroke="#ffffff" strokeWidth="3" className="opacity-40" transform="translate(0, 3)" />
            <motion.path
              d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
              fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" transform="translate(0, 3)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </svg>
        </div>

        <motion.div
          className="container mx-auto grid grid-cols-1 gap-12 px-6 md:grid-cols-12 lg:px-12"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
          variants={sectionVariants}
        >
          {/* ── LEFT: Details ───────────────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="flex flex-col md:col-span-7 lg:col-span-8 lg:pr-8">
            <div className="flex flex-col gap-6">

              {/* Category badge + heading */}
              <div className="flex flex-col items-start gap-3">
                <span className="inline-block rounded-full bg-[#1E227D]/10 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-widest text-[#1E227D]">
                  {catName} Package
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
                  Service Overview
                </h2>
              </div>

              {/* Overview - moved immediately after heading */}
              {overview && (
                <p className="font-body text-[15px] leading-relaxed text-[#2D2136]/75">
                  {overview}
                </p>
              )}

              {/* Metrics badges */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {price && (
                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-300 bg-white p-5">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E0A2F5]/10 text-[#F000E2]">
                      <Coins size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-[11px] font-bold uppercase tracking-wider text-[#2D2136]/50">Price</span>
                      <span className="font-display text-lg font-bold text-[#2D2136]">{price}</span>
                    </div>
                  </div>
                )}

                {appointment && (
                  <div className="flex items-center gap-4 rounded-2xl border border-zinc-300 bg-white p-5">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E0A2F5]/10 text-[#F000E2]">
                      <Clock size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body text-[11px] font-bold uppercase tracking-wider text-[#2D2136]/50">Appointment</span>
                      <span className="font-display text-base font-bold text-[#2D2136]">{appointment}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 rounded-2xl border border-zinc-300 bg-white p-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E0A2F5]/10 text-[#F000E2]">
                    <ClipboardList size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-[11px] font-bold uppercase tracking-wider text-[#2D2136]/50">Preparations</span>
                    <Link href={`/faq?category=${encodeURIComponent(catName)}`} className="font-display text-sm font-bold text-[#1E227D] hover:underline leading-tight text-left">
                      View Prep Info
                    </Link>
                  </div>
                </div>
              </div>

              {/* What's Included - using description1 */}
              {desc1 && (
                <div className="mt-6">
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#2D2136] mb-4">
                    What&apos;s Included
                  </h3>
                  {/* Parse and display list items with check icons */}
                  {(() => {
                    const htmlContent = apiService?.description1 ?? desc1;
                    // Simple regex to extract list items from HTML (without 's' flag)
                    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
                    const matches = htmlContent.match(liRegex);
                    const listItems = matches ? matches.map(match => {
                      // Remove HTML tags and decode entities
                      return match.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                    }).filter(Boolean) : [];
                    
                    if (listItems.length > 0) {
                      return (
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {listItems.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#E0A2F5]/20 text-[#F000E2]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check" aria-hidden="true">
                                  <path d="M20 6 9 17l-5-5"></path>
                                </svg>
                              </div>
                              <span className="font-body text-[14px] leading-relaxed text-[#2D2136]/80 font-medium">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    
                    // Fallback: show as HTML if no list items found
                    return (
                      <div
                        className="font-body text-[15px] leading-relaxed text-[#2D2136]/75 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Description 2 */}
              {desc2 && (
                <div className="mt-2 rounded-2xl bg-[#FCFAFD] border border-zinc-200 p-6">
                  <div
                    className="font-body text-[14px] leading-relaxed text-[#2D2136]/75 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: apiService?.description2 ?? desc2 }}
                  />
                </div>
              )}

              {/* Video section */}
              <div className="mt-10 border-t border-zinc-200 pt-8 text-left">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#2D2136] mb-4">
                  Watch: Service expectations &amp; preparations
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-[#2D2136]/70 mb-6">
                  Learn more about our private scan and clinical pathways. Watch our short walkthrough video detailing what to expect during your appointment.
                </p>
                <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1E227D] to-[#F000E2] group/video border border-[#E0A2F5]/20 shadow-lg">
                  <GoldenDragonWave className="opacity-20 group-hover/video:opacity-40 transition-opacity duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <a
                      href={videoLink || "https://www.youtube.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#1E227D] shadow-xl hover:scale-110 transition-transform duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </a>
                    <span className="mt-4 font-display text-sm font-bold text-white drop-shadow-md tracking-wide">
                      Watch Video Guide
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  <a href={videoLink || "https://youtube.com"} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="!py-2.5 !px-5 !text-xs"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.104 1.981l-.03.272-.012.104c-.052.52-.123 1.02-.224 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.58v-.075c.001-.201.01-1.131.104-2.022l.03-.272.012-.104c.052-.52.123-1.02.224-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.958 2v-.001zM6.4 5.209v4.818l4.157-2.409z"/></svg>}
                      iconPosition="left"
                    >Watch on YouTube</Button>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="!py-2.5 !px-5 !text-xs"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>}
                      iconPosition="left"
                    >Follow on Instagram</Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Booking + Trust ───────────────────────────────────────── */}
          <motion.div variants={itemVariants} className="flex flex-col md:col-span-5 lg:col-span-4">
            {/* Service image (if from API) - moved before booking card */}
            {image && (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-zinc-200 mb-6">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            )}

            {/* Booking Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-[#1E227D]/5 to-[#F000E2]/5 border border-[#1E227D] p-8">
              <GoldenDragonWave className="opacity-10" />
              <div className="relative z-10 flex flex-col gap-6">
                <h3 className="font-display text-2xl font-bold tracking-tight text-[#2D2136]">
                  Experience Premium Care
                </h3>
                <p className="font-body text-[14px] leading-relaxed text-[#2D2136]/70">
                  Book your private clinical appointment in Walsall today. Choose a date and time that fits around your schedule.
                </p>
                <Button
                  variant="primary"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                  className="w-full !bg-gradient-to-b !from-[#5839E8] !to-[#2D10AD] !text-white !border-transparent hover:brightness-110 transition-all py-4"
                >
                  Book Appointment Now
                </Button>
                <div className="text-center font-body text-xs text-[#2D2136]/60">
                  Have questions? Call us on{" "}
                  <a href="tel:01922351933" className="font-bold text-[#1E227D] hover:underline">
                    01922 351 933
                  </a>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-col gap-4 rounded-[2.0rem] bg-white border border-zinc-300 p-6">
              {[
                { icon: <Award size={20} />, title: "HCPC Registered", sub: "Senior Clinical Sonographers" },
                { icon: <HeartPulse size={20} />, title: "CSP Chartered", sub: "Expert Physiotherapists" },
                { icon: <ShieldCheck size={20} />, title: "CQC Regulated Clinic", sub: "Ensuring High Clinical Standards" },
              ].map((badge, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E0A2F5]/10 text-[#F000E2]">
                    {badge.icon}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-display text-sm font-bold tracking-tight text-[#2D2136]">{badge.title}</h4>
                    <p className="font-body text-[11px] text-[#2D2136]/60">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── FAQS ──────────────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <ServiceFaqs faqs={faqs} categoryName={title} />
      )}
    </main>
  );
}
