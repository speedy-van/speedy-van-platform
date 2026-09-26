"use client";

import Image from "next/image";
import Link from "next/link";
import { haptic } from "@/lib/haptic";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function StickyBookBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      role="complementary"
      aria-label="Quick booking bar"
      style={{
        background: "rgba(10,9,0,0.96)",
        borderTop: "1px solid rgba(245,158,11,0.15)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-400 leading-tight">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 align-middle" />
            Online quote
          </p>
          <p className="text-sm font-bold text-white truncate">
            <span
              className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-extrabold mr-1 text-black"
              style={{ background: "linear-gradient(90deg, #F59E0B, #EA580C)" }}
            >
              From {money.format(45)}
            </span>
            Instant quote
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/book"
            data-track-event="quote_click"
            data-track-location="sticky_bar"
            onClick={() => haptic(10)}
            className="text-[11px] font-medium text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
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
