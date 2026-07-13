import AboutHero from "@/components/about/AboutHero";
import AboutNarrative from "@/components/about/AboutNarrative";
import AboutPillars from "@/components/about/AboutPillars";
import AboutDirectory from "@/components/about/AboutDirectory";
import AboutWhyChooseUs from "@/components/about/AboutWhyChooseUs";

export const metadata = {
  title: "About Us | Insight Health Services Walsall",
  description: "CQC regulated private healthcare clinic in Walsall. Expert diagnostics, physical therapy, and phlebotomy services.",
};

export interface CmsItem {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

// Fetch a single CMS record by ID
async function fetchCms(id: number): Promise<CmsItem | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/cms/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  // Fetch all About CMS records in parallel
  const [narrative, pillar1, pillar2, pillar3, whyChooseUs, premium1, premium2, premium3] = await Promise.all([
    fetchCms(3), // id:3 → "Our Vision & Clinical Excellence" (Narrative section)
    fetchCms(4), // id:4 → "Personalized Physiotherapy"
    fetchCms(5), // id:5 → "Trusted Professionals"
    fetchCms(6), // id:6 → "Path To Better Health"
    fetchCms(7), // id:7 → "Why Choose Insight Health Services"
    fetchCms(8), // id:8 → "Experience Premium Care" card 1
    fetchCms(9), // id:9 → "Experience Premium Care" card 2
    fetchCms(10), // id:10 → "Experience Premium Care" card 3
  ]);

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <AboutHero />
      <AboutNarrative cms={narrative} />
      <AboutPillars pillars={[pillar1, pillar2, pillar3]} />
      <AboutDirectory />
      <AboutWhyChooseUs cms={whyChooseUs} premiumCards={[premium1, premium2, premium3]} />
    </main>
  );
}
