"use client";

import { useState, type ReactNode } from "react";
import { useBooking } from "@/lib/booking-store";
import { STEP_PRIMARY_CTA_ID } from "@/lib/booking-steps";

export interface UpsellFlowProps {
  onComplete: () => void;
}

const SELECTED_CARD = {
  background: "rgba(245,158,11,0.12)",
  boxShadow: "0 0 0 1px rgba(245,158,11,0.35)",
};
const DEFAULT_CARD = {
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
};

const SLOT_LABELS: Record<string, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  }).format(new Date(`${iso}T12:00:00Z`));
}

type AssemblyType = "dismantle" | "assemble" | "both";

const ASSEMBLY_OPTIONS: {
  type: AssemblyType;
  label: string;
  description: string;
  unitPrice: number;
}[] = [
  {
    type: "dismantle",
    label: "Dismantling only",
    description: "We carefully dismantle the items you choose before loading.",
    unitPrice: 10,
  },
  {
    type: "assemble",
    label: "Assembly only",
    description: "We reassemble the items you choose at the new property.",
    unitPrice: 10,
  },
  {
    type: "both",
    label: "Dismantle + reassemble",
    description: "Full service — dismantle before loading and reassemble on arrival.",
    unitPrice: 20,
  },
];

export function UpsellFlow({ onComplete }: UpsellFlowProps) {
  const { state, dispatch } = useBooking();
  const [subStep, setSubStep] = useState(0);

  // Assembly: which type is selected + per-type item count
  const [assemblyType, setAssemblyType] = useState<AssemblyType | null>(null);
  const [assemblyQty, setAssemblyQty] = useState<Record<AssemblyType, number>>({
    dismantle: 1,
    assemble: 1,
    both: 1,
  });

  // Day-of extras: local only (informational, not yet in store)
  const [dayExtras, setDayExtras] = useState({
    upstairs: false,
    waiting: false,
    disposal: false,
  });

  const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

  function advance() {
    if (subStep < 3) {
      setSubStep((s) => s + 1);
    } else {
      onComplete();
    }
  }

  function changeAssemblyQty(type: AssemblyType, delta: number) {
    const newQty = Math.max(1, assemblyQty[type] + delta);
    setAssemblyQty((prev) => ({ ...prev, [type]: newQty }));
    if (assemblyType === type) {
      dispatch({ type: "SET_ASSEMBLY", value: true, assemblyType: type, assemblyQty: newQty });
    }
  }

  const hasHelper = state.helpersCount > 0;
  const hasAssembly = state.needsAssembly;
  const hasPacking = state.needsPacking;
  const hasDayExtra = dayExtras.upstairs || dayExtras.waiting || dayExtras.disposal;

  const selectedQty = assemblyType ? assemblyQty[assemblyType] : 0;
  const selectedUnitPrice = assemblyType
    ? (ASSEMBLY_OPTIONS.find((o) => o.type === assemblyType)?.unitPrice ?? 0)
    : 0;
  const assemblyTotal = selectedQty * selectedUnitPrice;

  const quoteSummary =
    state.clientTotal > 0 && state.selectedDate && state.selectedTimeSlot
      ? `${formatDateShort(state.selectedDate)}, ${SLOT_LABELS[state.selectedTimeSlot] ?? ""} · ${money.format(state.clientTotal)}`
      : state.clientTotal > 0
        ? money.format(state.clientTotal)
        : null;

  return (
    <section className="space-y-5">
      {/* Quote banner */}
      {quoteSummary && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5"
          style={{ background: "rgba(245,158,11,0.10)", boxShadow: "0 0 0 1px rgba(245,158,11,0.30)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400/70">Your quote</p>
            <p className="mt-1 font-black text-white">{quoteSummary}</p>
          </div>
          <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 ring-1 ring-amber-500/25">
            Optional extras · {subStep + 1} / 4
          </span>
        </div>
      )}

      {/* ── Sub-step 0: Extra helper ─────────────────────────────────── */}
      {subStep === 0 && (
        <UpsellStep
          heading="Make the move faster"
          subheading="Add one extra helper to reduce lifting time and make the job easier — especially for heavier items."
          nav={
            <UpsellNav
              hasSelection={hasHelper}
              continueLabel={hasHelper ? "Add extra helper and continue →" : "Continue →"}
              onContinue={advance}
              onSkip={() => {
                dispatch({ type: "SET_HELPERS", count: 0 });
                advance();
              }}
            />
          }
        >
          <OptionCard
            selected={hasHelper}
            label="Add another helper"
            description="Reduces lifting time — especially for heavier items or tight spaces."
            priceLabel="£45"
            priceUnit="per move"
            onClick={() => dispatch({ type: "SET_HELPERS", count: hasHelper ? 0 : 1 })}
          />
        </UpsellStep>
      )}

      {/* ── Sub-step 1: Assembly / dismantling ──────────────────────── */}
      {subStep === 1 && (
        <UpsellStep
          heading="Need assembly or dismantling?"
          subheading="Select which service you need, then choose how many items — only those items will be included."
          nav={
            <UpsellNav
              hasSelection={hasAssembly}
              continueLabel={
                hasAssembly
                  ? `Add for ${selectedQty} item${selectedQty !== 1 ? "s" : ""} (+£${assemblyTotal}) and continue →`
                  : "Continue →"
              }
              onContinue={advance}
              onSkip={() => {
                dispatch({ type: "SET_ASSEMBLY", value: false });
                setAssemblyType(null);
                advance();
              }}
            />
          }
        >
          {ASSEMBLY_OPTIONS.map(({ type, label, description, unitPrice }) => {
            const isSelected = assemblyType === type;
            const qty = assemblyQty[type];
            const total = qty * unitPrice;
            return (
              <OptionCard
                key={type}
                selected={isSelected}
                label={label}
                description={description}
                priceLabel={isSelected && qty > 1 ? `£${total}` : `£${unitPrice}`}
                priceUnit={isSelected && qty > 1 ? `${qty} items` : "per item"}
                onClick={() => {
                  const next = assemblyType === type ? null : type;
                  setAssemblyType(next);
                  dispatch({ type: "SET_ASSEMBLY", value: next !== null, assemblyType: next ?? undefined, assemblyQty: next ? assemblyQty[next] : undefined });
                }}
                footer={
                  <QtyRow
                    label="How many items?"
                    qty={qty}
                    onDecrement={() => changeAssemblyQty(type, -1)}
                    onIncrement={() => changeAssemblyQty(type, +1)}
                  />
                }
              />
            );
          })}
        </UpsellStep>
      )}

      {/* ── Sub-step 2: Packing & protection ────────────────────────── */}
      {subStep === 2 && (
        <UpsellStep
          heading="Protect your items"
          subheading="Extra care for fragile, valuable, or awkward items during the move."
          nav={
            <UpsellNav
              hasSelection={hasPacking}
              continueLabel={hasPacking ? "Add packing service and continue →" : "Continue →"}
              onContinue={advance}
              onSkip={() => {
                dispatch({ type: "SET_PACKING", value: false });
                advance();
              }}
            />
          }
        >
          <OptionCard
            selected={hasPacking}
            label="Packing service"
            description="We pack and wrap your items — bubble wrap, blankets, and secure sealing — before loading."
            priceLabel="from £10"
            priceUnit="per item"
            onClick={() => dispatch({ type: "SET_PACKING", value: !hasPacking })}
          />
        </UpsellStep>
      )}

      {/* ── Sub-step 3: Day-of extras ────────────────────────────────── */}
      {subStep === 3 && (
        <UpsellStep
          heading="Make it easier on the day"
          subheading="A few last options to take the stress out of moving day. We'll note these and confirm the details when we call."
          nav={
            <UpsellNav
              hasSelection={hasDayExtra}
              continueLabel={hasDayExtra ? "Note my requests and continue →" : "Continue to payment →"}
              onContinue={advance}
              onSkip={() => {
                setDayExtras({ upstairs: false, waiting: false, disposal: false });
                advance();
              }}
            />
          }
        >
          <OptionCard
            selected={dayExtras.upstairs}
            label="Carry items upstairs"
            description="Additional charge per floor above ground level."
            priceLabel="£10"
            priceUnit="per floor"
            onClick={() => setDayExtras((d) => ({ ...d, upstairs: !d.upstairs }))}
          />
          <OptionCard
            selected={dayExtras.waiting}
            label="Waiting time"
            description="If there are delays on the day — keys, lift access, and so on."
            priceLabel="£15"
            priceUnit="per 30 mins"
            onClick={() => setDayExtras((d) => ({ ...d, waiting: !d.waiting }))}
          />
          <OptionCard
            selected={dayExtras.disposal}
            label="Remove / dispose unwanted items"
            description="We take away items you no longer need."
            priceLabel="from £20"
            priceUnit="per item"
            onClick={() => setDayExtras((d) => ({ ...d, disposal: !d.disposal }))}
          />
        </UpsellStep>
      )}
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UpsellStep({
  heading,
  subheading,
  children,
  nav,
}: {
  heading: string;
  subheading: string;
  children: ReactNode;
  nav: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">{heading}</h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-amber-100/55">{subheading}</p>
      </div>
      <div className="space-y-3">{children}</div>
      {nav}
    </div>
  );
}

function OptionCard({
  selected,
  label,
  description,
  priceLabel,
  priceUnit,
  onClick,
  footer,
}: {
  selected: boolean;
  label: string;
  description: string;
  priceLabel: string;
  priceUnit: string;
  onClick: () => void;
  footer?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded-2xl p-5 text-left transition"
      style={selected ? SELECTED_CARD : DEFAULT_CARD}
    >
      <div className="flex items-start gap-4">
        <div
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition"
          style={
            selected
              ? { borderColor: "#F59E0B", background: "#F59E0B" }
              : { borderColor: "rgba(255,255,255,0.25)" }
          }
        >
          {selected && (
            <svg
              className="h-3 w-3 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-white">{label}</p>
          <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-black text-amber-400">{priceLabel}</p>
          <p className="text-xs text-amber-400/60">{priceUnit}</p>
        </div>
      </div>

      {/* Quantity row — only visible when selected, stops card toggle on click */}
      {selected && footer && (
        <div
          className="mt-4 border-t pt-4"
          style={{ borderColor: "rgba(245,158,11,0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {footer}
        </div>
      )}
    </button>
  );
}

function QtyRow({
  label,
  qty,
  onDecrement,
  onIncrement,
}: {
  label: string;
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-bold text-white/70">{label}</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrement}
          disabled={qty <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold text-white/70 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.08)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
          aria-label="Remove one item"
        >
          −
        </button>
        <span className="w-8 text-center text-base font-black text-white" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-black text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          style={{ background: "linear-gradient(135deg, #F59E0B, #EA580C)" }}
          aria-label="Add one item"
        >
          +
        </button>
      </div>
    </div>
  );
}

function UpsellNav({
  hasSelection,
  continueLabel,
  onContinue,
  onSkip,
}: {
  hasSelection: boolean;
  continueLabel: string;
  onContinue: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="space-y-3 pt-2">
      <button
        id={STEP_PRIMARY_CTA_ID}
        type="button"
        onClick={onContinue}
        className="min-h-12 w-full rounded-xl px-5 text-sm font-black text-black shadow-lg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
      >
        {continueLabel}
      </button>
      {hasSelection && (
        <div className="text-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-amber-400/55 underline underline-offset-2 transition hover:text-amber-400"
          >
            No thanks, continue without this
          </button>
        </div>
      )}
    </div>
  );
}
