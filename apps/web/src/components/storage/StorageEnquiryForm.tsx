"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  STORAGE_DURATION_OPTIONS,
  STORAGE_PROPERTY_TYPES,
  STORAGE_UNIT_SIZE_OPTIONS,
  StorageEnquiryCreateSchema,
  type StorageDuration,
  type StorageEnquiryCreateInput,
  type StoragePropertyType,
  type StorageUnitSize,
} from "@speedy-van/shared";
import { trackAnalyticsEvent } from "@/lib/analytics";
import {
  newStorageEnquiryKey,
  parseStorageEnquiryDraft,
  redactedStorageAnalytics,
  serialiseStorageEnquiryDraft,
  STORAGE_ENQUIRY_API_BASE,
  STORAGE_ENQUIRY_DRAFT_KEY,
  STORAGE_ENQUIRY_RECEIPT_KEY,
  storageEnquiryReceiptFromApi,
  type StorageEnquiryReceipt,
} from "@/lib/storage-enquiry";

type YesNoUnknown = "" | "yes" | "no";
type DateChoice = "known" | "undecided";

type StorageEnquiryFormState = {
  idempotencyKey: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startChoice: DateChoice;
  storageStartDate: string;
  storageDuration: StorageDuration;
  estimatedUnitSize: StorageUnitSize;
  needsCollectionTransport: boolean;
  collectionAddress: string;
  collectionPostcode: string;
  propertyType: "" | StoragePropertyType;
  floor: string;
  hasLift: YesNoUnknown;
  carryDistanceMetres: string;
  narrowAccess: boolean;
  permitOrRestrictedParking: boolean;
  accessNotes: string;
  storageFacilityKnown: boolean;
  storageFacilityAddress: string;
  storageFacilityPostcode: string;
  needsReturnTransport: boolean;
  returnDestinationKnown: boolean;
  returnAddress: string;
  returnPostcode: string;
  returnDateChoice: DateChoice;
  returnDate: string;
  itemDescription: string;
  needsPacking: boolean;
  needsDismantling: boolean;
  notes: string;
};

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-base text-stone-950 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30";
const labelClass = "block text-sm font-bold text-stone-800";
const hintClass = "mt-1 text-xs leading-5 text-stone-500";

