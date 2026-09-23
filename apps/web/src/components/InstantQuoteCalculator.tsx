"use client";

import { BOOKING_SERVICE_OPTIONS } from "@/lib/booking-service-options";
import { trackAnalyticsEvent } from "@/lib/analytics";

/** Start the existing quote flow; prices are calculated from the complete job. */
export function InstantQuoteCalculator() {
  return (
    <section id="instant-quote" className="bg-stone-950 py-16 text-white sm:py-20" aria-labelledby="instant-quote-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Your moving quote</p>
          <h2 id="instant-quote-heading" className="mt-3 text-2xl font-black sm:text-4xl">Get a quote for the move you need</h2>
          <p className="mt-3 text-stone-300">Add both addresses, your items and your date to see a quote based on the full job.</p>
        </div>
        <form
          action="/book"
          method="get"
          onSubmit={() => trackAnalyticsEvent("quote_click", { event_category: "engagement", location: "quote_starter" })}
          className="rounded-2xl border border-white/15 bg-white/5 p-5 sm:p-8"
        >
          <label htmlFor="iq-service" className="mb-2 block font-semibold">What are you moving?</label>
          <select id="iq-service" name="service" defaultValue="other" className="w-full rounded-lg border border-stone-500 bg-stone-900 px-4 py-3 text-base text-white focus:outline-none focus:ring-2 focus:ring-amber-400">
            {BOOKING_SERVICE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label} — {option.description}</option>)}
          </select>
          <p className="mt-4 text-sm leading-relaxed text-stone-300">Stairs, parking, crew size and load size can change the price. If a quote cannot be calculated, contact the team before booking.</p>
          <button type="submit" className="mt-6 inline-flex w-full justify-center rounded-lg bg-amber-400 px-6 py-3 font-bold text-stone-950 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:w-auto">Continue to your quote</button>
        </form>
      </div>
    </section>
  );
}
