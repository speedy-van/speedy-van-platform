# Stage 2 URL Inventory — Path to 1,000 Pages
**Date:** 2026-09-24
**Branch:** `integration/seo-1000-2026-09-23`
**HEAD:** `ed8ae095`

---

## Measured verification results (2026-09-24)

### What the build count means
The production build generated **279 static pages**. This includes admin, driver, auth, and booking routes that are not SEO landing pages. The SEO-relevant count is **251** — these are the URLs registered in the generated sitemap. The 279 figure is an internal build count only.

### Production build
- Command: `next build` from `apps/web/`
- Result: ✓ 279 static pages generated (internal build count — includes admin/driver/auth routes)
- SEO sitemap URLs: **251** (the meaningful count)
- TypeScript: ✓ no errors
- ESLint: ✓ no warnings or errors
- Build warnings: non-fatal `lockfile missing swc dependencies` — does not affect output

### Runtime URL checks (production build, `next start` port 3001)
All 75 checks passed (0 failures):

| Category | URLs tested | Expected | Result |
|---|---|---|---|
| Published samples | 7 | HTTP 200 | ✓ all 200 |
| Staged routes (moving-route-pages-stage2.ts) | 20 | HTTP 404 | ✓ all genuine 404 |
| Staged town service pages (town-service-pages-1.ts) | 48 | HTTP 404 | ✓ all genuine 404 |

Published samples verified HTTP 200: `/`, `/about`, `/areas/glasgow`, `/areas/glasgow/house-removal`, `/moving-routes/glasgow-to-london`, `/services/man-and-van`, `/sitemap.xml`

### Sitemap verification
- Total `<loc>` entries: **251** (matches expected count exactly)
- Staged slugs present in sitemap: **0** (verified by pattern match against all 68 staged slugs)

### Browser checks (Playwright headless Chromium v1.62)
Tested 5 page types × 2 viewports (360px, 768px) = 10 checks:

| Check | Result |
|---|---|
| Horizontal overflow | ✓ PASS — body width = viewport width on all 10 |
| Visible focus ring (5 Tab stops per page) | ✓ PASS — all 50 focus targets had visible outline |
| FAQ toggle (details/summary) | ✓ PASS — toggles correctly on all 10 |
| Booking CTA present | ✓ PASS — `/book` link found on all 10 |

Pages tested: homepage, /about, /areas/glasgow, /areas/glasgow/house-removal, /moving-routes/glasgow-to-london

### Booking draft preservation — PASS (runtime verified)
Tested via Playwright headless against the running production build:

1. Navigated to `/book?service=house-removals` — `SearchParamsInitializer` dispatched `APPLY_SERVICE_ENTRY`, state advanced to step 2 (`serviceSlug=house-removal`)
2. `sv_booking_draft_v1` written to `localStorage` — `serviceSlug=house-removal`, `step=2`, `savedAt=1790213090789`
3. Navigated to `/areas/glasgow` — draft present in localStorage during content page visit
4. Clicked `See local pricing` CTA (href `/book`) on the content page
5. Returned to `/book` — form rendered "Journey" (JourneyFields, step 2) — draft restored
6. Verified: `serviceSlug` unchanged, `step` unchanged, `savedAt` unchanged

**Confirmed PASS:** Draft persists across same-origin navigation and is restored on /book load.

**Caveat:** Addresses were not entered. The production build calls `https://api.speedyvan.uk` for geocoding; no results returned from localhost origin. Draft persistence at step 2 is confirmed; full address entry requires the API running locally (dev mode).

### Source citation quality
- Original citations: 48 (one per page in section 1)
- After removing office-removal, student-move, packing-service, furniture-delivery sections: 16
- After removing flat-removal stair/entrance sections that cited parking pages: **8 final**
- All 8 remaining citations are on house-removal section 1 (loading position, road conditions, driveway, pedestrianised access) — each source directly addresses the specific external claim in its section

### Production deployment status
- **Not yet deployed to production**
- Release authorisation required before merging to main or deploying

### Google Search Console indexing
- **Not applicable** — branch not deployed; no impressions data available
- Stage 1 gate remains open until production deployment and one week of crawl data

---

## URL count reconciliation

---

## URL count reconciliation

### Verified baseline at `d5a5d5f` (PR #4 merge): 250 pages

| Category | Count |
|---|---|
| Static pages (no /about) | 10 |
| Area guides | 160 |
| Indexable services | 12 |
| European removals | 1 |
| City × service pages | 48 |
| Route guides | 19 |
| **Total** | **250** |

### Changes on this integration branch

| Commit | Change | Delta |
|---|---|---|
| `f5572913` | Added `/about` page | +1 static (10 → 11) |
| `d95e8167` (revised) | Stage gate applied — 20 new routes authored and moved to `moving-route-pages-stage2.ts`, NOT added to live sitemap | +0 to routable count |

