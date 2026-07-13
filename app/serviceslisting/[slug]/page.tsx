import { servicesData } from "@/components/servicelistingpage/servicesData";
import ServiceListingClient from "@/components/servicelistingpage/ServiceListingClient";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// Define the static params for prerendering
export function generateStaticParams() {
  return [
    { slug: "pregnancy-scans" },
    { slug: "diagnostics" },
    { slug: "physiotherapy" },
    { slug: "all" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fetch services from API or fallback to static
async function getServicesForCategory(slug: string) {
  // For "all", aggregate services from all categories via API
  if (slug === "all") {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
    try {
      const catRes = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
      const categories = catRes.ok ? await catRes.json() : [];
      const slugs = categories.map((c: { slug: string }) => c.slug).filter(Boolean);

      const results = await Promise.allSettled(
        slugs.map((s: string) =>
          fetch(`${API_URL}/services/category/${s}`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : null)
        )
      );

      const allServices: any[] = [];
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value?.services) {
          allServices.push(...result.value.services);
        }
      }

      return {
        services: allServices,
        faqs: [],
        category: null,
      };
    } catch {
      return { services: [], faqs: [], category: null };
    }
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  
  try {
    // Fetch services
    const servicesRes = await fetch(`${API_URL}/services/category/${slug}`, {
      next: { revalidate: 60 } // ISR: revalidate every 60 seconds
    });

    // Fetch FAQs
    const faqsRes = await fetch(`${API_URL}/faqs/category/${slug}`, {
      next: { revalidate: 60 }
    });

    let services = [];
    let category = null;
    let faqs = [];

    if (servicesRes.ok) {
      const data = await servicesRes.json();
      services = data.services || [];
      category = data.category;
    }

    if (faqsRes.ok) {
      faqs = await faqsRes.json();
    }

    // If no services from API, fall back to static data
    if (services.length === 0 && servicesData[slug]) {
      return {
        services: servicesData[slug].scans,
        faqs: servicesData[slug].faqs,
        category: null,
      };
    }



    return { services, faqs, category };
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback to static data
    if (servicesData[slug]) {
      return {
        services: servicesData[slug].scans,
        faqs: servicesData[slug].faqs,
        category: null,
      };
    }
    return { services: [], faqs: [], category: null };
  }
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = servicesData[slug];
  if (!data) {
    return {
      title: "Service Details | Insight Health Services",
    };
  }
  return {
    title: data.seoTitle,
    description: data.seoDescription,
  };
}

export default async function ServiceListingPage({ params }: PageProps) {
  const { slug } = await params;

  // Blood tests has its own dedicated page with a unique design
  if (slug === "blood-tests") {
    redirect("/blood-tests");
  }

  const { services, faqs, category } = await getServicesForCategory(slug);
  return <ServiceListingClient slug={slug} services={services} faqs={faqs} category={category} />;
}
