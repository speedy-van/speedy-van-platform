"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  EUROPEAN_COUNTRIES,
  PROPERTY_TYPES,
  NO_BEDROOMS_TYPES,
  FLEX_MONTHS,
  type PropertyType,
} from "@/lib/european";

interface FormState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fromAddress: string;
  propertyType: PropertyType;
  bedrooms: number;
  toCountry: string;
  toCity: string;
  preferredDate: string;
  flexibleDate: boolean;
  flexibleMonth: string;
  needsPacking: boolean;
  needsStorage: boolean;
  notes: string;
}

const todayPlus = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const initialState: FormState = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  fromAddress: "",
  propertyType: "House",
  bedrooms: 2,
  toCountry: "France",
  toCity: "",
  preferredDate: todayPlus(14),
  flexibleDate: false,
  flexibleMonth: "",
  needsPacking: false,
  needsStorage: false,
  notes: "",
};

export default function EuropeanEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDate = useMemo(() => todayPlus(7), []);
  const showBedrooms = !NO_BEDROOMS_TYPES.includes(form.propertyType);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName.trim(),
        customerEmail: form.customerEmail.trim(),
        customerPhone: form.customerPhone.trim(),
        fromAddress: form.fromAddress.trim(),
        propertyType: form.propertyType,
        bedrooms: showBedrooms ? form.bedrooms : 0,
        toCountry: form.toCountry,
        toCity: form.toCity.trim(),
        preferredDate: form.flexibleDate ? null : form.preferredDate,
        flexibleDate: form.flexibleDate,
        flexibleMonth: form.flexibleDate ? form.flexibleMonth || null : null,
        needsPacking: form.needsPacking,
        needsStorage: form.needsStorage,
        notes: form.notes.trim() || null,
      };
      const res = await api.post<{ enquiryId: string; message: string }>(
        "/enquiry/european",
        payload,
      );
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error ?? "Could not submit your enquiry.");
      }
    } catch (err) {
      console.error("[european-enquiry] submit failed:", err);
      setError(err instanceof Error ? err.message : "Could not submit your enquiry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        id="enquiry"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
      >
        <div className="text-4xl mb-3" aria-hidden="true">
          ✅
        </div>
        <h3 className="text-2xl font-extrabold text-emerald-900">
          Thanks — your enquiry is in
        </h3>
        <p className="mt-3 text-emerald-800 max-w-xl mx-auto">
          We&apos;ve received your details and emailed you a confirmation. One of
          our European removals specialists will send you a detailed,
          fixed-price quote within <strong>24 hours</strong>.
        </p>
        <p className="mt-4 text-sm text-emerald-700">
          Need to talk now? Call{" "}
          <a href="tel:01202129746" className="font-semibold underline">
            01202 129746
          </a>
          .
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5";
  const fieldsetClass =
    "rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4";
  const legendClass =
    "text-sm font-bold text-slate-900 uppercase tracking-wider px-2 -ml-2";

  return (
    <form
      id="enquiry"
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-labelledby="enquiry-heading"
      noValidate
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-3 mb-6">
          <div className="text-3xl" aria-hidden="true">
            📋
          </div>
          <div>
            <h3 id="enquiry-heading" className="text-2xl font-extrabold text-slate-900">
              Get Your Free European Move Quote
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              We&apos;ll respond within 24 hours with a detailed, fixed-price quote.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>Your details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cust-name" className={labelClass}>
                  Full name *
                </label>
                <input
                  id="cust-name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="cust-email" className={labelClass}>
                  Email *
                </label>
                <input
                  id="cust-email"
                  type="email"
                  required
                  maxLength={255}
                  value={form.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="cust-phone" className={labelClass}>
                  Phone *
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  pattern="[+()\-\s\d]{7,20}"
                  value={form.customerPhone}
                  onChange={(e) => update("customerPhone", e.target.value)}
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>Moving from (Scotland)</legend>
            <div>
              <label htmlFor="from-address" className={labelClass}>
                Address or city *
              </label>
              <input
                id="from-address"
                required
                value={form.fromAddress}
                onChange={(e) => update("fromAddress", e.target.value)}
                className={inputClass}
                placeholder="e.g. 12 High Street, Glasgow"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prop-type" className={labelClass}>
                  Property type *
                </label>
                <select
                  id="prop-type"
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType)}
                  className={inputClass}
                >
                  {PROPERTY_TYPES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              {showBedrooms && (
                <div>
                  <label className={labelClass}>Bedrooms *</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => update("bedrooms", Math.max(1, form.bedrooms - 1))}
                      className="h-10 w-10 rounded-lg border border-slate-300 text-lg font-bold text-slate-700 hover:bg-slate-50"
                      aria-label="Decrease bedrooms"
                    >
                      −
                    </button>
                    <input
                      readOnly
                      value={form.bedrooms >= 6 ? "6+" : String(form.bedrooms)}
                      className={`${inputClass} text-center font-bold`}
                      aria-label="Bedrooms"
                    />
                    <button
                      type="button"
                      onClick={() => update("bedrooms", Math.min(6, form.bedrooms + 1))}
                      className="h-10 w-10 rounded-lg border border-slate-300 text-lg font-bold text-slate-700 hover:bg-slate-50"
                      aria-label="Increase bedrooms"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>Moving to (Europe)</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="to-country" className={labelClass}>
                  Country *
                </label>
                <select
                  id="to-country"
                  value={form.toCountry}
                  onChange={(e) => update("toCountry", e.target.value)}
                  className={inputClass}
                >
                  {EUROPEAN_COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="to-city" className={labelClass}>
                  City or region *
                </label>
                <input
                  id="to-city"
                  required
                  value={form.toCity}
                  onChange={(e) => update("toCity", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Paris"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className={legendClass}>Move details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pref-date" className={labelClass}>
                  Preferred date
                </label>
                <input
                  id="pref-date"
                  type="date"
                  min={minDate}
                  disabled={form.flexibleDate}
                  value={form.preferredDate}
                  onChange={(e) => update("preferredDate", e.target.value)}
                  className={`${inputClass} ${form.flexibleDate ? "opacity-50" : ""}`}
                />
              </div>
              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.flexibleDate}
                    onChange={(e) => update("flexibleDate", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-400"
                  />
                  I&apos;m flexible on the date
                </label>
                {form.flexibleDate && (
                  <select
                    value={form.flexibleMonth}
                    onChange={(e) => update("flexibleMonth", e.target.value)}
                    className={inputClass}
                    aria-label="Flexible month"
                  >
                    <option value="">Anytime</option>
                    {FLEX_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        Anytime in {m}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.needsPacking}
                  onChange={(e) => update("needsPacking", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-400"
                />
                I need a packing service
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.needsStorage}
                  onChange={(e) => update("needsStorage", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-500 focus:ring-primary-400"
                />
                I need temporary storage
              </label>
            </div>
            <div>
              <label htmlFor="notes" className={labelClass}>
                Anything else we should know?
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={2000}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputClass} min-h-[100px]`}
                placeholder="Large items (piano, motorbike), parking restrictions, fragile items, anything else…"
              />
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-400 px-6 py-4 text-base font-extrabold text-slate-900 shadow-lg shadow-primary-400/20 transition-colors hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending…" : "Request Free Quote →"}
          </button>

          <p className="text-center text-xs text-slate-500">
            🔒 No spam. We&apos;ll only contact you about this quote.
          </p>
        </div>
      </div>
    </form>
  );
}
