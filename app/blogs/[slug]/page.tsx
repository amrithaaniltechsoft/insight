import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, User, ChevronRight, BookOpen, Share2 } from "lucide-react";
import CTASection from "@/components/home/CTASection";
import BlogCard from "@/components/blogs/BlogCard";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  slug: string;
  category: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
}

async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/blogs/${slug}`, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getBlogs(): Promise<BlogPost[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const response = await fetch(`${API_URL}/blogs`, { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta_title || `${post.title} | Insight Health Services Walsall`,
    description: post.meta_description || post.description,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const allBlogs = await getBlogs();
  const CATEGORY_GRADIENTS: Record<string, string> = {
    "Pregnancy": "from-[#1E227D]/20 to-[#F000E2]/20",
    "Physiotherapy": "from-[#4F1CE9]/20 to-[#9955DD]/20",
    "Blood Tests": "from-[#4617E6]/20 to-[#C955DD]/20",
    "Diagnostics": "from-[#3A14CC]/20 to-[#AB55DD]/20",
    "General": "from-[#1E227D]/20 to-[#F000E2]/20",
  };

  const relatedPosts = allBlogs
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)
    .map((blog) => ({
      title: blog.title,
      slug: blog.slug,
      summary: blog.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '',
      category: blog.category || 'General',
      date: new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: "5 min read",
      gradient: CATEGORY_GRADIENTS[blog.category] || CATEGORY_GRADIENTS["General"],
      image: blog.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80"
    }));

  return (
    <main className="w-full bg-[#FCFAFD] overflow-hidden pt-8 sm:pt-8 md:pt-12">
      <article className="relative pb-16 lg:pb-24">
        {/* Background Grid Accent */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 50' width='50' height='50'%3e%3cpath d='M25 20 V30 M20 25 H30' stroke='%233E17E6' stroke-width='1.5'/%3e%3c/svg%3e")`,
          }}
        />

        <div className="container relative z-10 mx-auto px-6 lg:px-12">
          {/* Breadcrumbs & Back Link */}
          <div className="mb-10 max-w-4xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 font-display text-xs font-bold text-[#1E227D] hover:text-[#F000E2] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>All Articles</span>
            </Link>

            <nav className="flex items-center gap-1.5 text-zinc-400 font-body text-[11px] font-bold uppercase tracking-wider">
              <Link href="/" className="hover:text-[#1E227D] transition-colors">Home</Link>
              <ChevronRight size={10} />
              <Link href="/blogs" className="hover:text-[#1E227D] transition-colors">Blogs</Link>
              <ChevronRight size={10} />
              <span className="text-zinc-600 max-w-[200px] truncate">{post.title}</span>
            </nav>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Header Content */}
            <div className="mb-8">
              <span className="inline-block rounded-full bg-[#1E227D]/10 px-4 py-1.5 font-display text-xs font-bold text-[#1E227D] uppercase tracking-wider mb-4">
                {post.category}
              </span>
              <h1 className="font-display text-2xl font-extrabold leading-tight text-[#2D2136] md:text-3xl lg:text-4xl">
                {post.title}
              </h1>

              {/* Meta stats */}
              <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-zinc-200/80 pb-6 text-zinc-500 font-body text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 overflow-hidden rounded-full border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                    <User size={14} className="text-zinc-400" />
                  </div>
                  <span className="font-bold text-[#2D2136]">Insight Health Team</span>
                </div>
                <div className="h-4 w-px bg-zinc-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="h-4 w-px bg-zinc-300 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Clock size={15} />
                  <span>5 min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem]">
              <Image
                src={post.image || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80"}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Editorial Layout: Center Article Text */}
            <div className="max-w-3xl mx-auto">

              {/* Rich Body Content */}
              <div className="w-full">
                <div
                  className="prose prose-zinc max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-[#2D2136] prose-p:font-body prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-[#2D2136]/80 prose-strong:text-[#2D2136] prose-blockquote:border-[#1E227D] prose-blockquote:bg-zinc-50 prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:font-body prose-blockquote:italic prose-blockquote:text-[#2D2136]/80 prose-ul:font-body prose-ul:text-[15px] prose-ul:text-[#2D2136]/80 prose-li:my-2 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 border-b border-zinc-200/80 pb-12"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />

                {/* Bottom Section: Tags & Share */}
                <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  {/* Article Tags */}
                  {post.meta_keywords && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag size={16} className="text-[#F000E2] mr-1" />
                      {post.meta_keywords.split(',').map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="rounded-full bg-zinc-100 border border-zinc-200/60 px-3 py-1 font-body text-xs text-[#2D2136]/70"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Share Callout */}
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xs font-bold text-zinc-400 uppercase tracking-wider">Share:</span>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:text-[#1E227D] hover:border-[#1E227D]/30">
                      <Share2 size={16} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:text-[#1E227D] hover:border-[#1E227D]/30 font-display text-xs font-bold">
                      F
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-colors hover:text-[#1E227D] hover:border-[#1E227D]/30 font-display text-xs font-bold">
                      in
                    </button>
                  </div>
                </div>
              </div>

            </div>

            

          </div>
          {/* Related Posts Section */}
            <div className="mt-20 border-t border-zinc-200/80 pt-16">
              <h3 className="font-display text-2xl font-extrabold text-[#2D2136] mb-8">
                Keep Reading
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {relatedPosts.map((relatedPost, idx) => (
                  <BlogCard key={idx} post={relatedPost} />
                ))}
              </div>
            </div>
        </div>
      </article>

      <CTASection />
    </main>
  );
}
