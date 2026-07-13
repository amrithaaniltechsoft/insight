import ServiceDetailClient from "@/components/servicelistingpage/ServiceDetailClient";
import { servicesData } from "@/components/servicelistingpage/servicesData";
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
    return {
      title: `${result.service.title} - Private ${result.category?.name ?? ''} | Insight Health Services Walsall`,
      description: `${result.service.service_overview ?? result.service.title}. Price: ${result.service.price ?? 'POA'}. Book your private scan in Walsall today.`,
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
