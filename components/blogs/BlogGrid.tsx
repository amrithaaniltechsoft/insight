"use client";

import { useState } from "react";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import GoldenDragonWave from "../home/GoldenDragonWave";
import BlogCard from "./BlogCard";
import { BlogPost } from "./blogData";

interface BlogGridProps {
  blogs: any[];
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Pregnancy": "from-[#1E227D]/20 to-[#F000E2]/20",
  "Physiotherapy": "from-[#4F1CE9]/20 to-[#9955DD]/20",
  "Blood Tests": "from-[#4617E6]/20 to-[#C955DD]/20",
  "Diagnostics": "from-[#3A14CC]/20 to-[#AB55DD]/20",
  "General": "from-[#1E227D]/20 to-[#F000E2]/20",
};

export default function BlogGrid({ blogs }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(blogs.map(blog => blog.category)))];

  const transformedBlogs: BlogPost[] = blogs.map((blog) => ({
    title: blog.title,
    slug: blog.slug,
    summary: blog.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '',
    category: blog.category || 'General',
    date: new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: "5 min read",
    gradient: CATEGORY_GRADIENTS[blog.category] || CATEGORY_GRADIENTS["General"],
    image: blog.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"
  }));

  const filteredPosts = transformedBlogs.filter(
    (post) => activeCategory === "All" || post.category === activeCategory
  );

  return (
    <section
      className="relative py-20 lg:py-28 bg-[#FCFAFD]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='rgba(181,102,214,0.06)' stroke-width='1.5'/%3e%3c/svg%3e")`,
      }}
    >

      {/* TOP WAVE DIVIDER */}
      <div className="absolute left-0 top-0 z-10 w-full -translate-y-[99%] rotate-180 leading-[0]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-[40px] w-full max-w-none lg:h-[70px]"
        >
          <defs>
            <linearGradient id="topWaveGradTrust" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F000E2" />
              <stop offset="100%" stopColor="#1E227D" />
            </linearGradient>
          </defs>
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#FCFAFD"
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
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Category Filters */}
        <div className="mb-16 flex flex-wrap justify-center gap-2">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2.5 font-display text-[13.5px] font-bold transition-all ${
                activeCategory === category
                  ? "bg-[#1E227D] text-white shadow-md"
                  : "bg-white text-[#2D2136] border border-zinc-200/80 hover:border-[#E0A2F5]/50 hover:bg-zinc-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
