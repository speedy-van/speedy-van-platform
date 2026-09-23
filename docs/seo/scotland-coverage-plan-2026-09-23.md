# Scotland coverage plan — 23 September 2026

> **Approved expansion update:** The owner subsequently approved a 3,500-page programme with review milestones at 250, 1,000 and 3,500. The original 32-area/54-URL inventory below remains the historical baseline, not the expanded count. See `scotland-expansion-review-2026-09-23.md` and `scotland-expansion-inventory-2026-09-23.json` for the first increment. Measured demand and town-level capacity remain unknown and are not fabricated. The later approval permits preparing this bounded review increment; publication and subsequent expansion still require review of the actual content and operational arrangements. No 3,500-page placeholder inventory is created.

## Scope and verified baseline

The objective is to make useful moving information discoverable throughout Scotland, including towns outside the eight cities. The geographic inventory below is a research and delivery backlog. It is not a claim of operational availability, measured search demand, local driver capacity or Google indexing.

The repository's `apps/web/src/lib/areas.ts` currently declares **32 area pages**. The route `apps/web/src/app/(site)/areas/[slug]/page.tsx` uses `/areas/{slug}` as their canonical path. These pages represent places in **19 of Scotland's 32 council areas**. The other **13 council areas have no dedicated place entry in this data file**. This is a code inventory; references in prose or nearby-location lists are not additional canonical pages, and the absence of a page does not establish absence of service.

All eight Scottish cities already have pages: Aberdeen, Dundee, Dunfermline, Edinburgh, Glasgow, Inverness, Perth and Stirling. Preserve those URLs. Glasgow West End, Glasgow Southside, Edinburgh Leith and Edinburgh South are district pages, not additional cities or council areas.

The owner reported **5,576 drivers waiting for jobs in Scotland** on 23 September 2026 and explicitly confirmed that the network count is Scotland-only. The owner also confirmed that moves **originating in Scotland can go anywhere in Britain**. This is the confirmed service direction for the expansion; do not describe an England or Wales destination as outside the service simply because it is outside Scotland. Moves originating outside Scotland have not been newly confirmed by this instruction.

The reported total has not been independently reconciled with active driver records. Distribution by council area, current availability, vehicle capacity and supported job types remain unconfirmed. Do not publish this number, allocate it across towns, or derive promises of immediate availability from it. Use existing authorised operational records in aggregate to establish the capacity for a specific job. The missing-page inventory measures content coverage, not a limit on the owner's confirmed Scotland-origin service area.

## Publication gates

Every proposed new indexable page must pass all three gates:

1. **G1 — Operational coverage:** start from the owner-confirmed Scotland-origin, Britain-wide destination service. Establish the named collection area's actual capacity and relevant vehicle, crew and scheduling constraints with a responsible operator. Record the verification date and source internally. Check any service direction beyond the confirmed scope before adding it. Do not invent a depot, local branch, local driver count, response time or fixed price.
2. **G2 — Customer need:** record actual Search Console queries, enquiries or booking evidence supporting a useful destination or a distinct service intent. Give the observation window and source. Population and a place name alone do not establish moving demand; missing query data is unknown, not zero demand.
3. **G3 — Original useful content:** prepare specific moving guidance supported by current official sources and/or genuine operational experience. Identify what changes a customer's planning decision: access, building arrangements, collection constraints, rural approaches, multi-stop routes or ferry requirements. Replacing place names in common paragraphs does not pass this gate. Genuine completed-job examples, photographs and reviews may be used only when available and authorised for publication.

Use a locality section within an existing city or regional hub when that answers the need adequately. Create a separate page only when the evidence and content justify it. A council boundary is a coverage check, not a requirement to create a council landing page. There is no automatic page quota and no automatic `every service × every town` expansion.

