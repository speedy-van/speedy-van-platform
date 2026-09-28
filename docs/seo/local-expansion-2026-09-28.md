# Local SEO expansion review - 2026-09-28

## Verified baseline

- Editing worktree: `C:\speedy-van-platform-prod-baseline-d2b9e3d`
- Repository: `https://github.com/speedy-van/speedy-van-platform.git`
- Base SHA before this branch work: `d2b9e3d97c438909bc33146aba04ebfd8298f05e`
- Branch: `seo/local-expansion-2026-09-28`
- Original dirty checkout preserved: `C:\speedy-van-platform`
  - `M apps/web/src/app/(site)/layout.tsx`
  - `D apps/web/src/components/SofaItemPopup.tsx`
  - `M packages/db/prisma/schema.prisma`

No deployment, Vercel relink, database migration, pricing rewrite, payment change, admin change, driver change or API contract change was made.

## Search Console access

The HYPD connector exposed only the Search Console connection description in this session:

- Source: Google Search Console
- Scope: `webmasters.readonly`
- Data caveats: 16-month retention, 2-3 day finalized-data lag, rare queries anonymised

The callable tools needed to list properties, inspect URLs, submit or read sitemaps, or query performance rows were not exposed in this session. This report therefore does not claim Google indexing, ranking, impressions, clicks, or URL Inspection state.

## Inventory

Source-counted area URL inventory:

| State | Standalone `/areas/{slug}` | Local service `/areas/{area}/{service}` | Combined `/areas` URLs |
| --- | ---: | ---: | ---: |
| Before `origin/main` | 160 | 48 | 208 |
| After this change | 161 | 60 | 221 |
| Delta | +1 | +12 | +13 |

Rendered sitemap check against the final local source tree on `http://localhost:3004`:

- Total `<loc>` entries: 264
- `/areas/*` entries: 221
- Added URLs checked: 13
- Duplicate sitemap locs: 0
- `/areas/not-a-real-place`: 404 with `noindex`

## Geographic outcomes

| Group | Outcome |
| --- | --- |
| Glasgow | Reviewed and retained. Existing core page, six local service pages and nearby groups already cover city, neighbourhood, flat, house, furniture, student, office and packing intent. No duplicate pages added. |
| Edinburgh | Reviewed and retained. Existing city page, six service pages and neighbourhood/town links already cover Old Town, New Town, Leith, South Edinburgh and Lothians intent. No duplicate pages added. |
| Inverness | Reviewed and retained. Existing city page and six service pages remain the core Highland city cluster. Fort William now has stronger linked coverage instead of being treated only as an Inverness-adjacent mention. |
| Aberdeen | Reviewed and retained. Existing city page and six service pages already cover city-centre, LEZ, office, flat and furniture intent. No duplicate pages added. |
| Dundee | Improved nearby-area content only. Existing six service pages retained; added grouped Dundee neighbourhood, Angus/Tay coast and North Fife route guidance without creating thin town pages. |
| Perth | Improved nearby-area content only. Existing six service pages retained; added Perth city/suburb and Perthshire route groups without creating duplicate service combinations. |
| Fort William | Implemented remaining gap. Existing area page kept and six authored local service pages added. Nearby Lochaber groups added. |
| Isle of Skye | Implemented remaining gap. Added accurate island area page, six authored local service pages and Skye locality groups. Copy now focuses on bridge, ferry, rural approach and vehicle-access detail rather than internal SEO classification. |

## Schema decision

Schema.org `City` is not limited to formal city-status pages in this codebase; it can be used for towns and civic localities where that is the chosen modelling style. Fort William keeps the existing schema modelling instead of being changed solely because it is a town; `Place` would also be acceptable, but it is not mandatory. `Place` is used for Isle of Skye because it is an island/service area rather than a town or city page.

## Added pages reviewed individually

Each page was reviewed against existing Glasgow, Edinburgh, Inverness, Aberdeen, Dundee and Perth siblings. The pages keep distinct service intent, use local route/access facts, avoid invented claims, and are linked from the parent area page plus the matching service hub. Canonicals are the production URL at `https://www.speedyvan.uk`.

