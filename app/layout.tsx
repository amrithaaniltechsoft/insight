import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import FloatingContactIsland from "@/components/global/FloatingContactIsland";

// Display Font (Headings)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

// Body Font (Paragraphs/UI)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Insight Health Services | Private Ultrasound & Physio",
  description: "Premium private pregnancy scans, clinical diagnostics, and physiotherapy.",
};

interface SearchServiceData {
  title: string;
  slug: string;
  description: string;
  categoryName: string;
  categorySlug: string;
}

interface SearchCategoryData {
  title: string;
  slug: string;
  description: string;
}

async function fetchSearchData(): Promise<{ services: SearchServiceData[]; categories: SearchCategoryData[] }> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const catRes = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!catRes.ok) return { services: [], categories: [] };
    const cats: { id: number; name: string; slug: string; description: string }[] = await catRes.json();

    const results = await Promise.allSettled(
      cats.map(c =>
        fetch(`${API_URL}/services/category/${c.slug}`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : null)
      )
    );

    const services: SearchServiceData[] = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].status === 'fulfilled' && results[i].value?.services) {
        const cat = cats[i];
        for (const svc of results[i].value.services) {
          services.push({
            title: svc.title || svc.service_name,
            slug: svc.slug,
            description: svc.service_overview || '',
            categoryName: cat.name,
            categorySlug: cat.slug,
          });
        }
      }
    }

    const categories: SearchCategoryData[] = cats.map(c => ({
      title: c.name,
      slug: c.slug,
      description: c.description || '',
    }));

    return { services, categories };
  } catch {
    return { services: [], categories: [] };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: { id: number; name: string; slug: string }[] = [];
  let contact1 = '01922 351933';
  let contact2 = '07777 138 166';
  let searchData: { services: SearchServiceData[]; categories: SearchCategoryData[] } = { services: [], categories: [] };
  try {
    const [catRes, contactRes, searchResult] = await Promise.all([
      fetch('http://127.0.0.1:8000/api/categories', { next: { revalidate: 60 } }),
      fetch('http://127.0.0.1:8000/api/contact', { cache: 'no-store' }),
      fetchSearchData(),
    ]);
    if (catRes.ok) categories = await catRes.json();
    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contact1 = contactData.contact1 || contact1;
      contact2 = contactData.contact2 || contact2;
    }
    searchData = searchResult;
  } catch {}

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Header contact1={contact1} contact2={contact2} searchData={searchData} />
        {children}
        <Footer categories={categories} />
        <FloatingContactIsland contact1={contact1} contact2={contact2} />
      </body>
    </html>
  );
}