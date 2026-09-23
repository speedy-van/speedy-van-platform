# Independent review: Inverness and Aberdeen

Reviewed: 23 September 2026. Final source base: `39fbb443baeedcae67a881b70e22db4f9f7e5bba`, from `fix/organic-search-and-booking-2026-09-21` in `speedy-van/speedy-van-platform`.

## Decision

No blocking defect found in the final city patch during independent source review. It is suitable for the lead's integrated build, HTTP and mobile verification. The exact current production deployment commit remains a release dependency; the historical hosting record is not proof of today's deployed SHA.

This review applies to `city-seo-current`, superseding the earlier review against the older `4b29418` checkout. It does not carry forward that checkout's framework, styling, metadata or analytics findings. No application code was changed by this review workstream, and no parallel build was run.

## Checks performed

| Check | Result and evidence |
| --- | --- |
| Framework and props | The final application declares Next.js 15.5.25 and React 19.2.8. The area page retains `params: Promise<{ slug: string }>` and awaits it in both metadata and page functions. No dependency or package-manager change is part of this patch. |
| Metadata integration | Both guide titles are brandless and passed to the existing `buildPageMetadata` helper. The root title template adds `SpeedyVan` once; the helper applies the same single suffix to social titles and uses `absoluteUrl` for canonical and Open Graph URLs. This is source verification, not a rendered-head test. |
| Scope of replacement | The new guide renderer replaces the generic middle sections only for Aberdeen and Inverness. Other city introductions, planning advice, FAQs and metadata keep their existing rendering path. Hero, nearby-area section, footer, navigation and existing quote/contact destinations remain intact. |
| Server rendering and performance | The guide renderer has no client directive, hooks or browser dependency. Copy and native FAQs are rendered directly from typed data. No map, image, external script or client component is added. |
| Design preservation | New sections use the existing black/near-black backgrounds, white text, amber accents and primary-button class. No white/slate design from the older checkout was transferred. Responsive grids begin in one column, with flexible containers and wrapping text. A visual 360px result remains the lead's responsibility. |
| Route handling | Existing `getAreaBySlug`, `notFound()` and invalid-slug noindex metadata remain. The guide lookup independently rejects absent slugs and inherited object property names. Actual HTTP 404 behaviour remains an integrated runtime check. |
| Service/data consistency | A read-only Node/TypeScript check passed on this final worktree: each city has eight unique, indexable service references, covering all seven core service intents plus student moves. Service labels come from the existing registry. Both guides have unique section IDs, three booking steps, four FAQs and a quote section. |
| Discovery links | The new featured-area list is unique, retains the previous first ten areas and adds both target cities. Footer and service pages consume it. The unchanged area-driven sitemap already includes both existing city URLs. No thin city × service routes are created. |
| Structured data | Existing Service and BreadcrumbList entities remain. The city Service retains its stable URL-based ID and existing organisation reference. `areaServed` is a City for these two guides. No city-office address, fabricated offer or review data is added. |
| Customer claims | New text supplies no price, minimum-charge amount, local branch, permanently stationed crew, review score, insurance promise or guaranteed slot. Longer routes, crew requirements, extra work and availability are qualified by assessment and agreement. |
| Accessibility and motion | New sections use labelled headings, descriptive links and hidden decorative icons. Native `details`/`summary` controls expose FAQs without JavaScript; focus styling is present. Card and chevron transitions use `motion-safe`, and the added quote button disables its transition under reduced motion. No new spatial animation is introduced. This is not a full WCAG or assistive-technology certification. |
| Booking and analytics | Application changes do not modify quote, inventory, payment, authentication, API, tracking or consent contracts. The current base already treats CTA events as expressions of interest; this patch does not turn them into leads or bookings. No findings about the older tracker are carried forward. |
| Regression fixture | The analytics regression fixture now loads the real area module in place of its former `AREAS`-only stub, supplying the new `FEATURED_AREAS` export. Existing contact-event assertions remain intact; no assertion was removed or weakened. The reviewer inspected this change but did not rerun the full suite. |
| Keyword map | The CSV contains 60 rows, split evenly between the two cities, with no exact duplicate rows. Every row is labelled as an inferred intent variant rather than an observed Search Console query; search-volume cells are blank. It maps to existing canonical pages. |
| Patch hygiene | `git diff --check` passed on the final worktree. The new HTTP verification script was reviewed; its result belongs in the lead's integrated verification record. |

## Local source confirmation

The following links were independently opened on the review date and the referenced copy remained the same after the source-base change:

- [Highland Council loading-bay guidance](https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/5) supports checking operating times, vehicle restrictions and active loading requirements.
- [Aberdeen City Council residential parking permits](https://sites.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/residential-parking-permits) supports the advice that a permit does not reserve a space or override other parking restrictions.

The guides use different practical emphasis: Aberdeen covers shared stairs, urban loading and business handover; Inverness covers the full Highland journey, narrow approaches, vehicle access and delivery timing. Both explain service fit and quote scope. Stronger local credibility should subsequently come from genuine job evidence and approved customer material, without inventing premises or route guarantees.

## Remaining integrated and release gates

1. Record actual typecheck, lint, regression and production-build results in the lead's verification record. This source review does not assert those checks were independently rerun.
2. Verify initial HTML and response headers for both city pages, single-brand titles, self-canonicals, schema JSON, core service links and actual invalid-route HTTP 404/noindex responses.
3. Verify layout at 360px, keyboard operation of the FAQs and quote navigation. Unchanged booking/payment contracts alone do not establish a complete transaction pass.
4. Confirm the current production source before applying the patch; integrate only the reviewed changes while retaining newer work. The repository's 21 September hosting record remains historical evidence, not current deployment verification.
5. Keep code completion, indexing requests, search visibility and qualified enquiries/bookings as separate measured outcomes.

No deployment, push, merge, DNS change, outreach or new tracking integration was performed by this independent review.
