"use client";

import { CookieConsent } from "./CookieConsent";
import { AnalyticsPixels } from "./AnalyticsPixels";
import { BookingDetectionPopup } from "@/components/booking/BookingDetectionPopup";
import { BookingResumeNudge } from "@/components/BookingResumeNudge";
import { InstallPrompt } from "./InstallPrompt";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
      <AnalyticsPixels />
      <BookingDetectionPopup />
      <BookingResumeNudge />
      <InstallPrompt />
    </>
  );
}
