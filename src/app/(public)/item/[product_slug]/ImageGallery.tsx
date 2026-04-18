"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/src/types";

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const fallback = "https://placehold.co/800x800?text=sin+imagen";
  const primary = images.find((img) => img.is_primary) || images[0];
  const [selected, setSelected] = useState<string>(primary?.url ?? fallback);

  const displayImages = images.length > 0 ? images : [];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/20">
        <Image
          src={selected}
          alt={productName}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails — only shown if there are 2+ images */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelected(img.url)}
              className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selected === img.url
                  ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  : "border-white/20 hover:border-white/60"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} imagen ${img.sort_order + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
