# AGENTS.md — Speedy Van Platform · Booking V2

Read this before touching anything in `apps/web/src/app/book` or `apps/api/src/routes/pricing.ts`.

---

## Stack — do not modernise, do not swap

| Layer | Version | Notes |
|-------|---------|-------|
| Next.js | 15.5.25 | App Router, React Server Components where noted |
| React | 19.2.8 | No legacy patterns |
| CSS | **Tailwind CSS 3.4** | **NOT Chakra UI. Never import @chakra-ui.** |
| API | Hono on Node (port 4000) | Separate process from Next. `apps/api/` |
| DB ORM | Prisma 5.22 via `@speedy-van/db` | Schema in `packages/db/prisma/schema.prisma` |
| Auth | next-auth 4 | Session in Next only; API uses JWT middleware |
| Payments | Stripe (stripe-js + react-stripe-js) | Webhook in `apps/api/src/routes/stripe.ts` |
| Maps | Mapbox GL 3 | Token required: `MAPBOX_TOKEN` |
| State | React `useReducer` + Context | `apps/web/src/lib/booking-store.tsx` |

**Do not install new UI libraries. Do not upgrade Tailwind. Do not touch the Stripe webhook handler.**

---

## What exists today

```
apps/web/src/app/book/          ← live booking route (takes real money)
apps/web/src/components/booking/
  BookingFlow.tsx               43 lines — mounts steps
  BookingShell.tsx              85 lines — wraps each step
  BookingProvider / booking-store.tsx  509 lines — full reducer + draft
  JourneyFields.tsx             ← Step 2: addresses + inventory
  InventorySelector.tsx         ← item picker
  SchedulePicker.tsx            ← 14-day calendar with 3 slots
  Step4Payment.tsx              613 lines — Stripe checkout
apps/api/src/services/pricing.service.ts  ← 14-day price calendar, no signing
```

The flow collects: service → addresses + items → 14-day calendar → payment.  
Draft is saved to `localStorage` only (key `sv_booking_draft_v1`, 24h TTL).

---

## What Booking V2 must add (do not ship these as hidden changes)

All V2 work is gated behind `NEXT_PUBLIC_BOOKING_V2=true`.  
The existing `/book` route must keep working at all times.

| ID | Feature | Where | Status |
|----|---------|-------|--------|
| T2 | **Signed quote** — HMAC token, 30-min expiry, verified server-side before payment | `apps/api/src/lib/quote-token.ts` | ✅ Done |
| T3 | **Van-fill meter** — volume against usable capacity, upgrade prompt at 85% | `packages/shared/src/van-capacity.ts` | ✅ Done |
| T4 | **28-day calendar** — extended from 14 → 28 days, cheapest-day marker | `apps/api/src/services/pricing.service.ts` | ✅ Done |
| T6 | **Access pricing** — carry distance, narrow access, permit zone, priced as named lines | `AccessFields.tsx` + pricing schema | ✅ Done |
| T7 | **Inventory v2** — van-fill meter inline, upgrade prompt at 85% | `VanFillMeter.tsx` + `InventorySelector.tsx` | ✅ Done |
| T8 | **Schedule v2** — 28-day calendar with cheapest-day pill | `SchedulePicker.tsx` | ✅ Done |
| T9 | **Cover + price lock** — signed quote card, 30-min countdown, itemised breakdown | `PriceLockCard.tsx` | ✅ Done |
| T10 | **Checkout v2** — access fields + quoteToken wired to `/booking/create` | `Step4Payment.tsx` | ✅ Done |
| T11 | **Persistent price bar** — pinned bottom bar showing running total across all steps | `StickyPriceBar.tsx` | ✅ Done |
| T12 | **Amendment system** — £20 auto-charge, >£20 to admin approval | `apps/api/src/routes/amendment.ts` | ✅ Done |
| T13 | **Recovery drafts** — `BookingDraft` DB table + `/draft` API + cookie session | `apps/api/src/routes/draft.ts` | ✅ Done |

---

## Hard rules

1. **Never compute price on the client.** The client renders a number returned by the API. It must not recalculate it.
2. **Never modify `/booking-luxury` or `apps/api/src/routes/stripe.ts`.** These are live and untouched.
3. **Signed quote token must be verified server-side before a Stripe PaymentIntent is created.** No exceptions.
4. **All new files under `apps/web/src/app/book/` use Tailwind classes only.** No inline style objects except for dynamic values (e.g. fill meter width).
5. **Pricing service changes are additive.** Extend `calculatePrice`, do not rewrite it. Existing callers must not break.
6. **Van capacity numbers in `van-capacity.ts` are placeholders until the operator confirms real figures.** Mark them with `// PLACEHOLDER — replace before fit-guarantee goes live`.
7. **No countdown timers, no fake scarcity.** One cheapest-day nudge is the limit.
8. **Feature flag check:** any V2 component must guard with `process.env.NEXT_PUBLIC_BOOKING_V2 === "true"` or the exported `isBookingV2` constant.

---

## Key pending decisions (block T9 / T12 going live)

| Decision | Value | Status |
|----------|-------|--------|
| Fit-guarantee liability cap per booking | **£500** | ✅ Confirmed |
| Amendment auto-charge threshold | **£20** | ✅ Confirmed |
| Fleet usable volume + payload per van tier | See `van-capacity.ts` placeholders | Deferred — fit guarantee must not go live until replaced |

---

## Environment variables required for V2

Add to `apps/web/.env.local` and `apps/api/.env.local`:

```
NEXT_PUBLIC_BOOKING_V2=true          # gates V2 UI
QUOTE_SIGNING_SECRET=<random-32-char># HMAC secret for signed quotes (API only)
```

---

## File conventions

- Step components: `apps/web/src/components/booking/v2/Step*.tsx` (under 300 lines each)
- Pure logic (no React): `packages/shared/src/` — importable by both web and api
- API additions: extend existing route files; do not create new route files unless the feature has no existing route
- Tests: colocate as `*.test.ts` next to the file under test

---

## Acceptance checklist for every task

- [ ] `/book` still works end-to-end with `NEXT_PUBLIC_BOOKING_V2` unset
- [ ] TypeScript compiles with no new errors (`pnpm typecheck` from root)
- [ ] No Chakra UI imports introduced
- [ ] No price computed on the client
- [ ] New env vars documented above and in `.env.example`
