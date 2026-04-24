"use client";

import { useState } from "react";
import Image from "next/image";
import { ITEMS_CATALOG } from "@/lib/items-catalog";
import type { SelectedItem } from "@/lib/booking-store";

interface ItemPickerProps {
  items: SelectedItem[];
  onChange: (items: SelectedItem[]) => void;
}

export function ItemPicker({ items, onChange }: ItemPickerProps) {
  const [activeSlug, setActiveSlug] = useState<string>(ITEMS_CATALOG[0]?.slug ?? "");
  const [search, setSearch] = useState("");

  const activeCat = ITEMS_CATALOG.find((c) => c.slug === activeSlug);

  const filteredItems = activeCat?.items.filter((item) =>
    search.trim() === "" ||
    item.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  function getQty(itemSlug: string): number {
    return items.find((i) => i.itemId === itemSlug)?.quantity ?? 0;
  }

  function setQty(itemSlug: string, itemName: string, qty: number) {
    const next = items.filter((i) => i.itemId !== itemSlug);
    if (qty > 0) next.push({ itemId: itemSlug, name: itemName, quantity: qty });
    onChange(next);
  }

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-slate-700">
          Items to move
        </label>
        {totalItems > 0 && (
          <span className="text-xs font-medium text-primary-600 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
            {totalItems} item{totalItems !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items…"
          className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
        {ITEMS_CATALOG.map((cat) => {
          const catQty = items
            .filter((i) => cat.items.some((ci) => ci.slug === i.itemId))
            .reduce((acc, i) => acc + i.quantity, 0);
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => { setActiveSlug(cat.slug); setSearch(""); }}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeSlug === cat.slug
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {catQty > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeSlug === cat.slug ? "bg-primary-400 text-slate-900" : "bg-slate-900 text-white"
                }`}>
                  {catQty}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-0.5">
        {filteredItems.map((item) => {
          const qty = getQty(item.slug);
          return (
            <div
              key={item.slug}
              className={`rounded-xl border overflow-hidden transition-all ${
                qty > 0
                  ? "border-primary-400 shadow-sm"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Image */}
              <div className="relative h-20 bg-slate-100">
                <Image
                  src={item.imagePath}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  unoptimized
                />
                {qty > 0 && (
                  <div className="absolute top-1 right-1 bg-primary-400 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {qty}
                  </div>
                )}
              </div>

              {/* Name + weight */}
              <div className="p-2">
                <p className="text-[11px] font-medium text-slate-900 leading-tight line-clamp-2 mb-1">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 mb-2">{item.weightKg} kg</p>

                {/* Qty controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.name, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="h-6 w-6 rounded-md bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-slate-900 w-5 text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(item.slug, item.name, qty + 1)}
                    className="h-6 w-6 rounded-md bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-3 py-6 text-center text-sm text-slate-400">
            No items found{search ? ` for "${search}"` : ""}.
          </div>
        )}
      </div>

      {/* Selected summary strip */}
      {totalItems > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {items.map((i) => (
            <span
              key={i.itemId}
              className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full"
            >
              {i.name} × {i.quantity}
              <button
                type="button"
                onClick={() => setQty(i.itemId!, i.name, 0)}
                className="text-slate-400 hover:text-red-500 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
