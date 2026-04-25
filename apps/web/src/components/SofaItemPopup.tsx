"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SEEN_KEY = "sv_sofa_popup_seen";
const DELAY_MS = 5_000;

interface QuickItem {
  id: string;
  label: string;
  imagePath: string;
  price: number;
  serviceSlug: string;
}

const QUICK_ITEMS: QuickItem[] = [
  {
    id: "sofa-2",
    label: "Sofa (2-seater)",
    imagePath: "/images/items/Living_room_Furniture/loveseat_2_seat_fabric_63inch_jpg_38kg.jpg",
    price: 55,
    serviceSlug: "furniture-delivery",
  },
  {
    id: "sofa-3",
    label: "Sofa (3-seater)",
    imagePath: "/images/items/Living_room_Furniture/sofa_3_seat_fabric_modern_lestar_jpg_48kg.jpg",
    price: 65,
    serviceSlug: "furniture-delivery",
  },
  {
    id: "double-bed",
    label: "Double bed",
    imagePath: "/images/items/Bedroom/double_bed_frame_florence_luxury_jpg_35kg.jpg",
    price: 60,
    serviceSlug: "furniture-delivery",
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    imagePath: "/images/items/Wardrobes_closet/wardrobe_double_door_harmony_wood_better_home_jpg_68kg.jpg",
    price: 70,
    serviceSlug: "furniture-delivery",
  },
  {
    id: "washing-machine",
    label: "Washing machine",
    imagePath: "/images/items/Kitchen_appliances/washing_machine_buying_guide_jpg_85kg.jpg",
    price: 50,
    serviceSlug: "man-and-van",
  },
  {
    id: "ikea-flatpack",
    label: "IKEA / flat-pack",
    imagePath: "/images/items/Bag_luggage_box/moving_boxes_8_best_top_moving_house_boxes_jpg_18kg.jpg",
    price: 45,
    serviceSlug: "ikea-delivery",
  },
];

const BASE_PRICE = 45;

const TRIGGER_PATHS = [
  "/",
  "/services/furniture-delivery",
  "/services/man-and-van",
  "/services/ikea-delivery",
  "/services/house-removal",
];

function track(items: string[], total: number) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", "item_popup_click", {
      event_category: "engagement",
      items: items.join(","),
      estimated_total: total,
    });
  } catch { /* ignore */ }
  try {
    w.dataLayer?.push({ event: "item_popup_click", items, estimated_total: total });
  } catch { /* ignore */ }
}

export function SofaItemPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname || !TRIGGER_PATHS.includes(pathname)) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch { /* ignore */ }

    const timer = window.setTimeout(() => {
      try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
      setVisible(true);
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function dismiss() { setVisible(false); }

  if (!visible) return null;

  const selectedItems = QUICK_ITEMS.filter((i) => selected.has(i.id));
  const hasItems = selectedItems.length > 0;
  const total = selectedItems.reduce((acc, i) => acc + i.price, BASE_PRICE);

  const hasFurniture = selectedItems.some((i) => i.serviceSlug === "furniture-delivery");
  const hasIkea = selectedItems.some((i) => i.serviceSlug === "ikea-delivery");
  const serviceSlug = hasFurniture ? "furniture-delivery" : hasIkea ? "ikea-delivery" : "man-and-van";
  const bookingHref = hasItems ? `/book?service=${serviceSlug}` : "/book?service=furniture-delivery";

  function handleBook() {
    if (hasItems) track(selectedItems.map((i) => i.id), total);
    dismiss();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sofa-popup-heading"
      className="fixed left-4 bottom-24 sm:bottom-6 z-50 w-[calc(100vw-2rem)] sm:w-80 rounded-2xl bg-white shadow-2xl border border-slate-200 p-4 animate-fade-in"
    >
      {/* Close */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
      >
        ×
      </button>

      {/* Header */}
      <div className="mb-3 pr-6">
        <p id="sofa-popup-heading" className="text-sm font-bold text-slate-900 leading-snug">
          Do you need to move a sofa or large item?
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">Tap your items — see an instant price.</p>
      </div>

      {/* Item grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-3" role="group" aria-label="Items to move">
        {QUICK_ITEMS.map((item) => {
          const isSelected = selected.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              aria-label={`${item.label}${isSelected ? " (selected)" : ""}`}
              className={`relative flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                isSelected
                  ? "border-primary-400 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Photo */}
              <div className="relative w-full h-16 bg-slate-100">
                <Image
                  src={item.imagePath}
                  alt={item.label}
                  fill
                  sizes="96px"
                  className="object-cover"
                  loading="lazy"
                  quality={60}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary-400/20" aria-hidden="true" />
                )}
                {isSelected && (
                  <span
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-400 text-[10px] font-extrabold text-slate-900 shadow"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </div>
              {/* Label + price */}
              <div className="px-1.5 pb-2 pt-1 text-center">
                <p className="text-[10px] font-semibold text-slate-700 leading-tight">{item.label}</p>
                <p className="text-[10px] font-bold text-primary-600">+£{item.price}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Price + CTA */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
        <div>
          {hasItems ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Estimated</p>
              <p className="text-2xl font-extrabold text-slate-900 leading-none">From £{total}</p>
            </>
          ) : (
            <p className="text-[11px] text-slate-400 italic">Select items above</p>
          )}
        </div>
        <Link
          href={bookingHref}
          onClick={handleBook}
          className="inline-flex items-center justify-center rounded-lg bg-primary-400 px-4 py-2.5 text-xs font-extrabold text-slate-900 hover:bg-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors shrink-0"
        >
          {hasItems ? "Book now \u2192" : "Get a quote \u2192"}
        </Link>
      </div>
    </div>
  );
}
