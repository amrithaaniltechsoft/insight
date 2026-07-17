"use client";

import { useState } from "react";
import { Star, MessageSquareCode, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GoldenDragonWave from "../home/GoldenDragonWave";

interface Review {
  name: string;
  date: string;
  text: string;
  rating: number;
  service: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    name: "Sarah Jenkins",
    date: "2 weeks ago",
    text: "Absolutely phenomenal experience. The 4D scan was incredibly clear, and the sonographer was so warm and reassuring. The clinic feels like a premium spa.",
    rating: 5,
    service: "Pregnancy Scans"
  },
  {
    name: "David Aris",
    date: "1 month ago",
    text: "I needed an urgent DVT scan and was seen within 2 hours. The medical team was highly professional, and getting the report immediately gave me absolute peace of mind.",
    rating: 5,
    service: "Diagnostics"
  },
  {
    name: "Emily R.",
    date: "2 months ago",
    text: "The best physiotherapy I’ve ever received. After months of chronic back pain, their ultrasound-guided injections completely changed my daily life. Highly recommended.",
    rating: 5,
    service: "Physiotherapy"
  },
  {
    name: "Chloe T.",
    date: "3 months ago",
    text: "Booked an early reassurance scan. The staff went above and beyond to make my husband and I feel comfortable. Spotlessly clean clinic and top-tier equipment.",
    rating: 5,
    service: "Pregnancy Scans"
  },
  {
    name: "Michael B.",
    date: "4 months ago",
    text: "Extremely efficient well-man blood tests. No NHS waiting lists, incredibly professional phlebotomists, and my detailed results were back the next morning.",
    rating: 5,
    service: "Blood Tests"
  },
  {
    name: "Jessica L.",
    date: "4 months ago",
    text: "The dating scan was a wonderful experience. The team took the time to show us every detail and answered all our nervous questions. Will definitely return.",
    rating: 5,
    service: "Pregnancy Scans"
  },
  {
    name: "Robert H.",
    date: "5 months ago",
    text: "Great clinic, spotless hygiene standards. Had my knee treated here and the recovery plan was excellent. The physiotherapist really knows their stuff.",
    rating: 5,
    service: "Physiotherapy"
  },
  {
    name: "Linda M.",
    date: "6 months ago",
    text: "Extremely friendly and helpful receptionist. The scan itself was highly professional and comforting. Thank you to the whole clinic team.",
    rating: 5,
    service: "General Clinic"
  }
];

export default function ReviewsGrid() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [service, setService] = useState("Pregnancy Scans");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const newReview: Review = {
      name,
      date: "Just now",
      text,
      rating,
      service
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setName("");
      setText("");
      setRating(5);
    }, 3000);
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#FCFAFD]">
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          
          {/* Reviews List (Left/Middle Column) */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold text-[#2D2136] mb-8">
              Patient Testimonials ({reviews.length})
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden flex flex-col justify-between rounded-[2rem] border border-zinc-200 bg-[#FCFAFD] p-8 transition-all hover:border-[#E0A2F5]/40 hover:shadow-lg shadow-sm"
                >
                  <GoldenDragonWave className="opacity-10" />
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < review.rating
                                ? "fill-[#F000E2] text-[#F000E2]"
                                : "text-zinc-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="rounded-full bg-[#E0A2F5]/10 px-3 py-1 font-display text-[11px] font-bold text-[#F000E2]">
                        {review.service}
                      </span>
                    </div>
                    <p className="font-body text-[14px] leading-relaxed text-[#2D2136]/80 italic">
                      "{review.text}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-zinc-150 pt-4">
                    <span className="font-display text-sm font-bold text-[#2D2136]">
                      {review.name}
                    </span>
                    <span className="font-body text-[11px] text-[#2D2136]/40">
                      {review.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave a Review Form (Right Column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-xl">
              <h3 className="font-display text-xl font-bold text-[#2D2136] mb-2">
                Share Your Experience
              </h3>
              <p className="font-body text-xs text-[#2D2136]/60 mb-6">
                Your feedback helps us continuously deliver premium healthcare services.
              </p>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                        Service Experienced
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white"
                      >
                        <option value="Pregnancy Scans">Pregnancy Scans</option>
                        <option value="Diagnostics">Diagnostics</option>
                        <option value="Physiotherapy">Physiotherapy</option>
                        <option value="Blood Tests">Blood Tests</option>
                        <option value="General Clinic">General Clinic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                        Rating
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={`${
                                star <= (hoverRating ?? rating)
                                  ? "fill-[#F000E2] text-[#F000E2]"
                                  : "text-zinc-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display text-[13px] font-bold text-[#2D2136] mb-1.5">
                        Your Review
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Describe your visit..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 font-body text-sm text-[#2D2136] outline-none transition-all focus:border-[#E0A2F5]/80 focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#1E227D] to-[#F000E2] py-3.5 font-display text-sm font-bold text-white shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-98"
                    >
                      Submit Review
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500 mb-4 border border-green-150">
                      <Check size={28} />
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#2D2136] mb-2">
                      Thank You!
                    </h4>
                    <p className="font-body text-xs text-[#2D2136]/60 max-w-[200px]">
                      Your review has been successfully submitted and listed.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
