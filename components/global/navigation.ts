import { Baby, Stethoscope, Activity, Droplet, ClipboardList, LucideIcon } from "lucide-react";

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
    href: "/serviceslisting/pregnancy-scans",
    links: [
      { label: "Early Reassurance Scan", href: "/serviceslisting/pregnancy-scans/early-reassurance-scan" },
      { label: "Dating Scan", href: "/serviceslisting/pregnancy-scans/dating-scan" },
      { label: "Baby Gender Scan", href: "/serviceslisting/pregnancy-scans/baby-gender-scan" },
      { label: "4D Ultrasound Packages", href: "/serviceslisting/pregnancy-scans/4d-ultrasound-packages" },
      { label: "Anomaly Scan", href: "/serviceslisting/pregnancy-scans/anomaly-scan" },
      { label: "Growth & Presentation Scan", href: "/serviceslisting/pregnancy-scans/growth-presentation-scan" },
    ],
    promoCard: {
      title: "Not sure which scan?",
      description: "Use our scan calculator to find the right package for your exact gestation week.",
      linkText: "Find my scan \u2192",
      linkHref: "/serviceslisting/pregnancy-scans#scan-calculator",
      bgType: "pearl",
      colSpan: 1,
    },
  },
  {
    label: "General Ultrasound Scans",
    icon: Stethoscope,
    href: "/serviceslisting/diagnostics",
    links: [
      { label: "General Abdominal", href: "/serviceslisting/diagnostics/general-abdominal-scan" },
      { label: "Kidney, Ureter & Bladder", href: "/serviceslisting/diagnostics/kidney-ureter-bladder-scan" },
      { label: "Deep Vein Thrombosis (DVT)", href: "/serviceslisting/diagnostics/dvt-scan" },
      { label: "Well Woman Pelvic", href: "/serviceslisting/diagnostics/well-woman-pelvic-scan" },
      { label: "Well Man Screening", href: "/serviceslisting/diagnostics/well-man-screening" },
      { label: "Aortic Surveillance (AAA)", href: "/serviceslisting/diagnostics/aortic-surveillance" },
    ],
    promoCard: {
      title: "Clinical Blood Tests",
      description: "We offer comprehensive private blood profiling, from routine health checks to specialized fertility and hormone panels. Results returned rapidly without the NHS wait.",
      linkText: "View all blood tests \u2192",
      linkHref: "/serviceslisting/blood-tests",
      bgType: "zinc",
      colSpan: 2,
    },
  },
  {
    label: "Physiotherapy",
    icon: Activity,
    href: "/serviceslisting/physiotherapy",
    links: [
      { label: "Manual Physiotherapy", href: "/serviceslisting/physiotherapy/manual-physiotherapy" },
      { label: "Whiplash Injury Rehab", href: "/serviceslisting/physiotherapy/whiplash-rehab" },
      { label: "Exercise Rehabilitation", href: "/serviceslisting/physiotherapy/exercise-rehab" },
      { label: "Ultrasound Guided Injections", href: "/serviceslisting/physiotherapy/guided-injections" },
      { label: "Steroid Injection Therapy", href: "/serviceslisting/physiotherapy/steroid-therapy" },
      { label: "Clinical Acupuncture", href: "/serviceslisting/physiotherapy/clinical-acupuncture" },
    ],
  },
  {
    label: "Blood Tests",
    icon: Droplet,
    href: "/blood-tests",
    links: [
      { label: "General Health", href: "/blood-tests#general-health" },
      { label: "Heart & Cardio", href: "/blood-tests#heart-cardio" },
      { label: "Fertility & Hormones", href: "/blood-tests#fertility-hormones" },
      { label: "Men's Health", href: "/blood-tests#mens-health" },
      { label: "Women's Health", href: "/blood-tests#womens-health" },
      { label: "Infection & Immune", href: "/blood-tests#infection-immune" },
      { label: "Organ Function", href: "/blood-tests#organ-function" },
    ],
    promoCard: {
      title: "Rapid Laboratory Results",
      description: "Most of our comprehensive blood profiles and tests are processed with rapid turnaround times, directly from our accredited partner laboratories.",
      linkText: "Learn more about our lab \u2192",
      linkHref: "/blood-tests#scan-calculator",
      bgType: "pearl",
      colSpan: 2,
    },
  },
  {
    label: "Other Diagnostics",
    icon: ClipboardList,
    href: "/serviceslisting/other-diagnostics",
    links: [
      { label: "Cervical Screening - Coming Soon!", href: "#", isComingSoon: true },
      { label: "Health MOT - Coming Soon!", href: "#", isComingSoon: true },
    ],
    promoCard: {
      title: "Preventive Care",
      description: "Advanced screening services designed to detect early indicators and help support your long-term health and wellness.",
      linkText: "Contact Us to Learn More \u2192",
      linkHref: "/contact",
      bgType: "zinc",
      colSpan: 2,
    },
  },
];
