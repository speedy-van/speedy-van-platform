import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/components/layout/GlobalProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env["NEXT_PUBLIC_BASE_URL"] ?? "https://speedy-van.co.uk"
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
    url: "https://speedy-van.co.uk",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedyVan | Man and Van & Removals Across Scotland",
    description:
      "Scotland's trusted man and van service. House moves, office relocations, and furniture deliveries across Glasgow, Edinburgh, Dundee, Aberdeen, and beyond.",
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
    canonical: "https://speedy-van.co.uk",
  },
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
      </body>
    </html>
  );
}
