import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import PageBanner from "@/components/global/PageBanner";
import CTASection from "@/components/home/CTASection";

interface ProductDetail {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description: string;
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function getAllProducts(): Promise<ProductDetail[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  try {
    const res = await fetch(`${API_URL}/shop/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getAllProducts();
  const product = products.find(p => toSlug(p.name) === slug) || null;

  if (!product) {
    return (
      <main className="w-full bg-[#FCFAFD] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-[#2D2136]">Product not found</h1>
          <Link href="/shop" className="mt-4 inline-block text-[#F000E2] hover:underline">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const enquiryUrl = `/contact?enquiry=${encodeURIComponent(product.name)}`;

  return (
    <main className="w-full bg-[#FCFAFD]">
      <PageBanner
        title={product.name}
        highlightedTitle=""
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-[#2D2136]/60 hover:text-[#F000E2] transition-colors mb-8">
              <ArrowLeft size={16} />
              Back to Shop
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative aspect-square w-full bg-zinc-50 rounded-2xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">{product.category}</span>
                <h1 className="mt-2 font-display text-2xl lg:text-3xl font-bold tracking-tight text-[#2D2136]">{product.name}</h1>
                <span className="mt-3 font-display text-2xl font-bold text-[#1E227D]">{product.price}</span>

                <div className="mt-6 font-body text-[15px] leading-relaxed text-[#2D2136]/70 whitespace-pre-line">
                  {product.description?.replace(/"/g, '')}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href={enquiryUrl}>
                    <Button
                      variant="primary"
                      className="w-full sm:w-auto"
                      icon={<MessageSquare size={16} />}
                      iconPosition="left"
                    >
                      Enquire Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}