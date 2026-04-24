"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth-client";
import { DriverTopBar } from "@/components/driver/DriverTopBar";
import { DriverBottomNav } from "@/components/driver/DriverBottomNav";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/driver/login?returnUrl=/driver/dashboard");
      return;
    }
    const user = getUser();
    if (user?.role !== "DRIVER") {
      router.replace("/driver/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DriverTopBar />
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
      <DriverBottomNav />
    </div>
  );
}
