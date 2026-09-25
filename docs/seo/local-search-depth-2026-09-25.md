# Local search depth and discovery — 25 September 2026

Source baseline: `1fd90c023f7e1f3cd69f94475caa53269440c558`.

## Observed problem

Search Console's Web report, with the three-month range selected, currently plots 20–23 September 2026. It shows 15 clicks, 319 impressions and average position 18.6. These are property-wide metrics, not a rank for any particular city. The visible query table has 64 rows; no Aberdeen query was reported in that table. Unreported queries must not be interpreted as zero demand or a numeric rank.

| Reported query | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| man and van glasgow | 1 | 2 | 2.5 |
| man and van inverness | 0 | 1 | 39.0 |
| edinburgh student removals and storage | 0 | 4 | 79.3 |
| edinburgh student removals | 0 | 3 | 84.7 |
| student removals edinburgh booking | 0 | 1 | 52.0 |

The sample is too small to establish stable city rankings. No city geolocation or mobile search-browser emulation was available; Search Console averages are not represented as a location-controlled SERP check.

Filtering to `edinburgh student removals and storage` and opening Pages attributes all four impressions to `/services/student-move`. Inspection of `/areas/edinburgh/student-move` shows **Discovered – currently not indexed**, sitemap discovery and no recorded crawl. This establishes an indexing gap, not a diagnosed crawl error or penalty.

The Edinburgh city hub also lacked the authored guide used by Glasgow, Aberdeen and Inverness. Local service links on generic service pages appeared below their FAQ content. Existing local service pages linked to the city hub, generic service and generic pricing, without links to complementary services within that city.

## Changes

- Add an Edinburgh guide covering flat access, student moves, loading permissions, storage transfers, quote scope and short-notice/onward moves. Use the existing city URL, metadata and server-rendered guide template.
- Expand the existing Edinburgh student page with moving-out, storage-transfer and quote guidance, and questions about storage and shared moves. Distinguish transport from separately arranged storage. Link current university guidance.
- Put the existing city-specific service choices immediately after the generic service introduction and quote action, so a visitor arriving on a general service page can find their local guide early.
- Link each reviewed local service page to two complementary reviewed pages within its own city. Unknown combinations return no links. Point the four target cities' local service pages to their actual pricing sections.
- Add the Edinburgh pricing section, connect Aberdeen pricing to the existing local flat/furniture pages, and connect Inverness pricing to its local house-removal page.
- Record genuine review dates for the two changed Edinburgh URLs and update the source inventory's evidence link. The sitemap remains 251 URLs; this release does not add duplicate city/service pages.

## Validation

- Production web build and type validation passed.
- All 127 regressions passed. The added regression checks real, same-city, distinct destinations and rejects unknown combinations.
- All 3,209 local HTTP/HTML checks passed across the 251 sitemap URLs, including canonical URLs, indexability, valid structured data, section anchors and the added contextual links. Evidence: `evidence/local-search-depth-local-2026-09-25.json`.
- Lint passed with the same three pre-existing image warnings. React review: server-rendered changes, no new browser JavaScript, fetches, effects or dependencies; native links, headings, focus styles and responsive grids are retained.
- Preview and production deployment evidence and the outcome of the local student-page indexing request belong in the release PR after those actions complete.

## Remaining evidence gaps

The authenticated Google Business Profile account has no managed business. The name-entry suggestions did not identify a matching profile. This is not proof that another account or public listing does not exist. Public business identity and customer-facing premises must be verified before publishing a profile or a branch; neither four city landing pages nor structured data establish four offices.

Current public sources are not sufficient to invent completed jobs, reviews, an insurance certificate or a customer-reception address. Existing website address and legal-name wording also require reconciliation with authoritative business records. These matters are separate from this content release; no contractual insurance terms or company records were changed.

Success requires subsequent Google crawling and indexing, then enough query and conversion data to compare equal periods. An accepted indexing request is not an indexed page. This release makes no top-ten, timing or causal ranking claim.

## Sources checked

- https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions
- https://www.accom.ed.ac.uk/living-with-us/moving-out
- https://www.accom.ed.ac.uk/living-with-us/moving-in
- https://transport.ed.ac.uk/travelling-here/pollock
- https://find-and-update.company-information.service.gov.uk/company/SC865658
- Authenticated Search Console performance and URL inspection, 25 September 2026.
