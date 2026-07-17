import Image from "next/image";
import { Quote, Award, HeartPulse } from "lucide-react";

export default function CredentialsBanner() {
  return (
    <div className="container relative z-10 mx-auto px-6 lg:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#1E227D] to-[#F000E2] border border-white/20 backdrop-blur-md shadow-2xl md:flex-row group">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-15 transition-opacity duration-500 group-hover:opacity-30">
          <svg viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-1/2 min-h-[100%] min-w-[100%] -translate-x-1/2 -translate-y-1/2 opacity-100" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="credPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff8af7ff" />
                <stop offset="50%" stopColor="#E0A2F5" />
                <stop offset="100%" stopColor="#fd7cf5ff" />
              </linearGradient>
              <linearGradient id="credLilacGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0A2F5" />
                <stop offset="50%" stopColor="#F5E6FB" />
                <stop offset="100%" stopColor="#B67BCB" />
              </linearGradient>
            </defs>
            <g>
              <path d="M -200 600 C 200 300, 600 700, 1000 400 C 1400 100, 1600 600, 1800 300" stroke="url(#credLilacGrad)" strokeWidth="20" strokeLinecap="round" opacity="0.8" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
              <path d="M -200 500 C 300 200, 500 800, 900 500 C 1300 200, 1500 700, 1800 400" stroke="url(#credPurpleGrad)" strokeWidth="45" strokeLinecap="round" opacity="1" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
              <path d="M -200 550 C 400 150, 400 850, 950 450 C 1400 50,  1400 750, 1800 350" stroke="url(#credLilacGrad)" strokeWidth="12" strokeLinecap="round" opacity="0.9" pathLength="1" strokeDashoffset="0" strokeDasharray="1 1" />
            </g>
          </svg>
        </div>
        <div className="flex w-full flex-col justify-center p-8 md:w-3/5 lg:p-10">
          <div className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-2">
              <Quote size={24} className="text-white" />
              <h2 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl">&ldquo;We believe every patient deserves clinical excellence delivered with rapid, compassionate care.&rdquo;</h2>
            </div>
            <div className="h-px w-full bg-white/20" />
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Award size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">HCPC Registered</h3>
                  <p className="font-body text-sm font-medium text-white/80">Senior Sonographers</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <HeartPulse size={24} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">CSP Chartered</h3>
                  <p className="font-body text-sm font-medium text-white/80">Expert Physiotherapists</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative min-h-[240px] w-full bg-white/5 md:w-2/5 flex items-end justify-center">
          <Image
            src="/asset-images/physiotherapist-helping-nobg.png"
            alt="Medical Professional"
            width={1000}
            height={1000}
            className="h-auto max-h-[200px] md:max-h-[440px] w-auto object-contain object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
