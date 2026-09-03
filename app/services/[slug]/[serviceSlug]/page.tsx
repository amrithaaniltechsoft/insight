import ServiceDetailClient from "@/components/servicelistingpage/ServiceDetailClient";
import { servicesData } from "@/components/servicelistingpage/servicesData";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; serviceSlug: string }>;
}

// Fetch a single service from API, fallback to static
async function getServiceDetail(slug: string, serviceSlug: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  try {
    const res = await fetch(`${API_URL}/services/${slug}/${serviceSlug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      return {
        service: data.service,
        category: data.category,
        faqs: data.faqs || [],
        fromApi: true,
      };
    }
  } catch (e) {
    console.error('Error fetching service detail:', e);
  }

  // Fallback: static data
  const categoryData = servicesData[slug];
  if (!categoryData) return null;
  const scan = categoryData.scans.find((s) => s.slug === serviceSlug);
  if (!scan) return null;

  return {
    service: null,
    category: null,
    faqs: categoryData.faqs,
    fromApi: false,
    staticScan: scan,
    staticCategory: categoryData,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params;
  const result = await getServiceDetail(slug, serviceSlug);

  if (!result) return { title: "Service Details | Insight Health Services" };

  if (result.fromApi && result.service) {
    const catName = result.category?.name ?? '';
    const svc = result.service;
    return {
      title: svc.meta_title || `${svc.title} - Private ${catName} | Insight Health Services Walsall`,
      description: svc.meta_description || `${svc.service_overview ?? svc.title}. Price: ${svc.price ?? 'POA'}. Book your private scan in Walsall today.`,
      keywords: svc.meta_keywords || undefined,
    };
  }

  // Static fallback
  const staticData = servicesData[slug];
  const scan = staticData?.scans.find((s) => s.slug === serviceSlug);
  if (!scan) return { title: "Service Details | Insight Health Services" };
  return {
    title: `${scan.title} - Private ${staticData.title} | Insight Health Services Walsall`,
    description: `${scan.description} Duration: ${scan.duration}. Price: ${scan.price}. Book your private scan in Walsall today.`,
  };
}

// Keep static params so existing static URLs still prerender
export function generateStaticParams() {
  const paths: { slug: string; serviceSlug: string }[] = [];
  Object.keys(servicesData).forEach((categoryKey) => {
    if (categoryKey !== "blood-tests" && categoryKey !== "all") {
      servicesData[categoryKey].scans.forEach((scan) => {
        paths.push({ slug: categoryKey, serviceSlug: scan.slug });
      });
    }
  });
  return paths;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, serviceSlug } = await params;

  if (slug === "servical-screening" || (slug === "cervical-screening" && serviceSlug === "zxczxc")) {
    redirect("/services/cervical-screening/cervical-screening");
  }

  const result = await getServiceDetail(slug, serviceSlug);

  return (
    <ServiceDetailClient
      slug={slug}
      serviceSlug={serviceSlug}
      apiService={result?.fromApi ? result.service : null}
      apiCategory={result?.fromApi ? result.category : null}
      apiFaqs={result?.faqs ?? []}
    />
  );
}
