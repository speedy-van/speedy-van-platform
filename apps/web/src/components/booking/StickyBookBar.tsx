"use client";

import Link from "next/link";
import { haptic } from "@/lib/haptic";

export function StickyBookBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      role="complementary"
      aria-label="Quick booking bar"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 leading-tight">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 align-middle animate-pulse" />
            Available now
          </p>
          <p className="text-sm font-bold text-slate-900 truncate">
            <span className="inline-flex items-center rounded-md bg-primary-400/90 text-slate-900 px-1.5 py-0.5 text-xs font-extrabold mr-1">
              From £45
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
            className="text-[11px] font-medium text-slate-400 hover:text-slate-700 underline underline-offset-2"
          >
            Book online
          </Link>
          <a
            href="tel:01202129746"
            data-track-event="call_click"
            data-track-location="sticky_bar"
            onClick={() => haptic(10)}
            className="cta-pulse inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
            aria-label="Call 01202 129746"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call now
          </a>
        </div>
      </div>
    </div>
  );
}
