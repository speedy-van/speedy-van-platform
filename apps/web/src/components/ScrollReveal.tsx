"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Enhance below-the-fold content only. Server-rendered content stays visible
 * without JavaScript, and content already in view never waits for animation.
 * Keep mobile content static to avoid layout work during hydration.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const skipReveal = window.matchMedia(
      "(prefers-reduced-motion: reduce), (max-width: 767px)",
    );

    if (skipReveal.matches || !("IntersectionObserver" in window)) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger > *"),
    );

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

    // Finish all layout reads before changing classes. Interleaving these
    // operations forces the browser to recalculate layout for every target.
    const viewportHeight = window.innerHeight;
    const offscreenTargets = targets.filter(
      (element) => element.getBoundingClientRect().top >= viewportHeight,
    );
    offscreenTargets.forEach((element) => {
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
      if (skipReveal.matches) revealAll();
    };
    skipReveal.addEventListener("change", onMotionChange);

    return () => {
      skipReveal.removeEventListener("change", onMotionChange);
      revealAll();
    };
  }, [pathname]);

  return null;
}
