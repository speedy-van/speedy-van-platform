# Organic search measurement plan

Prepared 21 September 2026. The [baseline JSON](measurement-baseline-2026-09-21.json) preserves the **pre-deployment** observations and adds a separate verified release anchor: the API was ready at 16:09:36 UTC and the web at 16:13:56 UTC. The initial coordinated release uses 16:13:56 UTC as D. Subsequent API-only maintenance is recorded separately. No post-release ranking gain is established.

The post-release [Search Console evidence](search-console-release-2026-09-21.json) records the canonical man-and-van page's successful live smartphone test and accepted indexing request. Its index snapshot remains discovered but not indexed. The current sitemap contains 47 URLs, while the previously processed Search Console discovery count remained 45. Keep these values distinct from indexed totals.

## Recorded baseline

The lead rechecked the domain Search Console property at **15:06 UTC**. Performance and aggregate Page Indexing still displayed processing data. Clicks, impressions, CTR, average position and aggregate indexed totals are **unavailable, not zero**. Earlier URL Inspection findings and the accepted sitemap's 45 discovered URLs are labelled separately in the JSON; they were not refreshed by this measurement pass.

Fresh HYPD samples were returned between **15:09:24 and 15:09:58 UTC**. Each request used United Kingdom, English, mobile, organic results and page 1. These are country-level samples; city names in the query do not establish a search from a particular street or a map-pack position.

| Fixed query | Canonical target | Organic results examined | Website observation |
| --- | --- | ---: | --- |
| `man and van Glasgow` | `/services/man-and-van` | 10 | Not observed |
| `furniture delivery Glasgow` | `/services/furniture-delivery` | 10 | Not observed |
| `house removals Edinburgh` | `/services/house-removal` | 9 | Not observed |
| `flat removals Glasgow` | `/services/flat-removals` | 10 | Not observed |
| `office removals Glasgow` | `/services/office-removal` | 10 | Not observed |
| `small moves Glasgow` | `/services/small-moves` | 10 | Not observed |
| `long distance removals Scotland` | `/services/long-distance-removals` | 9 | Not observed |
| `speedy van` | `/` | 9 | Organic position 1, returning `https://speedyvan.uk/` |

Use the provider's organic `rank_group`, not its position across mixed result blocks. The response included nested non-organic blocks despite the requested filter; only `type=organic` entries were counted. Full examined organic URLs, counts, source IDs and timestamps are preserved in the JSON. Match the owned website hostnames exactly, including old-domain variants; directory or social profiles do not count as a website result.

