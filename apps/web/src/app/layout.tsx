import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./typography.css";
import { GlobalProviders } from "@/components/layout/GlobalProviders";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { SITE_OG_IMAGE, SITE_URL } from "@/lib/seo/constants";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

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
        width: 1200,
        height: 630,
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
  icons: {
    icon: [
      { url: "/logo.png?v=amber-20260921-1", sizes: "any" },
    ],
    apple: [
      { url: "/logo.png?v=amber-20260921-1", sizes: "180x180" },
    ],
  },
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
    <html lang="en" className={manrope.variable}>
      <body className="font-sans">
        <GlobalProviders>{children}</GlobalProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
