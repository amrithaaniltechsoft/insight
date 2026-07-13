"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ChevronRight, Check } from "lucide-react";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface ServiceCalculatorProps {
  slug: string;
  title: string;
  subtitle: string;
}

export default function ServiceCalculator({ slug, title, subtitle }: ServiceCalculatorProps) {
  // Gestation week state (Pregnancy)
  const [gestationWeek, setGestationWeek] = useState<number>(12);

  // Selector states for other slugs
  const [selectedDiagnosticArea, setSelectedDiagnosticArea] = useState<string>("Upper Abdomen");
  const [selectedPhysioIssue, setSelectedPhysioIssue] = useState<string>("Spinal/Joint Mobilization");
  const [selectedBloodGoal, setSelectedBloodGoal] = useState<string>("General Wellness");

  // Pregnancy recommendation logic
  const getPregnancyRecommendations = (week: number) => {
    const list = [];
    if (week >= 6 && week <= 15) {
      list.push({ title: "Early Pregnancy Scan", href: `/serviceslisting/${slug}/early-pregnancy-scan` });
    }
    if (week >= 15 && week <= 24) {
      list.push({ title: "Reassurance Scan", href: `/serviceslisting/${slug}/reassurance-scan` });
    }
    if (week >= 15 && week <= 24) {
      list.push({ title: "Baby Gender Scan", href: `/serviceslisting/${slug}/baby-gender-scan` });
    }
    if (week >= 18 && week <= 22) {
      list.push({ title: "Anomaly Scan", href: `/serviceslisting/${slug}/anomaly-scan` });
    }
    if (week >= 24 && week <= 32) {
      list.push({ title: "4D Ultrasound Packages", href: `/serviceslisting/${slug}/4d-ultrasound-packages` });
    }
    if (week >= 26 && week <= 40) {
      list.push({ title: "Growth & Presentation Scan", href: `/serviceslisting/${slug}/growth-and-presentation-scan` });
    }
    return list;
  };

  // Diagnostics recommendation logic
  const diagnosticAreas = [
    { name: "Upper Abdomen", scan: "General Abdominal Scan", desc: "Liver, gallbladder, pancreas, kidneys & spleen checks.", href: `/serviceslisting/${slug}/general-abdominal-scan` },
    { name: "Urinary Tract", scan: "Kidney, Ureter & Bladder Scan", desc: "Renal calculi, bladder capacity & flow checks.", href: `/serviceslisting/${slug}/kidney-ureter-bladder-scan` },
    { name: "Swollen Leg / Pain", scan: "Deep Vein Thrombosis (DVT) Scan", desc: "Urgent Doppler evaluation for vascular blood clots.", href: `/serviceslisting/${slug}/dvt-scan` },
    { name: "Female Pelvis", scan: "Well Woman Pelvic Scan", desc: "Uterus structure, lining & ovarian follicle counts.", href: `/serviceslisting/${slug}/well-woman-pelvic-scan` },
    { name: "Prostate Check", scan: "Well Man Screening", desc: "Abdominal organ scanning + prostate volume checks.", href: `/serviceslisting/${slug}/well-man-screening` },
    { name: "Aorta Check", scan: "Aortic Surveillance (AAA)", desc: "Abdominal aortic aneurysm screening measurements.", href: `/serviceslisting/${slug}/aortic-surveillance` }
  ];

  // Physiotherapy recommendation logic
  const physioIssues = [
    { issue: "Spinal/Joint Mobilization", therapy: "Manual Physiotherapy", desc: "Hands-on joint manipulation, deep tissue release & recovery.", href: `/serviceslisting/${slug}/manual-physiotherapy` },
    { issue: "Whiplash / Neck Pain", therapy: "Whiplash Injury Rehab", desc: "Specialist post-accident care for stiffness and headaches.", href: `/serviceslisting/${slug}/whiplash-rehab` },
    { issue: "Sports Injury Rehab", therapy: "Exercise Rehabilitation", desc: "Active strength programs and gym-based joint recovery.", href: `/serviceslisting/${slug}/exercise-rehab` },
    { issue: "Live Injection Precision", therapy: "Ultrasound Guided Injections", desc: "Steroid or Ostenil doses delivered under live clinical guidance.", href: `/serviceslisting/${slug}/guided-injections` },
    { issue: "Severe Inflammation Relief", therapy: "Steroid Injection Therapy", desc: "MSK check with anti-inflammatory corticosteroid delivery.", href: `/serviceslisting/[slug]/steroid-therapy` }, // Fixed slug syntax
    { issue: "Trigger Points / Dry Needling", therapy: "Clinical Acupuncture", desc: "Fine-needle stimulation to reduce muscle spasms and ease pain.", href: `/serviceslisting/${slug}/clinical-acupuncture` }
  ];

  // Blood tests recommendation logic
  const bloodGoals = [
    { goal: "General Wellness", test: "General Health Blood Test", desc: "Full check covering liver, kidney, blood count, iron, vitamins & lipids.", href: `/serviceslisting/${slug}/general-health-blood-test` },
    { goal: "Early DNA Gender", test: "Early Gender Blood Test", desc: "Non-invasive early prenatal gender DNA screening from 6 weeks.", href: `/serviceslisting/${slug}/early-gender-blood-test` },
    { goal: "Pregnancy Progress Check", test: "HCG Early Pregnancy Test", desc: "Quantitative Beta-hCG blood draw for conception timeline checks.", href: `/serviceslisting/${slug}/hcg-pregnancy-test` },
    { goal: "Fertility Planning", test: "Fertility Blood Tests", desc: "Comprehensive profiling of ovarian reserves (AMH) and key hormones.", href: `/serviceslisting/${slug}/fertility-blood-tests` },
    { goal: "Thyroid & Hormones", test: "Hormone Blood Tests", desc: "Focused endocrinology checking thyroid, testosterone, or cortisol.", href: `/serviceslisting/${slug}/hormone-blood-tests` }
  ];

  return (
    <section id="scan-calculator" className="relative py-20 bg-gradient-to-r from-[#1E227D] to-[#F000E2]">
      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradCalculator" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="url(#topWaveGradCalculator)"
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

      {/* Dragon Wave Background */}
      <GoldenDragonWave className="scale-x-[-1] opacity-20" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-12">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-5 relative z-10">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-[#E0A2F5] bg-white/10 px-3 py-1 rounded-full">
              Interactive Assessment
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-4 font-body text-[15px] leading-relaxed text-white/80">
              {subtitle}
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-white/60">
              <Clock size={16} className="text-[#E0A2F5]" />
              Select a parameter to view matching recommendations immediately.
            </div>
          </div>

          {/* RIGHT WIDGET */}
          <div className="lg:col-span-7 rounded-[2.5rem] bg-white border border-zinc-100 p-8 shadow-xl shadow-[#2D2136]/5 md:p-10 relative z-10">
            
            {/* WIDGET FOR PREGNANCY SCANS */}
            {slug === "pregnancy-scans" && (
              <>
                <div className="flex flex-col items-center gap-6 border-b border-zinc-100 pb-8">
                  <span className="font-display text-sm font-semibold text-[#2D2136]/60">My Pregnancy Gestation:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black text-[#F000E2]">{gestationWeek}</span>
                    <span className="font-display text-lg font-bold text-[#2D2136]/80">Weeks</span>
                  </div>

                  <div className="w-full flex items-center gap-4">
                    <span className="font-body text-xs font-bold text-[#2D2136]/50">6w</span>
                    <input
                      type="range"
                      min="6"
                      max="40"
                      value={gestationWeek}
                      onChange={(e) => setGestationWeek(parseInt(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-100 accent-[#F000E2]"
                      style={{
                        background: `linear-gradient(to right, #F000E2 0%, #F000E2 ${((gestationWeek - 6) / 34) * 100}%, #f4f4f5 ${((gestationWeek - 6) / 34) * 100}%, #f4f4f5 100%)`
                      }}
                    />
                    <span className="font-body text-xs font-bold text-[#2D2136]/50">40w</span>
                  </div>
                </div>

                <div className="pt-6">
                  <h4 className="font-display text-sm font-bold text-[#2D2136] mb-4">Recommended Scan Packages:</h4>
                  <div className="flex flex-col gap-4">
                    {getPregnancyRecommendations(gestationWeek).map((scan, sIdx) => (
                      <motion.div
                        key={sIdx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between rounded-xl bg-[#FCFAFD] border border-zinc-200/50 p-4 hover:border-[#E0A2F5]/40"
                      >
                        <h5 className="font-display text-[14.5px] font-bold text-[#2D2136]">
                          {scan.title}
                        </h5>
                        <Link
                          href={scan.href}
                          className="flex items-center gap-1 font-body text-xs font-bold text-[#F000E2] hover:text-[#E0A2F5]"
                        >
                          View Scan <ChevronRight size={14} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* WIDGET FOR CLINICAL DIAGNOSTICS */}
            {slug === "diagnostics" && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-[#2D2136]/50">Select Target Area / Symptom</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {diagnosticAreas.map((area, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDiagnosticArea(area.name)}
                        className={`rounded-full px-4 py-2 font-body text-xs font-semibold border transition-all cursor-pointer ${
                          selectedDiagnosticArea === area.name
                            ? "bg-[#F000E2] text-white border-[#F000E2]"
                            : "bg-[#FCFAFD] border-zinc-200 text-[#2D2136] hover:border-[#F000E2]"
                        }`}
                      >
                        {area.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <h4 className="font-display text-sm font-bold text-[#2D2136] mb-4">Recommended Ultrasound Assessment:</h4>
                  {diagnosticAreas.filter(a => a.name === selectedDiagnosticArea).map((area, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-[#FCFAFD] border border-zinc-200 p-6 flex flex-col justify-between md:flex-row md:items-center gap-4"
                    >
                      <div>
                        <span className="font-display text-[10px] font-black uppercase text-[#F000E2] tracking-wider">Clinical Scan</span>
                        <h5 className="font-display text-lg font-bold text-[#2D2136] mt-1">{area.scan}</h5>
                        <p className="font-body text-xs text-[#2D2136]/75 mt-1">{area.desc}</p>
                      </div>
                      <Link
                        href={area.href}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1E227D] px-5 py-2.5 font-body text-xs font-bold text-white hover:bg-[#1E227D]/90 transition-colors"
                      >
                        View Details <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* WIDGET FOR EXPERT PHYSIOTHERAPY */}
            {slug === "physiotherapy" && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-[#2D2136]/50">Select Joint/Pain Issue</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {physioIssues.map((issue, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhysioIssue(issue.issue)}
                        className={`rounded-full px-4 py-2 font-body text-xs font-semibold border transition-all cursor-pointer ${
                          selectedPhysioIssue === issue.issue
                            ? "bg-[#F000E2] text-white border-[#F000E2]"
                            : "bg-[#FCFAFD] border-zinc-200 text-[#2D2136] hover:border-[#F000E2]"
                        }`}
                      >
                        {issue.issue}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <h4 className="font-display text-sm font-bold text-[#2D2136] mb-4">Recommended Care Pathway:</h4>
                  {physioIssues.filter(i => i.issue === selectedPhysioIssue).map((issue, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-[#FCFAFD] border border-zinc-200 p-6 flex flex-col justify-between md:flex-row md:items-center gap-4"
                    >
                      <div>
                        <span className="font-display text-[10px] font-black uppercase text-[#F000E2] tracking-wider">Physio Pathway</span>
                        <h5 className="font-display text-lg font-bold text-[#2D2136] mt-1">{issue.therapy}</h5>
                        <p className="font-body text-xs text-[#2D2136]/75 mt-1">{issue.desc}</p>
                      </div>
                      <Link
                        href={issue.href}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1E227D] px-5 py-2.5 font-body text-xs font-bold text-white hover:bg-[#1E227D]/90 transition-colors"
                      >
                        View Details <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* WIDGET FOR COMPREHENSIVE BLOOD TESTS */}
            {slug === "blood-tests" && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="font-display text-xs font-bold uppercase tracking-wider text-[#2D2136]/50">Select Health Focus Area</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {bloodGoals.map((goal, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedBloodGoal(goal.goal)}
                        className={`rounded-full px-4 py-2 font-body text-xs font-semibold border transition-all cursor-pointer ${
                          selectedBloodGoal === goal.goal
                            ? "bg-[#F000E2] text-white border-[#F000E2]"
                            : "bg-[#FCFAFD] border-zinc-200 text-[#2D2136] hover:border-[#F000E2]"
                        }`}
                      >
                        {goal.goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-6">
                  <h4 className="font-display text-sm font-bold text-[#2D2136] mb-4">Recommended Testing Profile:</h4>
                  {bloodGoals.filter(bg => bg.goal === selectedBloodGoal).map((goal, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl bg-[#FCFAFD] border border-zinc-200 p-6 flex flex-col justify-between md:flex-row md:items-center gap-4"
                    >
                      <div>
                        <span className="font-display text-[10px] font-black uppercase text-[#F000E2] tracking-wider">Laboratory Panel</span>
                        <h5 className="font-display text-lg font-bold text-[#2D2136] mt-1">{goal.test}</h5>
                        <p className="font-body text-xs text-[#2D2136]/75 mt-1">{goal.desc}</p>
                      </div>
                      <Link
                        href={goal.href}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#1E227D] px-5 py-2.5 font-body text-xs font-bold text-white hover:bg-[#1E227D]/90 transition-colors"
                      >
                        View Details <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
