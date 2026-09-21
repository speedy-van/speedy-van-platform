"use client";

import { usePathname } from "next/navigation";
import { logout, getUser } from "@/lib/auth-client";
import NotificationBell from "./NotificationBell";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/drivers": "Drivers",
  "/admin/pricing": "Pricing",
  "/admin/jobs": "Job Board",
  "/admin/visitors": "Visitors",
  "/admin/content": "Content",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

interface Props {
  onMenuClick: () => void;
}

export default function AdminTopBar({ onMenuClick }: Props) {
  const pathname = usePathname();
  const user = getUser();

  // Match longest prefix
  const title =
    Object.entries(TITLES)
      .filter(([path]) => pathname.startsWith(path))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Admin";

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-10" style={{ background: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(245,158,11,0.12)", backdropFilter: "blur(8px)" }}>
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-white/55 hover:text-white hover:bg-white/5"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-black text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-black text-sm font-black" style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}>
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <button
            onClick={logout}
            className="hidden sm:block text-sm text-white/55 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
