import PageBanner from "@/components/global/PageBanner";
import ProductGrid from "@/components/shop/ProductGrid";
import CTASection from "@/components/home/CTASection";
import TopWaveDivider from "@/components/shop/TopWaveDivider";
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
  const seo = await getSeoByPage('Shop');
  return {
    title: seo?.meta_title || "Gender Reveal Shop & Keepsakes | Insight Health Services Walsall",
    description: seo?.meta_description || "Browse our premium selection of gender reveal products, baby heartbeat teddy bears, confetti cannons, and scratch cards at Insight Health Services.",
    keywords: seo?.meta_keywords || undefined,
  };
}

interface ProductColor {
  id: number;
  color_name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  colors?: ProductColor[];
}

async function getProducts(): Promise<Product[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/shop/products`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop" },
  ];

  return (
    <main className="w-full bg-[#FCFAFD]">
      <PageBanner
        title="Our Gender Reveal"
        highlightedTitle="Shop"
        breadcrumbs={breadcrumbs}
      />

      <section className="relative pb-16 lg:pb-24 pt-8 lg:pt-12">
        {/* TOP WAVE DIVIDER */}
        <TopWaveDivider />
        <div className="container mx-auto px-6 lg:px-12">
          {/* Page Intro */}
          {/* <div className="mb-12 flex flex-col items-center text-center max-w-2xl mx-auto">
            <span className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-[#F000E2]">
              Milestone Celebrations
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#2D2136] md:text-4xl">
              Add Magic to Your Reveal
            </h2>
            <p className="mt-4 font-body text-sm leading-relaxed text-[#2D2136]/70">
              Available to purchase directly in our Walsall clinic during your scan appointment. Make your baby gender announcement spectacular with our hand-picked premium reveal accessories.
            </p>
          </div> */}

          {/* Product Grid */}
          <ProductGrid products={products} />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
