"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { useBooking } from "@/lib/booking-store";
import { BookingProgress } from "./BookingProgress";
import { BookingSummary } from "./BookingSummary";
import { BookingActionBar } from "./BookingActionBar";

export interface BookingShellProps {
  children: ReactNode;
}

export function BookingShell({ children }: BookingShellProps) {
  const { state } = useBooking();
  const previousStep = useRef(state.step);

  useEffect(() => {
    if (previousStep.current === state.step) return;
    previousStep.current = state.step;

    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>("main h1");
      if (!heading) return;

      heading.setAttribute("tabindex", "-1");
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
      heading.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [state.step]);

  return (
    <div className="min-h-screen bg-booking-background text-booking-heading">
      <header className="sticky top-0 z-30 overflow-hidden border-b border-amber-500/25 bg-booking-background/95 backdrop-blur">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100 brightness-150 contrast-105 saturate-125"
          style={{
            backgroundImage: "url('/images/booking/booking-header-furniture.png')",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,0,0.72)_0%,rgba(5,4,0,0.36)_44%,rgba(5,4,0,0.16)_100%),linear-gradient(180deg,rgba(5,4,0,0.06)_0%,rgba(5,4,0,0.34)_100%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1160px] px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400" aria-hidden="true">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.2 2 4 13.1h6.6L9.9 22 20 9.7h-6.7L13.2 2Z" />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-bold text-white">SpeedyVan</span>
                <span className="block text-xs font-semibold text-amber-400/70">Secure online booking</span>
              </span>
            </Link>
            <a
              href="tel:07909032889"
              aria-label="Call us on 07909 032889"
              data-track-event="booking_shell_call_click"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-400 text-blue-700 shadow-lg shadow-black/35 ring-2 ring-white/70 transition-transform hover:scale-110 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-booking-background"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.91.33 1.79.62 2.63a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.23-1.23a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.63.62A2 2 0 0 1 22 16.92Z" />
              </svg>
            </a>
          </div>
          <div className="mt-4">
            <BookingProgress />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1160px] gap-6 px-4 py-6 pb-36 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:pb-32">
        <div className="lg:hidden">
          <BookingSummary collapsible />
        </div>
        <div className="min-w-0">{children}</div>
        <div className="hidden lg:block">
          <BookingSummary />
        </div>
      </main>

      <BookingActionBar />
    </div>
  );
}
