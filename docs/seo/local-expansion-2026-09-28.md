# Local SEO expansion review - 2026-09-28

## Verified baseline

- Editing worktree: `C:\speedy-van-platform-prod-baseline-d2b9e3d`
- Repository: `https://github.com/speedy-van/speedy-van-platform.git`
- Branch: `seo/local-expansion-2026-09-28`
- Starting HEAD for this round: `f268a2e40f8f3f62f187ed13fbfbf14ec26fd759`
- Original dirty checkout preserved: `C:\speedy-van-platform`
  - `M apps/web/src/app/(site)/layout.tsx`
  - `D apps/web/src/components/SofaItemPopup.tsx`
  - `M packages/db/prisma/schema.prisma`

No production deployment, Vercel relink, database schema change, production data write, real booking or real payment was made.

## Search Console access

No callable tool in this session exposed URL Inspection, sitemap submission, indexing, ranking, impression or click rows. This report therefore does not claim Google indexing or ranking state.

## Inventory outcome

The expansion now creates standalone local-service URLs for verified cities, towns and villages in the eight requested geographic groups. Synonyms from the keyword corpus are grouped by intent; they do not create separate doorway pages.

| Item | Count |
| --- | ---: |
| Target geographic groups | 8 |
| Target localities in those groups | 114 |
| Service intents per target locality | 10 |
| Target locality/service matrix | 1,140 URLs |
| Total `LOCAL_SERVICE_PAGES` exposed to Next | 1,146 URLs |
| Sitemap `<loc>` entries on local dev | 1,367 |
| Sitemap local-service entries | 1,146 |
| `next build` static pages generated | 1,395 |

The six extra local-service URLs outside the target matrix are retained reviewed pages from earlier authored content. They remain because they are valid existing content, not new duplicate targets.

## Geographic matrix

| Group | Localities | Service URLs | Outcome |
| --- | ---: | ---: | --- |
| Glasgow | 23 | 230 | Reviewed and retained across Glasgow neighbourhoods and nearby towns such as Paisley, East Kilbride and Hamilton. |
| Edinburgh | 22 | 220 | Reviewed and retained across Edinburgh, Leith, Livingston and Lothian towns. |
| Inverness | 10 | 100 | Reviewed and retained for Highland localities including Inverness, Nairn, Dingwall, Aviemore, Wick, Thurso and Ullapool. |
| Aberdeen | 16 | 160 | Reviewed and retained across Aberdeen/Grampian localities including Westhill, Inverurie, Ellon, Peterhead and Fraserburgh. |
| Dundee | 8 | 80 | Reviewed and retained across Dundee/Angus localities including Broughty Ferry, Carnoustie, Arbroath and Kirriemuir. |
| Fort William | 8 | 80 | Completed missing Lochaber localities: Fort William, Caol, Mallaig, Corpach, Spean Bridge, Ballachulish, Glencoe and Kinlochleven. |
| Isle of Skye | 10 | 100 | Completed Skye localities: Isle of Skye, Portree, Broadford, Kyleakin, Dunvegan, Uig, Armadale, Skye, Carbost, Staffin and Edinbane. `armadale-skye` remains distinct from West Lothian `armadale`. |
| Perth | 17 | 170 | Reviewed and retained across Perth/Perthshire and Fife localities including Crieff, Blairgowrie, Pitlochry and St Andrews. |

Sleat is retained as Skye route-area guidance only, not a standalone service URL. Reason: it is a broader peninsula/service-area descriptor rather than a distinct verified town/village destination page in this pass.

## Service-intent matrix

