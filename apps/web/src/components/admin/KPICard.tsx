"use client";

import { useEffect, useRef, useState } from "react";

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  title: string;
  value: number;
  subtitle?: string;
  trend?: number; // percentage
  icon?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;
    function step(now: number) {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(eased * value);
      if (elapsed < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  const fmt = display.toFixed(decimals);

  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-2xl font-black text-white font-mono">
            {prefix}{fmt}{suffix}
          </p>
          {subtitle && <p className="text-xs text-white/40 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1">
          <span className={`text-xs font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-white/40">vs last month</span>
        </div>
      )}
    </div>
  );
}