### Current routable sitemap count: **251**

| Category | Pages | Source |
|---|---|---|
| Static pages | 11 | `sitemap.ts` `staticPages` array (includes /about) |
| Area guides | 160 | `AREAS` from `areas.ts` |
| Indexable services | 12 | `SERVICES` (1 of 13 is non-indexable) |
| European removals | 1 | `internationalPages` in `sitemap.ts` |
| City × service pages | 48 | `LOCAL_SERVICE_PAGES` in `city-service-pages.ts` |
| Route guides | 19 | `MOVING_ROUTE_PAGES` in `moving-route-pages.ts` |
| **TOTAL** | **251** | Verified from actual data registries |

---

## Staged content (authored, NOT routable — genuine 404s in production)

### Staged routes: 20 entries

**File:** `apps/web/src/lib/content/moving-route-pages-stage2.ts`

Not imported into `MOVING_ROUTE_PAGES`. Because `apps/web/src/app/(site)/moving-routes/[slug]/page.tsx` has `dynamicParams = false` and `generateStaticParams` reads only `MOVING_ROUTE_PAGES`, these slugs return genuine 404s.

| Origin | Destination | Slug |
|---|---|---|
| Glasgow | Leeds | `glasgow-to-leeds` |
| Glasgow | Bristol | `glasgow-to-bristol` |
| Glasgow | Newcastle | `glasgow-to-newcastle` |
| Edinburgh | Birmingham | `edinburgh-to-birmingham` |
| Edinburgh | Leeds | `edinburgh-to-leeds` |
| Aberdeen | Birmingham | `aberdeen-to-birmingham` |
| Aberdeen | Newcastle | `aberdeen-to-newcastle` |
| Dundee | Edinburgh | `dundee-to-edinburgh` |
| Dundee | Manchester | `dundee-to-manchester` |
| Inverness | Manchester | `inverness-to-manchester` |
| Perth | London | `perth-to-london` |
| Stirling | London | `stirling-to-london` |
| Stirling | Edinburgh | `stirling-to-edinburgh` |
| Falkirk | London | `falkirk-to-london` |
| Falkirk | Manchester | `falkirk-to-manchester` |
| Motherwell | London | `motherwell-to-london` |
| Hamilton | London | `hamilton-to-london` |
| Paisley | London | `paisley-to-london` |
| Livingston | London | `livingston-to-london` |
| Kirkcaldy | London | `kirkcaldy-to-london` |

Note: `dundee-to-edinburgh` appears once. No duplicate exists in the registry. Earlier progress reports listed it in both a "new routes" table and a route-coverage summary — that was a reporting artefact, not a data duplicate.

### Staged town service pages: 48 entries

**File:** `apps/web/src/lib/content/town-service-pages-1.ts`

Not imported into `LOCAL_SERVICE_PAGES`. `apps/web/src/app/(site)/areas/[slug]/[service]/page.tsx` has `dynamicParams = false` and `generateStaticParams` reads only `LOCAL_SERVICE_PAGES`, so these return genuine 404s.

| Town | Services |
|---|---|
| Elgin (Moray) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Glenrothes (Fife) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Musselburgh (East Lothian) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Hawick (Scottish Borders) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Irvine (North Ayrshire) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Bishopbriggs (East Dunbartonshire) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Arbroath (Angus) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Bathgate (West Lothian) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |

**Total staged:** 68 pages (20 routes + 48 town service pages)

---

## Page count arithmetic

| Step | Action | Total |
|---|---|---|
| Current published | 251 sitemap URLs (verified by HTTP 200 and sitemap.xml) | 251 |
| + Batch 1 (town service pages) | Activate `town-service-pages-1.ts` | 251 + 48 = **299** |
| + Batch 2 (staged routes) | Activate `moving-route-pages-stage2.ts` | 299 + 20 = **319** |
| Remaining to reach 1,000 | Further batches required | 1,000 − 319 = **681** |

All 68 staged pages remain unpublished until the Stage 1 review gate is cleared.

---

## Stage 1 review gate (REQUIRED before activating any staged content)

Do not import any staged content files until all five conditions are met:

| Condition | Status |
|---|---|
| 1. Production deployment of the 251-page branch | **Pending** — release authorisation required |
| 2. Google Search Console confirms indexing has begun (impressions visible) | **Pending** — no deployment yet |
| 3. At least one week of crawl data available | **Pending** — depends on condition 2 |
| 4. No canonical errors on current area or route pages | **Pending** — requires live crawl |
| 5. Mobile layout 360px and 768px acceptance checks | **PASS** — verified 2026-09-24 via Playwright |

Seven elapsed days after deployment is NOT automatic approval to expand. Each condition must be measured and recorded.

