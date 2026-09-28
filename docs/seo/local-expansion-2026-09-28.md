# Local SEO expansion review - 2026-09-28

## Verified baseline

- Editing worktree: `C:\speedy-van-platform-prod-baseline-d2b9e3d`
- Repository: `https://github.com/speedy-van/speedy-van-platform.git`
- Branch: `seo/local-expansion-2026-09-28`
- Starting HEAD for this round: `724a67868b343ec3c4514d43d4469226a8777146`
- Original dirty checkout preserved: `C:\speedy-van-platform`
  - `M apps/web/src/app/(site)/layout.tsx`
  - `D apps/web/src/components/SofaItemPopup.tsx`
  - `M packages/db/prisma/schema.prisma`

No deployment, Vercel relink, database migration, production data write, real booking, real payment, admin refactor or driver workflow change was made.

## Search Console access

The HYPD connector exposed only the Search Console connection description in this session:

- Source: Google Search Console
- Scope: `webmasters.readonly`
- Data caveats: 16-month retention, 2-3 day finalized-data lag, rare queries anonymised

The callable tools needed to list properties, inspect URLs, submit or read sitemaps, or query performance rows were not exposed in this session. This report therefore does not claim Google indexing, ranking, impressions, clicks, or URL Inspection state.

## Inventory outcome

The expansion now creates standalone local-service URLs for verified cities, towns and villages in the eight requested geographic groups. Synonyms from the keyword corpus are grouped by intent; they do not create separate doorway pages.

| Item | Count |
| --- | ---: |
| Target geographic groups | 8 |
| Target localities in those groups | 102 |
| Service intents per target locality | 10 |
| Target locality/service matrix | 1,020 URLs |
| Total `LOCAL_SERVICE_PAGES` exposed to Next | 1,026 URLs |
| Sitemap `<loc>` entries on local dev | 1,235 |
| Sitemap local-service entries | 1,026 |

The six extra local-service URLs outside the target matrix are retained reviewed pages from earlier authored content. They remain because they are valid existing content, not new duplicate targets.

## Geographic matrix

| Group | Localities | Service URLs | Outcome |
| --- | ---: | ---: | --- |
| Glasgow | 23 | 230 | Reviewed and expanded to the full service matrix, including Glasgow, neighbourhoods and nearby towns such as Paisley, East Kilbride and Hamilton. |
| Edinburgh | 22 | 220 | Reviewed and expanded to the full service matrix, including Edinburgh, Edinburgh Leith, Musselburgh, Livingston and Lothian towns. |
| Inverness | 10 | 100 | Reviewed and expanded to Highland localities such as Inverness, Nairn and Dingwall. |
| Aberdeen | 16 | 160 | Reviewed and expanded to Aberdeen/Grampian localities including Westhill and Inverurie. |
| Dundee | 8 | 80 | Reviewed and expanded to Dundee/Angus localities including Broughty Ferry and Carnoustie. |
| Fort William | 3 | 30 | Reviewed and expanded to Fort William, Caol and Mallaig. |
| Isle of Skye | 3 | 30 | Reviewed and expanded to Isle of Skye, Portree and Broadford. Skye does not link to West Lothian `/areas/armadale`. |
| Perth | 17 | 170 | Reviewed and expanded to Perth/Perthshire localities including Crieff and Blairgowrie. |

## Service-intent matrix

