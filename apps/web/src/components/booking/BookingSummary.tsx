"use client";

import Link from "next/link";
import { useBooking } from "@/lib/booking-store";
import { getBookingServiceOptionForState } from "@/lib/booking-service-options";
import { PriceExplainerLink } from "./PriceExplainerLink";

export interface BookingSummaryProps {
  compact?: boolean;
  collapsible?: boolean;
}

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Europe/London",
});

const SLOT_LABELS = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
} as const;

function shortAddress(address: string): string {
  return address.length > 72 ? `${address.slice(0, 69)}...` : address;
}

function floorLabel(floor: number, hasLift: boolean): string {
  const level = floor === 0 ? "Ground floor" : `Floor ${floor}`;
  return `${level}, ${hasLift ? "lift available" : "no lift"}`;
}

export function BookingSummary({ compact = false, collapsible = false }: BookingSummaryProps) {
  const { state, dispatch } = useBooking();
  const serviceOption = getBookingServiceOptionForState(state.entryServiceSlug, state.serviceSlug);
  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  const hasExtras = state.needsPacking || state.needsAssembly || state.helpersCount > 0;
  const visibleItems = state.items.slice(0, 3);
  const remainingItems = Math.max(state.items.length - visibleItems.length, 0);
  const dateLabel = state.selectedDate
    ? dateFormatter.format(new Date(`${state.selectedDate}T12:00:00Z`))
    : "";
  const slotLabel = state.selectedTimeSlot ? SLOT_LABELS[state.selectedTimeSlot] : "";

  const editBtn = "inline-flex min-h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-bold text-amber-400 transition hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
  const sectionDivider = "border-t border-amber-900/20 pt-3";

  const content = (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400/60">Booking summary</p>
          <p className="mt-1 text-2xl font-black text-white">
            {state.clientTotal > 0 ? money.format(state.clientTotal) : "Quote pending"}
          </p>
        </div>
        {state.quoteStatus && (
          <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold capitalize text-amber-400 ring-1 ring-amber-500/25">
            {state.quoteStatus}
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <section className={sectionDivider}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white/80">Service</h3>
            {state.serviceSlug && (
              <Link href="/#get-quote" className={editBtn}>Edit</Link>
            )}
          </div>
          <p className="mt-1 text-booking-body">{state.serviceName || "Not selected"}</p>
          {serviceOption && state.serviceSlug && (
            <p className="mt-1 text-xs font-semibold text-amber-400/50">{serviceOption.summaryNote}</p>
          )}
        </section>

        <section className={sectionDivider}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white/80">Journey</h3>
            {(state.pickup || state.dropoff) && (
              <button type="button" onClick={() => dispatch({ type: "SET_STEP", step: 2 })} className={editBtn}>Edit</button>
            )}
          </div>
          <div className="mt-1 space-y-1 text-booking-body">
            <p>From: {state.pickup ? shortAddress(state.pickup.address) : "Not confirmed"}</p>
            {state.pickup && <p>Pickup access: {floorLabel(state.pickupFloor, state.pickupHasLift)}</p>}
            <p>To: {state.dropoff ? shortAddress(state.dropoff.address) : "Not confirmed"}</p>
            {state.dropoff && <p>Drop-off access: {floorLabel(state.dropoffFloor, state.dropoffHasLift)}</p>}
            {state.distanceMiles > 0 && <p>{state.distanceMiles.toFixed(1)} miles</p>}
          </div>
        </section>

        <section className={sectionDivider}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white/80">Items and help</h3>
            {(totalItems > 0 || hasExtras) && (
              <button type="button" onClick={() => dispatch({ type: "SET_STEP", step: 3 })} className={editBtn}>Edit</button>
            )}
          </div>
          <p className="mt-1 text-booking-body">
            {totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? "s" : ""}` : "No items added"}
          </p>
          {visibleItems.length > 0 && (
            <ul className="mt-2 space-y-1 text-booking-body">
              {visibleItems.map((item) => (
                <li key={item.lineId ?? `${item.name}-${item.roomId ?? "default"}`}>
                  {item.quantity} x {item.name}{item.roomName ? `, ${item.roomName}` : ""}
                </li>
              ))}
              {remainingItems > 0 && <li>{remainingItems} more line{remainingItems > 1 ? "s" : ""}</li>}
            </ul>
          )}
          {hasExtras && (
            <ul className="mt-2 space-y-1 text-booking-body">
              {state.needsPacking && <li>Packing service</li>}
              {state.needsAssembly && <li>Assembly or disassembly</li>}
              {state.helpersCount > 0 && <li>{state.helpersCount} extra helper{state.helpersCount > 1 ? "s" : ""}</li>}
            </ul>
          )}
        </section>

        <section className={sectionDivider}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-white/80">Appointment</h3>
            {state.selectedDate && (
              <button type="button" onClick={() => dispatch({ type: "SET_STEP", step: 4 })} className={editBtn}>Edit</button>
            )}
          </div>
          <p className="mt-1 text-booking-body">
            {dateLabel && slotLabel ? `${dateLabel}, ${slotLabel}` : "Not selected"}
          </p>
        </section>
      </div>

      {state.priceBreakdown.length > 0 && (
        <div className="border-t border-amber-900/20 pt-4">
          <PriceExplainerLink />
        </div>
      )}
    </div>
  );

  if (collapsible) {
    return (
      <details className="rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15)" }}>
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold text-white">
          <span>Booking summary</span>
          <span className="text-amber-400">{state.clientTotal > 0 ? money.format(state.clientTotal) : "Open"}</span>
        </summary>
        <div className="border-t border-amber-900/20 p-4">{content}</div>
      </details>
    );
  }

  return (
    <aside
      className={`rounded-2xl p-5 ${compact ? "" : "sticky top-28"}`}
      style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 8px 32px rgba(0,0,0,0.4)" }}
    >
      {content}
    </aside>
  );
}
