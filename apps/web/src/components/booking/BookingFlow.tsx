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
  const { state, ready } = useBooking();

  if (!ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 text-white">
        <p role="status">Loading your quote…</p>
      </main>
    );
  }

  return (
    <>
      {/* Consume recognised service hints after the provider has restored the draft. */}
      <Suspense fallback={null}>
        <SearchParamsInitializer />
      </Suspense>

      <BookingShell>
        {(state.step === 1 || !state.serviceSlug) && <Step1Service />}
        {state.step === 2 && <JourneyFields />}
        {state.step === 3 && <InventorySelector />}
        {state.step === 4 && <SchedulePicker />}
        {state.step === 5 && <Step4Payment />}
        <PriceDropToast />
      </BookingShell>
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
