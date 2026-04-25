"use client";

import { useEffect, useState } from "react";

interface TypingHeroHeadingProps {
  prefix: string;
  highlight: string;
  /** Milliseconds per character */
  speed?: number;
  /** Delay before typing starts (ms) */
  startDelay?: number;
  /** Optional className for the wrapping <h1> */
  className?: string;
  id?: string;
}

/**
 * Animated hero heading:
 *  - Typewriter reveal for the full sentence
 *  - Shimmer + flowing gradient applied to the highlighted portion
 *
 * Respects `prefers-reduced-motion` by rendering the final text immediately
 * and disabling the looping shimmer animation.
 */
export default function TypingHeroHeading({
  prefix,
  highlight,
  speed = 55,
  startDelay = 250,
  className = "",
  id,
}: TypingHeroHeadingProps) {
  const fullText = `${prefix}${highlight}`;
  const [typedLength, setTypedLength] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setTypedLength(fullText.length);
      return;
    }
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = window.setTimeout(() => {
      interval = setInterval(() => {
        setTypedLength((prev) => {
          if (prev >= fullText.length) {
            if (interval) clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [fullText, speed, startDelay, reducedMotion]);

  const finished = typedLength >= fullText.length;
  const prefixShown = fullText.slice(0, Math.min(typedLength, prefix.length));
  const highlightShown = fullText.slice(prefix.length, typedLength);

  return (
    <h1 id={id} className={className} aria-label={fullText}>
      <span aria-hidden="true">{prefixShown}</span>
      <span
        aria-hidden="true"
        className={`hero-gradient-text ${finished && !reducedMotion ? "hero-gradient-text--shimmer" : ""}`}
      >
        {highlightShown}
      </span>
      {!finished && !reducedMotion && (
        <span className="hero-typing-caret" aria-hidden="true" />
      )}
    </h1>
  );
}
