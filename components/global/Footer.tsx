import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";



interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface ContactData {
  contact1: string;
  contact2: string;
  email: string;
  address: string;
  mon_fri: string;
  saturday: string;
  sunday: string;
}

interface FooterService {
  title: string;
  slug: string;
  categorySlug: string;
}

async function getContact(): Promise<ContactData> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/contact`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    return {
      contact1: '01922 351933',
      contact2: '07777 138 166',
      email: 'bookings@insighthealthservices.co.uk',
      address: '1a Walsall Rd, Walsall WS5 4QL, United Kingdom',
      mon_fri: '08:00 - 21:00',
      saturday: '08:00 - 21:00',
      sunday: '08:00 - 21:00',
    };
  }
}

async function getCms(id: number): Promise<string | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/cms/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.description || null;
  } catch {
    return null;
  }
}

async function getFooterServices(): Promise<FooterService[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const catRes = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!catRes.ok) return [];
    const cats: { slug: string }[] = await catRes.json();
    const results = await Promise.allSettled(
      cats.map(c =>
        fetch(`${API_URL}/services/category/${c.slug}`, { next: { revalidate: 60 } }).then(r => r.ok ? r.json() : null)
      )
    );
    const services: FooterService[] = [];
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === 'fulfilled' && r.value?.services) {
        const catSlug = cats[i].slug;
        for (const svc of r.value.services) {
          services.push({ title: svc.title || svc.service_name, slug: svc.slug, categorySlug: catSlug });
        }
      }
    }
    return services;
  } catch {
    return [];
  }
}

export default async function Footer({ categories = [] }: { categories?: CategoryItem[] }) {
  const [contact, cms12, footerServices] = await Promise.all([getContact(), getCms(12), getFooterServices()]);
  return (
    <footer className="relative w-full bg-gradient-to-r from-[#1A0B66] to-[#3D1052] pt-20 pb-10 text-white">
      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="footerWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3D1052" />
              <stop offset="100%" stopColor="#1A0B66" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#footerWaveGrad)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

          {/* Column 1: Brand & Trust */}
          <div className="flex flex-col gap-6 lg:pr-6">
            {/* Replace with a white/light version of the client's logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo/logo2.png"
                alt="Insight Health Services Logo"
                width={160}
                height={55}
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="font-body text-sm leading-relaxed text-white/70">
              {cms12 ? cms12.replace(/<[^>]*>/g, '') : 'Premium private healthcare clinic in Walsall offering expert pregnancy scans, clinical diagnostics, physiotherapy, and comprehensive blood profiling.'}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 transition-all hover:bg-[#1E227D] hover:text-white hover:border-[#1E227D]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 transition-all hover:bg-[#1E227D] hover:text-white hover:border-[#1E227D]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/70 transition-all hover:bg-[#1E227D] hover:text-white hover:border-[#1E227D]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Clinical Services */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display text-lg font-bold tracking-tight text-white">
              Specialist Services
            </h4>
            <nav className="flex flex-col gap-3 font-body text-[14.5px] text-white/70">
              {categories.length > 0 ? categories.map(cat => (
                <Link key={cat.id} href={`/services/${cat.slug}`} className="transition-colors hover:text-[#F000E2]">{cat.name.replace(/\n/g, '').trim()}</Link>
              )) : (
                <>
                  <Link href="/services/pregnancy-scans" className="transition-colors hover:text-[#F000E2]">Pregnancy Ultrasound Scans</Link>
                  <Link href="/services/diagnostics" className="transition-colors hover:text-[#F000E2]">Clinical Diagnostic Scans</Link>
                  <Link href="/services/physiotherapy" className="transition-colors hover:text-[#F000E2]">Expert Physiotherapy</Link>
                  <Link href="/services/blood-tests" className="transition-colors hover:text-[#F000E2]">Private Blood Tests</Link>
                  <Link href="/services/blood-tests" className="transition-colors hover:text-[#F000E2]">Well Woman & Man Packages</Link>
                </>
              )}
            </nav>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display text-lg font-bold tracking-tight text-white">
              Patient Info
            </h4>
            <nav className="flex flex-col gap-3 font-body text-[14.5px] text-white/70">
              <Link href="/about" className="transition-colors hover:text-[#F000E2]">About The Clinic</Link>
              <Link href="/services/all" className="transition-colors hover:text-[#F000E2]">Meet Our Specialists</Link>
              <Link href="/reviews" className="transition-colors hover:text-[#F000E2]">Patient Reviews</Link>
              <Link href="/blogs" className="transition-colors hover:text-[#F000E2]">Health & Wellness Blog</Link>
              <Link href="/faq" className="transition-colors hover:text-[#F000E2]">Frequently Asked Questions</Link>
            </nav>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="flex flex-col gap-6">
            <h4 className="font-display text-lg font-bold tracking-tight text-white">
              Contact Clinic
            </h4>
            <ul className="flex flex-col gap-4 font-body text-[14.5px] text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#E0A2F5]" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[#E0A2F5]" />
                <div className="flex flex-col">
                  <a href={`tel:${contact.contact1.replace(/\s/g, '')}`} className="transition-colors hover:text-[#F000E2]">{contact.contact1} <span className="text-xs text-white/40">(Hotline)</span></a>
                  <a href={`tel:${contact.contact2.replace(/\s/g, '')}`} className="transition-colors hover:text-[#F000E2]">{contact.contact2} <span className="text-xs text-white/40">(Mobile/WhatsApp)</span></a>
                </div>
              </li>
              <li className="flex items-center gap-3 min-w-0">
                <Mail size={18} className="shrink-0 text-[#E0A2F5]" />
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-[#F000E2] break-all min-w-0 lg:max-[1100px]:break-all">{contact.email}</a>
              </li>
              <li className="flex items-start gap-3 pt-2">
                <Clock size={18} className="mt-0.5 shrink-0 text-[#F000E2]" />
                <div className="flex flex-col">
                  <span className="font-bold text-white">Mon - Fri: {contact.mon_fri}</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Registration Logos */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 border-b border-white/10 py-10">
          <Image
            src="/reg-logos/CQC-Logo 1.png"
            alt="Care Quality Commission Registered"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/reg-logos/HCPC-Registration1.png"
            alt="Health and Care Professions Council Registered"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/reg-logos/NMC-Logo.png"
            alt="Nursing and Midwifery Council Registered"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/reg-logos/SoR-Logo 1.png"
            alt="Society of Radiographers"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          />
          <Image
            src="/reg-logos/Disclosure_and_Barring_Service.png"
            alt="Disclosure and Barring Service Registered"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          /><Image
            src="/reg-logos/General Electric.png"
            alt="General Electric"
            width={120}
            height={42}
            className="h-10 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        {/* Our Services */}
        <div className="border-b border-white/10 py-10">
          <h5 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#F000E2] text-center mb-8">
            Our Services
          </h5>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-body text-xs text-white/50 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[...footerServices].filter(s => s.title.length <= 28).reverse().slice(0, 24).map((svc, i) => (
              <Link
                key={i}
                href={svc.categorySlug === 'blood-tests' ? `/services/blood-tests#${svc.slug}` : `/services/${svc.categorySlug}/${svc.slug}`}
                className="transition-colors hover:text-white"
              >
                {svc.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Legal */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 font-body text-xs text-white/50 md:flex-row">
          <span>&copy; {new Date().getFullYear()} Insight Health Services. <a href="https://www.techsoftweb.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-transparent">Web Design Company Kochi</a>.</span>
          <div className="flex gap-6">
            <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-white">Terms of Service</Link>
            <Link href="#" className="transition-colors hover:text-white">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}