# Organic growth plan

Evidence date: 21 September 2026. The 30/60/90-day periods start from the verified coordinated release at **16:13:56 UTC on 21 September 2026**. The subsequent API-only date fix was ready at 16:27:50 UTC. Code completion, index eligibility, Google's indexing decisions and commercial results are separate measures. These are review checkpoints, not automatically scheduled work or ranking deadlines.

Primary origin: `https://www.speedyvan.uk`.

## Pre-release baseline

| Measure | Recorded evidence | Limit |
| --- | --- | --- |
| Priority service indexing | Initial URL Inspection: man-and-van unknown to Google; house-removal, furniture-delivery and office-removal discovered but not indexed; last crawl `N/A` | These four pages were not indexed at inspection. The reports do not establish why Google had not crawled them. |
| Other inspected pages | Earlier inspections found flat-removals, small-moves, long-distance-removals and Glasgow indexed | The site is not wholly unindexed. Recheck after release. |
| Sitemap | Accepted successfully with 45 discovered pages before this release | Discovery is not indexing. Compare the released sitemap with the new URL inventory. |
| Index requests | Six requests previously accepted after live tests | Acceptance is not indexing completion. |
| Search performance | Search Console processing; no reliable query/click/impression/CTR baseline | Missing data is unavailable, not zero. No measured conversion baseline is available. |
| Google Business Profile | Management access and the correct profile not verified | Do not claim that a profile is absent, incorrect or optimised. |

The [post-release Search Console record](search-console-release-2026-09-21.json) supersedes the man-and-van snapshot: the canonical page is now discovered but not indexed, and Google's live smartphone test fetched it successfully with crawling/indexing allowed. Its indexing request and the updated sitemap resubmission were accepted. The live sitemap has 47 URLs; the earlier processed discovery count still displayed 45. No ranking gain or completed indexing is inferred.

The audit's HYPD Google organic samples used United Kingdom, English and mobile on 21 September 2026:

| Sampled query | Observation |
| --- | --- |
| Brand query, exact phrase in `keyword-map.csv` | Apex homepage ranked 1 in the inspected sample. Follow the primary-www canonical transition. |
| `man and van` | Domain absent from the first 10 organic results inspected; AnyVan appeared at position 2. |
| `man and van glasgow` | Domain absent from the first 10 organic results inspected. |
| `furniture delivery glasgow` | Domain absent from the first 10 organic results inspected. |
| `house removals edinburgh` | Domain absent from the first 9 organic results inspected. |

These were auditor-selected queries, not customer queries observed in Search Console, universal positions or a local-pack audit. They do not establish the share of brand versus non-brand traffic.

## First 30 days: release, discovery and reliable measurement

| Priority / owner | Action | Completion evidence |
| --- | --- | --- |
| P0 / Engineering | Release and scoped live checks completed; review normal PR integration and finish outstanding mobile/payment integration checks | 414 live HTTP assertions across 47 pages, 18 host checks, ten API probes and the production browser journey to review passed. PR remains unmerged; production branch tracking remains `main`. See `verification.md` for limits. |
| P0 / SEO | Inspect seven services, Glasgow, Edinburgh and the homepage after release | Dated indexing states, last crawl and Google-selected canonical recorded. Investigate failed live tests without repeatedly submitting accepted requests. |
| P0 / Engineering + SEO | Published robots, sitemap, hubs and canonical inventory reconciled; monitor subsequent changes | The 47 released sitemap URLs passed HTTP/canonical checks; private and preview URLs are excluded. |
| P1 / Analytics | Verify the existing analytics and consent before adding tracking | Separate contact clicks, quote starts and genuine confirmed bookings; check deduplication and reconcile confirmed totals with backend records without exporting personal details. |
| P1 / SEO | Export the first complete usable Search Console period | Preserve country/device/search-type/date filters and a documented brand filter. Establish a 28-day baseline once reliable data is available. |
| P1 / Operations + owner | Confirm commercial facts and identify the correct existing Business Profile | Evidence for prices/units, minimum charges, crew, insurance, hours and routes; verified profile identity, phone, website and genuine operating address. |

## Days 31–60: improve existing pages using real enquiries

| Priority / owner | Action | Completion evidence |
| --- | --- | --- |
| P1 / Operations + content | Add permitted evidence of real Glasgow and Edinburgh work | Internal job reference, accurate service/access details and permission for any customer quotation/photo. No private home addresses or fabricated examples. |
| P1 / Content | Refine existing pages from actual queries and sales questions | Useful answers on price basis, stairs, item fit, parking, packing and timing. Word-order variants remain on one canonical page. |
| P1 / SEO | Audit relevant existing citations against confirmed business facts | Listing URLs and discrepancies recorded; no duplicate branches. |
| P2 / Operations | Prepare a small storage-transfer/business-referral shortlist | Genuine customer benefit, operational fit and contact route documented. No outreach or partnership claims made by this change set. |
| P2 / Engineering + analytics | Resolve the largest measured quote-flow loss | Select from consented funnel/error evidence; verify mobile loading, empty, validation and retry states; measure completion rather than clicks. |

