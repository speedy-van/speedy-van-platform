"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Per-service CSS gradient fallbacks used when the image fails to load.
const GRADIENT_FALLBACKS: Record<string, string> = {
  "man-and-van":        "from-[#1e3a5f] to-[#2d5f8a]",
  "house-removal":      "from-[#2d4a2a] to-[#4a7a44]",
  "office-removal":     "from-[#3a3a5c] to-[#5a5a8a]",
  "student-move":       "from-[#5c3a1e] to-[#8a6a3d]",
  "furniture-delivery": "from-[#1e4a5c] to-[#3a7a8a]",
  "ikea-delivery":      "from-[#1a3f6f] to-[#2a6faf]",
  "rubbish-removal":    "from-[#2a5a2a] to-[#4a8a4a]",
  "piano-moving":       "from-[#2a2a2a] to-[#5a5a5a]",
  "same-day-delivery":  "from-[#5c1e3a] to-[#8a3a5a]",
  "packing-service":    "from-[#4a3a1e] to-[#7a6a3a]",
};

interface ServiceImageCardProps {
  slug: string;
  title: string;
  description?: string;
  price: string;
  imagePath: string;
  href?: string;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: "homepage" | "booking";
}

export function ServiceImageCard({
  slug,
  title,
  description,
  price,
  imagePath,
  href,
  isSelected = false,
  onClick,
  variant = "homepage",
}: ServiceImageCardProps) {
  const [imgError, setImgError] = useState(false);
  const isBooking = variant === "booking";
  const fallback = GRADIENT_FALLBACKS[slug] ?? "from-[#1e3a5f] to-[#2d5f8a]";

  const sharedClass = [
    "group relative overflow-hidden rounded-2xl transition-all duration-200",
    isBooking ? "h-40" : "h-56",
    isSelected
      ? "ring-[3px] ring-primary-400 shadow-lg shadow-primary-400/20"
      : "ring-0",
    "hover:-translate-y-1 hover:shadow-xl",
  ].join(" ");

  const inner = (
    <>
      {/* Background: photo or gradient fallback */}
      {imgError ? (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${fallback}`}
          aria-hidden="true"
        />
      ) : (
        <Image
          src={imagePath}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          quality={70}
          onError={() => setImgError(true)}
        />
      )}

      {/* Dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10"
        aria-hidden="true"
      />

      {/* Selected checkmark (booking only) */}
      {isSelected && isBooking && (
        <div className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary-400 shadow-md">
          <span className="text-xs font-extrabold text-slate-900" aria-hidden="true">
            ✓
          </span>
        </div>
      )}

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1 p-4">
        <p
          className={[
            "font-bold leading-tight text-white drop-shadow-sm",
            isBooking ? "text-sm" : "text-base",
          ].join(" ")}
        >
          {title}
        </p>

        {!isBooking && description && (
          <p className="line-clamp-2 text-xs text-white/75 leading-snug">
            {description}
          </p>
        )}

        <p
          className={[
            "font-extrabold text-primary-300 drop-shadow-sm",
            isBooking ? "text-xs" : "text-sm",
          ].join(" ")}
        >
          {price} →
        </p>
      </div>
    </>
  );

  if (isBooking) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${sharedClass} w-full text-left`}
        aria-label={title}
      >
        {inner}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={`block ${sharedClass}`} aria-label={title}>
        {inner}
      </Link>
    );
  }

  return <div className={sharedClass}>{inner}</div>;
}