Ferry-dependent routes need an additional route check: operator acceptance, actual route, suitable sailing and vehicle capacity, timetable, check-in allowance, fare treatment, return journey and disruption arrangements. Do not equate an island destination with a ferry requirement: for example, a Skye journey may use the bridge. Assess the exact route. Nationwide geographic planning does not imply confirmed service to every island.

## Council-by-council backlog

Existing paths below come from the area data file. Candidate towns and localities are **suggestions for assessment only**, not approved new pages or confirmed service locations. The list is illustrative rather than an exhaustive gazetteer. The council mapping describes each named place, not the full reach of its postcode or the page's wider regional prose. Verify precise address boundaries before using a mapping operationally.

All evidence requirements include G1–G3; the final column identifies additional local questions to resolve.

| Council area | Existing canonical area pages | Candidate towns or localities without their own current area page | Evidence requirement |
| --- | --- | --- | --- |
| Aberdeen City | `/areas/aberdeen` | Dyce, Cove Bay, Bridge of Don — assess within the city page first | G1–G3; establish a distinct neighbourhood need before splitting the existing city destination. |
| Aberdeenshire | `/areas/inverurie`, `/areas/westhill`, `/areas/stonehaven`, `/areas/ellon` | Peterhead, Fraserburgh, Banchory, Huntly, Banff, Turriff | G1–G3; confirm collection reach, onward routes and rural property access. |
| Angus | None | Arbroath, Forfar, Montrose, Brechin, Carnoustie, Kirriemuir | G1–G3; confirm town-level capacity and distinguish town access from rural collections. |
| Argyll and Bute | `/areas/oban` | Helensburgh, Dunoon, Campbeltown, Lochgilphead, Inveraray, Rothesay | G1–G3; confirm exact route and apply ferry checks wherever the proposed journey requires one. |
| City of Edinburgh | `/areas/edinburgh`, `/areas/edinburgh-leith`, `/areas/edinburgh-south` | Queensferry, Portobello — assess city/locality content first | G1–G3; resolve overlap with existing district pages and verify current council loading guidance. |
| Clackmannanshire | None | Alloa, Alva, Tillicoultry, Dollar, Tullibody | G1–G3; establish service reach and genuine local enquiries before selecting standalone destinations. |
| Dumfries and Galloway | `/areas/dumfries` | Stranraer, Annan, Lockerbie, Castle Douglas, Dalbeattie, Newton Stewart | G1–G3; verify longer rural routes and cross-border timing/pricing within the confirmed Scotland-origin service. |
| Dundee City | `/areas/dundee` | Broughty Ferry — assess within the city page first | G1–G3; demonstrate a distinct locality need and avoid duplicating the existing Dundee page. |
| East Ayrshire | `/areas/kilmarnock` | Cumnock, Stewarton, Galston, Newmilns, Auchinleck | G1–G3; establish the supported routes and collect local access or job evidence. |
| East Dunbartonshire | None | Bishopbriggs, Kirkintilloch, Bearsden, Milngavie, Lenzie | G1–G3; distinguish independent town needs from nearby Glasgow content and verify collection coverage. |
| East Lothian | None | Musselburgh, Haddington, Tranent, Prestonpans, North Berwick, Dunbar | G1–G3; validate town demand and access guidance without treating all destinations as Edinburgh districts. |
| East Renfrewshire | None | Giffnock, Newton Mearns, Barrhead, Clarkston, Eaglesham | G1–G3; confirm exact service reach and town-specific usefulness beyond the Glasgow Southside page. |
| Falkirk | `/areas/falkirk` | Grangemouth, Bo'ness, Denny, Larbert, Stenhousemuir | G1–G3; assess locality sections first and record evidence for any independent town intent. |
| Fife | `/areas/kirkcaldy`, `/areas/dunfermline`, `/areas/st-andrews` | Glenrothes, Cupar, Leven, Rosyth, Cowdenbeath, Dalgety Bay, Inverkeithing | G1–G3; establish local operational reach and differentiate each town from existing Fife destinations. |
| Glasgow City | `/areas/glasgow`, `/areas/glasgow-west-end`, `/areas/glasgow-southside` | Partick, Anniesland, Shawlands — assess within the existing city/district pages first | G1–G3; avoid overlapping neighbourhood pages and use building/access evidence for useful locality sections. |
| Highland | `/areas/inverness`, `/areas/nairn`, `/areas/dingwall`, `/areas/fort-william` | Alness, Invergordon, Tain, Aviemore, Wick, Thurso, Ullapool, Mallaig, Portree | G1–G3; confirm remote-route capacity, vehicle access and the actual bridge/ferry itinerary where relevant. |
| Inverclyde | None | Greenock, Port Glasgow, Gourock, Kilmacolm | G1–G3; verify supported collections and distinguish mainland moves from ferry-dependent onward routes. |
| Midlothian | None | Dalkeith, Bonnyrigg, Penicuik, Loanhead, Mayfield, Gorebridge | G1–G3; establish town-level demand and operational coverage independently of the Edinburgh label. |
| Moray | None | Elgin, Forres, Buckie, Lossiemouth, Keith | G1–G3; validate town and rural collection reach, vehicle requirements and longer delivery routes. |
| Na h-Eileanan Siar | None | Stornoway, Tarbert (Harris), Balivanich, Castlebay | G1–G3 plus island route checks; establish where crews are based or can travel, vehicle capacity, transfer arrangements and disruption handling. |
| North Ayrshire | None | Irvine, Kilwinning, Ardrossan, Saltcoats, Stevenston, Largs, Brodick | G1–G3; separate mainland coverage from Arran and other island enquiries; apply ferry checks to relevant routes. |
| North Lanarkshire | `/areas/motherwell` | Airdrie, Coatbridge, Cumbernauld, Wishaw, Bellshill, Shotts | G1–G3; confirm town-specific demand and useful access guidance, then select standalone pages or linked localities. |
| Orkney Islands | None | Kirkwall, Stromness | G1–G3 plus island route checks; verify local or inbound crew capacity and distinguish Mainland Orkney from inter-island transfers. |
| Perth and Kinross | `/areas/perth` | Blairgowrie and Rattray, Crieff, Auchterarder, Kinross, Pitlochry, Aberfeldy | G1–G3; establish rural approach, crew and longer-route constraints with evidence for each candidate. |
| Renfrewshire | `/areas/paisley` | Renfrew, Johnstone, Erskine, Linwood, Bishopton | G1–G3; distinguish town intent from Paisley/Glasgow overlap and confirm the supported routes. |
| Scottish Borders | `/areas/galashiels` | Hawick, Kelso, Selkirk, Peebles, Jedburgh, Eyemouth, Melrose | G1–G3; verify rural access and longer-route timing/pricing, including England and Wales destinations from Scotland. |
| Shetland Islands | None | Lerwick, Scalloway | G1–G3 plus island route checks; confirm local capacity, inbound transport options and inter-island requirements. |
| South Ayrshire | `/areas/ayr` | Troon, Prestwick, Girvan, Maybole | G1–G3; verify local enquiries and service capacity before expanding beyond the existing Ayr destination. |
| South Lanarkshire | `/areas/hamilton`, `/areas/east-kilbride` | Rutherglen, Cambuslang, Lanark, Strathaven, Larkhall, Carluke, Biggar | G1–G3; distinguish Glasgow-adjacent towns from more rural routes and verify useful local access information. |
| Stirling | `/areas/stirling` | Dunblane, Bridge of Allan, Callander, Doune, Balfron | G1–G3; assess city-adjacent locality content first and confirm capacity for more rural routes. |
| West Dunbartonshire | None | Clydebank, Dumbarton, Alexandria, Balloch | G1–G3; establish the town-level service offer and useful route/access distinctions from Glasgow. |
| West Lothian | `/areas/livingston` | Bathgate, Linlithgow, Broxburn, Armadale, Whitburn, Uphall | G1–G3; verify independent town demand and operational coverage before expanding the existing Livingston hub. |

