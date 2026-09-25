# Booking quote refresh — 25 September 2026

## Confirmed findings

The deployed calendar returned £165.05 for Saturday 26 September afternoon, Glasgow Central Station to Waverley Bridge (48.2 miles), with either one or two Three Seater Sofas. Adding one helper changed the same slot to £189.89. No booking or payment was submitted.

There are two distinct gaps:

- Price fetching was owned by SchedulePicker, which unmounted when the customer went Back. Editing invalidated the quote and erased the appointment, but no new quote was requested until returning to the date step.
- The API PricingCalculateSchema and pricing.service.ts do not price inventory. Neither the item catalogue nor the current pricing configuration defines an inventory tariff. Refreshing cannot repair that business-rule gap. **This change does not introduce inventory charges or claim to solve inventory-dependent pricing.**

## Implemented

BookingQuoteSync stays mounted through booking navigation. It debounces edits for 250 ms, requests the current server price, preserves the chosen appointment, and applies the selected slot atomically. Request identity and input identity reject obsolete responses, including A-to-B-to-A edits. Aborted requests cannot overwrite current state.

The summary, calendar and action bar use the same quote. Old amounts disappear immediately while a replacement loads. Failure and empty availability retain retry states and block payment. An unavailable appointment cannot use the static subtotal as a payable fallback. Quote calendars and request identities are never restored from drafts. Entering the date step revalidates an existing calendar. Unresolved checkout protection remains enforced.

The existing API endpoint and monetary formula are unchanged. The quote request now carries selectedItems, but the current API does not consume them. A follow-up inventory tariff must be approved and implemented in both preview calculation and createBooking's server recalculation; sending the data alone is not inventory pricing. Admin and driver booking/payment records remain unchanged.

## Verification

- 135 regression tests passed, including eight new quote lifecycle cases.
- Web TypeScript check passed.
- Web lint passed with three existing unrelated image warnings.
- Production web build passed. The final source also passed the 39 booking regression cases and TypeScript after the last changes.
- The owner explicitly approved uploading these changes to the public GitHub repository and publishing them after the initial automatic-review block. Publication proceeds from baseline e1b97378a0220c1a0124d483e717a804bcc583b5; deployment and live verification are recorded in the pull request/session.

## Remaining work

Provide the authoritative inventory pricing rules/source. Do not invent per-item, per-kg, volume, handling, capacity, or competitor benchmark charges. Apply an approved formula using canonical item identity and quantity in the shared request schema, pricing service, and booking verification, then test real preview/checkout parity.

## VS Code Copilot verification prompt

Inspect apps/web/src/lib/{booking-store.tsx,booking-quote.ts}, components/booking/{BookingQuoteSync,SchedulePicker,BookingSummary,BookingActionBar,PriceDropToast}.tsx under apps/web/src, and scripts/booking-regression.cjs. Preserve BookingState, BookingAction, SchedulePickerProps and existing @/lib imports. Confirm one persistent fetch owner, 250 ms debounce, abort cleanup, request/input identity guards, retained appointment, empty/failed quote retries, no stale payable amount, and locked checkout protection. Test Back/Edit for route, access, helpers, packing, assembly, bedroom variant and item quantity, including rapid A-B-A changes, stale responses, unavailable dates and refresh. Inventory tariffs remain unimplemented: inspect packages/shared/src/validations.ts and apps/api/src/services/{pricing,booking}.service.ts, obtain approved rules before changing amounts, and update both preview and final server recalculation together. Do not claim item-dependent pricing is fixed by a refresh alone. Run the regression suite, web lint/typecheck/build and verify the deployed booking flow without submitting a booking or payment.
