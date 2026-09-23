# Stage 2 URL Inventory — Path to 1,000 Pages
**Date:** 2026-09-24 (revised from 2026-09-23 draft)
**Branch:** `integration/seo-1000-2026-09-23`

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

## Stage 1 review gate (REQUIRED before activating any staged content)

Do not import any staged content files until all five conditions are met:

1. Production deployment of the 251-page branch
2. Google Search Console confirms indexing has begun on the current pages (impressions visible)
3. At least one week of crawl data available
4. No canonical errors on current area or route pages
5. Mobile layout acceptance checks at 360px and 768px passed (see `scotland-expansion-review-2026-09-23.md`)

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
