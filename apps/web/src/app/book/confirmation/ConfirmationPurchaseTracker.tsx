"use client";

import { useEffect } from "react";
import { hasAnalyticsConsent, subscribeCookieConsent, trackPurchase } from "@/lib/analytics";

const PURCHASE_RECOVERY_LAST_KEY = "sv-purchase-recovery:last";

interface ConfirmationPurchaseTrackerProps {
  reference: string;
}

interface StoredPurchase {
  bookingRef: string;
  totalPrice: number;
  serviceSlug: string;
  email?: string;
  phone?: string;
}

function purchaseRecoveryKey(bookingRef: string) {
  return `sv-purchase-recovery:${bookingRef}`;
}

function parseStoredPurchase(value: string | null, reference: string): StoredPurchase | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<StoredPurchase>;
    if (parsed.bookingRef !== reference) return null;
    if (!parsed.serviceSlug || typeof parsed.serviceSlug !== "string") return null;
    if (!Number.isFinite(parsed.totalPrice) || Number(parsed.totalPrice) <= 0) return null;
    return {
      bookingRef: parsed.bookingRef,
      totalPrice: Number(parsed.totalPrice),
      serviceSlug: parsed.serviceSlug,
      email: typeof parsed.email === "string" ? parsed.email : undefined,
      phone: typeof parsed.phone === "string" ? parsed.phone : undefined,
    };
  } catch {
    return null;
  }
}

function readStoredPurchase(reference: string): StoredPurchase | null {
  try {
    return parseStoredPurchase(localStorage.getItem(purchaseRecoveryKey(reference)), reference)
      ?? parseStoredPurchase(localStorage.getItem(PURCHASE_RECOVERY_LAST_KEY), reference);
  } catch {
    return null;
  }
}

function clearStoredPurchase(reference: string) {
  try {
    localStorage.removeItem(purchaseRecoveryKey(reference));
    const latest = parseStoredPurchase(localStorage.getItem(PURCHASE_RECOVERY_LAST_KEY), reference);
    if (latest) localStorage.removeItem(PURCHASE_RECOVERY_LAST_KEY);
  } catch {
    /* Storage cleanup is optional. */
  }
}

export function ConfirmationPurchaseTracker({ reference }: ConfirmationPurchaseTrackerProps) {
  useEffect(() => {
    if (!reference) return undefined;

    const attemptTracking = () => {
      const stored = readStoredPurchase(reference);
      if (!stored || !hasAnalyticsConsent()) return;
      trackPurchase(stored.bookingRef, stored.totalPrice, stored.serviceSlug, {
        email: stored.email,
        phone: stored.phone,
      });
      clearStoredPurchase(reference);
    };

    attemptTracking();
    const retryTimer = window.setTimeout(attemptTracking, 1200);
    const unsubscribe = subscribeCookieConsent(attemptTracking);

    return () => {
      window.clearTimeout(retryTimer);
      unsubscribe();
    };
  }, [reference]);

  return null;
}