| Public URL slug | Intent grouped here | Booking target | Request context |
| --- | --- | --- | --- |
| `house-removal` | house, home, residential and full-house removals | `/book?service=house-removal` | `house-removals`, room inventory |
| `flat-removals` | flat, apartment, studio and one/two-bedroom flat moves | `/book?service=flat-removals` | `flat-removals`, room inventory |
| `furniture-delivery` | furniture, sofa, bed, wardrobe and marketplace collection | `/book?service=furniture-delivery` | `furniture`, item inventory |
| `storage-transport` | storage collection/delivery and moving into/out of storage | `/book?service=storage-transport` | `storage`, item inventory |
| `office-removal` | office relocation, desks, files and boxed office equipment | `/book?service=office-removal` | `office`, item inventory |
| `business-removals` | commercial, shop, studio, stock and business-equipment moves | `/book?service=business-removals` | `business`, item inventory |
| `man-and-van` | man and van, man with a van and local van-with-driver help | `/book?service=man-and-van` | `man-and-van`, item inventory |
| `student-move` | student removals, halls/shared-flat and student storage moves | `/book?service=student-move` | `student-move`, item inventory |
| `small-moves` | small moves, single-room and part-load removals | `/book?service=small-moves` | `small-moves`, room inventory |
| `packing-service` | packing help, removals with packing and dismantling/assembly context | `/book?service=packing-service` | `packing-service`, room inventory |

`entryServiceSlug` is request/draft/quote context, not a persisted `Booking` table column. Business remains intentionally distinct from Office in UI labels, draft identity, quote request and booking payload context. Storage and `storage-transport` now share the same booking intent; Storage remains distinct from generic Man and Van.

## Schema decision

Schema.org `City` includes towns in this project model and is not limited to formal city-status pages. `Place` is acceptable for Fort William/Skye localities but not mandatory. No schema churn was made solely to relabel towns.

## Rendered SEO checks

Representative new and retained local-service pages checked on `http://localhost:3004`:

| URL | HTTP | Canonical | Robots | CTA |
| --- | ---: | --- | --- | --- |
| `/areas/corpach/storage-transport` | 200 | `https://www.speedyvan.uk/areas/corpach/storage-transport` | `index, follow` | `/book?service=storage-transport` |
| `/areas/spean-bridge/house-removal` | 200 | `https://www.speedyvan.uk/areas/spean-bridge/house-removal` | `index, follow` | `/book?service=house-removal` |
| `/areas/ballachulish/man-and-van` | 200 | `https://www.speedyvan.uk/areas/ballachulish/man-and-van` | `index, follow` | `/book?service=man-and-van` |
| `/areas/glencoe/furniture-delivery` | 200 | `https://www.speedyvan.uk/areas/glencoe/furniture-delivery` | `index, follow` | `/book?service=furniture-delivery` |
| `/areas/kinlochleven/student-move` | 200 | `https://www.speedyvan.uk/areas/kinlochleven/student-move` | `index, follow` | `/book?service=student-move` |
| `/areas/kyleakin/office-removal` | 200 | `https://www.speedyvan.uk/areas/kyleakin/office-removal` | `index, follow` | `/book?service=office-removal` |
| `/areas/dunvegan/business-removals` | 200 | `https://www.speedyvan.uk/areas/dunvegan/business-removals` | `index, follow` | `/book?service=business-removals` |
| `/areas/uig/storage-transport` | 200 | `https://www.speedyvan.uk/areas/uig/storage-transport` | `index, follow` | `/book?service=storage-transport` |
| `/areas/armadale-skye/man-and-van` | 200 | `https://www.speedyvan.uk/areas/armadale-skye/man-and-van` | `index, follow` | `/book?service=man-and-van` |
| `/areas/carbost/furniture-delivery` | 200 | `https://www.speedyvan.uk/areas/carbost/furniture-delivery` | `index, follow` | `/book?service=furniture-delivery` |
| `/areas/staffin/house-removal` | 200 | `https://www.speedyvan.uk/areas/staffin/house-removal` | `index, follow` | `/book?service=house-removal` |
| `/areas/edinbane/small-moves` | 200 | `https://www.speedyvan.uk/areas/edinbane/small-moves` | `index, follow` | `/book?service=small-moves` |
| `/areas/portree/packing-service` | 200 | `https://www.speedyvan.uk/areas/portree/packing-service` | `index, follow` | `/book?service=packing-service` |
| `/areas/mallaig/business-removals` | 200 | `https://www.speedyvan.uk/areas/mallaig/business-removals` | `index, follow` | `/book?service=business-removals` |

