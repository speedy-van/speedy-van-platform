"use client";

import { CookieConsent } from "./CookieConsent";
import { AnalyticsPixels } from "./AnalyticsPixels";
import { BookingDetectionPopup } from "@/components/booking/BookingDetectionPopup";
import { BookingResumeNudge } from "@/components/BookingResumeNudge";
import { InstallPrompt } from "./InstallPrompt";
import { CtaClickTracker } from "@/components/CtaClickTracker";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
      <AnalyticsPixels />
      <CtaClickTracker />
      <BookingDetectionPopup />
      <BookingResumeNudge />
      <InstallPrompt />
    </>
  );
}
