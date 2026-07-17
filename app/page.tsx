import Script from "next/script";
import HeroSection from "@/components/home/HeroSection";
import TrustAnchor from "@/components/home/TrustAnchor";
import SubServices from "@/components/home/SubServices";



import ClinicalDiagnostics from "@/components/home/ClinicalDiagnostics";
import ScanCalculatorSection from "@/components/home/ScanCalculatorSection";
import PremiumPackages, { type PackageData } from "@/components/home/PremiumPackages";
import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface DiagnosticCard {
  title: string;
  description: string;
  image: string;
  description1: string;
  href: string;
  bgColor: string;
}

interface ServiceCard {
  title: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  href: string;
}

/** Service entry for search dropdown */
interface SearchService {
  slug: string;
  title: string;
  categorySlug: string;
}

const MAPPED_SLUGS = ['pregnancy-scans', 'diagnostics', 'physiotherapy'];

const CATEGORY_IMAGES: Record<string, string> = {
  'pregnancy-scans': '/sub-service/gynecologist-performing-ultrasound-consultation.jpg',
  diagnostics: '/sub-service/medical-expert-patient-meeting-check-up-appointment.jpg',
  physiotherapy: '/sub-service/doctor-helping-patient-rehabilitation.jpg',
};

async function getCategories(): Promise<CategoryItem[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch {
    return [];
  }
}


async function getPregnancyDiagnostics(): Promise<DiagnosticCard[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/services/category/pregnancy-scans`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    const services: { slug: string; title: string; service_name: string; service_overview: string; description1: string }[] = json.services || [];
    if (services.length === 0) throw new Error('No services');

    const displayServices = services.slice(0, 2);

    return displayServices.map((s, i) => ({
      title: s.title || s.service_name,
      description: s.service_overview || `Professional ${s.service_name} at our Walsall clinic.`,
      image: i === 0 ? "/services/w-checup.png" : "/services/m-checkup.png",
      description1: s.description1 || '',
      href: `/services/pregnancy-scans/${s.slug}`,
      bgColor: i === 0 ? "bg-[#FCFAFD]" : "bg-white",
    }));
  } catch {
    return [];
  }
}

interface CmsItem {
  id: number;
  page: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

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

function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function getBloodTestPackages(): Promise<PackageData[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/services/category/blood-tests`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const services: { id: number; title: string; service_name: string; price: string; description1: string; package_include: string; slug: string }[] = json.services || [];
    const first3 = services.slice(0, 3);
    return first3.map((s) => ({
      name: s.title || s.service_name,
      category: json.category?.name || 'Blood Tests',
      price: s.price || 'POA',
      description: stripHtml(s.description1) || `Comprehensive ${s.service_name} screening service.`,
      features: s.package_include
        ? stripHtml(s.package_include).split(/[,;]/).map((f: string) => f.trim()).filter(Boolean)
        : [s.service_name || s.title],
    }));
  } catch {
    return [];
  }
}

async function getAllCategories(): Promise<string[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const cats: { slug: string }[] = await res.json();
    return cats.map(c => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

async function getSearchServices(): Promise<SearchService[]> {
  const slugs = await getAllCategories();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const results = await Promise.allSettled(
    slugs.map(s =>
      fetch(`${API_URL}/services/category/${s}`, { next: { revalidate: 60 } })
        .then(r => r.ok ? r.json() : null)
    )
  );
  const out: SearchService[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value?.services) {
      const catSlug = result.value.category?.slug || '';
      for (const svc of result.value.services) {
        out.push({ slug: svc.slug, title: svc.title || svc.service_name, categorySlug: catSlug });
      }
    }
  }
  return out;
}

async function getServices(): Promise<ServiceCard[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const [catRes, servicesRes] = await Promise.all([
      fetch(`${API_URL}/categories`, { next: { revalidate: 60 } }),
      Promise.allSettled(
        MAPPED_SLUGS.map(slug =>
          fetch(`${API_URL}/services/category/${slug}`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : null)
        )
      ),
    ]);
    if (!catRes.ok) return [];
    const categories: { id: number; name: string; slug: string; description?: string }[] = await catRes.json();

    return MAPPED_SLUGS.map((slug, i) => {
      const cat = categories.find(c => c.slug === slug);
      const svcResult = servicesRes[i];
      const services = svcResult.status === 'fulfilled' && svcResult.value ? svcResult.value.services ?? svcResult.value : [];
      return {
        title: cat?.name ?? slug,
        category: slug,
        image: CATEGORY_IMAGES[slug] || '',
        description: cat?.description || '',
        features: (services as { title?: string; service_name?: string }[]).map(s => s.title || s.service_name || '').filter(Boolean),
        href: `/services/${slug}`,
      };
    });
  } catch {
    return [];
  }
}

async function fetchCmsList(ids: number[]): Promise<CmsItem[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const results = await Promise.allSettled(
    ids.map(id => fetch(`${API_URL}/cms/${id}`, { next: { revalidate: 60 } }).then(r => r.json()))
  );
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<{ data: CmsItem }>).value.data)
    .filter(Boolean);
}

export default async function Home() {
  const [services, aboutCms, categories, pregnancyDiagnostics, bloodTestPkgs, cmsFeatures, contactData, searchServices] = await Promise.all([
    getServices(),
    fetchCms(11),
    getCategories(),
    getPregnancyDiagnostics(),
    getBloodTestPackages(),
    fetchCmsList([4, 5, 6]),
    fetch('http://127.0.0.1:8000/api/contact', { cache: 'no-store' }).then(r => r.ok ? r.json() : { contact2: '07777 138 166' }).catch(() => ({ contact2: '07777 138 166' })),
    getSearchServices(),
  ]);

  return (
    <main className="flex flex-1 flex-col w-full">
      <HeroSection />
      <TrustAnchor />
      <ScanCalculatorSection />
      <SubServices services={services} categories={categories} searchServices={searchServices} />
      <ClinicalDiagnostics diagnostics={pregnancyDiagnostics} />
      <PremiumPackages packages={bloodTestPkgs} eyebrow="Blood Tests" title="Blood Test Packages" description="Confidential wellness blood profiling with rapid results from our accredited lab." />
      <AboutSection cms={aboutCms} cmsFeatures={cmsFeatures} />
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <section className="py-16 lg:py-24 bg-[#FCFAFD]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="elfsight-app-46a1acc6-6126-4429-93c8-7e1fb83e1925" data-elfsight-app-lazy />
        </div>
      </section>
      <CTASection contact2={contactData.contact2} />
    </main>
  );
}
