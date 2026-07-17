"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { ChevronDown, X, MessageSquare } from "lucide-react";
import Button from "@/components/ui/Button";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
}

interface ProductGridProps {
  products: Product[];
}

type MainCategory = "all" | "teddies" | "gender-reveal";
type SubCategory = "all" | "balloons" | "cannons" | "extinguishers" | "scratch-cards" | "envelopes";

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory>("all");
  const [activeSubCategory, setActiveSubCategory] = useState<SubCategory>("all");
  const [isSubDropdownOpen, setIsSubDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

        {/* Sub-category dropdown (only visible when Gender Reveal Options is active) */}
        {/* {activeCategory === "gender-reveal" && (
          <div className="relative w-full max-w-xs animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => setIsSubDropdownOpen((prev) => !prev)}
              onBlur={() => setTimeout(() => setIsSubDropdownOpen(false), 200)}
              className="w-full flex items-center justify-between gap-2 rounded-lg bg-white border border-[#1E227D]/40 px-4 py-2.5 font-body text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 focus:border-[#1E227D] focus:outline-none focus:ring-2 focus:ring-[#1E227D]/20 cursor-pointer"
            >
              <span>{selectedSubCategoryLabel}</span>
              <ChevronDown
                size={18}
                className={`text-zinc-500 transition-transform duration-200 ${isSubDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isSubDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg py-1">
                {subCategoriesList.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onMouseDown={() => {
                      setActiveSubCategory(sub.id as SubCategory);
                      setIsSubDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer ${activeSubCategory === sub.id
                      ? "bg-[#1E227D]/10 text-[#1E227D] font-semibold"
                      : "text-zinc-700 hover:bg-zinc-50"
                      }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )} */}
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
              onReadMore={() => setSelectedProduct(product)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row-reverse">
              <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto md:min-h-[300px] bg-zinc-50 flex-shrink-0">
                <Image
                  src={selectedProduct.image}
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

                <div className="mt-4 font-body text-sm leading-relaxed text-[#2D2136]/70 whitespace-pre-line">
                  {selectedProduct.description?.replace(/"/g, '')}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <Link href={`/contact?enquiry=${encodeURIComponent(selectedProduct.name)}`} onClick={() => setSelectedProduct(null)}>
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
