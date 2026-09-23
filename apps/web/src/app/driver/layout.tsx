import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DriverShell } from "@/components/driver/DriverShell";

export const metadata: Metadata = {
  title: "Driver Portal",
  robots: { index: false, follow: false },
};

export default function DriverLayout({ children }: { children: ReactNode }) {
  return <DriverShell>{children}</DriverShell>;
}