## Phased delivery

### Phase 1 — Improve the existing inventory

Improve the 32 existing destinations and their navigation, with original guidance for pages still using common planning sections. Keep the eight city anchors and existing district/town URLs stable. Reconcile the production source, verify actual HTTP responses and metadata, and diagnose current Search Console exclusions separately. A correct canonical or successful indexing request does not prove Google has indexed a page.

### Phase 2 — Assemble evidence across all 32 council areas

For every candidate being considered, record the council/place, existing destination or proposed parent, operational confirmation and date, anonymised query/enquiry/booking evidence, distinct customer need, research sources, available original media or job evidence, and intended page-versus-locality decision. These are research fields, not a proposal to add unverified database columns or new operational APIs.

Investigate the 13 council areas without a current area entry alongside gaps in already represented councils. Do not infer equal opportunity from equal administrative status. Prioritise demonstrated customer need and verified local fulfilment capacity; if either is unknown, collect evidence before making a locality-specific availability promise. Preserve the owner-confirmed Scotland-origin, Britain-wide service statement throughout.

### Phase 3 — Publish approved, useful destinations in manageable batches

Publish only candidates passing G1–G3 and any applicable route checks. Add valid links from the relevant existing hub, service pages and area directory. Use self-canonical URLs, accurate place types and truthful service descriptions. Add only published, indexable destinations to the sitemap. Preserve real 404s for unknown slugs and avoid placeholder pages for the remainder of the inventory.

