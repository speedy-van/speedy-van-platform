"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout, getUser } from "@/lib/auth-client";
import { FiLogOut, FiUser } from "react-icons/fi";

export function DriverTopBar({ title }: { title?: string }) {
  const router = useRouter();
  const user = getUser();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/driver/login");
  }

  return (
    <header className="sticky top-0 h-14 bg-[#0F172A] border-b border-slate-700 flex items-center px-4 z-20">
      <div className="flex-1">
        <span className="text-lg font-extrabold text-white">{title ?? "Speedy Van"}</span>
      </div>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-1"
        >
          <FiUser className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:block">{user?.name ?? user?.email}</span>
        </button>
        {open && (
          <div className="absolute right-0 top-10 bg-slate-800 border border-slate-700 rounded-xl shadow-xl w-44 py-1 z-30">
            <div className="px-3 py-2 border-b border-slate-700">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition-colors"
            >
              <FiLogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
