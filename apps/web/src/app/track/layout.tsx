import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Delivery | SpeedyVan",
  description: "Track your SpeedyVan booking in real time.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
