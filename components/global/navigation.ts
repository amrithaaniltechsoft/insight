import { Baby, Stethoscope, Activity, Droplet, ClipboardList, Syringe, LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
  isHeading?: boolean;
  isComingSoon?: boolean;
}

export interface PromoCard {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  colSpan?: 1 | 2;
  bgType?: "pearl" | "zinc";
}

export interface MegaMenuItem {
  label: string;
  icon: LucideIcon;
  href: string;
  links: NavLink[]; // Flat list of links
  columns?: NavLink[][]; // Explicit columns grouping for custom layouts
  promoCard?: PromoCard;
}

export const navigationData: MegaMenuItem[] = [
  {
    label: "Pregnancy Ultrasound Scans",
    icon: Baby,
    href: "/services/pregnancy-scans",
    links: [
      { label: "Early Reassurance Scan", href: "/services/pregnancy-scans/early-reassurance-scan" },
      { label: "Dating Scan", href: "/services/pregnancy-scans/dating-scan" },
      { label: "Baby Gender Scan", href: "/services/pregnancy-scans/baby-gender-scan" },
      { label: "4D Ultrasound Packages", href: "/services/pregnancy-scans/4d-ultrasound-packages" },
      { label: "Anomaly Scan", href: "/services/pregnancy-scans/anomaly-scan" },
      { label: "Growth & Presentation Scan", href: "/services/pregnancy-scans/growth-presentation-scan" },
    ],
    promoCard: {
      title: "Not sure which scan?",
      description: "Use our scan calculator to find the right package for your exact gestation week.",
      linkText: "Find my scan \u2192",
      linkHref: "/services/pregnancy-scans#scan-calculator",
      bgType: "pearl",
      colSpan: 1,
    },
  },
  {
    label: "General Ultrasound Scans",
    icon: Stethoscope,
    href: "/services/diagnostics",
    links: [
      { label: "General Abdominal", href: "/services/diagnostics/general-abdominal-scan" },
      { label: "Kidney, Ureter & Bladder", href: "/services/diagnostics/kidney-ureter-bladder-scan" },
      { label: "Deep Vein Thrombosis (DVT)", href: "/services/diagnostics/dvt-scan" },
      { label: "Well Woman Pelvic", href: "/services/diagnostics/well-woman-pelvic-scan" },
      { label: "Well Man Screening", href: "/services/diagnostics/well-man-screening" },
      { label: "Aortic Surveillance (AAA)", href: "/services/diagnostics/aortic-surveillance" },
    ],
    promoCard: {
      title: "Clinical Blood Tests",
      description: "We offer comprehensive private blood profiling, from routine health checks to specialized fertility and hormone panels. Results returned rapidly without the NHS wait.",
      linkText: "View all blood tests \u2192",
      linkHref: "/services/blood-tests",
      bgType: "zinc",
      colSpan: 2,
    },
  },
  {
    label: "Physiotherapy",
    icon: Activity,
    href: "/services/physiotherapy",
    links: [
      { label: "Manual Physiotherapy", href: "/services/physiotherapy/manual-physiotherapy" },
      { label: "Whiplash Injury Rehab", href: "/services/physiotherapy/whiplash-rehab" },
      { label: "Exercise Rehabilitation", href: "/services/physiotherapy/exercise-rehab" },
      { label: "Ultrasound Guided Injections", href: "/services/physiotherapy/guided-injections" },
      { label: "Steroid Injection Therapy", href: "/services/physiotherapy/steroid-therapy" },
      { label: "Clinical Acupuncture", href: "/services/physiotherapy/clinical-acupuncture" },
    ],
  },
  {
    label: "Blood Tests",
    icon: Droplet,
    href: "/services/blood-tests",
    links: [
      { label: "General Health", href: "/services/blood-tests#general-health" },
      { label: "Heart & Cardio", href: "/services/blood-tests#heart-cardio" },
      { label: "Fertility & Hormones", href: "/services/blood-tests#fertility-hormones" },
      { label: "Men's Health", href: "/services/blood-tests#mens-health" },
      { label: "Women's Health", href: "/services/blood-tests#womens-health" },
      { label: "Infection & Immune", href: "/services/blood-tests#infection-immune" },
      { label: "Organ Function", href: "/services/blood-tests#organ-function" },
    ],
    promoCard: {
      title: "Rapid Laboratory Results",
      description: "Most of our comprehensive blood profiles and tests are processed with rapid turnaround times, directly from our accredited partner laboratories.",
      linkText: "Learn more about our lab \u2192",
      linkHref: "/services/blood-tests#scan-calculator",
      bgType: "pearl",
      colSpan: 2,
    },
  },
  {
    label: "Acupuncture",
    icon: Syringe,
    href: "/services/acupuncture",
    links: [
      { label: "Clinical Acupuncture", href: "/services/acupuncture/clinical-acupuncture" },
      { label: "Cosmetic Acupuncture", href: "/services/acupuncture/cosmetic-acupuncture" },
    ],
    promoCard: {
      title: "Holistic Healing",
      description: "Experience needle‑based therapy to alleviate pain, improve wellbeing, and support recovery.",
      linkText: "Explore Acupuncture \u2192",
      linkHref: "/services/acupuncture",
      bgType: "pearl",
      colSpan: 2,
    },
  },
  {
    label: "Joint Injections",
    icon: Syringe,
    href: "/services/joint-injections",
    links: [
      { label: "Ultrasound Guided Joint Injection", href: "/services/joint-injections/ultrasound-guided" },
      { label: "Steroid Injection Therapy", href: "/services/joint-injections/steroid-therapy" },
    ],
    promoCard: {
      title: "Targeted Relief",
      description: "Precise ultrasound‑guided injections to reduce pain and inflammation in joints.",
      linkText: "Learn More →",
      linkHref: "/services/joint-injections",
      bgType: "pearl",
      colSpan: 1,
    },
  },
];