Parent area HTML checks:

- `/areas/dundee`: 200, nearby section rendered, 14 locality cards.
- `/areas/perth`: 200, nearby section rendered, 9 locality cards.
- `/areas/fort-william`: 200, nearby section rendered, 8 locality cards.
- `/areas/isle-of-skye`: 200, nearby section rendered, 10 locality cards, no `href="/areas/armadale"`.
- `/areas/not-a-real-place/business-removals`: 404 with `noindex`.
- `/areas/glasgow/not-real-service`: 404 with `noindex`.
- `/sitemap.xml`: 1,367 locs; 1,146 local-service locs. New selected URLs for Corpach, Armadale Skye, Staffin, Mallaig and Portree are present.

Browser snapshots:

- `/book` at 360px on `http://localhost:3004`: fresh service selector rendered.
- `/book?service=house-removals`: opens `Plan the home move`.
- `/book?service=house`: valid alias opens `Plan the home move`.
- `/book?service=unknown` on a fresh origin: unknown service ignored, service selector rendered.
- `/book?service=storage-transport`: opens `Plan the storage run`.
- `/book?service=business-removals`: opens `Plan the business move`.
- `/areas/isle-of-skye` at 360px and `/areas/fort-william` at 768px: locality sections visible; console showed no errors, only existing warnings/noise.

## Booking and API checks

Automated regression checks passed:

- `storage` and `storage-transport` share one draft identity, including differing labels `Storage` and `Storage Transport`.
- Storage remains distinct from Man and Van.
- Business remains distinct from Office.
- `office` and `office-removal` share the intended Office capacity alias.
- Van capacity aliases: `office`/`office-removal`/`business`/`business-removals` => large; `storage`/`storage-transport` => medium; `man-and-van` => small.
- Existing booking regression covers same-service draft restoration, different-service reset, reload/history behaviour, stale quote blocking, checkout locks and no stale payment continuation.

Matching local API check:

- API source/version: same worktree and branch as this PR, started separately on `http://localhost:4012`.
- Database isolation attempt: no Docker, no `psql`, no `.env.local`, and no `TEST_DATABASE_URL` were available in this environment. A local Postgres test database could not be created.
- The matching API was pointed at `127.0.0.1:55432` and `/pricing/calculate` returned HTTP 503 with `PRICING_CONFIG_UNAVAILABLE`.
- This confirms `PRICING_CONFIG_UNAVAILABLE` remains fail-closed and fallback rates were not restored.
- A successful quote recalculation against a matching frontend/API with an isolated database was not completed. No `/booking/create` request, production booking or payment was submitted.

## Quality checks

Checks run against the final source tree:

- `npm run test:regression`: passed, 142/142.
- `npm run typecheck -w packages/shared`: passed.
- `npm run typecheck -w apps/web`: passed.
- `npm run typecheck -w apps/api`: passed.
- `npm run lint -w apps/web`: passed with pre-existing warnings only:
  - `src/components/european/EuropeanEnquiryForm.tsx` uses `<img>`.
  - `src/components/FaqSearch.tsx` uses `<img>`.
  - `next lint` deprecation warning from Next.js 15.5.25.
- `npm run lint -w apps/api`: passed.
- `npm run build -w apps/api`: passed.
- `npm run build -w apps/web`: passed, generated 1,395 static pages.

## Remaining limitations

- No authenticated Search Console metrics or URL Inspection evidence was available.
- No successful isolated-database quote recalculation was possible because this machine has no local Postgres tooling and no test database URL.
- No production end-to-end payment or booking verification is claimed.
