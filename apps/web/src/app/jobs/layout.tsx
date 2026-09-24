import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Driver Jobs",
  description: "Internal driver job board.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
