"use client";

import Link from "next/link";
import Image from "next/image";
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
      <header className="sticky top-0 z-30 border-b border-amber-900/25 bg-booking-background/95 backdrop-blur">
        <div className="mx-auto max-w-[1160px] px-4 py-3 sm:px-6">
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
              className="hidden sm:flex items-center gap-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-full"
            >
              <Image src="/call-icon.png" alt="Call us" width={44} height={44} priority />
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
