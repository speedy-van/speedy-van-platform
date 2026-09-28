"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedTrustNumberProps {
  finalText: string;
  target?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  delayMs?: number;
  className?: string;
}

function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

export function AnimatedTrustNumber({
  finalText,
  target,
  prefix = "",
  suffix = "",
  durationMs = 2800,
  delayMs = 0,
  className,
}: AnimatedTrustNumberProps) {
  const [value, setValue] = useState(0);
  const [ready, setReady] = useState(target === undefined);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (target === undefined) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setValue(target);
      setReady(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    let delayTimer: number | null = null;
    let startedAt = 0;
    let hasStarted = false;

    const animate = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / durationMs);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    const start = () => {
      if (hasStarted) return;
      hasStarted = true;
      setReady(true);
      setValue(0);
      delayTimer = window.setTimeout(() => {
        frame = window.requestAnimationFrame(animate);
      }, delayMs);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
      start();
    }

    return () => {
      observer.disconnect();
      if (delayTimer) window.clearTimeout(delayTimer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [delayMs, durationMs, target]);

  return (
    <span ref={ref} className={className} aria-label={finalText}>
      {target === undefined || !ready ? finalText : `${prefix}${value}${suffix}`}
    </span>
  );
}
