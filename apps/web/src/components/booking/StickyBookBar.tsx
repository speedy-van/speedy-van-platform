"use client";

import Link from "next/link";

export function StickyBookBar() {
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      role="complementary"
      aria-label="Quick booking bar"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 leading-tight">Ready to move?</p>
          <p className="text-sm font-semibold text-slate-900 truncate">
            From £45 · Instant quote
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href="tel:+442012345678"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Call us"
          >
            <svg
              className="w-5 h-5"
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
          </a>
          <Link
            href="/book"
            className="btn-primary px-4 py-2.5 text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
