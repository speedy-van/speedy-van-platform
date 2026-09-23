"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBooking } from "@/lib/booking-store";
import { getBookingServiceOption } from "@/lib/booking-service-options";
import { SERVICES, getBookableService } from "@/lib/services";

const ROOM_PLANNER_DEFAULT_SOURCES = new Set([
  "house-removal",
  "flat-removals",
  "long-distance-removals",
  "small-moves",
]);

/**
 * Reads `?service=<slug>` from the URL on mount and pre-selects that service,
 * automatically advancing to step 2.
 *
 * Must be rendered inside <BookingProvider> and wrapped in <Suspense> by the
 * caller (Next.js 14 requirement for useSearchParams in a client component).
 */
export function SearchParamsInitializer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch } = useBooking();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const slug = searchParams.get("service");

    if (!slug) {
      // No service param — let any restored draft continue; if nothing, send to hero.
      // We check localStorage directly here so we don't depend on async hydration timing.
      try {
        const raw = localStorage.getItem("sv_booking_draft_v1");
        if (!raw) router.replace("/#get-quote");
      } catch {
        router.replace("/#get-quote");
      }
      return;
    }

    const match = SERVICES.find((s) => s.slug === slug);
    const intentMatch = getBookingServiceOption(slug);
    if (!match && !intentMatch) return;

    // A service slug is in the URL — always start fresh with it, clearing any old draft.
    dispatch({ type: "RESET" });

    if (intentMatch && !match) {
      dispatch({
        type: "SET_SERVICE",
        slug: intentMatch.serviceSlug,
        name: intentMatch.label,
        sourceSlug: intentMatch.id,
      });
      dispatch({ type: "SET_INVENTORY_MODE", mode: intentMatch.inventoryMode });
      dispatch({ type: "SET_STEP", step: 2 });
      return;
    }

    const bookableService = getBookableService(match!);
    const bookingOption = getBookingServiceOption(match!.slug) ?? getBookingServiceOption(bookableService.slug);

    dispatch({
      type: "SET_SERVICE",
      slug: bookableService.slug,
      name: match!.name,
      sourceSlug: bookingOption?.id ?? match!.slug,
    });
    dispatch({
      type: "SET_INVENTORY_MODE",
      mode: ROOM_PLANNER_DEFAULT_SOURCES.has(match!.slug)
        ? "rooms"
        : bookingOption?.inventoryMode ?? "items",
    });
    dispatch({ type: "SET_STEP", step: 2 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