function createInitialForm(): StorageEnquiryFormState {
  return {
    idempotencyKey: newStorageEnquiryKey(),
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startChoice: "undecided",
    storageStartDate: "",
    storageDuration: "not_sure",
    estimatedUnitSize: "not_sure",
    needsCollectionTransport: true,
    collectionAddress: "",
    collectionPostcode: "",
    propertyType: "",
    floor: "",
    hasLift: "",
    carryDistanceMetres: "",
    narrowAccess: false,
    permitOrRestrictedParking: false,
    accessNotes: "",
    storageFacilityKnown: false,
    storageFacilityAddress: "",
    storageFacilityPostcode: "",
    needsReturnTransport: false,
    returnDestinationKnown: false,
    returnAddress: "",
    returnPostcode: "",
    returnDateChoice: "undecided",
    returnDate: "",
    itemDescription: "",
    needsPacking: false,
    needsDismantling: false,
    notes: "",
  };
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function nullableText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function sourceAttribution(): StorageEnquiryCreateInput["source"] {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return {
    page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    service: params.get("source") || params.get("service") || "storage",
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

function buildPayload(form: StorageEnquiryFormState): StorageEnquiryCreateInput {
  const returnTransportRequested = form.needsReturnTransport;
  const returnKnown = returnTransportRequested && form.returnDestinationKnown;

  return {
    idempotencyKey: form.idempotencyKey,
    firstName: form.firstName,
    lastName: nullableText(form.lastName),
    email: form.email,
    phone: form.phone,
    storageStart:
      form.startChoice === "known" && form.storageStartDate
        ? { kind: "known", date: form.storageStartDate }
        : { kind: "undecided" },
    storageDuration: form.storageDuration,
    estimatedUnitSize: form.estimatedUnitSize,
    needsCollectionTransport: form.needsCollectionTransport,
    collectionAddress: nullableText(form.collectionAddress),
    collectionPostcode: form.collectionPostcode,
    collectionAccess: {
      propertyType: form.propertyType || null,
      floor: numberOrNull(form.floor),
      hasLift: form.hasLift === "" ? null : form.hasLift === "yes",
      carryDistanceMetres: numberOrNull(form.carryDistanceMetres),
      narrowAccess: form.narrowAccess,
      permitOrRestrictedParking: form.permitOrRestrictedParking,
      accessNotes: nullableText(form.accessNotes),
    },
    storageFacilityKnown: form.storageFacilityKnown,
    storageFacility: form.storageFacilityKnown
      ? {
          address: nullableText(form.storageFacilityAddress),
          postcode: nullableText(form.storageFacilityPostcode),
        }
      : null,
    needsReturnTransport: returnTransportRequested,
    returnDestinationKnown: returnKnown,
    returnAddress: returnKnown ? nullableText(form.returnAddress) : null,
    returnPostcode: returnKnown ? nullableText(form.returnPostcode) : null,
    returnDate:
      returnTransportRequested && form.returnDateChoice === "known" && form.returnDate
        ? { kind: "known", date: form.returnDate }
        : returnTransportRequested
          ? { kind: "undecided" }
          : null,
    itemDescription: form.itemDescription,
    needsPacking: form.needsPacking,
    needsDismantling: form.needsDismantling,
    notes: nullableText(form.notes),
    source: sourceAttribution(),
  };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className={hintClass}>{hint}</span> : null}
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm font-semibold text-stone-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-500 focus:ring-amber-500"
      />
      <span>{label}</span>
    </label>
  );
}

export function StorageEnquiryForm() {
  const initialForm = useMemo(createInitialForm, []);
  const [form, setForm] = useState<StorageEnquiryFormState>(initialForm);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<StorageEnquiryReceipt | null>(null);

  useEffect(() => {
    try {
      setForm(parseStorageEnquiryDraft(localStorage.getItem(STORAGE_ENQUIRY_DRAFT_KEY), initialForm));
    } catch {
      setForm(initialForm);
    } finally {
      setHydrated(true);
    }
  }, [initialForm]);

  useEffect(() => {
    if (!hydrated || receipt) return;
    try {
      localStorage.setItem(STORAGE_ENQUIRY_DRAFT_KEY, serialiseStorageEnquiryDraft(form));
    } catch {
      // The form still works without local storage.
    }
  }, [form, hydrated, receipt]);

  function update<K extends keyof StorageEnquiryFormState>(key: K, value: StorageEnquiryFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = StorageEnquiryCreateSchema.safeParse(buildPayload(form));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? "Check the highlighted details and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${STORAGE_ENQUIRY_API_BASE}/enquiry/storage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await response.json().catch(() => null) as { success?: boolean; error?: string; data?: unknown } | null;
      if (!response.ok || !json?.success) {
        throw new Error(json?.error ?? "Could not send your storage enquiry. Please try again.");
      }
      const nextReceipt = storageEnquiryReceiptFromApi(json.data);
      if (!nextReceipt) throw new Error("The server response was incomplete. Please contact us if you do not receive confirmation.");

      setReceipt(nextReceipt);
      try {
        localStorage.removeItem(STORAGE_ENQUIRY_DRAFT_KEY);
        localStorage.setItem(STORAGE_ENQUIRY_RECEIPT_KEY, JSON.stringify(nextReceipt));
      } catch {
        // Receipt is visible on screen even if storage is blocked.
      }
      trackAnalyticsEvent("storage_enquiry_submit", {
        event_category: "lead",
        ...redactedStorageAnalytics(parsed.data),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your storage enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (receipt) {
    return (
      <section className="rounded-2xl border border-emerald-300 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="storage-receipt-heading">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">Enquiry received</p>
        <h2 id="storage-receipt-heading" className="mt-3 text-2xl font-black text-stone-950">
          Your storage quote request is with the team.
        </h2>
        <p className="mt-3 text-stone-700">
          Reference <strong>{receipt.reference}</strong>. We will review your storage timing, estimated load and access details before replying with a manual quote.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setReceipt(null);
              setForm(createInitialForm());
            }}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-950 px-5 text-sm font-black text-white hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
          >
            Send another enquiry
          </button>
          <Link
            href="/book?service=storage-transport"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-stone-300 px-5 text-sm font-black text-stone-800 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            Book storage transport only
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8" noValidate>
      <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-1 text-sm font-black uppercase tracking-[0.16em] text-amber-700">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputClass} autoComplete="given-name" required />
          </Field>
          <Field label="Last name" hint="Optional.">
            <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputClass} autoComplete="family-name" />
          </Field>
          <Field label="Email">
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} autoComplete="email" required />
          </Field>
          <Field label="Phone">
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} autoComplete="tel" required />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-1 text-sm font-black uppercase tracking-[0.16em] text-amber-700">Storage need</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Start timing">
            <select value={form.startChoice} onChange={(e) => update("startChoice", e.target.value as DateChoice)} className={inputClass}>
              <option value="undecided">Not decided yet</option>
              <option value="known">I have a date</option>
            </select>
          </Field>
          <Field label="Preferred start date">
            <input
              type="date"
              value={form.storageStartDate}
              onChange={(e) => update("storageStartDate", e.target.value)}
              className={inputClass}
              disabled={form.startChoice !== "known"}
            />
          </Field>
          <Field label="Expected duration">
            <select value={form.storageDuration} onChange={(e) => update("storageDuration", e.target.value as StorageDuration)} className={inputClass}>
              {STORAGE_DURATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Estimated amount to store" hint="A rough size is enough. The quote will be checked manually.">
          <select value={form.estimatedUnitSize} onChange={(e) => update("estimatedUnitSize", e.target.value as StorageUnitSize)} className={inputClass}>
            {STORAGE_UNIT_SIZE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        <Field label="What needs storing?" hint="Include furniture, boxes, bulky items, fragile items and anything heavy.">
          <textarea
            value={form.itemDescription}
            onChange={(e) => update("itemDescription", e.target.value)}
            rows={5}
            className={inputClass}
            required
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow label="Packing help may be needed" checked={form.needsPacking} onChange={(value) => update("needsPacking", value)} />
          <ToggleRow label="Dismantling or reassembly may be needed" checked={form.needsDismantling} onChange={(value) => update("needsDismantling", value)} />
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-1 text-sm font-black uppercase tracking-[0.16em] text-amber-700">Collection and access</legend>
        <ToggleRow label="I need SpeedyVan to collect the items for storage" checked={form.needsCollectionTransport} onChange={(value) => update("needsCollectionTransport", value)} />
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Collection address" hint="Full address if known.">
            <input value={form.collectionAddress} onChange={(e) => update("collectionAddress", e.target.value)} className={inputClass} autoComplete="street-address" />
          </Field>
          <Field label="Collection postcode">
            <input value={form.collectionPostcode} onChange={(e) => update("collectionPostcode", e.target.value)} className={inputClass} autoComplete="postal-code" required />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Property type">
            <select value={form.propertyType} onChange={(e) => update("propertyType", e.target.value as StorageEnquiryFormState["propertyType"])} className={inputClass}>
              <option value="">Not sure</option>
              {STORAGE_PROPERTY_TYPES.map((value) => <option key={value} value={value}>{value.replace("_", " ")}</option>)}
            </select>
          </Field>
          <Field label="Floor">
            <input inputMode="numeric" value={form.floor} onChange={(e) => update("floor", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Lift">
            <select value={form.hasLift} onChange={(e) => update("hasLift", e.target.value as YesNoUnknown)} className={inputClass}>
              <option value="">Not sure</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Carry distance (m)">
            <input inputMode="numeric" value={form.carryDistanceMetres} onChange={(e) => update("carryDistanceMetres", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow label="Narrow access, tight stairs or restricted loading" checked={form.narrowAccess} onChange={(value) => update("narrowAccess", value)} />
          <ToggleRow label="Permit, loading bay or parking restriction likely" checked={form.permitOrRestrictedParking} onChange={(value) => update("permitOrRestrictedParking", value)} />
        </div>
        <Field label="Access notes" hint="Gate codes, building rules, loading limits or opening hours.">
          <textarea value={form.accessNotes} onChange={(e) => update("accessNotes", e.target.value)} rows={3} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-1 text-sm font-black uppercase tracking-[0.16em] text-amber-700">Storage and return</legend>
        <ToggleRow label="I already know the storage facility" checked={form.storageFacilityKnown} onChange={(value) => update("storageFacilityKnown", value)} />
        {form.storageFacilityKnown ? (
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <Field label="Storage facility address">
              <input value={form.storageFacilityAddress} onChange={(e) => update("storageFacilityAddress", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Facility postcode">
              <input value={form.storageFacilityPostcode} onChange={(e) => update("storageFacilityPostcode", e.target.value)} className={inputClass} />
            </Field>
          </div>
        ) : null}
        <ToggleRow label="I may need return delivery later" checked={form.needsReturnTransport} onChange={(value) => update("needsReturnTransport", value)} />
        {form.needsReturnTransport ? (
          <div className="space-y-4">
            <ToggleRow label="I know the return destination" checked={form.returnDestinationKnown} onChange={(value) => update("returnDestinationKnown", value)} />
            {form.returnDestinationKnown ? (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <Field label="Return address">
                  <input value={form.returnAddress} onChange={(e) => update("returnAddress", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Return postcode">
                  <input value={form.returnPostcode} onChange={(e) => update("returnPostcode", e.target.value)} className={inputClass} />
                </Field>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Return timing">
                <select value={form.returnDateChoice} onChange={(e) => update("returnDateChoice", e.target.value as DateChoice)} className={inputClass}>
                  <option value="undecided">Not decided yet</option>
                  <option value="known">I have a date</option>
                </select>
              </Field>
              <Field label="Return date">
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => update("returnDate", e.target.value)}
                  className={inputClass}
                  disabled={form.returnDateChoice !== "known"}
                />
              </Field>
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <legend className="px-1 text-sm font-black uppercase tracking-[0.16em] text-amber-700">Anything else</legend>
        <Field label="Notes" hint="Timing constraints, valuation concerns, photos you can send later, or anything the team should know.">
          <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={4} className={inputClass} />
        </Field>
      </fieldset>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-stone-700">
          This sends a manual quote request only. No booking is created and no payment is taken.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-stone-950 px-6 text-sm font-black text-white hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Request storage quote"}
        </button>
      </div>
    </form>
  );
}