---

## Planned content batches for Stage 2 (after Stage 1 gate)

### Batch 1 activation: +48 pages → 299 total
- Activate `town-service-pages-1.ts`: import `TOWN_SERVICE_PAGES_1` into `LOCAL_SERVICE_PAGES` in `city-service-pages.ts`
- Qualifying URL evidence: area guide impressions for the 8 towns in GSC

### Batch 2 activation: +20 routes → 319 total
- Activate `moving-route-pages-stage2.ts`: import `STAGED_ROUTE_PAGES_STAGE2` and spread into `MOVING_ROUTE_PAGES`
- Qualifying URL evidence: existing route pages showing impressions in GSC

### Batch 3: +120 pages → 439 total
- `town-service-pages-2.ts`: 20 expansion towns × 6 services
- Towns: alness, invergordon, aviemore, peterhead, fraserburgh, forres,
  montrose, forfar, blairgowrie, crieff, cupar, leven, dunblane, alloa,
  grangemouth, dalkeith, linlithgow, broxburn, westhill, banchory

### Batch 4: +120 pages → 559 total
- `town-service-pages-3.ts`: 20 more expansion towns × 6 services
- Towns: stranraer, annan, lockerbie, kilmarnock-area, largs, troon,
  prestwick, cumnock, galston, kirkintilloch, bearsden, milngavie,
  clydebank, greenock, port-glasgow, dumbarton, helensburgh, campbeltown,
  pitlochry, aberfeldy

### Batch 5: +120 pages → 679 total
- `town-service-pages-4.ts`: 20 more towns × 6 services
- Towns: airdrie, coatbridge, wishaw, larkhall, lanark, east-kilbride-area,
  saltcoats, ardrossan, stevenston, kilwinning, girvan, maybole,
  penicuik, bonnyrigg, tranent, prestonpans, north-berwick, dunbar,
  ellon, inverurie-area

### Batch 6: +120 pages → 799 total
- `town-service-pages-5.ts`: 20 towns × 6 services
- Towns: wick, thurso, ullapool, portree, stornoway, lerwick, kirkwall,
  fort-william, mallaig, tain, nairn, dingwall, huntly, stonehaven,
  musselburgh-area, hawick-area, irvine-area, livingston-area,
  bishopbriggs-area, arbroath-area

### Batch 7: Cost and planning guides → +10 pages → 809 total
- `/guides/house-removal-cost-scotland`
- `/guides/flat-removal-checklist`
- `/guides/moving-to-scotland-from-england`
- `/guides/student-moving-guide-scotland`
- `/guides/office-removal-checklist`
- `/guides/furniture-delivery-scotland`
- `/guides/moving-highlands-guide`
- `/guides/long-distance-removals-scotland`
- `/guides/moving-from-scotland-to-london`
- `/guides/packing-guide-scotland`

### Batch 8: Additional city × service pages → +80 pages → 889 total
- Extend city-service-pages.ts to 16 cities × 6 services (currently 8 cities × 6)
- Add: kilmarnock, ayr, dumfries, greenock, livingston, clydebank, hamilton, east-kilbride

### Batch 9: Top expansion town × priority service combos → +111 pages → 1,000 total
- house-removal pages for the 111 most-searched remaining expansion towns
- qualifying evidence required before each sub-batch of 20

---

## Content rules (apply to all batches)

- Scotland-origin only for routes; destinations may be anywhere in Britain
- No invented driver counts, reviews, prices or availability claims
- Each page must be genuinely differentiated from its parent area guide
- Official source URLs from the town's `moveAdvice` data take priority
- All page content in British English
- Do not import new content into sitemap.ts until the relevant review gate is cleared

---

## Active route coverage (19 routes)

**From Glasgow (5):** London, Manchester, Birmingham, Cardiff, Edinburgh
**From Edinburgh (4):** London, Manchester, Newcastle, Bristol
**From Aberdeen (3):** London, Edinburgh, Manchester
**From Inverness (4):** Glasgow, Edinburgh, London + (Manchester — staged)
**From Dundee (1):** London + (Edinburgh, Manchester — staged)
**From Perth (1):** Manchester + (London — staged)
**From Stirling (1):** Birmingham + (London, Edinburgh — staged)
**From Dunfermline (1):** Newcastle

**Staged additions (20):** glasgow→leeds, glasgow→bristol, glasgow→newcastle,
edinburgh→birmingham, edinburgh→leeds, aberdeen→birmingham, aberdeen→newcastle,
dundee→edinburgh, dundee→manchester, inverness→manchester, perth→london,
stirling→london, stirling→edinburgh, falkirk→london, falkirk→manchester,
motherwell→london, hamilton→london, paisley→london, livingston→london, kirkcaldy→london
