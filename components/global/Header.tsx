"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, CalendarDays, Phone, Menu, X, Search, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { navigationData as staticNavigationData } from "./navigation";
import { BLOG_POSTS_DETAIL } from "@/components/blogs/blogData";

interface Category {
  id: number;
  name: string;
  slug: string | null;
  description: string;
  promo_title: string | null;
  promo_description: string | null;
  promo_link_text: string | null;
  promo_link_href: string | null;
  promo_bg_type: "pearl" | "zinc";
}

interface SubCategory {
  id: number;
  name: string;
  order: number;
}

// Service item shape returned from API
interface ApiServiceItem {
  id: number;
  slug: string;
  title: string;
  service_name: string;
  service_overview: string | null;
  price: string | null;
  appointment: string | null;
  category_slug: string;
}

// Grouped by sub-category name
interface ServiceGroup {
  subcategory: string;
  items: ApiServiceItem[];
}

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

export default function Header({ contact1 = '01922 351933', contact2 = '07777 138 166', searchData }: {
  contact1?: string;
  contact2?: string;
  searchData?: { services: SearchServiceData[]; categories: SearchCategoryData[] };
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationData, setNavigationData] = useState(staticNavigationData);

  // Per-category service data fetched from API (keyed by category slug)
  const [categoryServicesMap, setCategoryServicesMap] = useState<Record<string, ServiceGroup[]>>({});
  const [loadingCatSlug, setLoadingCatSlug] = useState<string | null>(null);

  // Fetch services for a given category slug (only once per slug)
  const fetchCategoryServices = async (catSlug: string) => {
    if (categoryServicesMap[catSlug] !== undefined) return; // already fetched
    setLoadingCatSlug(catSlug);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
      const res = await fetch(`${API_URL}/services/category/${catSlug}`);
      if (res.ok) {
        const data = await res.json();
        const services: ApiServiceItem[] = data.services || [];

        // Determine if this category uses sub-category grouping.
        // Blood Tests (and similar) have multiple services sharing the same service_name
        // (service_name = sub-category group), whereas other categories have unique service_names.
        const serviceNameCounts: Record<string, number> = {};
        services.forEach((svc) => {
          const key = svc.service_name || 'General';
          serviceNameCounts[key] = (serviceNameCounts[key] || 0) + 1;
        });
        const hasSubGroups = Object.values(serviceNameCounts).some((count) => count > 1);

        let groups: ServiceGroup[];
        if (hasSubGroups) {
          // Blood-test style: group by service_name, use title as row label
          const grouped: Record<string, ApiServiceItem[]> = {};
          services.forEach((svc) => {
            const key = svc.service_name || 'General';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(svc);
          });
          groups = Object.entries(grouped).map(([subcategory, items]) => ({ subcategory, items }));
        } else {
          // Flat style (Pregnancy, Diagnostics, Physio): all services in one group with no heading
          groups = [{ subcategory: '', items: services }];
        }

        setCategoryServicesMap((prev) => ({ ...prev, [catSlug]: groups }));
      } else {
        setCategoryServicesMap((prev) => ({ ...prev, [catSlug]: [] }));
      }
    } catch {
      setCategoryServicesMap((prev) => ({ ...prev, [catSlug]: [] }));
    } finally {
      setLoadingCatSlug(null);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${API_URL}/categories`);
        if (response.ok) {
          const data: Category[] = await response.json();
          
          // Fetch subcategories for each category
          const categoriesWithSubCategories = await Promise.all(
            data.map(async (cat) => {
              const subCatResponse = await fetch(`${API_URL}/categories/${cat.id}/subcategories`);
              let subCategories: SubCategory[] = [];
              if (subCatResponse.ok) {
                subCategories = await subCatResponse.json();
              }
              return { ...cat, subCategories };
            })
          );

          // Build navigation from API data, using slug for URL paths
          const mappedNavigation = categoriesWithSubCategories.map((cat) => {
            // Use the slug from DB; fallback to slugified name
            const catSlug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');

            // Blood Tests has its own dedicated route
            const catHref = catSlug === 'blood-tests'
              ? '/blood-tests'
              : `/serviceslisting/${catSlug}`;

            const existingNav = staticNavigationData.find(nav =>
              nav.label.toLowerCase() === cat.name.toLowerCase()
            );

            // Build sub-links from sub_categories, using slugified sub-name
            // For blood-tests, use hash fragments (#) to avoid 404 on sub-paths
            const isBloodTests = catSlug === 'blood-tests';
            const links = cat.subCategories.map((subCat) => {
              const subSlug = subCat.name
                .toLowerCase()
                .replace(/ & /g, '-')
                .replace(/[\/\s]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
              return {
                label: subCat.name,
                href: isBloodTests ? `${catHref}#${subSlug}` : `${catHref}/${subSlug}`,
              };
            });

            // Build promo card from DB fields if they exist, else fall back to static
            const promoCard =
              cat.promo_title
                ? {
                    title: cat.promo_title,
                    description: cat.promo_description ?? "",
                    linkText: cat.promo_link_text ?? "Learn more →",
                    linkHref: cat.promo_link_href ?? catHref,
                    bgType: cat.promo_bg_type ?? "pearl",
                  }
                : existingNav?.promoCard;

            if (existingNav) {
              return {
                ...existingNav,
                label: cat.name,
                href: catHref,
                links: links.length > 0 ? links : existingNav.links,
                promoCard,
              };
            }

            // New category not in static data
            return {
              label: cat.name,
              icon: ClipboardList,
              href: catHref,
              links,
              promoCard,
            };
          });

          setNavigationData(mappedNavigation);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setNavigationData(staticNavigationData);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (idx: number) => {
    setActiveCategory(activeCategory === idx ? null : idx);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">

      {/* ========================================================================= */}
      {/* 1. DESKTOP HEADER (Screen widths lg and up) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block w-full">
        <div className="container relative mx-auto flex flex-col px-4 lg:px-6">
          {/* OVERLAPPING LOGO */}
          <Link
            href="/"
            className="absolute left-4 top-4 z-30 flex items-center justify-center lg:left-6"
          >
            <Image
              src="/logo/logo2.png"
              alt="Insight Health Services Logo"
              width={160}
              height={55}
              className="object-contain"
              priority
            />
          </Link>

          {/* NAVIGATION COLUMN */}
          <div className="flex w-full flex-col pl-[185px] lg:pl-[200px]">
            {/* TOP LAYER (Utility & Contact) */}
            <div className="flex h-10 items-center justify-between rounded-b-xl bg-gradient-to-r from-[#1E227D] to-[#F000E2] px-8">
              <nav className="flex gap-8 font-body text-[13px] font-medium text-white/80">
                <Link href="/" className="transition-colors hover:text-white">Home</Link>
                <Link href="/about" className="transition-colors hover:text-white">About us</Link>
                <Link href="/reviews" className="transition-colors hover:text-white">Reviews</Link>
                <Link href="/blogs" className="transition-colors hover:text-white">Blogs</Link>
                <Link href="/faq" className="transition-colors hover:text-white">FAQ</Link>
                <Link href="/shop" className="transition-colors hover:text-white">Shop</Link>
                <Link href="/contact" className="transition-colors hover:text-white">Contact us</Link>
              </nav>

              {/* Direct Contact Links */}
              <div className="flex items-center gap-6 font-body text-[13px] font-bold text-white/90">
                <a href={`tel:${contact1.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-white">
                  <Phone size={14} className="text-white/80" />
                  {contact1}
                </a>
                <div className="h-4 w-px bg-white/20" />
                <a href={`https://wa.me/${contact2.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition-colors hover:text-[#25D366]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16" className="text-[#FFFF]">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* BOTTOM LAYER (Primary Services & Booking) */}
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3.5 lg:gap-4 xl:gap-6">
                {navigationData.map((item, idx) => {
                  const IconComponent = item.icon;
                  // Derive the category slug from the href (e.g. /serviceslisting/pregnancy-scans => pregnancy-scans)
                  const catSlug = item.href.split('/').pop() || '';
                  const serviceGroups = categoryServicesMap[catSlug];

                  return (
                    <div
                      key={idx}
                      className="group static"
                      onMouseEnter={() => fetchCategoryServices(catSlug)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-1.5 font-display text-[12px] xl:text-[13px] font-bold text-[#2D2136] transition-colors hover:text-[#F000E2] whitespace-nowrap"
                      >
                        <IconComponent size={15} className="text-[#F000E2]" />
                        {item.label}
                        <ChevronDown size={12} className="text-[#F000E2]/50 transition-transform group-hover:rotate-180" />
                      </Link>

                      <div className="invisible absolute left-0 right-0 top-full z-20 w-full origin-top -translate-y-2 scale-y-95 bg-white opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:scale-y-100 group-hover:opacity-100 overflow-hidden">
                        <div className="max-h-[380px] overflow-y-auto border-t border-zinc-100 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                          <div className="container mx-auto max-w-5xl flex justify-between gap-10 p-8">

                            {/* ── SERVICES TABLE (dynamic from API) ── */}
                            <div className="flex-1 min-w-0">
                              {/* Loading state */}
                              {loadingCatSlug === catSlug && (
                                <div className="flex items-center gap-2 text-zinc-400 font-body text-sm py-4">
                                  <span className="inline-block w-3.5 h-3.5 border-2 border-zinc-300 border-t-[#F000E2] rounded-full animate-spin" />
                                  Loading services…
                                </div>
                              )}

                              {/* API data: grouped grid — 3 items per row, no price */}
                              {!loadingCatSlug && serviceGroups && serviceGroups.length > 0 && (
                                <div className="flex flex-col gap-5">
                                  {catSlug === 'blood-tests' ? (
                                    // Blood Tests: show subcategory names as links
                                    <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                                      {serviceGroups.map((group, gIdx) => {
                                        if (!group.subcategory) return null;
                                        const subSlug = group.subcategory
                                          .toLowerCase()
                                          .replace(/ & /g, '-')
                                          .replace(/[\/\s]+/g, '-')
                                          .replace(/-+/g, '-')
                                          .replace(/^-|-$/g, '');
                                        return (
                                          <Link
                                            key={gIdx}
                                            href={`/blood-tests#${subSlug}`}
                                            className="font-body text-[12.5px] text-[#2D2136]/85 hover:text-[#F000E2] transition-colors py-1"
                                          >
                                            {group.subcategory}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    // Other categories: grouped by subcategory with service items
                                    serviceGroups.map((group, gIdx) => (
                                      <div key={gIdx}>
                                        {group.subcategory && (
                                          <div className="font-display text-[11px] font-bold uppercase tracking-wider text-[#1E227D] border-b border-zinc-100 pb-1.5 mb-2">
                                            {group.subcategory}
                                          </div>
                                        )}
                                        <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                                          {group.items.map((svc, sIdx) => (
                                            <Link
                                              key={sIdx}
                                              href={`/serviceslisting/${catSlug}/${svc.slug}`}
                                              className="font-body text-[12.5px] text-[#2D2136]/85 hover:text-[#F000E2] transition-colors py-1"
                                            >
                                              {svc.title || svc.service_name}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}

                              {/* Fallback: static nav links (when API unavailable or blood-tests) */}
                              {!loadingCatSlug && (!serviceGroups || serviceGroups.length === 0) && (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                                  {item.links.map((link, linkIdx) => {
                                    if (link.isHeading) {
                                      return (
                                        <div
                                          key={linkIdx}
                                          className="col-span-2 font-display text-[11px] font-bold text-[#1E227D] uppercase tracking-wider border-b border-zinc-100 pb-1.5 mb-1 mt-2"
                                        >
                                          {link.label}
                                        </div>
                                      );
                                    }
                                    return (
                                      <Link
                                        key={linkIdx}
                                        href={link.href}
                                        onClick={(e) => { if (link.isComingSoon) e.preventDefault(); }}
                                        className={`font-body text-sm transition-colors ${
                                          link.isComingSoon
                                            ? 'text-zinc-400 cursor-not-allowed'
                                            : 'text-[#2D2136]/80 hover:text-[#F000E2]'
                                        }`}
                                      >
                                        {link.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Promo Card Sidebar */}
                            {item.promoCard && catSlug !== 'blood-tests' && (
                              <div
                                className={`w-72 shrink-0 flex flex-col justify-between rounded-xl ${
                                  item.promoCard.bgType === 'zinc' ? 'bg-zinc-50' : 'bg-[#FCFAFD]'
                                } p-5 border border-zinc-100/80`}
                              >
                                <div>
                                  <h4 className="font-display text-xs font-bold text-[#2D2136]">
                                    {item.promoCard.title}
                                  </h4>
                                  <p className="font-body text-[11px] text-[#2D2136]/70 mt-1.5 leading-relaxed">
                                    {item.promoCard.description}
                                  </p>
                                </div>
                                <Link
                                  href={item.promoCard.linkHref}
                                  className="font-body text-[12px] font-bold text-[#1E227D] hover:underline mt-4 inline-block"
                                >
                                  {item.promoCard.linkText}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Re-located Primary CTA */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center justify-center p-2.5 rounded-full border border-zinc-200 text-[#2D2136] hover:bg-zinc-50 hover:border-[#F000E2] hover:text-[#F000E2] transition-all"
                  aria-label="Search site"
                >
                  <Search size={16} />
                </button>
                <Button
                  variant="primary"
                  icon={<CalendarDays size={16} />}
                  iconPosition="left"
                  className="!px-5 !py-2.5 !text-[13px]"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE HEADER (Screen widths below lg) */}
      {/* ========================================================================= */}
      <div className="lg:hidden w-full relative z-[60]">

        {/* Top Navbar Layer */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-100 bg-white">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo/logo2.png"
              alt="Insight Health Services Logo"
              width={120}
              height={42}
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#2D2136] hover:bg-zinc-50 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Book Now Button */}
            <Button
              variant="primary"
              className="!px-4 !py-2 !text-[12px] whitespace-nowrap"
            >
              Book Now
            </Button>

            {/* Burger Menu Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setActiveCategory(null);
              }}
              className="p-2 text-[#2D2136] hover:bg-zinc-50 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Categories Bar Layer (Directly below top navbar) */}
        <div className="flex w-full items-center bg-[#FCFAFD] border-b border-zinc-100/80 overflow-x-auto scrollbar-none px-4 py-2.5 gap-2 scroll-smooth">
          {navigationData.map((item, idx) => {
            const isSelected = activeCategory === idx;
            const catSlug = item.href.split('/').pop() || '';
            return (
              <button
                key={idx}
                onClick={() => {
                  toggleCategory(idx);
                  setMobileMenuOpen(false);
                  fetchCategoryServices(catSlug);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-display text-xs font-bold transition-all whitespace-nowrap ${isSelected
                    ? "bg-[#1E227D] text-white shadow-sm"
                    : "bg-white text-[#2D2136] border border-zinc-200/80"
                  }`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={12}
                  className={`opacity-60 transition-transform ${isSelected ? "rotate-180" : ""}`}
                />
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* Slide-Down Category Modal (Z-INDEX 70 TO AVOID CONTACT ISLAND COLLISION) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {activeCategory !== null && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCategory(null)}
                className="fixed inset-0 z-[65] bg-black"
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute left-4 right-4 top-[calc(100%+0.5rem)] z-[70] overflow-hidden bg-white border border-zinc-200/80 rounded-[2rem] shadow-2xl max-h-[70vh] flex flex-col max-w-md mx-auto"
              >
                {/* STICKY MODAL HEADER */}
                <div className="sticky top-0 z-20 bg-white px-6 py-4 flex items-center justify-between border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = navigationData[activeCategory].icon;
                      return <IconComponent size={20} className="text-[#F000E2] shrink-0" />;
                    })()}
                    <h3 className="font-display text-base font-bold text-[#2D2136]">
                      {navigationData[activeCategory].label} Services
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* SCROLLABLE MODAL CONTENT */}
                <div className="overflow-y-auto p-5 flex flex-col gap-4">
                  {(() => {
                    const navItem = navigationData[activeCategory];
                    const catSlug = navItem.href.split('/').pop() || '';
                    const serviceGroups = categoryServicesMap[catSlug];
                    const isLoading = loadingCatSlug === catSlug;

                    return (
                      <>
                        {/* Loading */}
                        {isLoading && (
                          <div className="flex items-center gap-2 text-zinc-400 font-body text-sm py-2">
                            <span className="inline-block w-3.5 h-3.5 border-2 border-zinc-300 border-t-[#F000E2] rounded-full animate-spin" />
                            Loading services…
                          </div>
                        )}

                        {/* API grouped grid — 3 items per row, no price */}
                        {!isLoading && serviceGroups && serviceGroups.length > 0 && (
                          <div className="flex flex-col gap-4">
                            {catSlug === 'blood-tests' ? (
                              // Blood Tests: show subcategory names as links
                              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                {serviceGroups.map((group, gIdx) => {
                                  if (!group.subcategory) return null;
                                  const subSlug = group.subcategory
                                    .toLowerCase()
                                    .replace(/ & /g, '-')
                                    .replace(/[\/\s]+/g, '-')
                                    .replace(/-+/g, '-')
                                    .replace(/^-|-$/g, '');
                                  return (
                                    <Link
                                      key={gIdx}
                                      href={`/blood-tests#${subSlug}`}
                                      onClick={() => setActiveCategory(null)}
                                      className="font-body text-[13px] font-semibold text-[#2D2136] hover:text-[#F000E2] transition-colors py-1"
                                    >
                                      {group.subcategory}
                                    </Link>
                                  );
                                })}
                              </div>
                            ) : (
                              // Other categories: grouped by subcategory with service items
                              serviceGroups.map((group, gIdx) => (
                                <div key={gIdx}>
                                  {group.subcategory && (
                                    <div className="font-display text-[11px] font-bold uppercase tracking-wider text-[#1E227D] border-b border-zinc-100 pb-1.5 mb-2">
                                      {group.subcategory}
                                    </div>
                                  )}
                                  <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                                    {group.items.map((svc, sIdx) => (
                                      <Link
                                        key={sIdx}
                                        href={`/serviceslisting/${catSlug}/${svc.slug}`}
                                        onClick={() => setActiveCategory(null)}
                                        className="font-body text-[13px] font-semibold text-[#2D2136] hover:text-[#F000E2] transition-colors py-1"
                                      >
                                        {svc.title || svc.service_name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* Fallback static links */}
                        {!isLoading && (!serviceGroups || serviceGroups.length === 0) && (
                          <div className="flex flex-col gap-2">
                            {navItem.links.map((link, linkIdx) => {
                              if (link.isHeading) {
                                return (
                                  <div key={linkIdx} className="font-display text-[12px] font-bold text-[#1E227D] uppercase tracking-wider pt-3 pb-1 border-b border-zinc-100 mb-2 pl-1 text-left">
                                    {link.label}
                                  </div>
                                );
                              }
                              return (
                                <Link
                                  key={linkIdx}
                                  href={link.href}
                                  onClick={(e) => {
                                    if (link.isComingSoon) { e.preventDefault(); }
                                    else { setActiveCategory(null); }
                                  }}
                                  className={`group relative flex items-center justify-between rounded-xl border px-3 py-2.5 transition-all overflow-hidden ${
                                    link.isComingSoon
                                      ? 'bg-zinc-50/20 border-zinc-100 text-zinc-400 cursor-not-allowed'
                                      : 'border-zinc-100/80 bg-zinc-50/40 hover:bg-[#E0A2F5]/5 hover:border-[#E0A2F5]/20 font-body text-[13.5px] font-bold text-[#2D2136]'
                                  }`}
                                >
                                  {!link.isComingSoon && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1E227D] opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                  <span className={`${!link.isComingSoon ? 'pl-1 group-hover:translate-x-1' : ''} transition-transform`}>
                                    {link.label}
                                  </span>
                                  {!link.isComingSoon && (
                                    <ChevronDown size={14} className="-rotate-90 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-80 transition-all text-[#1E227D]" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        )}

                        {/* Promo card */}
                        {navItem.promoCard && catSlug !== 'blood-tests' && (
                          <div className="rounded-2xl bg-gradient-to-br from-[#FCFAFD] to-[#EAE6EF]/20 border border-[#E0A2F5]/60 p-5 flex flex-col gap-2.5 mt-1">
                            <h4 className="font-display text-[13px] font-bold text-[#1E227D]">
                              {navItem.promoCard.title}
                            </h4>
                            <p className="font-body text-xs text-[#2D2136]/65 leading-relaxed">
                              {navItem.promoCard.description}
                            </p>
                            <Link
                              href={navItem.promoCard.linkHref ?? '#'}
                              onClick={() => setActiveCategory(null)}
                              className="font-display text-xs font-bold text-[#F000E2] hover:text-[#1E227D] transition-colors mt-1 inline-flex items-center"
                            >
                              {navItem.promoCard.linkText}
                            </Link>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ========================================================================= */}
        {/* Burger Navigation Drawer (Overlay Modal for utility pages) */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-[65] bg-black"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="
                  fixed right-4 top-4 z-[70]
                  w-[80vw] max-w-sm
                  max-h-[calc(100vh-2rem)]
                  rounded-3xl
                  bg-white
                  shadow-2xl
                  flex flex-col
                  overflow-hidden
                "
              >
                <div className="p-6 flex flex-col gap-8 overflow-y-auto">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                      <Image
                        src="/logo/logo2.png"
                        alt="Insight Health Services Logo"
                        width={110}
                        height={38}
                        className="object-contain"
                        priority
                      />
                    </Link>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-full text-zinc-400 hover:bg-zinc-50 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Links */}
                  <nav className="flex flex-col gap-5">
                    {[
                      { name: "Home", path: "/" },
                      { name: "About Us", path: "/about" },
                      { name: "Reviews", path: "/reviews" },
                      { name: "Blogs", path: "/blogs" },
                      { name: "FAQ", path: "/faq" },
                      { name: "Shop", path: "/shop" },
                      { name: "Contact us", path: "/contact" }
                    ].map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-display text-base font-bold text-[#2D2136] hover:text-[#1E227D] transition-colors text-left"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                </div>

                {/* CTA */}
                <div className="p-6 pt-0">
                  <a
                    href={`tel:${contact1.replace(/\s/g, '')}`}
                    className="
                      flex w-full items-center justify-center gap-2.5
                      rounded-xl
                      bg-gradient-to-r from-[#1E227D] to-[#F000E2]
                      py-3.5
                      text-sm font-bold text-white
                      shadow-md
                    "
                  >
                    <Phone size={15} />
                    <span>Call Hotline: {contact1}</span>
                  </a>
                </div>

              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="fixed inset-0 z-[100] bg-black"
            />

            {/* Search Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-8 z-[110] mx-auto max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:top-24"
            >
              {/* Search input container */}
              <div className="flex items-center border-b border-zinc-150 px-6 py-4">
                <Search size={20} className="text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search scans, diagnostics, blood tests, or blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-3 flex-1 bg-transparent py-2 font-body text-base text-[#2D2136] outline-none placeholder:text-zinc-400"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-[#2D2136] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto p-6">
                {(() => {
                  if (!searchQuery.trim()) {
                    return (
                      <div className="text-center py-8 text-zinc-400 font-body text-sm">
                        Type something to start searching...
                      </div>
                    );
                  }

                  const query = searchQuery.toLowerCase();
                  
                  // Search Service/Scans from API data
                  const matchingServices: { title: string; category: string; href: string; desc: string }[] = [];

                  // Match against category names
                  if (searchData) {
                    for (const cat of searchData.categories) {
                      if (cat.title.toLowerCase().includes(query)) {
                        matchingServices.push({
                          title: cat.title,
                          category: 'Category',
                          href: `/serviceslisting/${cat.slug}`,
                          desc: cat.description,
                        });
                      }
                    }
                    // Match against services
                    for (const svc of searchData.services) {
                      if (
                        svc.title.toLowerCase().includes(query) ||
                        svc.description.toLowerCase().includes(query)
                      ) {
                        // Blood tests link to the blood-tests page with anchor, not a detail page
                        const href = svc.categorySlug === 'blood-tests'
                          ? `/blood-tests#${svc.slug}`
                          : `/serviceslisting/${svc.categorySlug}/${svc.slug}`;
                        matchingServices.push({
                          title: svc.title,
                          category: svc.categoryName,
                          href,
                          desc: svc.description,
                        });
                      }
                    }
                  }

                  // Search Blogs
                  const matchingBlogs = BLOG_POSTS_DETAIL.filter(
                    (post) =>
                      post.title.toLowerCase().includes(query) ||
                      post.summary.toLowerCase().includes(query) ||
                      post.tags.some((tag) => tag.toLowerCase().includes(query))
                  );

                  if (matchingServices.length === 0 && matchingBlogs.length === 0) {
                    return (
                      <div className="text-center py-8 text-zinc-400 font-body text-sm">
                        No results found for "{searchQuery}"
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col gap-6">
                      {matchingServices.length > 0 && (
                        <div>
                          <h4 className="font-display text-[11px] font-bold uppercase tracking-wider text-[#1E227D] mb-3 text-left">
                            Services & Scans ({matchingServices.length})
                          </h4>
                          <div className="flex flex-col gap-2">
                            {matchingServices.map((res, idx) => (
                              <Link
                                key={idx}
                                href={res.href}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex flex-col rounded-xl p-3 hover:bg-[#E0A2F5]/5 border border-transparent hover:border-[#E0A2F5]/25 transition-all text-left"
                              >
                                <span className="font-display text-sm font-bold text-[#2D2136] hover:text-[#F000E2] transition-colors">
                                  {res.title}
                                </span>
                                <span className="font-body text-[11px] text-zinc-400 mt-0.5">
                                  Category: {res.category}
                                </span>
                                <span className="font-body text-xs text-[#2D2136]/70 mt-1 line-clamp-1">
                                  {res.desc}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {matchingBlogs.length > 0 && (
                        <div>
                          <h4 className="font-display text-[11px] font-bold uppercase tracking-wider text-[#1E227D] mb-3 text-left">
                            Blogs ({matchingBlogs.length})
                          </h4>
                          <div className="flex flex-col gap-2">
                            {matchingBlogs.map((post, idx) => (
                              <Link
                                key={idx}
                                href={`/blogs/${post.slug}`}
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  setSearchQuery("");
                                }}
                                className="flex flex-col rounded-xl p-3 hover:bg-[#E0A2F5]/5 border border-transparent hover:border-[#E0A2F5]/25 transition-all text-left"
                              >
                                <span className="font-display text-sm font-bold text-[#2D2136] hover:text-[#F000E2] transition-colors">
                                  {post.title}
                                </span>
                                <span className="font-body text-[11px] text-zinc-400 mt-0.5">
                                  Category: {post.category} • {post.readTime}
                                </span>
                                <span className="font-body text-xs text-[#2D2136]/70 mt-1 line-clamp-1">
                                  {post.summary}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}