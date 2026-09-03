"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface ProductColor {
  id: number;
  color_name: string;
  image: string;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  colors?: ProductColor[];
  onReadMore: () => void;
}

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

export default function ProductCard({ name, price, image, colors, onReadMore }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(image);

  useEffect(() => {
    setActiveImage(image);
  }, [image]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden cursor-pointer" onClick={onReadMore}>
        <Image
          src={activeImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-6 flex-grow relative">
        <GoldenDragonWave className="opacity-[0.3] translate-y-1 pointer-events-none" />

        <div className="relative z-10 mb-4 flex flex-col gap-1.5">
          <h3 className="font-display text-base font-bold text-[#2D2136] tracking-tight transition-colors">
            {name}
          </h3>
          <span className="font-display text-sm font-bold text-[#1E227D]">
            {price}
          </span>

          {/* Color Dots */}
          {colors && colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  title={color.color_name}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (color.image) {
                      setActiveImage(activeImage === color.image ? image : color.image);
                    }
                  }}
                  style={{ backgroundColor: getColorFromName(color.color_name) }}
                  className={`relative w-6 h-6 rounded-full border transition-transform hover:scale-110 active:scale-90 flex-shrink-0 cursor-pointer ${
                    activeImage === color.image ? "ring-2 ring-[#1E227D] border-white" : "border-black/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-auto">
          <button
            onClick={onReadMore}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-xl border border-[#1E227D] text-[#1E227D] cursor-pointer transition-colors hover:bg-[#1E227D] hover:text-white active:scale-[0.98]"
          >
            <Eye size={13} />
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}