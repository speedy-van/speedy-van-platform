"use client";

import Link from "next/link";
import { BookingProvider, useBooking } from "@/lib/booking-store";
import { Step1Service } from "./Step1Service";
import { Step2Addresses } from "./Step2Addresses";
import { Step3Schedule } from "./Step3Schedule";
import { Step4Payment } from "./Step4Payment";

const STEPS = [
  { n: 1, label: "Service" },
  { n: 2, label: "Details" },
  { n: 3, label: "Schedule" },
  { n: 4, label: "Payment" },
];

function StepIndicator() {
  const { state } = useBooking();
  return (
    <div className="flex items-center gap-2 justify-center">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              state.step === s.n
                ? "bg-primary-400 text-slate-900"
                : state.step > s.n
                ? "bg-green-500 text-white"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {state.step > s.n ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s.n
            )}
          </div>
          <span
            className={`hidden sm:block text-sm font-medium ${
              state.step === s.n ? "text-slate-900" : "text-slate-500"
            }`}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-12 rounded ${
                state.step > s.n ? "bg-green-500" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FlowContent() {
  const { state } = useBooking();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 text-lg font-bold text-slate-900">
            ⚡ SpeedyVan
          </Link>
          <StepIndicator />
          <div className="w-24 shrink-0" />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {state.step === 1 && <Step1Service />}
        {state.step === 2 && <Step2Addresses />}
        {state.step === 3 && <Step3Schedule />}
        {state.step === 4 && <Step4Payment />}
      </main>
    </div>
  );
}

export function BookingFlow() {
  return (
    <BookingProvider>
      <FlowContent />
    </BookingProvider>
  );
}