Each page must offer a clear quote path while preserving booking drafts, inventory, prices, payments, existing loading/error/empty states and route behaviour. Do not expose internal evidence gates or implementation instructions in customer-facing copy. Validate mobile layouts at 360px and 768px, keyboard use, links, structured data and the documented repository checks before release.

### Phase 4 — Measure outcomes and expand on evidence

Record publication and deployment dates, then compare Google indexing, relevant non-brand impressions, clicks, quote starts, completed bookings and fulfilment by the available reporting dimensions. Do not manufacture a pre-release baseline, a query volume or an attribution model. Review results before multiplying service-specific destinations. Retain useful pages even when initial impressions are low; diagnose indexing and intent separately from service availability.

SEO does not establish a guaranteed job allocation for the reported driver network. This work creates useful routes for customers to find and book supported services; any volume target needs a separately measured acquisition and fulfilment model.

## Sources checked on 23 September 2026

- [Scottish Government — Cities and regions](https://www.gov.scot/policies/cities-regions/): confirms the eight named Scottish cities.
- [Scottish Government — Local government](https://www.gov.scot/policies/local-government/): confirms the 32-council structure.
- [mygov.scot — Organisations](https://www.mygov.scot/organisations): official list of the 32 local authorities. The council names in this inventory follow this list, using the geographic name Highland and Na h-Eileanan Siar for the relevant council areas.
- [National Records of Scotland — 2022 Census Geography Products](https://www.nrscotland.gov.uk/publications/2022-census-geography-products/): official settlement/locality boundaries, centroids and census index files for subsequent geographic reconciliation. This document does not claim that the full dataset has already been imported or matched to operational records.
- [National Records of Scotland — Settlement and Localities Information Note](https://www.nrscotland.gov.uk/publications/geography-settlement-and-localities-information-note/): explains that settlements generally reach about 500 inhabitants and may divide into localities. These statistical geographies do not enumerate every village or establish business service availability.
- Repository evidence: `apps/web/src/lib/areas.ts` and `apps/web/src/app/(site)/areas/[slug]/page.tsx`, inspected on the same date. Source data establishes the 32 current paths; the table's town suggestions are an editorial backlog, not official recommendations or measured search demand.

No new destination pages, public driver-count claims or live operational availability records are created by this plan.