## Days 61–90: allocate effort from measured commercial results

| Priority / owner | Action | Decision rule |
| --- | --- | --- |
| P1 / SEO + analytics | Compare like-for-like 28-day windows | Report non-brand clicks, qualified calls, quote starts and unique confirmed bookings with denominators; note seasonality, release dates and attribution changes. |
| P1 / Content | Prioritise relevant queries with impressions and lead potential | Improve the existing answer and links before adding pages. Average position alone is insufficient. |
| P2 / Content + operations | Assess a Glasgow–Edinburgh route guide | A new page requires observed demand, confirmed operations and original useful route material. Otherwise improve the existing intercity page. |
| P2 / Engineering | Test one evidence-backed CTA/form improvement | Define a primary metric and guardrails for quote errors, qualified leads and completed bookings. Keep inconclusive results labelled inconclusive. |
| P2 / Performance owner | Review mobile field measurements when available | Aim for field p75 LCP <2.5 seconds, INP <200 ms and CLS <0.1. Lab tests do not establish field INP. |

## Outcome targets

No traffic uplift, booking-growth percentage or ranking deadline is defensible from the unavailable performance baseline. Set numeric commercial targets after a complete reliable period and a capacity check:

- Record organic landing sessions, non-brand Search Console clicks, qualified calls, quote starts and unique confirmed bookings for the same 28 days. Clicks and analytics sessions are different measures.
- Calculate booking-start rate as quote starts / eligible organic landing sessions, and completion rate as confirmed bookings / quote starts. A zero denominator is unavailable, not a zero rate.
- Set the next-period booking target using measured demand, observed completion and additional jobs operations can accept. Document assumptions before testing; a target is not a forecast or guarantee.
- A contact click is not a qualified call. Qualify calls using the agreed business criteria and evidence; neither duration nor a click alone proves a sale.
- Track indexed coverage and selected canonicals for all seven priority services. Work towards complete useful coverage without promising an indexing date.

## Competitor gap and legitimate opportunities

The inspected [AnyVan Glasgow page](https://www.anyvan.com/man-and-van/man-and-van-glasgow) displays city-labelled reviews with item descriptions and dates, crew information, pricing explanations and a clear quote route. These are observable page features, not independently verified job totals or proof of a ranking factor. Add original local evidence and useful decision detail; do not copy its text, reviews, prices or claims.

| Opportunity | Verified relevance | Next action and boundary |
| --- | --- | --- |
| [Google Business Profile](https://business.google.com/us/business-profile/) | First-party business listing and customer discovery channel | Identify the correct existing profile before editing. Follow [Google's representation guidance](https://support.google.com/business/answer/3038177?hl=en-GB); no unsupported locations or services. |
| [Glasgow Chamber of Commerce](https://www.glasgowchamberofcommerce.com/) | Real local business organisation | Assess networking and applicable membership/listing requirements for commercial value. Membership, a listing and acceptance are unverified; do not buy ranking links. |
| Safestore [Glasgow](https://www.safestore.co.uk/self-storage/scotland/glasgow/) and [Edinburgh](https://www.safestore.co.uk/self-storage/scotland/edinburgh/) | Published storage locations relevant to storage transfers | Prepare a referral proposal after checking collection access and capacity. No partnership, endorsement or willingness to refer is established. |
| [Edinburgh Council parking guidance](https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions) | Primary removal-van loading guidance | Maintain the Edinburgh page reference and recheck changing rules before quoting fees/deadlines. This is an information source, not a backlink opportunity. |

## Keyword-map method

`keyword-map.csv` contains 162 deduplicated phrases mapped to 16 existing or prepared canonical targets: five `sampled_query` rows and 157 `inferred_variant` rows. No row represents a measured Search Console query or validated monthly search volume. Empty volume fields mean unavailable.

Inherited 19 September volume and competition numbers were not revalidated and have been removed from the current map; the historical version remains in Git. Priorities reflect relevance, indexing gaps and conversion value, not invented demand or advertising competition. Conditional specialist, packing, retailer and urgent-delivery phrases carry explicit operational limits. Exclude self-drive hire, passenger transport, unverified disposal and unsupported geographic expansion. Do not create a page per query or inflate the map to 10,000 combinations.
