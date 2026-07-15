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

              {/* Video section — only shown when video_link exists */}
              {videoLink && (
                <div className="mt-10 border-t border-zinc-200 pt-8 text-left">
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#2D2136] mb-4">
                    Watch: Service expectations &amp; preparations
                  </h3>
                  <p className="font-body text-[14px] leading-relaxed text-[#2D2136]/70 mb-6">
                    Learn more about our private scan and clinical pathways. Watch our short walkthrough video detailing what to expect during your appointment.
                  </p>
                  <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-[#E0A2F5]/20 shadow-lg bg-black">
                    <iframe
                      src={(() => {
                        try {
                          const u = new URL(videoLink);
                          if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed${u.pathname}`;
                          if (u.pathname.startsWith('/shorts/')) return `https://www.youtube.com/embed${u.pathname.replace('/shorts/', '/')}`;
                          const vid = u.searchParams.get('v');
                          if (vid) return `https://www.youtube.com/embed/${vid}`;
                          return videoLink;
                        } catch { return videoLink; }
                      })()}
                      title="Service walkthrough video"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
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
