import PageBanner from "@/components/global/PageBanner";
import CTASection from "@/components/home/CTASection";
import GoogleReviews from "@/components/home/GoogleReviews";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getSeoByPage(page: string) {
  try {
    const res = await fetch(`${API_URL}/seos/${page}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage('Reviews');
  return {
    title: seo?.meta_title || "Patient Reviews | Insight Health Services Walsall",
    description: seo?.meta_description || "Read genuine feedback and clinical testimonials from patients who visited our private ultrasound and wellness clinic in Walsall.",
    keywords: seo?.meta_keywords || undefined,
  };
}

export default function ReviewsPage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Reviews" }
  ];

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <PageBanner
        title="Patient"
        highlightedTitle="Reviews"
        breadcrumbs={breadcrumbs}
      />
      <GoogleReviews />
      <CTASection />
    </main>
  );
}
