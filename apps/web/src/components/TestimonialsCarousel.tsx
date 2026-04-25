"use client";

import { useEffect, useRef, useState } from "react";
export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-amber-400 text-slate-900",
  "bg-rose-300 text-slate-900",
  "bg-emerald-300 text-slate-900",
  "bg-sky-300 text-slate-900",
  "bg-violet-300 text-slate-900",
  "bg-orange-300 text-slate-900",
];

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, items.length]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${index * 100}%)`;
    }
  }, [index]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-2xl"
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-700 ease-out"
        >
          {items.map((review, i) => (
            <article
              key={review.name}
              className="w-full shrink-0 px-1"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-extrabold text-base shadow-sm ${
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    }`}
                    aria-hidden="true"
                  >
                    {initials(review.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{review.name}</p>
                    <p className="text-xs text-slate-500 truncate">{review.location}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 ring-1 ring-emerald-200">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12l6.8-6.8a1 1 0 011.4.1z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote>
                  <p className="text-slate-700 leading-relaxed text-base">&ldquo;{review.text}&rdquo;</p>
                </blockquote>

                <p className="mt-4 inline-block text-xs bg-primary-100 text-primary-800 font-medium px-2.5 py-1 rounded-full">
                  {review.service}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2" aria-label="Select testimonial">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-primary-500" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
