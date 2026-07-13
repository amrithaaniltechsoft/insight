"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import GoldenDragonWave from "./GoldenDragonWave";
import { useRouter } from "next/navigation";
import ServiceSearchBar from "@/components/ui/ServiceSearchBar";

interface ServiceCard {
  title: string;
  category: string;
  image: string;
  description: string;
  features: string[];
  href: string;
}

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
}

interface SearchService {
  slug: string;
  title: string;
  categorySlug: string;
}

interface SubServicesProps {
  services?: ServiceCard[];
  categories?: CategoryItem[];
  searchServices?: SearchService[];
}

const FALLBACK_SERVICES: ServiceCard[] = [
  {
    title: "Pregnancy Scans",
    category: "Maternity Care",
    image: "/sub-service/gynecologist-performing-ultrasound-consultation.jpg",
    description: "Private scans from early reassurance to premium 4D bonding packages.",
    features: [
      "Early Reassurance Scan (Confirmation & gestation)",
      "Dating Scan (Accurate due-date calculation)",
      "Baby Gender Scan (From 15 weeks gestation)",
      "4D Ultrasound Packages (High-definition live video)",
      "Anomaly Scan (Detailed structural check)",
      "Growth & Presentation Scan (Late pregnancy assessment)",
    ],
    href: "/serviceslisting/pregnancy-scans",
  },
  {
    title: "Clinical Diagnostics",
    category: "Diagnostics",
    image: "/sub-service/medical-expert-patient-meeting-check-up-appointment.jpg",
    description: "Rapid, accurate private ultrasound scans for general organ health.",
    features: [
      "General Abdominal Scan (Liver, gall, kidneys)",
      "Kidney, Ureter & Bladder (Renal tract assessment)",
      "Deep Vein Thrombosis (DVT - Immediate reporting)",
      "Well Woman Screening (Comprehensive pelvic check)",
      "Well Man Screening (Abdominal & prostate health)",
      "Aortic Surveillance (AAA surveillance scans)",
    ],
    href: "/serviceslisting/diagnostics",
  },
  {
    title: "Expert Physiotherapy",
    category: "Rehabilitation",
    image: "/sub-service/doctor-helping-patient-rehabilitation.jpg",
    description: "Personalized physical therapy and targeted joint/muscle treatment plans.",
    features: [
      "Manual Physiotherapy (Hands-on muscle release)",
      "Exercise Rehabilitation (Custom recovery regimes)",
      "Whiplash Injury Recovery (Specialist clinical rehab)",
      "Ultrasound Guided Injections (Precise target relief)",
      "Steroid Injection Therapy (Quick joint inflammation reduction)",
      "Acupuncture (Complementary pain relief therapy)",
    ],
    href: "/serviceslisting/physiotherapy",
  },
  {
    title: "Comprehensive Bloods",
    category: "Blood Profiling",
    image: "/sub-service/high-angle-healthcare-professional-drawing-blood.jpg",
    description: "Private blood tests with rapid results returned direct from our lab.",
    features: [
      "Routine Health Profiles (General wellbeing assessment)",
      "Fertility & Hormone Panels (Gender specific hormones)",
      "Allergy & Food Intolerance Checks",
      "Rapid Laboratory Turnaround (Often within 24 hours)",
      "Professional Phlebotomy (Comfortable clinical draw)",
    ],
    href: "/serviceslisting/blood-tests",
  },
  {
    title: "Other Diagnostics",
    category: "Diagnostics",
    image: "/sub-service/other_diagnostics.png",
    description: "Advanced preventive screenings, health checks, and wellness checkups.",
    features: [
      "Cervical Screening - Coming Soon!",
      "Health MOT - Coming Soon!",
    ],
    href: "/serviceslisting/other-diagnostics",
  },
];

