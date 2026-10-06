# AGENTS.md - Speedy Van Platform

Read this before touching booking, payment, admin, driver, or shared pricing code.

---

## Stack - do not modernise, do not swap

| Layer | Version | Notes |
|-------|---------|-------|
| Next.js | 15.5.25 | App Router, React Server Components where noted |
| React | 19.2.8 | No legacy patterns |
| CSS | Tailwind CSS 3.4 | NOT Chakra UI. Never import `@chakra-ui`. |
| Web app | `apps/web` | Public site, booking flow, admin, driver UI |
| Embedded API | `apps/web/src/server/api` | Served by Next route handlers under same-origin `/api/*`; no separate API app |
| DB ORM | Prisma 5.22 via `@speedy-van/db` | Schema in `packages/db/prisma/schema.prisma` |
| Auth | next-auth 4 plus API JWT middleware | Session handled in Next; API auth served from the web app |
| Payments | Stripe JS + Payment Element | Client-side payment UI plus embedded API payment creation |
| Maps | Mapbox GL 3 | Client token `NEXT_PUBLIC_MAPBOX_TOKEN`; server geocoding token `MAPBOX_TOKEN` |
| State | React `useReducer` + Context | `apps/web/src/lib/booking-store.tsx` |

Do not install new UI libraries. Do not upgrade Tailwind.

---

## What exists today

```
apps/web/src/app/book/          <- live booking route
apps/web/src/components/booking/
  BookingFlow.tsx               <- mounts steps
  BookingShell.tsx              <- wraps each step
  booking-store.tsx             <- reducer + draft
  JourneyFields.tsx             <- addresses + inventory
  InventorySelector.tsx         <- item picker
  SchedulePicker.tsx            <- calendar
  Step4Payment.tsx              <- Stripe checkout UI
```

The flow collects: service -> addresses + items -> calendar -> payment.
Drafts are saved locally in the browser and synced through the embedded same-origin API where the web app already has that integration.

---

## Hard rules

1. Never compute price on the client. The client renders numbers returned by the API.
2. Do not recreate a separate backend workspace or separate API deployment unless the owner explicitly asks for that split again.
3. All new booking UI files use Tailwind classes only. No inline style objects except dynamic values such as fill meter width.
4. Van capacity numbers in `van-capacity.ts` are placeholders until the operator confirms real figures. Keep the placeholder warning before any fit guarantee goes live.
5. No countdown timers and no fake scarcity. One cheapest-day nudge is the limit.
6. Feature flag check: any Booking V2 component must guard with `process.env.NEXT_PUBLIC_BOOKING_V2 === "true"` or the exported `isBookingV2` constant.

---

## Environment variables

Add to `apps/web/.env.local`:

```env
# API routes default to same-origin /api. Set only when intentionally testing another origin.
# NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BOOKING_V2=true
QUOTE_SIGNING_SECRET=<random-32-char>
```

---

## File conventions

- Step components: `apps/web/src/components/booking/v2/Step*.tsx` where practical.
- Pure logic with no React: `packages/shared/src/`, importable by web and other consumers.
- Tests: colocate as `*.test.ts` next to the file under test where the existing tooling supports it.

---

## Acceptance checklist

- [ ] `/book` still works end to end with `NEXT_PUBLIC_BOOKING_V2` unset.
- [ ] TypeScript compiles with no new errors.
- [ ] No Chakra UI imports introduced.
- [ ] No price computed on the client.
- [ ] New env vars documented in `.env.example`.
