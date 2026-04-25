"use client";

import { useMemo, useState } from "react";

export interface Faq {
  question: string;
  answer: string;
}

function track(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    w.gtag?.("event", name, { event_category: "engagement", ...payload });
  } catch {
    /* ignore */
  }
  try {
    w.dataLayer?.push({ event: name, ...payload });
  } catch {
    /* ignore */
  }
}

export function FaqSearch({ faqs }: { faqs: Faq[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <>
      <div className="relative mb-5">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length === 3) track("faq_search", { length: 3 });
          }}
          placeholder="Search questions… (e.g. insurance, pricing, areas)"
          className="w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          aria-label="Search FAQs"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-8">
          No questions matched <span className="font-semibold text-slate-700">&ldquo;{query}&rdquo;</span>.{" "}
          <a href="tel:01202129746" className="text-primary-600 font-semibold hover:underline" data-track-event="call_click" data-track-location="faq_no_results">
            Call us instead →
          </a>
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => (
            <details
              key={faq.question}
              className="faq-item group bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 font-semibold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors">
                <span>{faq.question}</span>
                <svg
                  className="chevron w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-slate-600 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
