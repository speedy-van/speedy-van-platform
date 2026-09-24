"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiTruck, FiClipboard, FiMessageSquare, FiDollarSign } from "react-icons/fi";

const tabs = [
  { href: "/driver/dashboard", label: "Home", Icon: FiGrid },
  { href: "/jobs", label: "Available", Icon: FiClipboard },
  { href: "/driver/my-jobs", label: "My Jobs", Icon: FiTruck },
  { href: "/driver/earnings", label: "Earnings", Icon: FiDollarSign },
  { href: "/driver/messages", label: "Messages", Icon: FiMessageSquare },
];

export function DriverBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 flex z-30 safe-area-bottom" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(245,158,11,0.15)" }}>
      {tabs.map(({ href, label, Icon }) => {
        const active = href === "/jobs" ? pathname === "/jobs" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              active ? "text-amber-400" : "text-white/40 hover:text-white/60"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
