import {
  Heart,
  CalendarDays,
  Baby,
  Sparkles,
  Activity,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  Droplet
} from "lucide-react";

export interface ScanService {
  title: string;
  slug: string;
  weeks: string; // Used for Gestation / Category / Info label
  description: string;
  price: string;
  icon: any; // Lucide icon component
  duration: string;
  inclusions: string[];
  categorySlug?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServicePageData {
  title: string;
  highlightedTitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  bannerGradient: string;
  scans: ScanService[]; // Flat list of services
  faqs: FaqItem[];
  calculatorTitle: string;
  calculatorSubtitle: string;
}

export const servicesData: Record<string, ServicePageData> = {
  "pregnancy-scans": {
    title: "Pregnancy Ultrasound",
    highlightedTitle: "Scans",
    description: "Premium private pregnancy scans in Walsall. From early reassurance to stunning 4D HD-Live bonding, experience specialized care in our warm, state-of-the-art clinic.",
    seoTitle: "Private Pregnancy Ultrasound Scans | Insight Health Services Walsall",
    seoDescription: "Premium private pregnancy scans in Walsall from 6 weeks. Early reassurance, dating scans, baby gender scans, structural anomaly scans, and 4D HD-Live bonding packages. Book without referral.",
    bannerGradient: "from-[#1E227D] to-[#F000E2]",
    scans: [
      {
        title: "Early Pregnancy Scan",
        slug: "early-pregnancy-scan",
        weeks: "6 - 15 Weeks",
        description: "Early Pregnancy Scan: This private early pregnancy scan is suitable if you want reassurance in the first trimester, have had pain or bleeding, are unsure of your dates, or simply want confirmation that the pregnancy is developing in the right place. The sonographer will explain the findings clearly during the appointment and provide a written report.",
        price: "£55",
        icon: Heart,
        duration: "10-15 Mins",
        inclusions: ["This private early pregnancy scan is suitable if you want reassurance in the first trimester, have had pain or bleeding, are unsure of your dates, or simply want confirmation that the pregnancy is developing in the right place. The sonographer will explain the findings clearly during the appointment and provide a written report."]
      },
      {
        title: "Reassurance Scan",
        slug: "reassurance-scan",
        weeks: "15 Weeks - Term",
        description: "Reassurance Scan: from 15 weeks to term. 15 mins scan appointment. This scan is for parents who want reassurance between routine NHS appointments. Please attend with a reasonably full bladder if advised.",
        price: "£45",
        icon: Heart,
        duration: "15 Mins",
        inclusions: [
          "Baby heartbeat check",
          "Baby movement check",
          "Baby position check where possible",
          "Placenta position review where appropriate",
          "2D thermal prints",
          "Detailed scan report"
        ]
      },
      {
        title: "Baby Gender Scan",
        slug: "baby-gender-scan",
        weeks: "15 - 24 Weeks",
        description: "Discover if you are having a boy or a girl with our highly accurate gender determination check. Includes a comprehensive heartbeat reassurance check.",
        price: "£59",
        icon: Baby,
        duration: "15 Mins",
        inclusions: [
          "99.9% accurate gender determination",
          "Optional gender envelope for reveals",
          "Hear baby's heartbeat",
          "3D preview of your baby",
          "2D keepsake prints & digital copies"
        ]
      },
      {
        title: "Silver 4D Ultrasound Package - Believe",
        slug: "silver-4d-ultrasound-package-believe",
        weeks: "20 - 34 Weeks",
        description: "Silver 4D Ultrasound Package - Believe: more time for your 3D/4D bonding experience, helping capture clearer images where baby's position allows.",
        price: "£120",
        icon: Sparkles,
        duration: "20 Mins",
        inclusions: [
          "Longer 3D/4D bonding scan experience",
          "Baby heartbeat and movement check",
          "Gender confirmation if requested and visible",
          "Selected images/prints as included in the package",
          "Scan report where applicable"
        ]
      },
      {
        title: "Gold 4D Ultrasound Package - Insight",
        slug: "gold-4d-ultrasound-package-insight",
        weeks: "Two Sessions (20-34 Weeks)",
        description: "Gold 4D Ultrasound Package - Insight: two sessions designed to give you more opportunity to see baby's development and bonding images across different stages.",
        price: "£170",
        icon: Sparkles,
        duration: "2 x 30 Mins",
        inclusions: [
          "Two 3D/4D scan sessions",
          "Baby heartbeat and movement checks",
          "Gender confirmation if requested and visible",
          "Selected images/prints as included in the package",
          "Scan report where applicable"
        ]
      },
      {
        title: "Bronze 4D Ultrasound Package - Hope",
        slug: "bronze-4d-ultrasound-package-hope",
        weeks: "20 - 34 Weeks",
        description: "Bronze 4D Ultrasound Package - Hope: a short 3D/4D bonding scan designed to give you a special view of your baby's face and movements where baby's position allows.",
        price: "£70",
        icon: Sparkles,
        duration: "15 Mins",
        inclusions: [
          "3D/4D bonding scan experience",
          "Baby heartbeat and movement check",
          "Gender confirmation if requested and visible",
          "Selected images/prints as included in the package",
          "Scan report where applicable"
        ]
      },
      {
        title: "Anomaly Scan",
        slug: "anomaly-scan",
        weeks: "18 - 22 Weeks",
        description: "A comprehensive structural scan checking baby's organs, limbs, spine, brain, and placenta position for complete clinical reassurance.",
        price: "£135",
        icon: Activity,
        duration: "30 Mins",
        inclusions: [
          "Detailed anatomical check",
          "Placenta position verification",
          "Amniotic fluid assessment",
          "Comprehensive clinical report",
          "NHS sonographer referral if needed"
        ]
      },
      {
        title: "Growth & Presentation Scan",
        slug: "growth-and-presentation-scan",
        weeks: "26 - 40 Weeks",
        description: "Assess baby's late-stage growth, estimated weight, fluid levels, blood flow (Doppler), and physical position (head down or breech).",
        price: "£85",
        icon: TrendingUp,
        duration: "20 Mins",
        inclusions: [
          "Estimated fetal weight (EFW)",
          "Umbilical Doppler blood flow check",
          "Baby presentation & position check",
          "Growth chart plotting",
          "Fluid volume measurement"
        ]
      }
    ],
    faqs: [
      {
        q: "Do I need a GP or midwife referral to book a scan?",
        a: "No, you do not need any referral to book a private pregnancy scan with us. Our scans are designed to complement, not replace, your routine NHS ultrasound pathway. You can schedule an appointment directly at your convenience."
      },
      {
        q: "How early can I have a reassurance pregnancy scan?",
        a: "We offer early reassurance scans from 6 weeks gestation. At this early stage, we can check the viability of the pregnancy, verify single or multiple gestations, and observe baby's early heartbeat."
      },
      {
        q: "Is the gender scan 100% accurate?",
        a: "Our senior clinical sonographers offer 99.9% accuracy for gender determination from 15 weeks gestation. While no ultrasound can claim 100% mathematical certainty due to fetal position, our expert team is highly trained and experienced."
      },
      {
        q: "Can I bring family members, partners, or children to the scan?",
        a: "Absolutely! We encourage family sharing and pregnancy bonding. Our spacious scanning suite comfortably accommodates the expectant mother plus up to 4 guests, including partners, family members, and children."
      },
      {
        q: "What should I do if a complication is found during the scan?",
        a: "Our clinical staff are highly experienced senior sonographers. If any concern is detected during your scan, we will provide a detailed clinical report immediately and guide you through an direct, accredited NHS referral pathway for support."
      }
    ],
    calculatorTitle: "Find Your Perfect Scan by Gestation Week",
    calculatorSubtitle: "Every scan in your pregnancy has an optimal clinical timing window. Adjust the week indicator to discover recommended packages for your current stage."
  },
  "diagnostics": {
    title: "General",
    highlightedTitle: "Ultrasound Scans",
    description: "Rapid, accurate private diagnostic scans for general organ health, pelvic screening, and cardiovascular checkups. Immediate insights from senior clinical sonographers.",
    seoTitle: "Private Diagnostic Ultrasound Scans | Insight Health Services Walsall",
    seoDescription: "Accurate private diagnostic scans in Walsall. Abdominal, renal, DVT Doppler, and comprehensive male/female health wellness screening. Rapid reporting.",
    bannerGradient: "from-[#4F1CE9] to-[#9955DD]",
    scans: [
      {
        title: "General Abdominal Scan",
        slug: "general-abdominal-scan",
        weeks: "Abdomen",
        description: "Scan of the upper abdomen to evaluate major organs including the liver, gallbladder, kidneys, spleen, and pancreas.",
        price: "£85",
        icon: Stethoscope,
        duration: "15 Mins",
        inclusions: [
          "Upper abdominal organ scan",
          "Gallstones screening",
          "Renal cyst or stone assessment",
          "Aorta diameter screening",
          "Comprehensive clinical report"
        ]
      },
      {
        title: "Kidney, Ureter & Bladder Scan",
        slug: "kidney-ureter-bladder-scan",
        weeks: "Renal Tract",
        description: "Detailed assessment of the kidneys, ureters, and urinary bladder to check for stones, cysts, obstruction, or bladder volume.",
        price: "£75",
        icon: Activity,
        duration: "15 Mins",
        inclusions: [
          "Kidney size & structure check",
          "Bladder pre/post void volume check",
          "Renal calculi detection check",
          "Ureteric jet flow assessment",
          "Clinical report copy"
        ]
      },
      {
        title: "Deep Vein Thrombosis (DVT) Scan",
        slug: "dvt-scan",
        weeks: "Leg Doppler",
        description: "Urgent Doppler scan of the leg veins to rule out or confirm deep vein thrombosis. Immediate reporting back to your GP.",
        price: "£110",
        icon: TrendingUp,
        duration: "20 Mins",
        inclusions: [
          "Deep vein compressibility test",
          "Color Doppler blood flow evaluation",
          "Immediate medical status report",
          "Direct communication with GP",
          "Urgent medical referral assistance"
        ]
      },
      {
        title: "Well Woman Pelvic Scan",
        slug: "well-woman-pelvic-scan",
        weeks: "Female Health",
        description: "Comprehensive pelvic scan checking the uterus, lining, ovaries, and follicles. Ideal for fertility checks or general gynecological wellbeing.",
        price: "£95",
        icon: ShieldCheck,
        duration: "20 Mins",
        inclusions: [
          "Uterus structure and size mapping",
          "Endometrial lining check",
          "Ovarian volume & follicle count",
          "Cyst & fibroid detection screening",
          "Transvaginal scan option included"
        ]
      },
      {
        title: "Well Man Screening",
        slug: "well-man-screening",
        weeks: "Male Health",
        description: "Comprehensive screening scan covering abdominal organs, gallbladder, kidneys, and a dedicated check of the bladder and prostate size.",
        price: "£105",
        icon: Stethoscope,
        duration: "25 Mins",
        inclusions: [
          "Abdominal organ screening scan",
          "Kidney health screening",
          "Prostate volume & dimension check",
          "Bladder post-void residual check",
          "Full clinical health report"
        ]
      },
      {
        title: "Aortic Surveillance (AAA)",
        slug: "aortic-surveillance",
        weeks: "Aorta Scan",
        description: "Screening or surveillance scan of the abdominal aorta to measure the diameter and check for abdominal aortic aneurysm.",
        price: "£70",
        icon: Activity,
        duration: "10 Mins",
        inclusions: [
          "Abdominal aorta measurement check",
          "Aneurysm diameter screening",
          "Immediate verbal results",
          "Detailed digital results report",
          "GP path liaison if indicated"
        ]
      }
    ],
    faqs: [
      {
        q: "What preparation is required for my diagnostic scan?",
        a: "Preparation depends on the scan. For Abdominal scans, you must fast (no food or drink except water) for 6 hours prior. For Pelvic and Renal scans, you need a full bladder (drink 1-2 pints of water 1 hour before). No preparation is needed for DVT scans."
      },
      {
        q: "How soon do I receive my diagnostic report?",
        a: "We provide an immediate verbal summary of your scan results on the day. Your fully documented clinical diagnostic report is typed and securely emailed to you, along with digital copies of the scan images, within 24 hours."
      },
      {
        q: "Who performs the diagnostic scans at Insight Health?",
        a: "All diagnostic ultrasounds are performed by senior, fully qualified sonographers with extensive experience in the NHS and private clinical practice. They are fully registered with the HCPC or SoR."
      }
    ],
    calculatorTitle: "Find Scans by Diagnostic Target Area",
    calculatorSubtitle: "Select the body area or symptom you'd like to check to find recommended clinical diagnostic scans."
  },
  "physiotherapy": {
    title: "Expert Clinical",
    highlightedTitle: "Physiotherapy",
    description: "Hands-on rehabilitation, acupuncture, and ultrasound-guided joint injections. Specialized treatment paths to restore your peak physical health and range of motion.",
    seoTitle: "Private Physiotherapy & Joint Injections | Walsall Clinic",
    seoDescription: "Professional private physiotherapy in Walsall. Joint mobilization, whiplash recovery, dry needling, and precise ultrasound-guided steroid injections for pain relief.",
    bannerGradient: "from-[#3A14CC] to-[#AB55DD]",
    scans: [
      {
        title: "Manual Physiotherapy",
        slug: "manual-physiotherapy",
        weeks: "Therapy Session",
        description: "Hands-on spinal and joint mobilization, deep tissue massage, and muscle energy techniques to restore pain-free movement.",
        price: "£60",
        icon: Activity,
        duration: "45 Mins",
        inclusions: [
          "Full clinical history examination",
          "Hands-on joint mobilization",
          "Myofascial and muscle release",
          "Targeted home exercise plan",
          "Post-treatment advice guidelines"
        ]
      },
      {
        title: "Whiplash Injury Rehab",
        slug: "whiplash-rehab",
        weeks: "Clinical Rehab",
        description: "Whiplash Injury Rehab: physiotherapy rehabilitation for neck pain, stiffness and movement problems following a whiplash-type injury.",
        price: "£65",
        icon: ShieldCheck,
        duration: "45 Mins",
        inclusions: ["Whiplash Injury Rehab: physiotherapy rehabilitation for neck pain, stiffness and movement problems following a whiplash-type injury."]
      },
      {
        title: "Exercise Rehabilitation",
        slug: "exercise-rehab",
        weeks: "Active Rehab",
        description: "Custom gym or home-based strength and conditioning programs to rehabilitate sports injuries or post-surgical joints.",
        price: "£55",
        icon: TrendingUp,
        duration: "30 Mins",
        inclusions: [
          "Functional movement assessment",
          "Exercise form and load coaching",
          "Digital rehab program log access",
          "Progression milestone logs",
          "Home training guide setup"
        ]
      },
      {
        title: "Ultrasound Guided Injections",
        slug: "guided-injections",
        weeks: "Joint Injection",
        description: "Extremely precise joint or tendon injections performed under live ultrasound guidance for maximum accuracy and pain relief.",
        price: "£220",
        icon: Stethoscope,
        duration: "30 Mins",
        inclusions: [
          "Live ultrasound target check",
          "Precise needle guidance tracking",
          "Corticosteroid or Ostenil dose",
          "Sterile clinical environment",
          "Post-injection safety protocol"
        ]
      },
      {
        title: "Steroid Injection Therapy",
        slug: "steroid-therapy",
        weeks: "Anti-Inflammatory",
        description: "Clinically indicated joint or soft tissue corticosteroid injection to rapidly reduce acute pain and severe inflammation.",
        price: "£180",
        icon: Heart,
        duration: "20 Mins",
        inclusions: [
          "Clinical musculoskeletal check",
          "Corticosteroid injection dosage",
          "Local anaesthetic pain buffer",
          "Post-injection safety booklet",
          "GP letter copy details"
        ]
      },
      {
        title: "Clinical Acupuncture",
        slug: "clinical-acupuncture",
        weeks: "Pain Relief",
        description: "Dry needling and acupuncture techniques to reduce chronic muscle trigger points, alleviate pain, and stimulate nerve pathways.",
        price: "£50",
        icon: Sparkles,
        duration: "45 Mins",
        inclusions: [
          "Fine-needle acupuncture mapping",
          "Trigger points release check",
          "Chronic pain management",
          "Relaxing clinic environment",
          "Circulation pathway stimulation"
        ]
      }
    ],
    faqs: [],
    calculatorTitle: "Choose Joint / Muscle Rehabilitation Area",
    calculatorSubtitle: "Select the area where you are experiencing pain or muscle stiffness to view our recommended physiotherapy treatment pathway."
  },
  "blood-tests": {
    title: "Comprehensive Private",
    highlightedTitle: "Blood Tests",
    description: "Detailed wellness, hormone, and fertility profiling. High-quality phlebotomy with rapid results returned directly from our partner laboratory without the NHS waiting lists.",
    seoTitle: "Private Clinical Blood Tests | Walsall Lab Clinic",
    seoDescription: "Comfortable private blood tests in Walsall. Early gender DNA tests, HCG hormones, fertility panels, and comprehensive wellness health screens. Fast results.",
    bannerGradient: "from-[#4617E6] to-[#C955DD]",
    scans: [
      {
        title: "Early Gender Blood Test",
        slug: "early-gender-blood-test",
        weeks: "From 6 Weeks",
        description: "Accurate early gender DNA test using a simple clinical blood draw from the mother. Fast turnaround direct from our partner lab.",
        price: "£129",
        icon: Baby,
        duration: "10 Mins",
        inclusions: [
          "Comfortable clinical blood draw",
          "DNA gender screening check",
          "Fast partner lab processing",
          "Strict clinical confidentiality",
          "Secure email results delivery"
        ]
      },
      {
        title: "HCG Early Pregnancy Test",
        slug: "hcg-pregnancy-test",
        weeks: "Early Hormones",
        description: "Quantitative Beta-hCG blood test to check pregnancy progression, viability, or confirm early conception with exact hormonal counts.",
        price: "£45",
        icon: Heart,
        duration: "10 Mins",
        inclusions: [
          "Quantitative Beta-hCG check",
          "Pregnancy confirmation metric",
          "Fast same/next day lab turn",
          "Interpretation guidelines copy",
          "Advice on early pregnancy scans"
        ]
      },
      {
        title: "Fertility Blood Tests",
        slug: "fertility-blood-tests",
        weeks: "Hormone Profile",
        description: "Comprehensive reproductive hormone panels checking AMH, LH, FSH, prolactin, and progesterone levels. Critical for fertility planning.",
        price: "£140",
        icon: Sparkles,
        duration: "15 Mins",
        inclusions: [
          "AMH ovarian reserve assessment",
          "LH, FSH & Prolactin levels check",
          "Progesterone ovulation check",
          "Clinical validation on output",
          "Confidential secure laboratory panel"
        ]
      },
      {
        title: "Hormone Blood Tests",
        slug: "hormone-blood-tests",
        weeks: "Endocrine Profile",
        description: "Focused hormone testing for thyroid profiles (TSH, FT4, FT3), testosterone, estrogen, or cortisol level checks.",
        price: "£85",
        icon: Activity,
        duration: "15 Mins",
        inclusions: [
          "Thyroid function check (TSH/T4/T3)",
          "Estrogen or testosterone count",
          "Stress hormone cortisol assay",
          "Advice on optimal draw times",
          "Electronic lab report copy"
        ]
      },
      {
        title: "General Health Blood Test",
        slug: "general-health-blood-test",
        weeks: "Wellness Screen",
        description: "Full hematology blood check covering liver/kidney function, cholesterol lipid panel, blood count, iron stores, and vitamin D/B12.",
        price: "£110",
        icon: TrendingUp,
        duration: "15 Mins",
        inclusions: [
          "Full Blood Count (FBC) profile",
          "Liver and Kidney efficiency profiles",
          "Lipids and Cholesterol panel check",
          "Vitamin D & B12 storage assay",
          "Iron stores (Ferritin) check"
        ]
      }
    ],
    faqs: [
      {
        q: "Do I need to fast before my blood test?",
        a: "Some tests, such as General Health Profiles or Lipids/Glucose checks, require fasting for 8 to 12 hours beforehand (water is fine). We will clearly specify any fasting instructions in your booking confirmation."
      },
      {
        q: "How soon do I receive my blood test results?",
        a: "Most of our blood profiles have rapid turnaround times, with laboratory results generated within 24 to 48 hours of blood collection. We email your results directly to you with clinical comments."
      },
      {
        q: "Who performs the blood draw?",
        a: "Your blood sample is drawn by a highly skilled clinical phlebotomist or registered nurse in a clean, professional, and comfortable environment, ensuring a stress-free experience."
      }
    ],
    calculatorTitle: "Choose Your Health & Wellness Goal",
    calculatorSubtitle: "Select your health focus area to find the recommended private blood testing profiles and panels."
  }
};

// Add "all" category dynamically
const allScans: ScanService[] = [];
Object.entries(servicesData).forEach(([catSlug, data]) => {
  data.scans.forEach((scan) => {
    allScans.push({
      ...scan,
      categorySlug: catSlug,
    });
  });
});

servicesData["all"] = {
  title: "All Clinical",
  highlightedTitle: "Services",
  description: "Explore our full range of private ultrasound scans, clinical diagnostics, physiotherapy, and comprehensive blood tests. High-quality care without the wait.",
  seoTitle: "All Services & Scans | Insight Health Services",
  seoDescription: "View our comprehensive range of private medical diagnostics, pregnancy scans, physiotherapies, and rapid blood tests in Walsall. Direct booking, no referral needed.",
  bannerGradient: "from-[#1E227D] to-[#F000E2]",
  scans: allScans,
  faqs: [
    {
      q: "Do I need a referral to book any of these services?",
      a: "No, all of our services, including pregnancy scans, diagnostic ultrasounds, blood tests, and physiotherapy, can be booked directly without any GP or NHS referral."
    },
    {
      q: "How can I book an appointment?",
      a: "You can book directly by clicking 'Book Now' on any of our services, which will guide you to our contact or scheduling system."
    }
  ],
  calculatorTitle: "Explore Our Full Range of Services",
  calculatorSubtitle: "Browse our comprehensive list of clinical diagnostic scan, blood test, and physiotherapy services."
};
