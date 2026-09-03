"use client";

import { useState, useEffect } from "react";
import { Star, ExternalLink, Quote } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=innsight+Visit+Clinic+1a+Walsall+Rd%2C+Walsall+WS5+4QL%2C+United+Kingdom";

const FALLBACK_REVIEWS = [
  {
    name: "Hanfaa H",
    date: "a month ago",
    text: "I came for a reassurance scan and was extremely pleased with the experience. The atmosphere was warm and calming, the facilities were clean and of a high standard, and the staff were kind, knowledgeable, and reassuring throughout.",
    rating: "5.0",
    profile_photo_url: null as string | null,
  },
  {
    name: "Reginold Daniel",
    date: "2 months ago",
    text: "Excellent service from Manju and Sonographer Laura. Very professional, excellent communication, compassionate, excellent knowledge. I would highly recommend anyone to use this service.",
    rating: "5.0",
    profile_photo_url: null as string | null,
  },
  {
    name: "Marta Balicka",
    date: "a month ago",
    text: "I had my 20-week scan at Insight Health Services. The experience was excellent from start to finish. The scan was very thorough, and the radiologist took the time to explain everything in detail.",
    rating: "5.0",
    profile_photo_url: null as string | null,
  },
  {
    name: "Jessica M.",
    date: "2 weeks ago",
    text: "Wonderful 5-star experience. Welcomed, never rushed, and our sonographer took the time to provide a thorough pregnancy scan while making our gender reveal experience special.",
    rating: "5.0",
    profile_photo_url: null as string | null,
  },
];

function ReviewCard({
  review,
  index,
  featured,
}: {
  review: (typeof FALLBACK_REVIEWS)[0];
  index: number;
  featured?: boolean;
}) {
  const stars = Math.round(parseFloat(review.rating || "5"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-3xl border bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-purple-200 shadow-purple-100/60 col-span-full lg:col-span-2"
          : "border-zinc-100 shadow-zinc-100/50"
      }`}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-blue-200/20 to-purple-100/20 blur-2xl" />

      <div className={`relative p-7 ${featured ? "lg:p-10" : ""}`}>
        {/* Top row: quote + stars */}
        <div className="mb-5 flex items-start justify-between">
          <Quote
            size={featured ? 40 : 32}
            className="text-purple-200"
            strokeWidth={1.5}
          />
          <div className="flex items-center gap-0.5">
            {[...Array(stars)].map((_, i) => (
              <Star key={i} size={16} className="fill-[#E1BE03] text-[#E1BE03]" />
            ))}
          </div>
        </div>

        {/* Review text */}
        <p
          className={`font-body leading-relaxed text-[#2D2136]/80 ${
            featured ? "text-xl lg:text-2xl" : "text-[15px]"
          }`}
        >
          &ldquo;{review.text}&rdquo;
        </p>

        {/* Reviewer identity */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-base font-bold text-white shadow">
              {review.name?.charAt(0) ?? "P"}
            </div>
            <div>
              <p className="font-display text-sm font-bold text-[#2D2136]">
                {review.name}
              </p>
              <p className="font-body text-xs text-[#2D2136]/50">
                {review.date} · Google Review
              </p>
            </div>
          </div>

          {/* Google logo */}
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LatestReview() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);
  const [rating, setRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_URL}/reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && data.reviews && data.reviews.length > 0) {
          // Show up to 4 latest reviews
          setReviews(data.reviews.slice(0, 4));
          setRating(data.rating || 5.0);
          setTotalRatings(data.total_ratings || 0);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-[#FCFAFD]">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-semibold text-purple-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Latest Google Reviews
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-[#2D2136] md:text-5xl">
            What Our Patients{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Say
            </span>
          </h2>
          {totalRatings > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(rating)
                        ? "fill-[#E1BE03] text-[#E1BE03]"
                        : "fill-zinc-300 text-zinc-300"
                    }
                  />
                ))}
              </div>
              <span className="font-display text-lg font-bold text-[#2D2136]">
                {rating.toFixed(1)}
              </span>
              <span className="font-body text-sm text-[#2D2136]/60">
                ({totalRatings} Google reviews)
              </span>
            </div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {reviews.map((review, index) => (
            <ReviewCard
              key={index}
              review={review}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>

        {/* View All Google Reviews Button */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-300/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-400/40"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0">
              <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" opacity="0.9" />
              <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.9" />
              <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.9" />
              <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.9" />
            </svg>
            View All Google Reviews
            <ExternalLink
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
