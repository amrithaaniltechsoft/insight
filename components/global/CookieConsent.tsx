"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "insight_cookie_consent";

type ConsentLevel = "all" | "necessary" | null;

function getSavedConsent(): ConsentLevel {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentLevel) || null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentLevel>(getSavedConsent);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const saveConsent = (level: ConsentLevel) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, level || "necessary");
    setConsent(level || "necessary");
  };

  const acceptAll = () => {
    setAnalytics(true);
    setFunctional(true);
    setMarketing(true);
    saveConsent("all");
  };

  const rejectOptional = () => {
    setAnalytics(false);
    setFunctional(false);
    setMarketing(false);
    saveConsent("necessary");
  };

  const savePreferences = () => {
    saveConsent(analytics || functional || marketing ? "all" : "necessary");
    setShowPreferences(false);
  };

  if (consent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[150] bg-white border-t border-zinc-200 shadow-2xl"
      >
        {!showPreferences ? (
          <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-base font-bold text-[#2D2136]">
                    Cookie Policy
                  </h3>
                  <button
                    onClick={rejectOptional}
                    className="p-1 text-zinc-400 hover:text-[#2D2136] transition-colors sm:hidden"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="mt-1 font-body text-sm text-[#2D2136]/70 leading-relaxed max-w-2xl">
                  We value your privacy. Insight Health Services uses cookies to help our website work properly, understand how visitors use our website and improve your online experience. Necessary cookies are always active because they are required for essential website functions. With your permission, we may also use analytics and marketing cookies.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:min-w-fit sm:flex-row sm:items-center">
                <button
                  onClick={acceptAll}
                  className="rounded-xl bg-[#1E227D] px-5 py-2.5 font-display text-sm font-bold text-white hover:bg-[#2D2136] transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={rejectOptional}
                  className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#2D2136] hover:bg-zinc-50 transition-colors"
                >
                  Reject Optional Cookies
                </button>
                <button
                  onClick={() => setShowPreferences(true)}
                  className="font-body text-xs text-[#F000E2] hover:text-[#2D2136] underline underline-offset-2 transition-colors sm:text-sm"
                >
                  Manage Preferences
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-bold text-[#2D2136]">
                Cookie Preferences
              </h3>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-1 text-zinc-400 hover:text-[#2D2136] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mb-4 font-body text-sm text-[#2D2136]/70 leading-relaxed">
              You can choose which optional cookies Insight Health Services may use. Necessary cookies cannot be switched off because they are required for the website to function securely and correctly.
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-sm font-bold text-[#2D2136]">Necessary Cookies</span>
                    <span className="ml-2 font-body text-xs text-[#2D2136]/50">— Always Active</span>
                  </div>
                  <input type="checkbox" checked disabled className="h-4 w-4 accent-[#1E227D]" />
                </div>
                <p className="mt-1 font-body text-xs text-[#2D2136]/60">
                  These cookies support essential website functions, including security, navigation, booking access and remembering your cookie preferences.
                </p>
              </div>
              <label className="flex flex-col rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#2D2136]">Analytics Cookies</span>
                  <span className="ml-2 font-body text-xs text-[#2D2136]/50">— Optional</span>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="h-4 w-4 accent-[#1E227D] ml-auto"
                  />
                </div>
                <p className="mt-1 font-body text-xs text-[#2D2136]/60">
                  These cookies help us understand how visitors use our website, such as which pages are visited and how users move around the site. This information helps us improve our website and services.
                </p>
              </label>
              <label className="flex flex-col rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#2D2136]">Functional Cookies</span>
                  <span className="ml-2 font-body text-xs text-[#2D2136]/50">— Optional</span>
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="h-4 w-4 accent-[#1E227D] ml-auto"
                  />
                </div>
                <p className="mt-1 font-body text-xs text-[#2D2136]/60">
                  These cookies allow the website to remember choices you make and provide enhanced features, such as embedded maps, videos or other third-party services.
                </p>
              </label>
              <label className="flex flex-col rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#2D2136]">Marketing Cookies</span>
                  <span className="ml-2 font-body text-xs text-[#2D2136]/50">— Optional</span>
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="h-4 w-4 accent-[#1E227D] ml-auto"
                  />
                </div>
                <p className="mt-1 font-body text-xs text-[#2D2136]/60">
                  These cookies may be used to measure advertising performance and show more relevant advertisements on platforms such as Google, Facebook or Instagram.
                </p>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={savePreferences}
                className="rounded-xl bg-[#1E227D] px-5 py-2.5 font-display text-sm font-bold text-white hover:bg-[#2D2136] transition-colors"
              >
                Save My Preferences
              </button>
              <button
                onClick={acceptAll}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#2D2136] hover:bg-zinc-50 transition-colors"
              >
                Accept All Cookies
              </button>
              <button
                onClick={rejectOptional}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#2D2136] hover:bg-zinc-50 transition-colors"
              >
                Reject Optional Cookies
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
