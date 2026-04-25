/**
 * Tiny haptic helper. No-ops on unsupported environments (desktop, iOS Safari).
 * Safe to call from any client-component event handler.
 */
export function haptic(pattern: number | number[] = 10): void {
  if (typeof window === "undefined") return;
  const nav = window.navigator as Navigator & {
    vibrate?: (p: number | number[]) => boolean;
  };
  try {
    nav.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
