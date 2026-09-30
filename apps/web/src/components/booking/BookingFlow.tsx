"use client";

import { Suspense } from "react";
import { BookingProvider, useBooking } from "@/lib/booking-store";
import { BookingShell } from "./BookingShell";
import { BookingServiceStep } from "./BookingServiceStep";
import { SearchParamsInitializer } from "./SearchParamsInitializer";
import { JourneyFields } from "./JourneyFields";
import { InventorySelector } from "./InventorySelector";
import { SchedulePicker } from "./SchedulePicker";
import { Step4Payment } from "./Step4Payment";

function FlowContent() {
  const { state, ready } = useBooking();
  const canShowBookingStep = ready && (!state.serviceSlug || state.step === 1);
  const canShowBookingShell =
    ready && Boolean(state.serviceSlug) && state.step >= 2 && state.step <= 5;

  return (
    <>
      {/* Always mount so recognised service links can initialise the flow. */}
      <Suspense fallback={null}>
        <SearchParamsInitializer />
      </Suspense>

      {(canShowBookingStep || canShowBookingShell) && (
        <BookingShell>
          {canShowBookingStep && <BookingServiceStep />}
          {state.step === 2 && <JourneyFields />}
          {state.step === 3 && <InventorySelector />}
          {state.step === 4 && <SchedulePicker />}
          {state.step === 5 && <Step4Payment />}
        </BookingShell>
      )}
    </>
  );
}

export function BookingFlow() {
  return (
    <BookingProvider>
      <FlowContent />
    </BookingProvider>
  );
}
