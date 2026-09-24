"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Enhance below-the-fold content only. Server-rendered content stays visible
 * without JavaScript, and content already in view never waits for animation.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger > *"),
    );

    if (motionPreference.matches || !("IntersectionObserver" in window)) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px 64px 0px", threshold: 0 },
    );

    targets.forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      element.classList.add("reveal-pending");
      io.observe(element);
    });

    const revealAll = () => {
      io.disconnect();
      targets.forEach((element) => {
        element.classList.remove("reveal-pending", "is-visible");
      });
    };
    const onMotionChange = () => {
      if (motionPreference.matches) revealAll();
    };
    motionPreference.addEventListener("change", onMotionChange);

    return () => {
      motionPreference.removeEventListener("change", onMotionChange);
      revealAll();
    };
  }, [pathname]);

  return null;
}
