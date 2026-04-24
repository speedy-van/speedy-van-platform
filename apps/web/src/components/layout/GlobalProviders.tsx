"use client";

import { CookieConsent } from "./CookieConsent";
import { AnalyticsPixels } from "./AnalyticsPixels";
import { BookingDetectionPopup } from "@/components/booking/BookingDetectionPopup";

export function GlobalProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CookieConsent />
      <AnalyticsPixels />
      <BookingDetectionPopup />
    </>
  );
}
