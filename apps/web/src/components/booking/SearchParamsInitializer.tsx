"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/booking-store";
import { SERVICES } from "@/lib/services";

/**
 * Reads `?service=<slug>` from the URL on mount and pre-selects that service,
 * automatically advancing to step 2.
 *
 * Must be rendered inside <BookingProvider> and wrapped in <Suspense> by the
 * caller (Next.js 14 requirement for useSearchParams in a client component).
 */
export function SearchParamsInitializer() {
  const searchParams = useSearchParams();
  const { state, dispatch } = useBooking();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    // Don't clobber a restored draft that already has a service selected.
    if (state.serviceSlug) return;

    const slug = searchParams.get("service");
    if (!slug) return;

    const match = SERVICES.find((s) => s.slug === slug);
    if (!match) return;

    ran.current = true;
    dispatch({ type: "SET_SERVICE", slug: match.slug, name: match.name });
    dispatch({ type: "SET_STEP", step: 2 });
  }, [searchParams, state.serviceSlug, dispatch]);

  return null;
}
