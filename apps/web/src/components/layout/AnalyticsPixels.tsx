"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { initialiseAnalytics, isPublicAnalyticsPath, syncAnalyticsConsent, trackPageView } from "@/lib/analytics";
import { useCookieConsent } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export function AnalyticsPixels() {
  const consent = useCookieConsent();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "accepted" || !pathname || !isPublicAnalyticsPath(pathname)) {
      syncAnalyticsConsent(null);
      setReady(false);
      lastPage.current = null;
      return;
    }
    try {
      initialiseAnalytics(GA_ID, FB_PIXEL_ID);
    } catch {
      // A blocked tag must not interrupt booking or navigation.
      return;
    }
    setReady(true);
    if (pathname && lastPage.current !== pathname) {
      trackPageView(pathname);
      lastPage.current = pathname;
    }
  }, [consent, pathname]);

  // No third-party script request is made before an affirmative choice.
  if (consent !== "accepted" || !ready || !pathname || !isPublicAnalyticsPath(pathname)) return null;

  return (
    <>
      {GA_ID && (
        <Script
          id="ga-library"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
          strategy="afterInteractive"
        />
      )}
      {FB_PIXEL_ID && (
        <Script
          id="fb-pixel-library"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
