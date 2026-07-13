"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { MessageSquare, Eye } from "lucide-react";
import GoldenDragonWave from "@/components/home/GoldenDragonWave";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  onReadMore: () => void;
}

export default function ProductCard({ name, price, image, onReadMore }: ProductCardProps) {
  const enquiryUrl = `/contact?enquiry=${encodeURIComponent(name)}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-zinc-200/50">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden cursor-pointer" onClick={onReadMore}>
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col p-6 flex-grow relative overflow-hidden">
        <GoldenDragonWave className="opacity-[0.3] translate-y-1 pointer-events-none" />

        <div className="relative z-10 mb-4 flex flex-col gap-1.5">
          <h3 className="font-display text-base font-bold text-[#2D2136] tracking-tight transition-colors">
            {name}
          </h3>
          <span className="font-display text-sm font-bold text-[#1E227D]">
            {price}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 mt-auto flex gap-2">
          <Link href={enquiryUrl} className="flex-1">
            <Button
              variant="primary"
              className="w-full !py-2.5 !text-xs !border-zinc-200 hover:!border-[#F000E2] hover:!text-[#F000E2]"
              icon={<MessageSquare size={13} />}
              iconPosition="left"
            >
              Enquire Now
            </Button>
          </Link>
          <div className="flex-1">
            <Button
              variant="secondary"
              className="w-full !py-2.5 !text-xs !border-zinc-200 !text-zinc-600 hover:!border-[#1E227D] hover:!text-[#1E227D]"
              icon={<Eye size={13} />}
              iconPosition="left"
              onClick={onReadMore}
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}