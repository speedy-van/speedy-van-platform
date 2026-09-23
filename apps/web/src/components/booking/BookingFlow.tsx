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

function FlowContent() {
  const { state } = useBooking();

  return (
    <BookingShell>
      <Suspense fallback={null}>
        <SearchParamsInitializer />
      </Suspense>

      {state.step === 2 && <JourneyFields />}
      {state.step === 3 && <InventorySelector />}
      {state.step === 4 && <SchedulePicker />}
      {state.step === 5 && <Step4Payment />}
      <PriceDropToast />
    </BookingShell>
  );
}

export function BookingFlow() {
  return (
    <BookingProvider>
      <FlowContent />
    </BookingProvider>
  );
}
