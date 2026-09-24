# Surrounding locality content: evidence and scope

Prepared: 23 September 2026. This document describes source content prepared for integration; it is not a production, indexing or ranking result.

## Operational evidence

The owner confirmed coverage of the towns and villages surrounding Inverness and Aberdeen in this conversation on 23 September 2026. That confirmation supports naming the covered localities and offering moving enquiries. Individual dates, crew requirements, vehicle suitability and arrival windows still require confirmation for the actual job.

The owner's separate claims about driver numbers and proximity have not been checked against a dispatch system, active-driver records or measured arrival times. Neither claim is included in the customer content or structured data. No local branch, office, review, completed job, guaranteed slot, response time, fixed price or discount is implied.

## Content inventory

`apps/web/src/lib/nearby-area-guides.ts` contains 23 distinct locality descriptions in six groups: 11 localities associated with the Inverness hub and 12 with the Aberdeen hub. The groups organise enquiries geographically; they are not prescribed driving routes, official administrative boundaries or promises to combine jobs.

| Hub | Group | Localities | Dedicated area destinations |
| --- | --- | --- | --- |
| Inverness | East Inverness, Ardersier and Nairn | Culloden, Smithton, Balloch, Ardersier, Croy, Nairn | Nairn |
| Inverness | Beauly, Muir of Ord and the Dingwall area | Beauly, Muir of Ord, Conon Bridge, Dingwall | Dingwall |
| Inverness | Drumnadrochit and Loch Ness enquiries | Drumnadrochit | None |
| Aberdeen | North Aberdeen, Ellon and the Inverurie area | Balmedie, Ellon, Newmachar, Oldmeldrum, Blackburn, Kintore, Inverurie | Ellon, existing Inverurie |
| Aberdeen | Westhill and Peterculter | Westhill, Peterculter | Westhill |
| Aberdeen | Portlethen, Newtonhill and Stonehaven | Portlethen, Newtonhill, Stonehaven | Stonehaven |

The data exports `NearbyAreaPlace`, `NearbyAreaGroup` and `getNearbyAreaGroups(slug: string): readonly NearbyAreaGroup[]`. An unknown slug returns an empty array. `areaSlug` is set only for Nairn, Dingwall, Ellon, Inverurie, Westhill and Stonehaven. The integration must resolve these six entries against the real area catalogue; other places receive sections within the hub rather than links to nonexistent pages.

The descriptions cover distinct enquiry details: seller release arrangements, item preparation, bedroom moves, extra stops, key handovers, business loading appointments, bulky garage contents, approach directions and destination handling. References to steps, private approaches, lifts or building restrictions are conditional questions about the customer's property, not claims that every property in a locality has those features. Exact postcodes distinguish Balloch, Croy and Blackburn enquiries without assigning unverified postcode coverage.

## Geographic sources

The following primary sources were checked through search retrieval on 23 September 2026. They establish locality names and geographic relationships; none verifies this business's operational coverage. The moving advice is original planning guidance, not copied council advice or a report of completed work.

| Source | Observed support | Limit |
| --- | --- | --- |
| [Highland Council: polling places for Wards 13–17](https://www.highland.gov.uk/elections-voting/find-polling-station/5) | Names Culloden and Ardersier, Smithton, Balloch and Croy within the Inverness ward listings. | No claim about removal access or permissions at those venues. |
| [Highland Council: Nairnshire dial-a-bus](https://www.highland.gov.uk/buses-community-transport/nairnshire-dial-bus) | Describes Nairnshire journeys and links to Croy and Ardersier. | Public transport coverage is not evidence of this business's service coverage or van travel time. |
| [Highland Council: Tomich–Dingwall route listing](https://www.highland.gov.uk/directory-record/54/tomich-to-dingwall-dingwall-to-tomich-routes-44-44a-and-44b-) | Lists Beauly, Muir of Ord, Conon Bridge and Dingwall along a connected local corridor. | No bus timetable, route duration or bus-only access claim is repurposed as a removals promise. |
| [Highland Council: Torvean bus links](https://www.highland.gov.uk/roads-transport-parking/park-ride/2) | Explicitly relates Inverness and Drumnadrochit through the Loch Ness corridor. | No claim that one route is suitable for every vehicle or address. |
| [Aberdeenshire Council: polling places](https://www.aberdeenshire.gov.uk/council-and-democracy/elections/where-to-vote/) | Names localities and exact addresses including Oldmeldrum, Balmedie, Ellon and Newmachar. | Addresses identify towns; they are not business branches or postcode coverage boundaries. |
| [Aberdeenshire Council: seasonal garden waste locations, 2026](https://www.aberdeenshire.gov.uk/news/2026/mar/aberdeenshire-council-seasonal-garden-waste-recycling-points-open-from-saturday-4-april) | Confirms locality names including Blackburn, Kintore, Newmachar, Newtonhill and Oldmeldrum. | No waste-disposal service is offered or inferred. |
| [Aberdeenshire Council: parks and open spaces](https://www.aberdeenshire.gov.uk/leisure-sport-and-culture/parks-and-open-spaces/parks-and-open-spaces) | Lists Newtonhill, Portlethen, Stonehaven and Westhill. | No park access or loading rights are implied. |
| [Aberdeenshire Council: local place plans](https://publications.aberdeenshire.gov.uk/local-place-plans-register) | Provides named place plans for Stonehaven, Newtonhill and Westhill. | Planning documents do not establish current driver availability or detailed street restrictions. |
| [Aberdeenshire Council: Stonehaven A2B](https://www.aberdeenshire.gov.uk/roads-and-travel/public-transport/a2b-dial-a-bus/stonehaven-a2b) | Names the Stonehaven–Portlethen and Stonehaven–Newtonhill links. | No passenger service or timetable is claimed for removals. |
| [Aberdeen City Council: West Locality Plan](https://committees.aberdeencity.gov.uk/documents/s77575/4.4%20HSCP.17.104%20-%20Appendix%20D%20-%20West%20ACHSCP%20Locality%20Plan%20-%20FINAL.pdf) | Places Peterculter within Lower Deeside and the west locality of Aberdeen. | Historical planning context supports geography only, not a current traffic or availability claim. |

## Search and publication limits

The natural service-and-place combinations are inferred enquiry intents, not measured Search Console queries or keyword-volume findings. This data file does not generate a page for every keyword or locality. It does not create a backlink, submission, review request or outreach message.

Renderer, catalogue integration, structured-data alignment, internal links and browser/build verification are owned by the lead integration. No booking, inventory, pricing, payment, authentication, API or driver/admin contract is changed by this data file. Production publication must be reported separately from local implementation, and neither establishes Google indexing or ranking gains.
