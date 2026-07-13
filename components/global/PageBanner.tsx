"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  title: string;
  highlightedTitle?: string;
  breadcrumbs: Breadcrumb[];
  description?: string;
  gradient?: string;
}

export default function PageBanner({ title, highlightedTitle, breadcrumbs, description, gradient }: PageBannerProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient ?? "from-[#1E227D] to-[#F000E2]"} py-20 text-white lg:py-28`}>
      <div className="absolute -left-32 top-0 z-0 h-[30rem] w-[30rem] rounded-full bg-white/5" />
      <div className="absolute bottom-0 right-0 z-0 h-[25rem] w-[35rem] rounded-tl-full bg-white/5" />
      <GoldenDragonWave className="opacity-30" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 font-body text-xs font-medium text-white/70">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-2">
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="transition-colors hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white" : "text-white/70"}>{crumb.label}</span>
                )}
                {!isLast && <ChevronRight size={10} />}
              </div>
            );
          })}
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {title} {highlightedTitle && <span className="text-[#E0A2F5]">{highlightedTitle}</span>}
          </h1>
          {description && (
            <p className="mt-5 font-body text-base leading-relaxed text-white/80 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
