import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/components/layout/GlobalProviders";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_BASE_URL"] ?? "https://speedyvan.uk"
  ),
  title: {
    default: "SpeedyVan | Man and Van & Removals Across Scotland",
    template: "%s | SpeedyVan Scotland",
  },
  description:
    "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, Stirling, Inverness, and beyond. Fixed prices, fully insured, book online in minutes.",
  keywords: [
    "man and van Scotland",
    "removals Scotland",
    "removal company Scotland",
    "man with van Glasgow",
    "man with van Edinburgh",
    "removals Glasgow",
    "removals Edinburgh",
    "removals Dundee",
    "removals Aberdeen",
    "removals Inverness",
    "house removal Scotland",
    "office removals Scotland",
    "furniture delivery Scotland",
    "van hire Scotland",
    "moving company Scotland",
    "Scottish removals",
  ],
  openGraph: {
    type: "website",
    siteName: "SpeedyVan",
    locale: "en_GB",
    url: "https://speedyvan.uk",
    images: [
      {
        url: "https://speedyvan.uk/og-image.jpg",
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
      "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, and beyond.",
    images: ["https://speedyvan.uk/og-image.jpg"],
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
    canonical: "https://speedyvan.uk",
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