| Public service URL slug | Keyword intent grouped here | Booking entry |
| --- | --- | --- |
| `house-removal` | house removals, home removals, residential removals, full-house moving | `/book?service=house-removal`; persisted service `house-removal`; room inventory |
| `flat-removals` | flat removals, apartment removals, studio moves, one-bed and two-bed flat moves | `/book?service=flat-removals`; persisted service `man-and-van`; entry `flat-removals`; room inventory |
| `furniture-delivery` | furniture removals, sofa delivery, bed collection, wardrobe delivery, marketplace collection | `/book?service=furniture-delivery`; persisted service `furniture-delivery`; item inventory |
| `storage-transport` | storage transport, storage collection and delivery, moving furniture into or out of storage | `/book?service=storage-transport`; persisted service `man-and-van`; entry `storage`; item inventory |
| `office-removal` | office removals, office relocation, office furniture and office equipment moving | `/book?service=office-removal`; persisted service `office-removal`; entry `office`; item inventory |
| `business-removals` | business removals, commercial removals, shop relocation, studio and commercial furniture moves | `/book?service=business-removals`; persisted service `office-removal`; entry `business`; item inventory |
| `man-and-van` | man and van, man with a van, van and man, two men and a van, local van-with-driver | `/book?service=man-and-van`; persisted service `man-and-van`; item inventory |
| `student-move` | student removals, student movers, student storage transport, halls/shared-flat moves | `/book?service=student-move`; persisted service `student-move`; item inventory |
| `small-moves` | small moves, small removals, single-room moves, part-load removals | `/book?service=small-moves`; persisted service `man-and-van`; entry `small-moves`; room inventory |
| `packing-service` | packing service, removals with packing, packing and moving, dismantling/assembly context | `/book?service=packing-service`; persisted service `packing-service`; room inventory |

`Business Removals` is intentionally distinct from `Office Removals` in the UI, draft identity, quote request signature and booking payload. The database service remains `office-removal` for compatibility, while `entryServiceSlug=business` and `serviceName=Business Removals` preserve the business-specific context for pricing and displays. `Storage Transport` remains transport-only; no storage-space rental claim was added.

## Schema decision

Schema.org `City` includes towns in this project model and is not limited to formal city-status pages. `Place` is acceptable for Fort William but not mandatory. No schema churn was made solely to relabel towns.

## Rendered SEO checks

Representative pages checked on `http://localhost:3000`:

| URL | HTTP | Canonical | Robots | CTA |
| --- | ---: | --- | --- | --- |
| `/areas/glasgow/business-removals` | 200 | `https://www.speedyvan.uk/areas/glasgow/business-removals` | `index, follow` | `/book?service=business-removals` |
| `/areas/edinburgh/storage-transport` | 200 | `https://www.speedyvan.uk/areas/edinburgh/storage-transport` | `index, follow` | `/book?service=storage-transport` |
| `/areas/inverness/man-and-van` | 200 | `https://www.speedyvan.uk/areas/inverness/man-and-van` | `index, follow` | `/book?service=man-and-van` |
| `/areas/aberdeen/office-removal` | 200 | `https://www.speedyvan.uk/areas/aberdeen/office-removal` | `index, follow` | `/book?service=office-removal` |
| `/areas/broughty-ferry/flat-removals` | 200 | `https://www.speedyvan.uk/areas/broughty-ferry/flat-removals` | `index, follow` | `/book?service=flat-removals` |
| `/areas/caol/student-move` | 200 | `https://www.speedyvan.uk/areas/caol/student-move` | `index, follow` | `/book?service=student-move` |
| `/areas/broadford/furniture-delivery` | 200 | `https://www.speedyvan.uk/areas/broadford/furniture-delivery` | `index, follow` | `/book?service=furniture-delivery` |
| `/areas/perth/packing-service` | 200 | `https://www.speedyvan.uk/areas/perth/packing-service` | `index, follow` | `/book?service=packing-service` |
| `/areas/isle-of-skye/business-removals` | 200 | `https://www.speedyvan.uk/areas/isle-of-skye/business-removals` | `index, follow` | `/book?service=business-removals` |

Additional checks:

- `/areas/not-a-real-place/business-removals`: 404 with `noindex`.
- `/areas/glasgow/not-real-service`: 404 with `noindex`.
- `/sitemap.xml`: 1,235 locs; 1,026 local-service URLs.
- Service counts in sitemap: `house-removal` 103, `flat-removals` 103, `furniture-delivery` 103, `storage-transport` 102, `office-removal` 103, `business-removals` 102, `man-and-van` 102, `student-move` 103, `small-moves` 102, `packing-service` 103.
- Selected sitemap URLs present: `/areas/broughty-ferry/storage-transport`, `/areas/caol/business-removals`, `/areas/broadford/furniture-delivery`, `/areas/east-kilbride/business-removals`, `/areas/hamilton/storage-transport`, `/areas/edinburgh-leith/man-and-van`.
- Internal links present from `/areas/broughty-ferry`, `/areas/caol`, `/areas/broadford`, `/services/storage-transport` and `/services/business-removals`.
- `/areas/isle-of-skye` contains Skye Armadale context but no `href="/areas/armadale"`.

