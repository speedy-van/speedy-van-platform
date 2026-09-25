# City search and booking entry repair — 25 September 2026

Source baseline: `a40072989ce6964e3cbbd150e1d1ca5fda5ed527` on `main`.

## Problems demonstrated

- The public `/book` route rendered no service selector for a new visitor. `BookingFlow` imported `Step1Service` but only mounted the shell after a service had already been selected.
- `BookingProvider` bypassed the existing validated draft restoration and serialisation functions. The existing regression suite exposed a retained old price, an intermediate wrong-service step, and loss of unresolved checkout state.
- City hero, guide and local-service quote links were missing the existing CTA tracking attributes.
- Service cards and service-to-city links ignored reviewed local-service pages that already existed.
- Glasgow used the shorter area template; its city guide and pricing fragment were absent.
- The about page repeated the business label through the title template. The recorded expansion inventory still counted 250 URLs although the sitemap contained 251.

## Changes

- Restore the existing service selector at `/book`, show a loading status during draft hydration, and retain the existing homepage quote starter.
- Restore through `restoreBookingDraft`, apply a recognised initial service hint before exposing the restored step, and persist through `serialiseBookingDraft`. Preserve unresolved checkout references for server reconciliation; never persist the client secret or reuse a saved price as a fresh quote.
- Add native tracked quote/call links with city/service context. The existing single listener and consent gate remain authoritative. A click is not a qualified lead or completed booking. Provider configuration and event receipt must be checked separately.
- Link to authored local-service destinations only. Unreviewed combinations retain the existing generic service/city destination. No new URLs or generated city/service combinations.
- Add a Glasgow guide covering tenement access, furniture collection, loading, city-centre access, quote scope and short-notice enquiries. Add a matching pricing section. No new prices, reviews, branches, capacity promises or availability guarantees.
- Add fixed, truthful content update dates for the three changed city hubs and pricing. Other sitemap entries keep their dates omitted.
- Use the existing metadata helper for the about page and reconcile the inventory count to 251.
- Align both API deployment builder pins to `@vercel/node@13.0.2`. The first preview failed before building application code because `13.0.1` required `@vercel/build-utils@14.10.1` while Vercel supplied `14.10.2`; the patch release declares the matching `14.10.2` peer. No forced dependency resolution or API contract changes.

## Validation

Verified before upload: 126 regression tests passed; production build and lint passed (existing image-optimisation warnings remain). The built site passed 3,144 HTTP/HTML checks across all 251 sitemap URLs.

To reproduce, run `npm run test:regression`, `npm run lint --workspace apps/web`, and `npm run build --workspace apps/web`. Run `scripts/seo-local-qa.py` against the built server; it checks all sitemap URLs, metadata, canonical links, structured data, status codes, internal links, draft-safe quote URLs and the three cities' CTA context.

The HTTP checks do not establish field Core Web Vitals, Google indexing, ranking, qualified calls or revenue. Production source and behaviour must be confirmed after merge, not inferred from a successful local build.

The web preview also passed a real-browser check: a new visitor could see the service selector, decline optional cookies, select house removals and reach the journey form. The deployment builder patch is additionally checked by the API packaging and request-adapter regression suite and the cloud preview build.

## Evidence and operational limits

- Glasgow loading guidance: https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension
- Glasgow LEZ guidance: https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information
- Accurate sitemap update dates: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Existing business address, insurance and operating-hours claims have not been independently substantiated by this source change. No additional claims were introduced.
- Rank comparisons need the same query, location, device and date range. The available Search Console sample was too small to establish a stable city ranking or a causal ranking gain.
- Existing database, API, driver and admin contracts are unchanged. No real booking, payment or database migration is part of verification.