“Not observed” means absent from the returned nine or ten entries. It does not mean rank 11, rank 100, no impressions or no indexing. The brand result's apex URL is a canonical-transition observation, not proof of Google's currently selected canonical. The earlier generic `man and van` sample remains in the audit; it is not part of this fixed eight-query repeat set. Google explains that results vary with time, place, device and search history in its [Performance report guidance](https://support.google.com/webmasters/answer/7576553?hl=en).

## Release and comparison checkpoints

Let **D** be the verified release time, recorded in UTC together with both deployment IDs and commits. Where the API and web release at different times, retain both timestamps and use completion of the coordinated release as the comparison anchor. Record the reporting dates and time zones of each data source rather than silently treating all daily reports as UTC. These are review checkpoints, not automated jobs or ranking deadlines.

| Checkpoint | Work | Comparable evidence |
| --- | --- | --- |
| D, after release | Verify HTTP status, canonical, robots, sitemap, initial content, invalid routes and intended booking behaviour against the release checklist. Inspect the homepage, seven services, Glasgow and Edinburgh in Search Console when available. | Released commits and dated live results. Record indexing state, last crawl and selected canonical separately from the live-test result. A same-day SERP rerun is an observation only. |
| D + 7 days | Repeat the eight exact queries with the same country, language, device and organic-rank method. Export seven complete post-release days when Search Console makes them available. | Compare the SERP sample with this baseline. Compare traffic with the preceding seven complete days only if both windows exist and use identical filters. Exclude partial or preliminary days; do not fill missing days with zeros. |
| D + 28 days | Repeat the fixed sample and indexing inspections. Export 28 complete post-release days and reconcile consented organic conversions. | Compare with the preceding 28 complete days if a reliable historical export exists. Otherwise the first complete usable 28-day period becomes the measured baseline; there is no supported growth percentage yet. |

Request indexing only for relevant changed URLs after a successful live test, respecting accepted requests. A request or sitemap entry is not completed indexing or a ranking result; repeated requests do not speed crawling. See [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Search Console comparisons

- Use the domain property, Web search and United Kingdom for the principal market comparison. Keep mobile and all-device views as separate named series. Preserve the date window and all active filters with each export.
- Export queries, pages, countries, devices and dates when usable. Keep page-level results for the seven canonical service targets. Follow the apex-to-www transition without treating the two hosts as separate businesses or simply adding potentially overlapping aggregates.
- Maintain a reviewed brand filter covering spaced, joined and hyphenated forms of the brand and domain. Apply the same filter to both periods and retain ambiguous names in a review list. Do not label inferred keyword variants as observed customer queries.
- Record clicks, impressions, CTR and average position together. Keep Search Console averages separate from the fixed SERP snapshot positions. Query/page aggregation and unavailable rows can differ from report totals; record discrepancies rather than forcing them to reconcile. These limits are described in [Google's report documentation](https://support.google.com/webmasters/answer/7576553?hl=en).
- Calculate percentage change only when both values are available and the comparison value is greater than zero. Label an unavailable baseline or undefined rate explicitly; never manufacture demand volumes or a percentage uplift.

## Commercial measurement definitions

| Measure | Definition | Current evidence limit |
| --- | --- | --- |
| Organic landing session | A session whose agreed analytics attribution identifies organic search and records its landing page. Keep the attribution model and channel rules fixed. | No usable analytics export or confirmed property configuration was inspected in this pass. Search Console clicks are not sessions. |
| Contact click | An interaction with a phone, WhatsApp or email CTA. | Existing click events measure interest. They do not prove a connected call, enquiry, qualification or sale. |
| Qualified organic call | A connected call attributable to organic search where a genuine customer requests a provided service within confirmed operational coverage and supplies enough information for a quote or next step. Exclude spam, recruitment, suppliers and repeated contacts about the same enquiry. | No connected-call or qualification dataset was accessed. Agree the operational criteria and deduplication process before counting; call duration alone is insufficient. |
| Quote start | The first valid journey/service submission entering the actual quote process, counted once per agreed quote attempt. | `quote_click` is a CTA event. `trackBookingStart` exists but has no caller in the inspected source. A reliable quote-start metric is not yet established; do not relabel CTA clicks as starts. |
| Confirmed online booking | A unique booking whose server has confirmed the required successful payment and booking state. Deduplicate using its transaction/booking reference. | The repair branch's checkout calls `trackPurchase` after confirmation and deduplicates client delivery. Actual provider receipt and backend reconciliation remain unverified. A confirmed booking is not a completed move. |
| Organic booking revenue | The verified payment value attached to uniquely confirmed organic-attributed bookings, in GBP; report refunds/cancellations and net revenue separately. | No reconciled dataset was accessed. Do not multiply clicks or enquiries by a guide price. Keep unattributed bookings separate. |

Before relying on totals, verify the configured analytics property, consent acceptance/decline/withdrawal, received event parameters and duplicate suppression in an approved test environment. Confirm GA4 Enhanced Measurement history-based page views do not duplicate the application's manual route page views. Do not send personal contact details, addresses or private URL tokens in measurement payloads. Respect declined consent; lower observed totals after a consent repair are not automatically a loss of customers.

Reconcile browser purchase counts with server-confirmed bookings for the same dates without exporting personal customer details. Report attribution gaps and test/internal traffic separately. Compute quote-start rate and booking-completion rate only after their denominators are available and consistently defined.

## Missing access and targets

Search Console aggregate reports are processing. GA4 identity/settings, tag delivery, call qualification, reconciled organic bookings and Google Business Profile performance are not verified by this pass. No live payments, bookings, calls, outreach or analytics events were generated to create the baseline. Business Profile management access still needs confirmation; a create-profile screen does not prove no existing profile exists.

No numerical ranking, traffic or booking-growth target is set without a complete reliable baseline. Once available, set commercial targets using observed qualified demand, conversion rates and the number of extra jobs operations can accept. Track technical completion, indexing decisions, visibility and commercial outcomes separately. No deployment or passed test establishes first place in Google.
