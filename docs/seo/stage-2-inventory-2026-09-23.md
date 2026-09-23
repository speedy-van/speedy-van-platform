# Stage 2 URL Inventory — Path to 1,000 Pages
**Date:** 2026-09-23  
**Branch:** `integration/seo-1000-2026-09-23`  
**Build:** 299 static pages (includes admin/auth/driver routes)

---

## Current sitemap page count: 271

| Category | Pages | Notes |
|---|---|---|
| Static pages | 11 | /, /services, /areas, /moving-routes, /about, /pricing, /guides, /guides/man-and-van-or-house-removals, /privacy, /terms, /cookies |
| Area guides | 160 | 32 base areas + 128 expansion towns (PR #4) |
| Indexable services | 12 | Excludes non-indexable services |
| European removals | 1 | /services/european-removals |
| City × service pages | 48 | 8 cities × 6 services (city-service-pages.ts) |
| Route guides | 39 | 19 from PR #4 + 20 new added today |
| **TOTAL** | **271** | Live in sitemap |

---

## Staged content (authored, NOT yet in sitemap): +48

**File:** `apps/web/src/lib/content/town-service-pages-1.ts`

8 expansion towns × 6 services = 48 pages

| Town | Services Authored |
|---|---|
| Elgin (Moray) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Glenrothes (Fife) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Musselburgh (East Lothian) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Hawick (Scottish Borders) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Irvine (North Ayrshire) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Bishopbriggs (East Dunbartonshire) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Arbroath (Angus) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |
| Bathgate (West Lothian) | house-removal, flat-removals, furniture-delivery, office-removal, student-move, packing-service |

**To activate:** Import `TOWN_SERVICE_PAGES_1` into `LOCAL_SERVICE_PAGES` in `city-service-pages.ts` and verify the route `apps/web/src/app/(site)/areas/[areaSlug]/[serviceSlug]/page.tsx` exists and handles these slugs.

---

## Stage 1 review gate (REQUIRED before activating Stage 2)

Do not import `town-service-pages-1.ts` or add further pages until:

1. Production deployment of the current 271-page branch
2. Google Search Console confirms indexing has begun (impressions in GSC)
3. At least one week of crawl data available
4. No canonical errors on current area or route pages
5. 360px and 768px interactive acceptance checks passed (outstanding per `scotland-expansion-review-2026-09-23.md`)

---

## Planned content batches for Stage 2 (after Stage 1 gate)

### Batch 1 activation: +48 pages → 319 total
- Activate `town-service-pages-1.ts` (already authored)

### Batch 2: +120 pages → 439 total
- `town-service-pages-2.ts`: 20 expansion towns × 6 services
- Towns to cover: alness, invergordon, aviemore, peterhead, fraserburgh, forres,
  arbroath (done—skip), montrose, forfar, blairgowrie, crieff, glenrothes (done—skip),
  cupar, leven, dunblane, alloa, grangemouth, dalkeith, linlithgow, broxburn

### Batch 3: +120 pages → 559 total
- `town-service-pages-3.ts`: 20 more expansion towns × 6 services
- Towns: stranraer, annan, lockerbie, dumfries-area, kilmarnock-area,
  largs, troon, prestwick, cumnock, galston, bishopbriggs (done—skip),
  kirkintilloch, bearsden, milngavie, clydebank, greenock, port-glasgow,
  dumbarton, helensburgh, campbeltown

### Batch 4: +120 pages → 679 total
- `town-service-pages-4.ts`: 20 more towns × 6 services
- Towns: from remaining 128 expansion pool — airdrie, coatbridge, wishaw,
  larkhall, lanark, hamilton-area, east-kilbride-area, irvine (done—skip),
  saltcoats, ardrossan, stevenston, kilwinning, girvan, maybole,
  penicuik, bonnyrigg, tranent, prestonpans, north-berwick, dunbar

### Batch 5: +120 pages → 799 total
- `town-service-pages-5.ts`: 20 towns × 6 services
- Towns: remaining Highlands and Islands — wick, thurso, ullapool, portree,
  stornoway, lerwick, kirkwall, fort-william, mallaig, tain,
  nairn, dingwall, huntly, inverurie (base area already covered),
  stonehaven (base area), westhill (base area), ellon (base area),
  banchory, pitlochry, aberfeldy

### Batch 6: Additional routes → +20 pages → 819 total
- Additional Scotland-origin routes to cover remaining expansion town origins
- Suggested: ayr-to-london, ayr-to-manchester, dumfries-to-london,
  dumfries-to-manchester, greenock-to-london, clydebank-to-london,
  east-kilbride-to-london, kilmarnock-to-london, airdrie-to-london,
  hamilton-to-edinburgh (short Scotland-Scotland), livingston-to-edinburgh,
  kirkcaldy-to-edinburgh, musselburgh-to-glasgow, hawick-to-edinburgh,
  elgin-to-inverness, elgin-to-aberdeen, inverness-to-edinburgh (new),
  perth-to-edinburgh, dundee-to-glasgow, stirling-to-glasgow

### Batch 7: Cost and planning guides → +10 pages → 829 total
- `/guides/house-removal-cost-scotland` — average cost breakdown
- `/guides/flat-removal-checklist` — Scot tenement specific
- `/guides/moving-to-scotland-from-england` — inbound moves
- `/guides/student-moving-guide-scotland` — term-time planning
- `/guides/office-removal-checklist` — business moves
- `/guides/furniture-delivery-scotland` — single items
- `/guides/moving-highlands-guide` — rural Scotland specifics
- `/guides/long-distance-removals-scotland` — planning 300+ mile moves
- `/guides/moving-from-scotland-to-london` — most common long-distance
- `/guides/packing-guide-scotland` — materials and method

### Batch 8: Additional city × service pages → +80 pages → 909 total
- Extend city-service-pages.ts to 16 cities × 6 services = 96 entries (currently 48)
- Add: Kilmarnock, Ayr, Dumfries, Greenock, Livingston, Clydebank,
  Hamilton (SpeedyVan base city), East Kilbride

### Batch 9: Top expansion town × priority service combos → +91 pages → 1,000 total
- Focus on most-searched combinations:
  house-removal pages for the 91 most-searched remaining expansion towns

---

## Content rules (apply to all batches)

- Scotland-origin only for routes; destinations may be anywhere in Britain
- No invented driver counts, reviews, prices or availability claims
- Each page must be genuinely differentiated from its parent area guide
- Official source URLs from the town's `moveAdvice` data take priority
- All content in British English; commit messages in English
- Do not import new content into sitemap.ts until Stage 1 gate is cleared

---

## Route coverage summary (39 routes)

**From Glasgow (5):** London, Manchester, Birmingham, Cardiff, Edinburgh  
**From Edinburgh (5):** London, Manchester, Newcastle, Bristol, Birmingham  
**To Leeds (2):** Glasgow to Leeds, Edinburgh to Leeds  
**From Aberdeen (4):** London, Edinburgh, Manchester, Birmingham, Newcastle → 5  
**From Inverness (4):** Glasgow, Edinburgh, London, Manchester  
**From Dundee (3):** London, Edinburgh, Manchester  
**From Perth (2):** Manchester, London  
**From Stirling (4):** Birmingham, London, Edinburgh (new), Glasgow (TBC)  
**From Dunfermline (1):** Newcastle  
**From Falkirk (2):** London, Manchester  
**From Motherwell (1):** London  
**From Hamilton (1):** London  
**From Paisley (1):** London  
**From Livingston (1):** London  
**From Kirkcaldy (1):** London  
**From Glasgow (new) (3):** Leeds, Bristol, Newcastle  

**Total: 39 routes**
