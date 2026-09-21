"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "@/lib/auth-client";
import { DriverTopBar } from "@/components/driver/DriverTopBar";
import { DriverBottomNav } from "@/components/driver/DriverBottomNav";

export function DriverShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/driver/login";
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);

  useEffect(() => {
    // The sign-in page owns its validated return URL, including /jobs links.
    if (isLoginPage) return;

    if (!isAuthenticated()) {
      router.replace(`/driver/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    const user = getUser();
    if (user?.role !== "DRIVER") {
      router.replace("/driver/login");
      return;
    }
    setVerifiedPath(pathname);
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) return <>{children}</>;

  if (verifiedPath !== pathname) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
        <p role="status" className="text-sm text-white/70">Checking driver session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0A0A0A" }}>
      <DriverTopBar />
      <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
      <DriverBottomNav />
    </div>
  );
}
