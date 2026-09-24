"use client";

import { trackAnalyticsEvent } from "@/lib/analytics";

import { useMemo, useState } from "react";

export interface Faq {
  question: string;
  answer: string;
}

function track(name: string, payload: Record<string, unknown> = {}) {
  trackAnalyticsEvent(name, { event_category: "engagement", ...payload });
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
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30"
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
          className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          style={{ background: "rgba(255,255,255,0.05)", boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
          aria-label="Search FAQs"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-center text-sm text-white/50">
            No questions matched <span className="font-semibold text-white/70">&ldquo;{query}&rdquo;</span>.
          </p>
          <a
            href="tel:07909032889"
            aria-label="Call us on 07909 032889"
            data-track-event="call_click"
            data-track-location="faq_no_results"
            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-full"
          >
            <img src="/call-icon.png" alt="Call us instead" width={52} height={52} />
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((faq) => (
            <details
              key={faq.question}
              className="faq-item group rounded-xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08)" }}
            >
              <summary className="flex items-center justify-between px-6 py-5 font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors">
                <span>{faq.question}</span>
                <svg
                  className="chevron w-5 h-5 text-white/30 shrink-0 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-white/55 leading-relaxed border-t border-white/8">{faq.answer}</div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
