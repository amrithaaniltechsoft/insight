"use client";

import { notFound, redirect } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { servicesData, ScanService, FaqItem } from "./servicesData";
import PageBanner from "@/components/global/PageBanner";
import ServiceListing from "./ServiceListing";
import ServiceCalculator from "./ServiceCalculator";
import ServiceFaqs from "./ServiceFaqs";

// Shape returned by the Laravel API
export interface ApiService {
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
  turn_around_time: string | null;
  video_link: string | null;
  faq_link: string | null;
  image: string | null;
  category_slug: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function extractInclusionItems(content: string | null | undefined): string[] {
  if (!content) return [];

  const liMatches = Array.from(content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((match) => stripHtml(match[1] ?? ""))
    .filter(Boolean);

  if (liMatches.length > 0) {
    return liMatches.slice(0, 5);
  }

  const normalizedText = content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/&nbsp;/gi, " ");

  const splitItems = normalizedText
    .split(/\r?\n|(?:^|\s)[•●▪·]\s+/)
    .map((item) => stripHtml(item))
    .filter(Boolean);

  return splitItems.slice(0, 5);
}

interface ServiceListingClientProps {
  slug: string;
  services: ApiService[] | ScanService[];
  faqs: FaqItem[];
  category: ApiCategory | null;
}

// Convert an API service to the ScanService shape expected by ServiceListing
function toScanService(svc: ApiService): ScanService {
  // Keep admin/detail-page list items intact for the listing card as well.
  const packageItems = extractInclusionItems(svc.package_include);
  const descriptionItems = extractInclusionItems(svc.description1);
  const overviewItems = extractInclusionItems(svc.service_overview);
  const inclusions =
    packageItems.length > 0
      ? packageItems
      : descriptionItems.length > 0
        ? descriptionItems
        : overviewItems;

  return {
    title: svc.title,
    slug: svc.slug,
    weeks: svc.appointment ?? svc.turn_around_time ?? "Contact Us",
    description: svc.service_overview ?? "",
    price: svc.price ?? "POA",
    icon: Stethoscope,
    duration: svc.appointment ?? "—",
    inclusions,
    categorySlug: svc.category_slug,
  };
}

export default function ServiceListingClient({
  slug,
  services,
  faqs,
  category,
}: ServiceListingClientProps) {
  // Blood tests has its own dedicated page with a different design
  if (slug === "blood-tests") {
    redirect("/services/blood-tests");
  }

  // Static fallback data for this category
  const staticData = servicesData[slug];

  if (!staticData && !category) {
    notFound();
  }

  // Determine which services to show: API if available, static as fallback
  const isApiService = (s: ApiService | ScanService): s is ApiService =>
    "service_name" in s;

  const scans: ScanService[] =
    services.length > 0
      ? services.map((s) => (isApiService(s) ? toScanService(s) : (s as ScanService)))
      : staticData?.scans ?? [];

  // Titles and metadata come from static data (they don't change often)
  const title = staticData?.title ?? category?.name ?? "Services";
  const highlightedTitle = staticData?.highlightedTitle ?? "";
  const description = staticData?.description ?? category?.description ?? "";
  const gradient = staticData?.bannerGradient ?? "from-[#1E227D] to-[#F000E2]";
  const calculatorTitle = staticData?.calculatorTitle ?? "Find the Right Service";
  const calculatorSubtitle =
    staticData?.calculatorSubtitle ??
    "Select your area of interest to view recommended services.";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services/all" },
    { label: `${title} ${highlightedTitle}`.trim() },
  ];

  return (
    <main className="flex-1 w-full bg-[#FCFAFD]">
      {/* Hero Banner — same style as Shop */}
      <PageBanner
        title={title}
        highlightedTitle={highlightedTitle || undefined}
        breadcrumbs={breadcrumbs}
        description={description}
        gradient={gradient}
      />

      {/* Service Cards Grid */}
      <ServiceListing scans={scans} slug={slug} />

      {/* Interactive Assessment Calculator */}
      <ServiceCalculator
        slug={slug}
        title={calculatorTitle}
        subtitle={calculatorSubtitle}
      />

      {/* FAQ Accordion - only show if there are FAQs and handle API/static fallback cleanly */}
      {(() => {
        const displayFaqs = category ? faqs : (faqs.length > 0 ? faqs : (staticData?.faqs ?? []));
        return displayFaqs.length > 0 ? (
          <ServiceFaqs
            faqs={displayFaqs}
            categoryName={`${title} ${highlightedTitle}`.trim()}
          />
        ) : null;
      })()}
    </main>
  );
}
