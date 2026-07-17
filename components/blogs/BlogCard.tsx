"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import GoldenDragonWave from "../home/GoldenDragonWave";
import { BlogPost } from "./blogData";

export default function BlogCard({ post }: { post: BlogPost }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="relative overflow-hidden group flex flex-col justify-between rounded-[2rem] border border-zinc-300 bg-white p-6 transition-all duration-300 hover:border-[#E0A2F5]/30 hover:shadow-xl hover:-translate-y-1"
    >
      <GoldenDragonWave className="opacity-20 transition-opacity duration-500 group-hover:opacity-30" />
      <div>
        {/* Decorative Colored Banner Card Top */}
        <div className={`relative mb-6 h-48 w-full rounded-2xl bg-gradient-to-br ${post.gradient} overflow-hidden flex items-center justify-center`}>
          {post.image && !imageError ? (
            <img
              src={post.image}
              alt={post.title}
              onError={() => setImageError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <BookOpen size={48} className="text-[#1E227D]/40 group-hover:scale-110 transition-transform duration-500" />
          )}
          <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3.5 py-1 font-display text-[11px] font-bold text-[#1E227D] uppercase tracking-wider z-10">
            {post.category}
          </div>
        </div>

        {/* Article Info */}
        <div className="flex items-center gap-4 text-zinc-400 font-body text-xs mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h3 className="font-display text-lg font-bold text-[#2D2136] mb-3 group-hover:text-[#1E227D] transition-colors leading-snug">
          {post.title}
        </h3>
        
        <p className="font-body text-[13.5px] text-[#2D2136]/70 leading-relaxed mb-6">
          {post.summary}
        </p>
      </div>

      {/* Read More Link */}
      <Link
        href={`/blogs/${post.slug}`}
        className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-[#1E227D] group-hover:text-[#F000E2] transition-colors mt-auto"
      >
        <span>Read Article</span>
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </article>
  );
}
