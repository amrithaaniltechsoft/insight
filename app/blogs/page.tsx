import PageBanner from "@/components/global/PageBanner";
import BlogGrid from "@/components/blogs/BlogGrid";
import CTASection from "@/components/home/CTASection";
import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function getSeoByPage(page: string) {
  try {
    const res = await fetch(`${API_URL}/seos/${page}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage('Blog');
  return {
    title: seo?.meta_title || "Health & Wellness Blog | Insight Health Services Walsall",
    description: seo?.meta_description || "Stay informed with health insights, prenatal advice, phlebotomy details, and muscle/joint rehabilitation tips from our clinic team.",
    keywords: seo?.meta_keywords || undefined,
  };
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  category: string;
  created_at: string;
}

async function getBlogs(): Promise<BlogPost[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/blogs`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blogs" }
  ];

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden">
      <PageBanner
        title="Health & Wellness"
        highlightedTitle="Blog"
        breadcrumbs={breadcrumbs}
      />
      <BlogGrid blogs={blogs} />
      <CTASection />
    </main>
  );
}
