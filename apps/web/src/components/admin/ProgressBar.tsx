"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value: number; // 0-100
  color?: "emerald" | "primary" | "crimson" | "amber";
  className?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-400",
  primary: "bg-amber-400",
  crimson: "bg-red-500",
  amber: "bg-amber-400",
};

export default function ProgressBar({ value, color = "amber", className = "" }: Props) {
  const [width, setWidth] = useState(0);
  const raf = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    raf.current = setTimeout(() => setWidth(Math.min(Math.max(value, 0), 100)), 50);
    return () => { if (raf.current) clearTimeout(raf.current); };
  }, [value]);

  return (
    <div className={`w-full bg-white/8 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${COLOR_CLASSES[color]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
