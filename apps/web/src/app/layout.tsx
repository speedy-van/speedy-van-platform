import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./typography.css";
import { GlobalProviders } from "@/components/layout/GlobalProviders";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { SITE_OG_IMAGE, SITE_OG_IMAGE_HEIGHT, SITE_OG_IMAGE_WIDTH, SITE_URL } from "@/lib/seo/constants";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const LOCALHOST_SW_CLEANUP_SCRIPT = `
(function () {
  try {
    var host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1" && host !== "::1") return;
    if (!("serviceWorker" in navigator)) return;

    var cleanupKey = "sv-local-sw-cleanup-v1";
    var cleanup = function () {
      var registrations = navigator.serviceWorker.getRegistrations
        ? navigator.serviceWorker.getRegistrations().then(function (items) {
            return Promise.all(items.map(function (registration) {
              return registration.unregister();
            }));
          })
        : Promise.resolve();

      var cacheCleanup = "caches" in window
        ? caches.keys().then(function (keys) {
            return Promise.all(keys
              .filter(function (key) { return key.indexOf("sv-") === 0; })
              .map(function (key) { return caches.delete(key); }));
          })
        : Promise.resolve();

      return Promise.all([registrations, cacheCleanup]);
    };

    if (navigator.serviceWorker.controller && sessionStorage.getItem(cleanupKey) !== "1") {
      sessionStorage.setItem(cleanupKey, "1");
      cleanup().then(function () {
        window.location.reload();
      }).catch(function () {
        window.location.reload();
      });
      return;
    }

    cleanup().catch(function () {});
  } catch (_) {}
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SpeedyVan | Man and Van & Removals Across Scotland",
    template: "%s | SpeedyVan",
  },
  description:
    "Man and van, removals, office moves and furniture delivery across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond. Fixed prices and online booking.",
  openGraph: {
    type: "website",
    siteName: "SpeedyVan",
    locale: "en_GB",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: SITE_OG_IMAGE_WIDTH,
        height: SITE_OG_IMAGE_HEIGHT,
        alt: "SpeedyVan – Man and Van & Removals Across Scotland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedyVan | Man and Van & Removals Across Scotland",
    description:
      "Man and van, removals, office moves and furniture delivery across Scotland with online quotes and booking.",
    images: [SITE_OG_IMAGE],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SpeedyVan",
    statusBarStyle: "default",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={manrope.variable} data-scroll-behavior="smooth">
      <body className="font-sans">
        {process.env.NODE_ENV !== "production" ? (
          <Script id="sv-local-sw-cleanup" strategy="beforeInteractive">
            {LOCALHOST_SW_CLEANUP_SCRIPT}
          </Script>
        ) : null}
        <GlobalProviders>{children}</GlobalProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
