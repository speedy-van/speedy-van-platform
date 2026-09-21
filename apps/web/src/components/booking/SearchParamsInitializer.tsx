"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useBooking } from "@/lib/booking-store";
import { resolveBookingService } from "@/lib/booking-service-options";

/** Apply recognised service links; direct visits and unknown slugs keep a usable form. */
export function SearchParamsInitializer() {
  const searchParams = useSearchParams();
  const { dispatch } = useBooking();
  const handledService = useRef<string | null>(null);
  const slug = searchParams.get("service");

  useEffect(() => {
    const service = resolveBookingService(slug);
    if (!service || handledService.current === slug) return;
    handledService.current = slug;

    dispatch({ type: "RESET" });
    dispatch({
      type: "SET_SERVICE",
      slug: service.serviceSlug,
      name: service.serviceName,
      sourceSlug: service.entryServiceSlug,
    });
    dispatch({ type: "SET_INVENTORY_MODE", mode: service.inventoryMode });
    dispatch({ type: "SET_STEP", step: 2 });
  }, [dispatch, slug]);

  return null;
}
