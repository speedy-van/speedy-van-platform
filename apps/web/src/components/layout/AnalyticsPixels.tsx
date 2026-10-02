"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { GOOGLE_ADS_ID, googleTagBootstrapScript, initialiseAnalytics, isPublicAnalyticsPath, prepareGoogleTag, syncAnalyticsConsent, trackPageView } from "@/lib/analytics";
import { useCookieConsent } from "./CookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA4_ID;
// The paid-booking destination owns the shared loader; GA4 is configured separately.
const GOOGLE_TAG_ID = GOOGLE_ADS_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

const GOOGLE_TAG_BOOTSTRAP = googleTagBootstrapScript(GOOGLE_TAG_ID);

export function AnalyticsPixels() {
  const consent = useCookieConsent();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const lastPage = useRef<string | null>(null);
  const isPublicPath = Boolean(pathname && isPublicAnalyticsPath(pathname));

  useEffect(() => {
    if (!pathname || !isPublicAnalyticsPath(pathname)) {
      syncAnalyticsConsent(null);
      setReady(false);
      lastPage.current = null;
      return;
    }

    try {
      prepareGoogleTag();
    } catch {
      // A blocked Google tag must not interrupt booking or navigation.
    }

    if (consent !== "accepted") {
      syncAnalyticsConsent(consent);
      setReady(false);
      lastPage.current = null;
      return;
    }

    try {
      initialiseAnalytics(GA_ID, FB_PIXEL_ID);
    } catch {
      // A blocked optional provider must not interrupt booking or navigation.
      return;
    }
    setReady(true);
    if (pathname && lastPage.current !== pathname) {
      trackPageView(pathname);
      lastPage.current = pathname;
    }
  }, [consent, pathname]);

  if (!isPublicPath) return null;

  return (
    <>
      {GOOGLE_TAG_ID && (
        <>
          <Script id="google-tag-bootstrap" strategy="afterInteractive">
            {GOOGLE_TAG_BOOTSTRAP}
          </Script>
          <Script
            id="google-tag-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_TAG_ID)}`}
            strategy="afterInteractive"
          />
        </>
      )}
      {consent === "accepted" && ready && FB_PIXEL_ID && (
        <Script
          id="fb-pixel-library"
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
