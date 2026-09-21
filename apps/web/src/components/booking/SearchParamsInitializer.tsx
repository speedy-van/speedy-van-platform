"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/booking-store";
import { resolveBookingService } from "@/lib/booking-service-options";

/** Apply recognised service links; direct visits and unknown slugs keep a usable form. */
export function SearchParamsInitializer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dispatch, ready } = useBooking();
  const handledService = useRef<string | null | undefined>(undefined);
  const slug = searchParams.get("service");

  useEffect(() => {
    if (!ready || handledService.current === slug) return;
    handledService.current = slug;
    const service = resolveBookingService(slug);
    if (!service || !slug) return;

    dispatch({ type: "APPLY_SERVICE_ENTRY", slug });
    // The service is an entry hint, not a later instruction to erase an edited draft.
    // Keep attribution and other query parameters, the hash and the current history entry.
    const remaining = new URLSearchParams(searchParams.toString());
    remaining.delete("service");
    const query = remaining.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`, { scroll: false });
  }, [dispatch, ready, router, searchParams, slug]);

  return null;
}