export default function SubServices({ services, categories: apiCategories, searchServices = [] }: SubServicesProps) {
  const servicesList = services && services.length > 0 ? services : FALLBACK_SERVICES;

  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedService, setSelectedService] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = (apiCategories && apiCategories.length > 0
    ? apiCategories
    : []
  ).map((c: any) => ({ slug: c.slug, title: c.name || c.title }));

  const servicesForCategory = selectedCategory
    ? searchServices.filter(s => s.categorySlug === selectedCategory).map(s => ({ title: s.title, slug: s.slug }))
    : [];

  const maxIndex = Math.max(0, servicesList.length - visibleCards);
  const safeIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedService(null);
    setSearchTerm("");
  };

  const handleServiceSelect = (service: { slug: string; title: string }) => {
    setSelectedService(service);
    setSearchTerm(service.title);
    const match = searchServices.find(s => s.slug === service.slug);
    const catSlug = match?.categorySlug || selectedCategory;
    if (catSlug) {
      if (catSlug === 'blood-tests') {
        router.push(`/blood-tests#${service.slug}`);
      } else {
        router.push(`/serviceslisting/${catSlug}/${service.slug}`);
      }
    }
  };

  const filteredServices = servicesForCategory.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    const target = selectedService || filteredServices[0];
    const match = searchServices.find(s => s.slug === target?.slug);
    const catSlug = match?.categorySlug || selectedCategory;
    if (catSlug && target) {
      if (catSlug === 'blood-tests') {
        router.push(`/blood-tests#${target.slug}`);
      } else {
        router.push(`/serviceslisting/${catSlug}/${target.slug}`);
      }
    }
  };

  useEffect(() => {
    if (selectedService) setSearchTerm(selectedService.title);
  }, [selectedService]);

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  return (
    <section className="relative w-full bg-gradient-to-r from-[#1E227D] to-[#F000E2] py-24 lg:py-32 overflow-hidden">
      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradSubServices" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradSubServices)"
          />

          {/* Faint Background Track for the Stroke */}
          <path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            className="opacity-20"
            transform="translate(0, 3)"
          />

          {/* Animated Wave Stroke */}
          <motion.path
            d="M0,27.35 A600.21,600.21,0,0,0,321.39,56.44 c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39 C823.78,31,906.67,72,985.66,92.83 c70.05,18.48,146.53,26.09,214.34,3"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            transform="translate(0, 3)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </svg>
      </div>

      {/* Background decoration */}
      <GoldenDragonWave className="scale-x-[-1] opacity-70" />

      <motion.div
        className="container relative z-10 mx-auto px-6 lg:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >

        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between text-left">
          <div className="flex flex-col">
            <motion.span variants={itemVariants} className="mb-3 font-display text-sm font-bold uppercase tracking-widest text-white/90">
              Our Clinical Offerings
            </motion.span>
            <motion.h2 variants={itemVariants} className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Our Services
            </motion.h2>

            {/* Searchable Dropdown */}
            <motion.div variants={itemVariants} className="relative z-50">
              <ServiceSearchBar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                searchTerm={searchTerm}
                onSearchTermChange={(val) => {
                  setSearchTerm(val);
                  setSelectedService(null);
                }}
                selectedService={selectedService}
                onServiceSelect={handleServiceSelect}
                filteredServices={filteredServices}
                onSearch={handleSearch}
                canSearch={!!selectedCategory && (!!selectedService || filteredServices.length > 0)}
              />
            </motion.div>
          </div>

          {/* Carousel Nav Controls */}
          <div className="mt-6 md:mt-0 flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#1E227D] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous slide"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <button
              onClick={handleNext}
              disabled={safeIndex === maxIndex}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#1E227D] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next slide"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Wrapper */}
        <div className="overflow-hidden w-full px-1">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{
              transform: mounted ? `translateX(calc(-${safeIndex} * (100% + 24px) / ${visibleCards}))` : "none"
            }}
          >
            {servicesList.map((service, index) => {
              return (
                <div
                  key={index}
                  className="w-full md:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)] flex-shrink-0 relative group flex flex-col overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2 border bg-white border-zinc-200 min-h-[560px]"
                >
                  {/* Dragon Wave Background */}
                  <GoldenDragonWave className="opacity-15 transition-opacity duration-500 group-hover:opacity-30" />

                  {/* Image Header */}
                  <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                      <span className="font-display text-[11px] font-bold uppercase tracking-widest text-[#E0A2F5] drop-shadow-sm">
                        {service.category}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-white drop-shadow-md hover:text-[#E0A2F5] transition-colors">
                        <Link href={service.href}>
                          {service.title}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-col p-6 flex-grow">


                    {/* Features List */}
                    <div className="py-4 flex-grow">
                      <ul className="flex flex-col gap-3.5 text-left">
                        {service.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2.5">
                            <div className="mt-1 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-[#E0A2F5]/10 text-[#F000E2]">
                              <Check size={10} strokeWidth={3} />
                            </div>
                            <span className="font-body text-[13px] leading-snug text-[#2D2136]/80 font-medium">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto pt-4">
                      <Link href={service.href} className="block w-full">
                        <Button
                          variant="secondary"
                          icon={<ArrowRight size={16} />}
                          iconPosition="right"
                          className="w-full !py-2.5 !text-xs"
                        >
                          Know More
                        </Button>
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </section>
  );
}
