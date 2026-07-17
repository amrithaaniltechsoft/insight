"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

interface Category {
  slug: string;
  title: string;
}

interface Service {
  slug: string;
  title: string;
}

interface ServiceSearchBarProps {
  categories?: Category[];
  selectedCategory?: string;
  onCategoryChange?: (slug: string) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
  filteredServices: Service[];
  onSearch: () => void;
  hideCategorySelect?: boolean;
  canSearch?: boolean;
}

export default function ServiceSearchBar({
  categories = [],
  selectedCategory = "",
  onCategoryChange = () => { },
  searchTerm,
  onSearchTermChange,
  selectedService,
  onServiceSelect,
  filteredServices,
  onSearch,
  hideCategorySelect = false,
  canSearch = false,
}: ServiceSearchBarProps) {
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    setIsServiceDropdownOpen(false);
  };

  const handleCategorySelect = (cat: Category) => {
    onCategoryChange(cat.slug);
    setIsCategoryDropdownOpen(false);
  };

  const selectedCategoryLabel =
    categories.find((c) => c.slug === selectedCategory)?.title ?? "Select Category";

  return (
    <div className="mt-6 w-full max-w-3xl p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20" style={{ background: "linear-gradient(rgb(246, 240, 249), rgb(246, 240, 249)) padding-box padding-box, linear-gradient(135deg, rgb(62, 23, 230), rgb(181, 102, 214)) border-box border-box", border: "3px solid transparent" }}>
      <div className="grid grid-cols-1 md:grid-cols-9 gap-3 items-center">

        {/* Category Custom Dropdown */}
        {!hideCategorySelect && (
          <div className="relative md:col-span-4">
            <button
              type="button"
              onClick={() => {
                setIsCategoryDropdownOpen((prev) => !prev);
                setIsServiceDropdownOpen(false);
              }}
              onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
              className="w-full flex items-center justify-between gap-2 rounded-lg bg-white border border-[#1E227D]/40 px-5 py-3 font-body text-base transition hover:bg-zinc-50 focus:border-[#1E227D] focus:outline-none focus:ring-2 focus:ring-[#1E227D]/20"
            >
              <span className={selectedCategory ? "text-zinc-800" : "text-zinc-400"}>
                {selectedCategoryLabel}
              </span>
              <ChevronDown
                size={20}
                className={`flex-shrink-0 text-zinc-500 transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 z-50 mt-2 w-full max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    onMouseDown={() => handleCategorySelect(cat)}
                    className="cursor-pointer px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100"
                  >
                    {cat.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Service Search Input */}
        <div className={`relative ${hideCategorySelect ? "md:col-span-8" : "md:col-span-4"}`}>
          <input
            type="text"
            placeholder="Select a service"
            value={searchTerm}
            onChange={(e) => {
              onSearchTermChange(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSearch) {
                e.preventDefault();
                onSearch();
              }
            }}
            onFocus={() => setIsServiceDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsServiceDropdownOpen(false), 200)}
            disabled={!hideCategorySelect && !selectedCategory}
            className="w-full rounded-lg border border-[#1E227D]/40 bg-white px-5 py-3 font-body text-base text-zinc-800 placeholder:text-zinc-400 transition hover:bg-zinc-50/80 focus:border-[#1E227D] focus:outline-none focus:ring-2 focus:ring-[#1E227D]/20 disabled:cursor-not-allowed disabled:opacity-80"
          />

          {isServiceDropdownOpen && (hideCategorySelect || selectedCategory) && filteredServices.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-2 w-full max-h-48 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
              {filteredServices.map((service) => (
                <div
                  key={service.slug}
                  onMouseDown={() => handleServiceSelect(service)}
                  className="cursor-pointer px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100"
                >
                  {service.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="md:col-span-1 flex justify-center md:justify-end w-full md:w-auto">
          <Button
            onClick={onSearch}
            disabled={!canSearch}
            icon={<Search size={18} />}
            className="w-full md:w-auto !rounded-lg md:!rounded-full py-3 md:p-3 !aspect-auto md:!aspect-square disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Search"
          />
        </div>
      </div>
    </div>
  );
}