| URL | Distinct intent and useful local information | Sources | Verified inbound links |
| --- | --- | --- | --- |
| `/areas/fort-william/house-removal` | Whole-house inventory, town-centre controlled access, A82 route and final-approach planning. | Highland Council Fort William High Street bollards; Traffic Scotland roadworks. | `/areas/fort-william`, `/services/house-removal`, related local service links. |
| `/areas/fort-william/flat-removals` | Floor/stair detail, pedestrian versus van access and route checks near the move date. | Highland Council bollards; Traffic Scotland roadworks. | `/areas/fort-william`, `/services/flat-removals`, related local service links. |
| `/areas/fort-william/furniture-delivery` | Seller release point, item measurement, delivery route and rural/longer delivery legs. | Highland Council bollards; Traffic Scotland roadworks. | `/areas/fort-william`, `/services/furniture-delivery`, related local service links. |
| `/areas/fort-william/office-removal` | Service entrance restrictions, business timing, equipment labels and Fort William access. | Highland Council bollards; Traffic Scotland roadworks. | `/areas/fort-william`, `/services/office-removal`, related local service links. |
| `/areas/fort-william/student-move` | Residence details, personal inventory, key timing and town-centre access. | UHI Fort William accommodation; Highland Council bollards. | `/areas/fort-william`, `/services/student-move`, related local service links. |
| `/areas/fort-william/packing-service` | Packing scope, fragile items, route-to-vehicle planning and separate packing/loading dates. | Highland Council bollards; Traffic Scotland roadworks. | `/areas/fort-william`, `/services/packing-service`, related local service links. |
| `/areas/isle-of-skye/house-removal` | Full island-house move, exact address detail, bridge/ferry route checks and final approach. | Traffic Scotland bridges; CalMac Mallaig-Armadale route. | `/areas/isle-of-skye`, `/services/house-removal`, related local service links. |
| `/areas/isle-of-skye/flat-removals` | Village/building entrance, floor/stair details and bridge route dependency. | Traffic Scotland bridges. | `/areas/isle-of-skye`, `/services/flat-removals`, related local service links. |
| `/areas/isle-of-skye/furniture-delivery` | Seller handover, item condition, crossing/ferry route and receiving-room access. | CalMac Mallaig-Armadale route. | `/areas/isle-of-skye`, `/services/furniture-delivery`, related local service links. |
| `/areas/isle-of-skye/office-removal` | Small business/office entrance, equipment labels and bridge/ferry/road dependency. | Traffic Scotland bridges. | `/areas/isle-of-skye`, `/services/office-removal`, related local service links. |
| `/areas/isle-of-skye/student-move` | Campus/private address accuracy, Portree/Broadford study-centre context and personal inventory. | UHI Portree centre; UHI Broadford centre. | `/areas/isle-of-skye`, `/services/student-move`, related local service links. |
| `/areas/isle-of-skye/packing-service` | Island packing scope, fragile preparation, bridge/ferry timing and rural final carry. | Traffic Scotland bridges. | `/areas/isle-of-skye`, `/services/packing-service`, related local service links. |

## Sources used

- Glasgow parking suspensions and dispensations: `https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension`
- Glasgow LEZ information: `https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information`
- Edinburgh dispensations and suspensions: `https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions`
- Highland Council Fort William High Street bollards: `https://www.highland.gov.uk/news/article/17266/fort-william-high-street-automatic-bollards-begin-operation`
- Highland Council parking/loading guidance: `https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/5`
- Traffic Scotland roadworks: `https://www.traffic.gov.scot/traffic-information/roadworks`
- Traffic Scotland bridge information: `https://www.traffic.gov.scot/traffic-information/bridges`
- CalMac Mallaig to Armadale route: `https://www.calmac.co.uk/route-information/mallaig-armadale/`
- Dundee LEZ: `https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez`
- Perth and Kinross bay suspensions and dispensations: `https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations`
- Aberdeen parking information: `https://www.aberdeencity.gov.uk/link/parking-information`
- Aberdeen LEZ: `https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/low-emission-zone-lez`
- UHI Fort William accommodation: `https://www.uhi.ac.uk/en/studying-at-uhi/accommodation/uni/fort-william/`
- UHI North, West and Hebrides Portree centre: `https://www.nwh.uhi.ac.uk/en/about-us/campuses-and-centres/portree/`
- UHI North, West and Hebrides Broadford centre: `https://www.nwh.uhi.ac.uk/en/about-us/campuses-and-centres/broadford/`

## Verification

Tested final source tree locally from `C:\speedy-van-platform-prod-baseline-d2b9e3d` on branch `seo/local-expansion-2026-09-28`.

