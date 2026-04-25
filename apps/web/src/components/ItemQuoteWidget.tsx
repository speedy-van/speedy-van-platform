"use client";

import { useState } from "react";
import Link from "next/link";

interface QuickItem {
  id: string;
  label: string;
  icon: string;
  /** Price contribution on top of the base charge. */
  price: number;
  /** Which booking service slug this item best maps to. */
  serviceSlug: string;
}

const QUICK_ITEMS: QuickItem[] = [
  { id: "sofa-2", label: "Sofa (2-seater)", icon: "🛋️", price: 55, serviceSlug: "furniture-delivery" },
  { id: "sofa-3", label: "Sofa (3-seater)", icon: "🛋️", price: 65, serviceSlug: "furniture-delivery" },
  { id: "double-bed", label: "Double bed", icon: "🛏️", price: 60, serviceSlug: "furniture-delivery" },
  { id: "wardrobe", label: "Wardrobe", icon: "🚪", price: 70, serviceSlug: "furniture-delivery" },
  { id: "washing-machine", label: "Washing machine", icon: "🌀", price: 50, serviceSlug: "man-and-van" },
  { id: "ikea-flatpack", label: "IKEA / flat-pack", icon: "📦", price: 45, serviceSlug: "ikea-delivery" },
];

const BASE_PRICE = 45; // van + driver base

function track(items: string[], total: number) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", "item_quote_click", {
      event_category: "engagement",
      items: items.join(","),
      estimated_total: total,
    });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: "item_quote_click", items, estimated_total: total });
  } catch {
    /* ignore */
  }
}

/**
 * Homepage widget: pick items → see instant price estimate → go to pre-filled
 * booking flow.  Uses local arithmetic only — no API calls required.
 */
export function ItemQuoteWidget() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedItems = QUICK_ITEMS.filter((i) => selected.has(i.id));
  const total = selectedItems.reduce((acc, i) => acc + i.price, BASE_PRICE);
  const hasItems = selectedItems.length > 0;

  // Choose service: favour furniture-delivery if any furniture is selected;
  // fall back to the first selected item's service, then man-and-van.
  const hasFurniture = selectedItems.some((i) => i.serviceSlug === "furniture-delivery");
  const hasIkea = selectedItems.some((i) => i.serviceSlug === "ikea-delivery");
  const serviceSlug = hasFurniture
    ? "furniture-delivery"
    : hasIkea
    ? "ikea-delivery"
    : "man-and-van";

  const bookingHref = hasItems ? `/book?service=${serviceSlug}` : "/book";

  function handleBookClick() {
    if (hasItems) {
      track(
        selectedItems.map((i) => i.id),
        total,
      );
    }
  }

  return (
    <section
      id="item-quote"
      className="py-16 sm:py-20 bg-amber-50"
      aria-labelledby="item-quote-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-700 ring-1 ring-primary-400/40">
            <span aria-hidden="true">🛋️</span> Quick Item Quote
          </span>
          <h2
            id="item-quote-heading"
            className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900"
          >
            What are you moving?
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Tap your items for an instant price — no sign-up needed.
          </p>
        </div>

        <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200 p-5 sm:p-8">
          {/* Item grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
            role="group"
            aria-label="Select items to move"
          >
            {QUICK_ITEMS.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-label={`${item.label}${isSelected ? " (selected)" : ""}`}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 sm:p-4 text-center transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 ${
                    isSelected
                      ? "border-primary-400 bg-primary-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {isSelected && (
                    <span
                      className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-400 text-[10px] font-extrabold text-slate-900"
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl leading-none" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-bold text-primary-600">
                    +£{item.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Estimate + CTA row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <div>
              {hasItems ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Estimated price
                  </p>
                  <p className="text-4xl font-extrabold text-slate-900 leading-none mt-0.5">
                    From £{total}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Includes driver &amp; van · Final price confirmed on booking
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Select one or more items above to see an estimate.
                </p>
              )}
            </div>

            <Link
              href={bookingHref}
              onClick={handleBookClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-400 px-7 py-3.5 text-sm font-extrabold text-slate-900 shadow-sm hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 shrink-0"
            >
              {hasItems ? "Book collection →" : "Get a full quote →"}
            </Link>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Price estimates are indicative. Exact quote confirmed during booking based on your postcodes and floors.
        </p>
      </div>
    </section>
  );
}
