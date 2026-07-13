import PageBanner from "@/components/global/PageBanner";
import FAQAccordion from "@/components/faq/FAQAccordion";
import CTASection from "@/components/home/CTASection";

export const metadata = {
  title: "Frequently Asked Questions | Insight Health Services Walsall",
  description: "Get answers to common questions about private pregnancy scans, blood tests, clinical diagnostics, and physiotherapy at our Walsall clinic.",
};

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

async function getFaqs(): Promise<FAQItem[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/faqs`);
    if (!response.ok) {
      throw new Error('Failed to fetch FAQs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

interface FAQPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function FAQPage({ searchParams }: FAQPageProps) {
  const faqs = await getFaqs();
  const { category } = await searchParams;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "FAQ" }
  ];

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <PageBanner
        title="Frequently Asked"
        highlightedTitle="Questions"
        breadcrumbs={breadcrumbs}
      />
      <FAQAccordion faqs={faqs} initialCategory={category} />
      <CTASection />
    </main>
  );
}
