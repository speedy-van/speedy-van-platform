"use client";

import Image from "next/image";
import Link from "next/link";
import { haptic } from "@/lib/haptic";

export function StickyBookBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-slate-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      role="complementary"
      aria-label="Quick booking bar"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 leading-tight">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 align-middle animate-pulse" />
            Online quote
          </p>
          <p className="text-sm font-bold leading-tight text-stone-950">
            Based on your move
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/book"
            data-track-event="quote_click"
            data-track-location="sticky_bar"
            onClick={() => haptic(10)}
            className="inline-flex min-h-11 items-center rounded px-2 text-xs font-semibold text-slate-700 hover:text-slate-950 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Book online
          </Link>
          <a
            href="tel:07909032889"
            data-track-event="call_click"
            data-track-location="sticky_bar"
            onClick={() => haptic(10)}
            aria-label="Call us on 07909 032889"
            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
          >
            <Image src="/call-icon.png" alt="" width={44} height={44} sizes="44px" />
          </a>
        </div>
      </div>
    </div>
  );
}
