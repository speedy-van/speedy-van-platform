# SEO Audit Evidence

Date: 2026-09-17

## Highest Priority Findings Revalidated

1. Conflicting host signals:
   - `www.speedyvan.uk` and `www.speedy-van.co.uk` both serve 200 responses with the same ETag.
   - Live canonical is `https://speedyvan.uk`, while the sitemap child URLs use `https://www.speedyvan.uk`.
   - Live `robots.txt` on both hosts points to `https://www.speedy-van.co.uk/sitemap.xml`.

2. Homepage H1 is empty in initial HTML:
   - Live `<h1>` contains animated spans and an aria label, but no raw text node for crawlers without hydration.
   - Local fix renders `Man and Van Services Across Scotland` in server HTML.

3. Repository vs live output differ:
   - Local `packages/config/src/site.ts` has been aligned to `https://www.speedyvan.uk`.
   - Live output still has non-www canonical and `.co.uk` robots sitemap until deployment.
   - `apps/web-v2` from `speedy-van/sv` uses `.co.uk` as primary and is not the active local app.

4. Commercial moving-intent coverage was thin:
   - Existing pages covered `man-and-van`, house, office, student, furniture, IKEA, piano, same-day, packing, and rubbish/clearance.
   - Missing or weak canonical coverage existed for flat/apartment/studio moves, small moves, and intercity/long-distance removals.

## Implementation Summary

Primary fixes implemented in `apps/web`:

- Added shared SEO constants in `apps/web/src/lib/seo/constants.ts`.
- Added App Router `robots.ts` and `sitemap.ts`.
- Removed stale static robots/sitemap files from `apps/web/public`.
- Added hostname redirect middleware for non-primary hosts.
- Made JSON-LD server-rendered instead of `next/script afterInteractive`.
- Rebuilt homepage H1 as server-rendered visible text.
- Added `/pricing`.
- Added canonical service coverage for:
  - `flat-removals`
  - `small-moves`
  - `long-distance-removals`
- Strengthened content for man and van / van and man / man with a van, house removals, office relocations, student moves, furniture collection and delivery, same-day delivery, and packing.
- Marked light clearance/rubbish as `indexable: false` and excluded it from sitemap and public service grids.
- Mapped SEO-only pages to existing bookable services so booking contracts are preserved.

## Claims And Trust Cleanup

Removed or softened unverified claims from public output:

- Fake testimonial carousel content.
- `4.9/5 from 1,000+ moves`.
- Live availability copy such as `vans available right now`, `advisors free`, and `bookings in the last hour`.
- `Trusted by Thousands`.
- Unverified DBS, customs-handled, and blanket waste-carrier claims.

Remaining visible trust statements are operational or conditional, for example:

- Goods-in-transit cover.
- Quote checked before dispatch.
- Same-day enquiries reviewed when capacity allows.

## Search And Conversion Evidence Available

HYPD Google Ads access was available for account:

```text
2427152166
Currency: GBP
Timezone: Europe/London
```

Enabled conversion actions visible:

```text
Contact
Calls from ads
Website Calls - 30 Seconds
```

GA4 properties were not available through HYPD (`accountSummaries: []`). Search Console was not available as a callable connector in this session. Google Ads GAQL returned `INVALID_ARGUMENT`, so campaign/search-term performance was not used.

Keyword volumes used for prioritization are documented in `keyword-map.csv`. These are demand signals, not ranking claims.
