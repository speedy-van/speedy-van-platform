"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number; // 0-100
  color?: "emerald" | "amber" | "crimson" | "blue";
  className?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  crimson: "bg-red-500",
  blue: "bg-blue-500",
};

export default function ProgressBar({ value, color = "blue", className = "" }: Props) {
  const [width, setWidth] = useState(0);
  const raf = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    raf.current = setTimeout(() => setWidth(Math.min(Math.max(value, 0), 100)), 50);
    return () => { if (raf.current) clearTimeout(raf.current); };
  }, [value]);

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${COLOR_CLASSES[color]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
