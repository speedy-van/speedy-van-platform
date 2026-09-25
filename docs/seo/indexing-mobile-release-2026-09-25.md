# Indexing recovery and mobile performance — 25 September 2026

Source baseline: `da93e30606bb13ea1d939dcf36ce6102d3b09aeb`.

## Evidence and actions

- Search Console's stored Edinburgh inspection reports “Duplicate without user-selected canonical”, last crawled on 21 September, with no declared canonical and an unrelated external canonical. This is a recorded Google selection, not proof of its underlying cause.
- The current production page declares `https://www.speedyvan.uk/areas/edinburgh`. Google's live smartphone inspection on 25 September returned “Page can be indexed”, successful fetch, crawling allowed and indexing allowed, with that correct declared canonical.
- Started validation for the duplicate-without-canonical exclusion on 25 September. Its detail report confirmed “Validation Started”. The overview can retain stale status while processing.
- The Edinburgh request returned “Indexing requested” and confirmation that the URL was added to a priority crawl queue. This is an accepted request, not confirmation that the URL is indexed or ranked.
- The `/services/man-and-van` request returned Google's generic submission error. It is not recorded as an accepted request, and repeated submissions were stopped.
- The inspected exclusion group contains one example, Edinburgh. The separate proper-canonical group contains the retired `/services/rubbish-removal` URL. It should not be submitted as a current service.
- Crawled-but-not-indexed examples are `/areas/kilmarnock`, `/services`, `/areas`, and the API hostname. The API is not a marketing page and should not be submitted for search discovery.
- The Google Business Profile Manager for the currently authenticated business account shows “0 businesses” and “0% verified”. This does not establish whether a profile exists under another account. No duplicate profile, fictional branch, review or address was created.

## Measured mobile problem

The public homepage PageSpeed report at 13:07 BST used Lighthouse 13.5.0, an emulated Moto G Power and slow 4G: performance 75, FCP 1.4 s, LCP 3.0 s, TBT 660 ms, CLS 0, Speed Index 4.3 s. It reported 19 non-composited animated elements and 369 ms of forced reflow attributed to the site layout chunk.

Baseline report: https://pagespeed.web.dev/analysis/https-speedyvan-uk/2ovgchde2l?utm_source=search_console&form_factor=mobile&hl=en_GB

The Edinburgh page scored 99 in its separate mobile report (LCP 1.8 s, TBT 30 ms). Neither report has enough Chrome field data. Lab scores are not search rankings.

Edinburgh report: https://pagespeed.web.dev/analysis/https-www-speedyvan-uk-areas-edinburgh/3089w29us6?hl=en_GB&form_factor=mobile

## Implementation

- Skip scroll-reveal enhancement on phone-sized viewports; content remains visible from server rendering. On larger screens, collect layout measurements before writing classes, avoiding the previous read/write loop.
- Use static decorative hero, logo, card and badge effects on phones. Preserve loading feedback, booking controls, links and reduced-motion support.
- Remove the global Mapbox stylesheet import: no Mapbox renderer or stylesheet consumer exists in the web source. This avoids downloading unused render-blocking CSS on every route.

## Validation and limits

- Production build and type validation passed; lint passed with three existing image-optimisation warnings.
- All 126 existing regressions passed, including booking draft recovery, private-route exclusions, analytics consent and payment safety.
- The built site passed 3,144 HTTP/HTML checks across all 251 sitemap URLs; see `evidence/indexing-mobile-local-2026-09-25.json`.
- Live preview, deployment and the follow-up PageSpeed report are checked separately from these local gates.
- Google decides canonical selection and indexing after recrawling. Nothing in this release promises a position, a deadline or a causal ranking increase.

References:

- https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/business/answer/7091?hl=en
