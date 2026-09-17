import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/components/layout/GlobalProviders";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { SITE_OG_IMAGE, SITE_URL } from "@/lib/seo/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env["NEXT_PUBLIC_BASE_URL"] ?? SITE_URL),
  title: {
    default: "SpeedyVan | Man and Van & Removals Across Scotland",
    template: "%s | SpeedyVan Scotland",
  },
  description:
    "Man and van, removals, office moves and furniture delivery across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness and beyond. Fixed prices and online booking.",
  openGraph: {
    type: "website",
    siteName: "SpeedyVan",
    locale: "en_GB",
    url: SITE_URL,
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180" },
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
  themeColor: "#FACC15",
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
    <html lang="en" className={inter.variable}>
      <body>
        <GlobalProviders>{children}</GlobalProviders>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
