"use client";

import { Suspense } from "react";
import { BookingProvider, useBooking } from "@/lib/booking-store";
import { BookingShell } from "./BookingShell";
import { SearchParamsInitializer } from "./SearchParamsInitializer";
import { JourneyFields } from "./JourneyFields";
import { InventorySelector } from "./InventorySelector";
import { SchedulePicker } from "./SchedulePicker";
import { Step4Payment } from "./Step4Payment";
import { PriceDropToast } from "./PriceDropToast";
import { Step1Service } from "./Step1Service";

function FlowContent() {
  const { state } = useBooking();
  const canShowBookingShell = Boolean(state.serviceSlug) && state.step >= 2 && state.step <= 5;

  return (
    <>
      {/* Always mount so it can redirect to /#get-quote when no valid draft/service */}
      <Suspense fallback={null}>
        <SearchParamsInitializer />
      </Suspense>

      {canShowBookingShell && (
        <BookingShell>
          {state.step === 2 && <JourneyFields />}
          {state.step === 3 && <InventorySelector />}
          {state.step === 4 && <SchedulePicker />}
          {state.step === 5 && <Step4Payment />}
          <PriceDropToast />
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