Checks run:

- `npm run lint -w apps/web`: passed with existing image warnings only:
  - `src/components/european/EuropeanEnquiryForm.tsx` uses `<img>`
  - `src/components/FaqSearch.tsx` uses `<img>`
  - `next lint` deprecation warning from Next.js 15.5.25
- `npm run typecheck -w apps/web`: passed.
- `npm run build -w apps/web`: passed; generated 292 static pages.

SEO route checks on final local production build at `http://localhost:3004`:

- `/areas/isle-of-skye`: 200, canonical `https://www.speedyvan.uk/areas/isle-of-skye`, robots index/follow.
- All twelve added local service URLs: 200, canonical matches production URL, robots index/follow.
- `/sitemap.xml`: 200, 264 locs, duplicate count 0, all 13 added URLs present.
- `/areas`: links to `/areas/isle-of-skye`.
- `/areas/fort-william`: links to the six Fort William service URLs and `/areas/isle-of-skye`.
- `/areas/isle-of-skye`: links to the six Skye service URLs.
- `/services/{service}` pages link to the corresponding Fort William and Skye local-service URLs.
- `/areas/not-a-real-place`: 404 with `noindex`.

Rendered nearby-content review checks on the final local production build at `http://localhost:3004`:

| Page | Server-rendered nearby section | Visible at 360px | Visible at 768px | Locality cards | Group anchors | Notes |
| --- | ---: | --- | --- | ---: | ---: | --- |
| `/areas/dundee` | 1 | Yes | Yes | 14/14 | 3 | First card: Dundee City Centre; last card: Cupar. |
| `/areas/perth` | 1 | Yes | Yes | 9/9 | 2 | First card: Perth City Centre; last card: Aberfeldy. |
| `/areas/fort-william` | 1 | Yes | Yes | 8/8 | 2 | First card: Caol; last card: Oban. |
| `/areas/isle-of-skye` | 1 | Yes | Yes | 10/10 | 2 | First card: Portree; last card: Edinbane. |

Guide-page duplication checks on `http://localhost:3004`:

- `/areas/glasgow`: nearby locality section rendered once.
- `/areas/edinburgh`: nearby locality section rendered once.
- `/areas/inverness`: nearby locality section rendered once.
- `/areas/aberdeen`: nearby locality section rendered once.
- `/areas/isle-of-skye`: no link to the West Lothian `/areas/armadale` route; the Skye locality card is labelled `Armadale, Skye` and has no `areaSlug`.
- The visible Skye postcode range `IV41-IV56` was removed using the existing empty-string convention until independently verified.
- Browser console during locality rendering checks: no errors. One pre-existing Next.js warning remains for `/logo.png?v=amber-20260921-1` needing `images.localPatterns` before Next.js 16.

Booking checks on `http://localhost:3000` at 360px viewport:

The booking checks used the local API already running on `http://localhost:4000`, not production API end-to-end. That API process was from `C:\speedy-van-platform\apps\api`, repository `https://github.com/speedy-van/speedy-van-platform.git`, branch `booking-v2-phase-a`, commit `b49872706ae67c03080a1d5d9b33d204a051ffa7`, package `@speedy-van/api` version `1.0.0`.

- `/book` with fresh storage: 200, service selection rendered.
- `/book?service=house-removals`: 200, opens the home-move journey step.
- `/book?service=house`: 200, valid alias opens the home-move journey step.
- `/book?service=unknown`: 200, unknown service ignored and service selection rendered.
- Restored draft: 200, restored to inventory step with saved item visible.
- Quote calculation: `/pricing/calculate` returned 200 with `success: true`, 28 days and a quote token.
- Initial displayed total after selecting cheapest slot: GBP 188.19.
- After changing a price-affecting input from house to fourth-floor flat, the quote area entered calculating state, the action-bar `Continue` was disabled while stale/loading, and the second `/pricing/calculate` returned 200 with `success: true`, 28 days and a quote token.
- Updated displayed total: GBP 237.66.
- No `/booking/create` request was made; no real booking or payment was submitted.
- Browser console during these booking checks: no errors and no warnings.

## Remaining limitations

- No authenticated Search Console metrics or URL Inspection evidence was available through callable tools.
- No production deployment was made and no production indexing/ranking claim is made.
- Booking was verified only to quote/recalculation and stale payment blocking against a local API process. No production end-to-end payment was submitted.
