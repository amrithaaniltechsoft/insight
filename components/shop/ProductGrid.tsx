"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ChevronDown, X, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

interface ProductColor {
  id: number;
  color_name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  colors?: ProductColor[];
}

interface ProductGridProps {
  products: Product[];
}

type MainCategory = "all" | "teddies" | "gender-reveal";
type SubCategory = "all" | "balloons" | "cannons" | "extinguishers" | "scratch-cards" | "envelopes";

const getColorFromName = (name: string): string => {
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  const colorMap: { [key: string]: string } = {
    pink: "#FFC0CB",
    lightpink: "#FFB6C1",
    blue: "#3B82F6",
    lightblue: "#93C5FD",
    red: "#EF4444",
    green: "#10B981",
    yellow: "#FBBF24",
    black: "#1F2937",
    white: "#FFFFFF",
    purple: "#8B5CF6",
    gold: "#F59E0B",
    silver: "#D1D5DB",
    grey: "#6B7280",
    gray: "#6B7280",
    orange: "#F97316",
    brown: "#78350F",
    navy: "#1E3A8A",
    teal: "#14B8A6",
    cyan: "#06B6D4",
    magenta: "#D946EF",
  };
  
  if (colorMap[cleanName]) {
    return colorMap[cleanName];
  }
  
  if (/^(#[0-9a-f]{3,8}|rgba?\(.*\)|hsla?\(.*\)|[a-z]+)$/i.test(cleanName)) {
    return cleanName;
  }
  
  return "#E5E7EB"; // Default gray-200
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>("all");
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProduct]);
  const [selectedColorImage, setSelectedColorImage] = useState<string | null>(null);

  // Helper to categorize products dynamically
  const categorizeProduct = (product: Product) => {
    const categoryLower = product.category.toLowerCase();

    // Use the actual category from the database
    if (categoryLower.includes("teddies") || categoryLower.includes("heartbeat")) {
      return { category: "teddies", subcategory: null };
    }

    // Otherwise it's a gender reveal option
    let subcategory = "other";
    const name = product.name.toLowerCase();
    if (name.includes("balloon")) {
      subcategory = "balloons";
    } else if (name.includes("cannon") || name.includes("popper")) {
      subcategory = "cannons";
    } else if (name.includes("extinguisher")) {
      subcategory = "extinguishers";
    } else if (name.includes("scratch")) {
      subcategory = "scratch-cards";
    } else if (name.includes("envelope") || name.includes("card") || name.includes("invitation")) {
      subcategory = "envelopes";
    }

    return { category: "gender-reveal", subcategory };
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const { category, subcategory } = categorizeProduct(product);

    if (activeCategory === "all") return true;
    if (activeCategory === "teddies") return category === "teddies";

    if (activeCategory === "gender-reveal") {
      if (category !== "gender-reveal") return false;
      if (activeSubCategory === "all") return true;
      return subcategory === activeSubCategory;
    }

    return true;
  });

  const subCategoriesList = [
    { id: "all", label: "All Gender Reveal Options" },
    { id: "balloons", label: "Gender Balloons" },
    { id: "cannons", label: "Cannons (Large & Small)" },
    { id: "extinguishers", label: "Extinguishers" },
    { id: "scratch-cards", label: "Scratch cards" },
    { id: "envelopes", label: "Secret envelopes" },
  ];

  const selectedSubCategoryLabel =
    subCategoriesList.find((sub) => sub.id === activeSubCategory)?.label ?? "Select Sub Category";

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-col items-center gap-6 pb-4 border-b border-zinc-100">
        <div className="flex flex-wrap justify-center gap-2 p-2 bg-white border border-[#1E227D] rounded-4xl backdrop-blur-sm max-w-fit">
          <button
            onClick={() => {
              setActiveCategory("all");
              setActiveSubCategory("all");
            }}
            className={`px-6 py-2.5 rounded-4xl border border-[#F3F1FE] text-sm font-semibold transition-all duration-200 cursor-pointer ${activeCategory === "all"
              ? "bg-[#1E227D] text-white shadow-md shadow-[#1E227D]/25"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setActiveCategory("teddies");
              setActiveSubCategory("all");
            }}
            className={`px-6 py-2.5 rounded-4xl border border-[#F3F1FE] text-sm font-semibold transition-all duration-200 cursor-pointer ${activeCategory === "teddies"
              ? "bg-[#1E227D] text-white shadow-md shadow-[#1E227D]/25"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
          >
            Teddies with Heartbeat Monitor
          </button>
          <button
            onClick={() => {
              setActiveCategory("gender-reveal");
              setActiveSubCategory("all");
            }}
            className={`px-6 py-2.5 rounded-4xl border border-[#F3F1FE] text-sm font-semibold transition-all duration-200 cursor-pointer ${activeCategory === "gender-reveal"
              ? "bg-[#1E227D] text-white shadow-md shadow-[#1E227D]/25"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
              }`}
          >
            Gender Reveal Options
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={idx}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              colors={product.colors}
              onReadMore={() => {
                setSelectedProduct(product);
                setSelectedColorImage(null);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-500 font-body text-base">
            No products found matching the selected filters.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setSelectedProduct(null); setSelectedColorImage(null); }}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => { setSelectedProduct(null); setSelectedColorImage(null); }} className="absolute top-4 right-4 z-[310] flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row-reverse">
              <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[300px] bg-zinc-50 flex-shrink-0">
                <Image
                  src={selectedColorImage || selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>

              <div className="flex flex-col p-6 md:w-3/5">
                <span className="font-display text-xs font-bold uppercase tracking-widest text-[#F000E2]">{selectedProduct.category}</span>
                <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-[#2D2136]">{selectedProduct.name}</h2>
                <span className="mt-2 font-display text-xl font-bold text-[#1E227D]">{selectedProduct.price}</span>

                {/* Colors Display */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-6">
                    <span className="font-display text-xs font-bold uppercase tracking-widest text-[#2D2136]/50">Available Colors</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.colors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => {
                            if (selectedColorImage === color.image) {
                              setSelectedColorImage(null);
                            } else {
                              setSelectedColorImage(color.image);
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            selectedColorImage === color.image
                              ? "bg-[#1E227D] text-white border-[#1E227D]"
                              : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <span 
                            className="relative w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                            style={{ backgroundColor: getColorFromName(color.color_name) }}
                          />
                          {color.color_name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 font-body text-sm leading-relaxed text-[#2D2136]/70 whitespace-pre-line">
                  {selectedProduct.description?.replace(/"/g, '')}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link href={`/contact?enquiry=${encodeURIComponent(selectedProduct.name)}`} onClick={() => { setSelectedProduct(null); setSelectedColorImage(null); }}>
                    <Button variant="primary" className="w-full" icon={<MessageSquare size={16} />} iconPosition="left">
                      Enquire Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
