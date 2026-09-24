"use client";

import Image from "next/image";
import { useBooking } from "@/lib/booking-store";
import { STEP_PRIMARY_CTA_ID } from "@/lib/booking-steps";
import {
  BOOKING_SERVICE_OPTIONS,
  getBookingServiceOptionForState,
  getBookingServiceStartingFrom,
} from "@/lib/booking-service-options";
import { getServiceImage } from "@/lib/service-images";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function Step1Service() {
  const { state, dispatch } = useBooking();
  const selectedOption = getBookingServiceOptionForState(state.entryServiceSlug, state.serviceSlug);

  function choose(choice: (typeof BOOKING_SERVICE_OPTIONS)[number]) {
    const currentChoiceKey = selectedOption?.id ?? (state.entryServiceSlug || state.serviceSlug);
    if (currentChoiceKey && currentChoiceKey !== choice.id) {
      dispatch({ type: "SET_ITEMS", items: [] });
      dispatch({ type: "SET_BEDROOM_COUNT", bedroomCount: "", exactBedroomCount: 5 });
      dispatch({ type: "SET_INVENTORY_ROOMS", rooms: [] });
    }
    dispatch({
      type: "SET_SERVICE",
      slug: choice.serviceSlug,
      name: choice.label,
      sourceSlug: choice.id,
    });
    dispatch({
      type: "SET_INVENTORY_MODE",
      mode: choice.inventoryMode,
    });
    dispatch({ type: "SET_STEP", step: 2 });
  }

  function continueToJourney() {
    if (!state.serviceSlug) return;
    dispatch({ type: "SET_STEP", step: 2 });
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-amber-400">Start your quote</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-white">What do you need?</h1>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {BOOKING_SERVICE_OPTIONS.map((choice) => {
          const selected = selectedOption?.id === choice.id;
          const price = getBookingServiceStartingFrom(choice);

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice)}
              aria-pressed={selected}
              className={`group grid min-h-[186px] grid-cols-[minmax(0,1fr)_92px] gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 sm:grid-cols-[minmax(0,1fr)_112px] ${
                selected
                  ? "border-primary-400 bg-primary-50 ring-2 ring-primary-400/25"
                  : "border-slate-200 hover:border-primary-200 hover:shadow-md"
              }`}
            >
              <span className="flex min-w-0 flex-col">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-xl font-bold leading-tight text-stone-950">{choice.label}</span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      selected ? "border-primary-400 bg-primary-400 text-white" : "border-slate-300 bg-white text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4L8.5 12l6.8-6.8a1 1 0 011.4.1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </span>
                <span className="mt-2 text-sm leading-6 text-slate-600">{choice.description}</span>
                <span className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {choice.pathBadge}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                    {choice.scopeBadge}
                  </span>
                </span>
                {price !== null && (
                  <span className="mt-auto pt-4">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      From {money.format(price)}
                    </span>
                  </span>
                )}
              </span>
              <span className="relative min-h-28 overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={getServiceImage(choice.imageSlug)}
                  alt=""
                  fill
                  sizes="112px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </span>
            </button>
          );
        })}
      </div>

      <button
        id={STEP_PRIMARY_CTA_ID}
        type="button"
        onClick={continueToJourney}
        disabled={!state.serviceSlug}
        className="hidden min-h-12 w-full items-center justify-center rounded-xl bg-primary-400 px-5 text-base font-bold text-white shadow-sm transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:flex"
      >
        Continue
      </button>
    </section>
  );
}
