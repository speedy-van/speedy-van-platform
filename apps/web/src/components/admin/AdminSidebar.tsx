"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, getUser } from "@/lib/auth-client";

const NAV = [
  { label: "Dashboard", icon: "▦", href: "/admin" },
  { label: "Bookings", icon: "📅", href: "/admin/bookings" },
  { label: "Drivers", icon: "👤", href: "/admin/drivers" },
  { label: "Pricing", icon: "£", href: "/admin/pricing" },
  { label: "Job Board", icon: "📋", href: "/admin/jobs" },
  { label: "Visitors", icon: "👁", href: "/admin/visitors" },
  { label: "Content", icon: "✏", href: "/admin/content" },
  { label: "Analytics", icon: "📊", href: "/admin/analytics" },
  { label: "Settings", icon: "⚙", href: "/admin/settings" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const user = getUser();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const content = (
    <div className="flex h-full flex-col" style={{ background: "#0F172A" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
        <span className="text-lg font-extrabold text-white leading-none">
          Speedy<span className="text-yellow-400">Van</span>
        </span>
        <span className="text-xs font-semibold text-slate-400 ml-1 border border-slate-600 rounded px-1.5 py-0.5">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-500/10 text-blue-400 border-l-[3px] border-blue-400 pl-[calc(0.75rem-3px)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-xs text-slate-500 mb-1 truncate">{user?.email}</p>
        <p className="text-sm font-medium text-white mb-3 truncate">{user?.name ?? "Admin"}</p>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          ← Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col" style={{ background: "#0F172A" }}>
        {content}
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex-col lg:hidden transition-transform duration-200 ${
          open ? "flex translate-x-0" : "flex -translate-x-full"
        }`}
        style={{ background: "#0F172A" }}
      >
        {content}
      </aside>
    </>
  );
}
