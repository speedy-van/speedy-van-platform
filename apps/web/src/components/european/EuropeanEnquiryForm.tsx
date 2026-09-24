"use client";

import { useMemo, useRef, useState } from "react";
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

const inputStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 0 1px rgba(255,255,255,0.10)",
  color: "#FFFFFF",
};

export default function EuropeanEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitInFlight = useRef(false);

  const minDate = useMemo(() => todayPlus(7), []);
  const showBedrooms = !NO_BEDROOMS_TYPES.includes(form.propertyType);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitInFlight.current || !e.currentTarget.reportValidity()) return;
    if ([form.customerName, form.fromAddress, form.toCity].some((value) => value.trim().length < 2)) {
      setError("Enter your name, collection address and destination city using at least two characters each.");
      return;
    }
    if (!/^[+()\-\s\d]{7,20}$/.test(form.customerPhone.trim()) || form.customerPhone.replace(/\D/g, "").length < 7) {
      setError("Enter a valid contact phone number, including the country code where needed.");
      return;
    }
    if (!form.flexibleDate && (!form.preferredDate || form.preferredDate < minDate)) {
      setError("Choose an available future date or select flexible dates.");
      return;
    }
    submitInFlight.current = true;
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
      submitInFlight.current = false;
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        id="enquiry"
        className="rounded-2xl p-8 text-center"
        style={{ background: "rgba(16,185,129,0.08)", boxShadow: "0 0 0 1px rgba(16,185,129,0.20)" }}
      >
        <div className="text-4xl mb-3" aria-hidden="true">✅</div>
        <h3 className="text-2xl font-extrabold text-white">Thanks — your enquiry is in</h3>
        <p className="mt-3 text-white/70 max-w-xl mx-auto">
          We&apos;ve received your details and emailed you a confirmation. One of
          our European removals specialists will send you a detailed,
          fixed-price quote within <strong className="text-white">24 hours</strong>.
        </p>
        <div className="mt-5 flex flex-col items-center gap-2">
          <p className="text-sm text-white/50">Need to talk now?</p>
          <a
            href="tel:07909032889"
            aria-label="Call us on 07909 032889"
            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
          >
            <img src="/call-icon.png" alt="Call us" width={52} height={52} />
          </a>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg px-3 py-2.5 text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5";
  const fieldsetStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
  };
  const legendClass = "text-sm font-bold text-white uppercase tracking-wider px-2 -ml-2";

  return (
    <form
      id="enquiry"
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-labelledby="enquiry-heading"
    >
      <div
        className="rounded-2xl p-6 sm:p-8"
        style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(245,158,11,0.15)" }}
      >
        <div className="flex items-start gap-3 mb-6">
          <div className="text-3xl" aria-hidden="true">📋</div>
          <div>
            <h3 id="enquiry-heading" className="text-2xl font-extrabold text-white">
              Get Your Free European Move Quote
            </h3>
            <p className="mt-1 text-sm text-white/50">
              We&apos;ll respond within 24 hours with a detailed, fixed-price quote.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <fieldset className="rounded-xl p-5 sm:p-6 space-y-4" style={fieldsetStyle}>
            <legend className={legendClass}>Your details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cust-name" className={labelClass}>Full name *</label>
                <input
                  id="cust-name"
                  required
                  minLength={2}
                  maxLength={120}
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="cust-email" className={labelClass}>Email *</label>
                <input
                  id="cust-email"
                  type="email"
                  required
                  maxLength={255}
                  value={form.customerEmail}
                  onChange={(e) => update("customerEmail", e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  autoComplete="email"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="cust-phone" className={labelClass}>Phone *</label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  value={form.customerPhone}
                  onChange={(e) => update("customerPhone", e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  autoComplete="tel"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-xl p-5 sm:p-6 space-y-4" style={fieldsetStyle}>
            <legend className={legendClass}>Moving from (Scotland)</legend>
            <div>
              <label htmlFor="from-address" className={labelClass}>Address or city *</label>
              <input
                id="from-address"
                required
                value={form.fromAddress}
                onChange={(e) => update("fromAddress", e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="e.g. 12 High Street, Glasgow"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prop-type" className={labelClass}>Property type *</label>
                <select
                  id="prop-type"
                  value={form.propertyType}
                  onChange={(e) => update("propertyType", e.target.value as PropertyType)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {PROPERTY_TYPES.map((p) => (
                    <option key={p} value={p}>{p}</option>
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
                      className="h-10 w-10 rounded-lg text-lg font-bold text-white hover:bg-white/10 transition-colors"
                      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.15)" }}
                      aria-label="Decrease bedrooms"
                    >
                      −
                    </button>
                    <input
                      readOnly
                      value={form.bedrooms >= 6 ? "6+" : String(form.bedrooms)}
                      className={`${inputClass} text-center font-bold`}
                      style={inputStyle}
                      aria-label="Bedrooms"
                    />
                    <button
                      type="button"
                      onClick={() => update("bedrooms", Math.min(6, form.bedrooms + 1))}
                      className="h-10 w-10 rounded-lg text-lg font-bold text-white hover:bg-white/10 transition-colors"
                      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.15)" }}
                      aria-label="Increase bedrooms"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </fieldset>

          <fieldset className="rounded-xl p-5 sm:p-6 space-y-4" style={fieldsetStyle}>
            <legend className={legendClass}>Moving to (Europe)</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="to-country" className={labelClass}>Country *</label>
                <select
                  id="to-country"
                  value={form.toCountry}
                  onChange={(e) => update("toCountry", e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                >
                  {EUROPEAN_COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="to-city" className={labelClass}>City or region *</label>
                <input
                  id="to-city"
                  required
                  value={form.toCity}
                  onChange={(e) => update("toCity", e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="e.g. Paris"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-xl p-5 sm:p-6 space-y-4" style={fieldsetStyle}>
            <legend className={legendClass}>Move details</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="pref-date" className={labelClass}>Preferred date</label>
                <input
                  id="pref-date"
                  type="date"
                  min={minDate}
                  required={!form.flexibleDate}
                  disabled={form.flexibleDate}
                  value={form.preferredDate}
                  onChange={(e) => update("preferredDate", e.target.value)}
                  className={`${inputClass} ${form.flexibleDate ? "opacity-50" : ""}`}
                  style={inputStyle}
                />
              </div>
              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={form.flexibleDate}
                    onChange={(e) => update("flexibleDate", e.target.checked)}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                  I&apos;m flexible on the date
                </label>
                {form.flexibleDate && (
                  <select
                    value={form.flexibleMonth}
                    onChange={(e) => update("flexibleMonth", e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    aria-label="Flexible month"
                  >
                    <option value="">Anytime</option>
                    {FLEX_MONTHS.map((m) => (
                      <option key={m} value={m}>Anytime in {m}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.needsPacking}
                  onChange={(e) => update("needsPacking", e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                I need a packing service
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={form.needsStorage}
                  onChange={(e) => update("needsStorage", e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500"
                />
                I need temporary storage
              </label>
            </div>
            <div>
              <label htmlFor="notes" className={labelClass}>Anything else we should know?</label>
              <textarea
                id="notes"
                rows={4}
                maxLength={2000}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputClass} min-h-[100px]`}
                style={inputStyle}
                placeholder="Large items (piano, motorbike), parking restrictions, fragile items, anything else…"
              />
            </div>
          </fieldset>

          {error && (
            <p
              role="alert"
              className="rounded-lg p-3 text-sm text-red-300"
              style={{ background: "rgba(239,68,68,0.10)", boxShadow: "0 0 0 1px rgba(239,68,68,0.20)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-base font-black text-black shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)" }}
          >
            {submitting ? "Sending…" : "Request Free Quote →"}
          </button>

          <p className="text-center text-xs text-white/35">
            🔒 No spam. We&apos;ll only contact you about this quote.
          </p>
        </div>
      </div>
    </form>
  );
}