Browser-rendered 360px and 768px checks:

- `/areas/glasgow/business-removals`, `/areas/edinburgh/storage-transport`, `/areas/broughty-ferry/flat-removals`, `/areas/caol/student-move`, `/areas/broadford/furniture-delivery`: 200, expected H1 visible, CTA visible, no horizontal overflow, no console errors.
- `/book?service=business-removals`: opens `Plan the business move` at both widths, no horizontal overflow, no console errors.
- `/book?service=storage-transport`: opens `Plan the storage run` at both widths, no horizontal overflow, no console errors.

Existing locality sections from the previous PR fix were rechecked in this round:

- `/areas/dundee`: 200, nearby content rendered, at least 14 locality links visible in server HTML.
- `/areas/perth`: 200, nearby content rendered, at least 9 locality links visible in server HTML.
- `/areas/fort-william`: 200, nearby content rendered, at least 8 locality links visible in server HTML.
- `/areas/isle-of-skye`: 200, nearby content rendered, at least 10 locality links visible in server HTML, no West Lothian Armadale link.

## Booking checks

Frontend checks on `http://localhost:3000`:

- `/book` with fresh storage: 200, service selection rendered.
- `/book?service=house-removals`: 200, opens `Plan the home move`.
- `/book?service=house`: 200, valid alias opens `Plan the home move`.
- `/book?service=unknown`: 200, unknown service ignored and service selection rendered.
- Restored draft, same service via `/book?service=storage-transport`: restored to `Storage load`; saved item remained visible; quote retry state shown.
- Restored draft, different service via `/book?service=business-removals`: reset to `Plan the business move`; reload preserved the business move context.
- Payment stayed blocked when quote status was not valid; no `/booking/create` request was made.

Matching API checks:

- Matching local API on `http://localhost:4010` and a second matching attempt on `http://localhost:4011` both returned `503 PRICING_CONFIG_UNAVAILABLE` for `/pricing/calculate`.
- Sanitised Prisma cause: the matching API cannot reach the configured Neon host on TCP `5432` from this environment.
- Because pricing config is unavailable on the matching API, a complete current quote recalculation after edits could not be verified end-to-end in this environment.

Non-matching comparison only:

- Existing API on `http://localhost:4000` is from `C:\speedy-van-platform\apps\api`, branch `booking-v2-phase-a`, commit `b49872706ae67c03080a1d5d9b33d204a051ffa7`.
- It returns pricing responses, but it is not the matching API revision and does not prove this PR end-to-end.
- Concrete incompatibility: old API priced `business` and `business-removals` as the fallback base (`52.8` in the sample request), while `office`/`office-removal` returned `153.8`; the new code maps business/commercial intents to `officeBasePrice`.

## Quality checks

Checks run against this worktree after implementation:

- `npm run typecheck -w apps/web`: passed.
- `npm run typecheck -w apps/api`: passed.
- `npm run typecheck -w packages/shared --if-present`: passed.
- `npm run lint -w apps/web`: passed with pre-existing warnings only:
  - `src/components/european/EuropeanEnquiryForm.tsx` uses `<img>`.
  - `src/components/FaqSearch.tsx` uses `<img>`.
  - `next lint` deprecation warning from Next.js 15.5.25.
- `npm run lint -w apps/api`: passed after removing an unused `fail` import in `apps/api/src/routes/draft.ts`.
- `npm run build -w apps/api`: passed.
- `npm run build -w apps/web`: passed and generated 1,263 static pages.

## Remaining limitations

- No authenticated Search Console metrics or URL Inspection evidence was available through callable tools.
- No production deployment was made and no production indexing/ranking claim is made.
- Matching API quote and payment end-to-end verification remains blocked by local inability to reach the configured Neon database from this environment. No production data write, booking creation or payment attempt was performed.
