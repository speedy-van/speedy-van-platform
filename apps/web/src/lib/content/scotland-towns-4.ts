import type { Area } from "@/lib/areas";

// Authored west Scotland profiles; evidence and retrieval limits are in town-sources-4.json.
export const EXPANSION_TOWNS_4: Area[] = [
  {
    slug: "irvine", name: "Irvine", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Irvine",
    description: "An Irvine collection near Bridgegate needs a different loading plan from furniture leaving a property by Harbour Road. Tell us the actual entrance, the furniture and box list, and whether the van can reach the door. We can quote a small collection or a household move starting in Irvine and ending elsewhere in Britain.",
    metaDescription: "Man and van in Irvine for furniture and house moves. Plan Bridgegate or harbour access, carrying distances and delivery anywhere in Britain.",
    highlights: ["Bridgegate and harbour access planning", "Furniture and household inventories", "Moves from Irvine across Britain"],
    nearbyAreas: ["kilwinning", "stevenston", "kilmarnock", "troon"],
    moveAdvice: [
      { title: "Choose a loading point near Bridgegate", body: "North Ayrshire lists West Road and Kirkgate as short-stay car parks, while Harbour Road and Caledonian provide long-stay parking. Those locations help orientate the enquiry; they do not reserve a loading bay. Send the door location and proposed stopping point so the carrying distance can be assessed.", source: { label: "North Ayrshire Council car parks", href: "https://www.north-ayrshire.gov.uk/roads-and-parking/parking/car-parks" } },
      { title: "Separate shop collection from home access", body: "For an Irvine furniture purchase, ask the seller whether collection is from a stockroom, shop entrance or another warehouse. Include the release reference and packed dimensions. Delivery to your house or flat also needs its own access description; a shop trolley does not resolve a narrow landing at home." },
      { title: "Plan around the property handover", body: "When leaving Irvine for another part of Britain, list items required on the first night separately from furniture that can be unloaded later. Give the time keys become available at the destination and any storage stop. The collection order and delivery window should be agreed before packing the final essentials." }
    ],
    faqs: [
      { question: "Can an Irvine shop car park be used for my collection?", answer: "Ask the shop to confirm its goods collection point and vehicle rules. Public parking information does not grant use of a private loading area. Share the seller's instructions and the distance from the item to the vehicle when requesting the quote." },
      { question: "Can you move a household from Irvine to England?", answer: "Yes, a move originating in Irvine can be quoted to destinations across Britain. Supply the complete inventory, both addresses and key-release arrangements so the crew, vehicle and delivery plan can be confirmed." }
    ]
  },
  {
    slug: "kilwinning", name: "Kilwinning", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Kilwinning",
    description: "For a Kilwinning move, distinguish the property entrance from the nearest town-centre parking area. A collection around Oxenward, a house with garden access and a flat above shops each need a clear route for bulky items. Build the quote around the contents and access rather than the short distance to the next address.",
    metaDescription: "Kilwinning man and van and removals. Share Oxenward or residential access, stairs, furniture dimensions and every collection stop for your quote.",
    highlights: ["Town-centre entrance checks", "Garden and stair access details", "Combined collections listed in advance"],
    nearbyAreas: ["irvine", "stevenston", "saltcoats", "ardrossan"],
    moveAdvice: [
      { title: "Oxenward and Woodwynd are different parking options", body: "The council lists Oxenward, reached from Lauchlan Way, as short stay and Woodwynd as long stay. Identify the entrance you actually need before choosing a waiting point. Check the vehicle fits and the current signs permit the intended use; neither listing promises space beside your front door.", source: { label: "Kilwinning parking information from North Ayrshire Council", href: "https://www.north-ayrshire.gov.uk/roads-and-parking/parking/car-parks" } },
      { title: "Furniture through a shared entrance", body: "If your Kilwinning property has a close or shared rear entrance, describe the whole route to the street. Photograph low ceilings, stair corners and door closers beside the largest item. Arrange access with other occupants so shared doors remain usable while boxes and furniture are carried." },
      { title: "Two collections in North Ayrshire", body: "Combining Kilwinning belongings with items in Irvine or the Three Towns requires separate item lists and a receiving address. Tell us which seller or property has the tighter collection window. The loading sequence must leave space for the second stop and allow the right items to be unloaded first." }
    ],
    faqs: [
      { question: "Is a Kilwinning-to-Irvine move priced only by distance?", answer: "No. The furniture volume, number of lifts, access at both homes and any waiting arrangements also matter. A short drive with several stair flights should be described as fully as a longer removal." },
      { question: "Can I add a second Kilwinning furniture collection?", answer: "Include it in the enquiry with the item dimensions, exact address and seller's available window. The extra stop needs to fit the vehicle capacity and agreed schedule before it becomes part of the booking." }
    ]
  },
  {
    slug: "ardrossan", name: "Ardrossan", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Ardrossan",
    description: "Arrange an Ardrossan furniture collection or home move with the road address and entrance clearly identified. Harbour connections need special care if a ferry is involved: the operating port and vehicle booking must be confirmed for the date. For a mainland move, give the final destination rather than using the harbour as a meeting point.",
    metaDescription: "Ardrossan man and van for home moves and furniture. Check harbour arrangements, item handling and any ferry connection before confirming a move.",
    highlights: ["Harbour and property access distinguished", "Ferry-dependent journeys assessed individually", "Mainland delivery from Ardrossan"],
    nearbyAreas: ["saltcoats", "stevenston", "kilwinning", "largs"],
    moveAdvice: [
      { title: "Confirm the operating port for an island connection", body: "CalMac publishes port changes and service status for the Ardrossan–Brodick route, including occasions when services use Troon. If your move includes that crossing, check the current operator information before fixing the collection window. The removal vehicle dimensions and commercial booking arrangements must also be confirmed.", source: { label: "CalMac Ardrossan–Brodick route information", href: "https://www.calmac.co.uk/route-information/ardrossan-brodick/" } },
      { title: "Keep household loading separate from terminal access", body: "For a home near the Ardrossan waterfront, provide the residential entrance and a lawful loading location. Terminal parking or a passenger drop-off area is not an agreed household collection point. Describe any outside steps and the route from the room to the vehicle, including gates that must remain open." },
      { title: "Pack for the complete journey", body: "A move from Ardrossan to a British mainland destination needs the complete inventory, including stored items and outdoor furniture. Identify anything damp, fragile or unusually heavy before packing. Keep documents and personal essentials with you, and confirm when somebody can receive the load at the new address." }
    ],
    faqs: [
      { question: "Does an Ardrossan enquiry automatically include a ferry?", answer: "No. State explicitly if a crossing is needed and give both property addresses. Ferry capacity, the operating port and the removal vehicle booking must be checked before a ferry-dependent move can be confirmed." },
      { question: "Can you collect furniture in Ardrossan for Glasgow?", answer: "Yes, request a quote with the seller's collection window, item dimensions and Glasgow delivery access. Mention any dismantling or stair carrying required at either end so the handling is agreed beforehand." }
    ]
  },
  {
    slug: "saltcoats", name: "Saltcoats", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Saltcoats",
    description: "A Saltcoats move can involve a town-centre entrance, a shared stair or an outdoor carry before the van is reached. Explain where the belongings are inside the property and whether collection is from the front or rear. Furniture bought locally and full household loads need different inventories and lifting arrangements.",
    metaDescription: "Man and van in Saltcoats for furniture, flats and home moves. Plan loading access around Union Street, Chapelwell Street or your exact address.",
    highlights: ["Front and rear entrance planning", "Flat furniture measurements", "Separate stops across the Three Towns"],
    nearbyAreas: ["ardrossan", "stevenston", "kilwinning", "irvine"],
    moveAdvice: [
      { title: "Map the carry from the actual entrance", body: "Union Street, Chapelwell Street and The Braes appear in the council's long-stay parking list for Saltcoats. Use the street names to clarify your location, then identify a suitable loading point separately. A nearby car park can still leave crossings, steps or a longer carry between the room and van.", source: { label: "North Ayrshire Council Saltcoats parking locations", href: "https://www.north-ayrshire.gov.uk/roads-and-parking/parking/car-parks" } },
      { title: "Measure assembled furniture before release", body: "For a sofa or wardrobe leaving a Saltcoats flat, measure the item and the narrowest stair turn before agreeing collection with the buyer. Tell us whether sections, doors or feet can be removed. Small loose fittings should be bagged with their item, with any dismantling included in the agreed work." },
      { title: "Label a move shared between households", body: "If relatives in Ardrossan or Stevenston are adding belongings to your Saltcoats move, label each collection and destination. Include each household's availability rather than assuming everybody can wait all day. Separate deliveries need an unloading order that avoids repeatedly moving the same furniture inside the vehicle." }
    ],
    faqs: [
      { question: "Can a Saltcoats collection use the back entrance?", answer: "Yes, if access is suitable and authorised. Send the lane or gate location, photographs, steps and distance to the loading point. The address alone may lead to the front door, so rear-access instructions should be explicit." },
      { question: "What if my Saltcoats wardrobe is already dismantled?", answer: "List the panels, mirrors and any fragile pieces, and photograph the packed parts. Secure the fittings in a labelled bag. Tell us whether reassembly is requested so it can be assessed and agreed as part of the work." }
    ]
  },
  {
    slug: "stevenston", name: "Stevenston", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Stevenston",
    description: "For Stevenston collections, give the house number and entrance instructions instead of relying on a Three Towns landmark. A Main Street collection, a garden outbuilding and a shared flat can create very different carrying routes. List every item and the delivery access so the move can be planned around the actual work.",
    metaDescription: "Stevenston man and van and furniture moves. Describe Main Street access, garden carries and additional stops for a tailored removal quote.",
    highlights: ["Exact Stevenston entrance instructions", "Outbuilding contents included in the inventory", "Furniture transfers within the Three Towns"],
    nearbyAreas: ["saltcoats", "ardrossan", "kilwinning", "irvine"],
    moveAdvice: [
      { title: "Confirm the residential approach", body: "North Ayrshire publishes a Stevenston street schedule and map with its local speed-limit order, including Townhead Street connections and Schoolwell Street. For a collection off these streets, identify the final driveway or close rather than a general Main Street meeting point. Follow current signs when approaching the property.", source: { label: "North Ayrshire Council Stevenston street schedule", href: "https://www.north-ayrshire.gov.uk/documents/temporary-20mph-speed-limit-stevenston" } },
      { title: "Include the shed and garden in the item list", body: "If your Stevenston move includes garden storage, empty and measure the largest pieces before requesting a vehicle. Explain whether the route passes through the house or a separate side gate. Soil-filled planters and damp equipment need to be identified separately from clean household boxes and soft furnishings." },
      { title: "Agree who releases each furniture purchase", body: "For collections from several Stevenston sellers, obtain individual time windows and confirmation that items are ready. Record dimensions and stairs for each address. Share the full plan in one enquiry so additional pieces do not exceed the agreed load or delay a seller who only has a short availability window." }
    ],
    faqs: [
      { question: "Can a Stevenston move include belongings from a shed?", answer: "Include them in the inventory with measurements and photographs. Describe the gate width, ground surface and whether contents are damp or heavy. Any restricted or hazardous materials need to be identified before the load is accepted." },
      { question: "Do you need the delivery floor for a short Stevenston move?", answer: "Yes. A short journey can still involve demanding stairs or a difficult doorway. Both collection and delivery access determine the handling plan, even if the properties are close together." }
    ]
  },
  {
    slug: "largs", name: "Largs", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Largs",
    description: "Moving from Largs calls for a loading plan that fits the property and the vehicle. Seafront parking has vehicle restrictions, so a large removal van cannot be assumed to use a visitor bay. Describe the entrance, any outside steps and the delivery destination for a furniture collection or full move from the town.",
    metaDescription: "Largs man and van and removals. Plan seafront vehicle access, stairs and bulky furniture before arranging delivery locally or across Britain.",
    highlights: ["Seafront vehicle suitability checks", "Outside steps and flat access", "Moves from Largs to British destinations"],
    nearbyAreas: ["ardrossan", "gourock", "greenock", "saltcoats"],
    moveAdvice: [
      { title: "Do not assume Seafront parking fits a removal van", body: "The council permits cars, small vans and motorcycles at the Largs Seafront car park, with vehicles required to fit within a bay. It excludes larger goods vehicles. Agree a lawful loading location suitable for the assigned vehicle; purchasing a parking ticket does not remove the size restrictions.", source: { label: "North Ayrshire Council Largs vehicle restrictions", href: "https://www.north-ayrshire.gov.uk/roads-and-parking/parking/car-parks" } },
      { title: "Photograph the route from an upper-floor flat", body: "For a Largs flat, show the stair entrance, tight turns and the final external steps to the pavement. A lift needs its door and internal dimensions checked against bulky furniture. Tell us if the receiving property has a different access constraint so dismantling can be considered before the collection day." },
      { title: "Keep weather-sensitive pieces ready indoors", body: "If a Largs property has an exposed outdoor carry, identify upholstered furniture, artwork and loose wrapping that need protection during loading. Have items ready inside until the carrying route is agreed. Include the distance to the van and any gate that affects safe handling, particularly for broad or lightweight pieces." }
    ],
    faqs: [
      { question: "Can the van wait in the Largs Seafront car park?", answer: "Only if the vehicle and proposed use comply with the current restrictions. Larger goods vehicles are excluded by the council's published rules. The collection plan needs a suitable loading point rather than assuming a public visitor bay will work." },
      { question: "Can a Largs move go directly to a home in Wales?", answer: "Yes, a Scotland-origin move can be quoted to Wales or elsewhere in Britain. Include both addresses, the full contents and the date the destination becomes available; the journey and unloading window require confirmation." }
    ]
  },
  {
    slug: "cumnock", name: "Cumnock", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Cumnock",
    description: "Give the precise collection address when arranging a Cumnock move, especially if a property is outside the town or could be confused with New Cumnock. Town-centre furniture and a household with garage contents need different load plans. Include access at the destination as well as the number of rooms being moved.",
    metaDescription: "Cumnock man and van and removals. Plan town-centre loading, outlying property access and garage contents with a complete item-based quote.",
    highlights: ["Cumnock and New Cumnock addresses distinguished", "Town-centre and outlying property access", "Garage contents assessed with the household"],
    nearbyAreas: ["kilmarnock", "galston", "ayr", "girvan"],
    moveAdvice: [
      { title: "Find the entrance beyond the parking landmark", body: "Ayrshire Roads Alliance lists Cumnock car parks at Glaisnock Street, Tanyard and Townhead Street. These are useful reference points, but the removal enquiry needs the actual property entrance and loading position. Identify any courtyard or rear access before deciding how far heavy items must be carried.", source: { label: "Ayrshire Roads Alliance Cumnock car parks", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Off-Street-Parking/East-Ayrshire-Car-Parks.aspx" } },
      { title: "Describe an address beyond the town centre", body: "For a property reached by a private lane near Cumnock, include a location pin, gate width, surface condition and space to turn. Tell us whether another vehicle will occupy the driveway on moving day. A van should not arrive with a plan based only on the nearest road junction." },
      { title: "Bring garage contents into the original quote", body: "A Cumnock house move may include workbenches, free-standing shelving or boxed tools as well as indoor furniture. List the heavy pieces individually and identify anything requiring specialist handling. Empty storage units before lifting and keep fuels, chemicals or other restricted items out of an ordinary household load unless explicitly assessed." }
    ],
    faqs: [
      { question: "Do you need to know if my address is in New Cumnock?", answer: "Yes. Supply the full address and postcode so the correct collection location is used. Cumnock and New Cumnock are different places; a shared place-name should not substitute for the actual property details." },
      { question: "Can you quote a Cumnock house with a long driveway?", answer: "Send the driveway length, width, surface and turning space, plus photos of any gate or low obstruction. If the van cannot reach the entrance, the extra carry needs to be included in the crew and timing assessment." }
    ]
  },
  {
    slug: "stewarton", name: "Stewarton", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Stewarton",
    description: "For Stewarton furniture collections, separate the seller's address from any nearby parking or station landmark. Share flat access, garden gates and the largest dimensions before booking. A move combining Stewarton and Kilmarnock belongings can be assessed together when every stop and collection window is supplied.",
    metaDescription: "Stewarton man and van for furniture and household moves. Check entrance access, collection windows and every stop before requesting your quote.",
    highlights: ["Avenue Square area access checks", "Seller release and item measurements", "Stewarton and Kilmarnock combined moves"],
    nearbyAreas: ["kilmarnock", "galston", "irvine", "kilwinning"],
    moveAdvice: [
      { title: "Use the correct town-centre entrance", body: "The roads authority lists Avenue Square, Hamilton Gardens and Standalane Park and Ride in Stewarton. A passenger parking location is not automatically a furniture loading area. Explain which entrance serves the property and whether the van can approach it without entering a private or restricted space.", source: { label: "Ayrshire Roads Alliance Stewarton parking locations", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Off-Street-Parking/East-Ayrshire-Car-Parks.aspx" } },
      { title: "Release arrangements for a private sale", body: "For a Stewarton marketplace purchase, agree payment and item release with the seller before arranging collection. Ask for photographs of the item where it stands and the route out. Confirm who will open the property; leaving a wardrobe outside does not establish that it is protected, complete or ready for transport." },
      { title: "Coordinate a move to or from storage", body: "If your Stewarton belongings first go into storage, give the unit address, access hours, lift restrictions and unloading distance. Mark the boxes needed soonest so they can remain accessible. A later final delivery is a separate leg that needs its own date, inventory and destination access agreed." }
    ],
    faqs: [
      { question: "Can you pick up a large table from a Stewarton seller?", answer: "Provide the dimensions, whether the legs detach, floor number and doorway photographs. Agree any dismantling before collection and confirm that the seller will release the table within the proposed window." },
      { question: "Can my Stewarton removal include a storage unit?", answer: "Yes, add the storage location and its access requirements to the quote request. State whether it is an additional collection, an intermediate stop or the final destination so capacity and unloading order can be planned." }
    ]
  },
  {
    slug: "galston", name: "Galston", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Galston",
    description: "A Galston removal needs the route from the room to the loading point described as carefully as the drive to the destination. For town-centre premises, identify the correct entrance; for an outlying home, explain the final lane and turning space. Include furniture from a second household before the vehicle is selected.",
    metaDescription: "Galston man and van and house moves. Share town-centre access, private lane details and additional furniture collections for a tailored quote.",
    highlights: ["Town-centre door and loading-point checks", "Private approach and turning information", "Household combinations planned together"],
    nearbyAreas: ["kilmarnock", "stewarton", "cumnock", "irvine"],
    moveAdvice: [
      { title: "Clarify access around the centre", body: "Barr Street, Church Lane and Wallace Street are listed as Galston parking locations by Ayrshire Roads Alliance. Tell us if your entrance is reached from one of these streets or from another side of the building. Check the route for steps and obstructions before suggesting where furniture can be loaded.", source: { label: "Ayrshire Roads Alliance Galston parking locations", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Off-Street-Parking/East-Ayrshire-Car-Parks.aspx" } },
      { title: "A rural approach needs more than a postcode", body: "For a home outside Galston, send directions for the final access lane with photos of narrow gates or sharp bends. Include overhead clearance and whether the vehicle can turn on firm ground. If loading must take place farther away, explain the carrying route instead of assuming driveway access." },
      { title: "Allocate furniture when households combine", body: "If a move from Galston brings together furniture from family homes, identify which items go to which room at the destination. List unwanted duplicates separately so they are not loaded accidentally. Additional addresses and disposal requests should be discussed before booking, rather than added to a household removal on the day." }
    ],
    faqs: [
      { question: "Can you collect from a property outside Galston?", answer: "Request a quote with the full address, location pin and access details. Gates, lane width, surface and turning room need checking against the vehicle and load before collection can be confirmed." },
      { question: "Can a Galston move include furniture from relatives?", answer: "Yes, list the second address and each household's items separately. Supply access and availability for both collections so the total load and order of stops can be assessed together." }
    ]
  },
  {
    slug: "troon", name: "Troon", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Troon",
    description: "Troon home moves and furniture collections need a confirmed property entrance, especially when directions mention the beach or harbour. If a ferry forms part of the journey, share that separately from the household collection. Indoor access, outside carrying distance and the full destination all belong in the quote.",
    metaDescription: "Man and van in Troon for furniture and house moves. Plan beach-area access, harbour connections and delivery details before confirming collection.",
    highlights: ["Beach-area property access", "Harbour connections confirmed separately", "House and flat inventories"],
    nearbyAreas: ["prestwick", "ayr", "irvine", "kilmarnock"],
    moveAdvice: [
      { title: "A beach car park is a landmark, not a loading reservation", body: "Ayrshire Roads Alliance lists Beach Road, Titchfield Road and the South Beach car parks in Troon. For a nearby move, identify the actual entrance and check a suitable loading point. The van's size, carrying distance and any private forecourt permission still need to be assessed.", source: { label: "Ayrshire Roads Alliance Troon car parks", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Off-Street-Parking/South-Ayrshire-Car-Parks.aspx" } },
      { title: "Keep ferry timing separate from packing time", body: "CalMac's Arran route information can include services operating from Troon. If your belongings need a crossing, disclose it before agreeing the removal date. The vehicle booking and operating port must be confirmed with the live timetable; finishing packing at a particular hour does not guarantee a sailing connection.", source: { label: "CalMac Arran route and port updates", href: "https://www.calmac.co.uk/route-information/ardrossan-brodick/" } },
      { title: "Prepare a sheltered handover for soft furnishings", body: "Where a Troon property has an outdoor carry, keep sofas, mattresses and boxed electronics indoors until loading is ready. Describe exposed steps or a gate that limits handling space. Have the receiving room available so furniture can be placed without leaving delicate items outside while access is resolved." }
    ],
    faqs: [
      { question: "Can I use Troon harbour as the collection address?", answer: "Only if the collection really takes place at an authorised harbour location with suitable arrangements. For a household move, provide the property address. A ferry terminal reference alone does not explain where the belongings are or how the crew can reach them." },
      { question: "Can you move from Troon to another part of Britain?", answer: "Yes, provide the destination address, contents and access window. Any ferry leg or extra stop must be declared so it can be assessed alongside the road journey and unloading requirements." }
    ]
  },
  {
    slug: "prestwick", name: "Prestwick", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Prestwick",
    description: "A Prestwick removal should be planned around the home entrance and parking arrangements, rather than an airport or station landmark. Tell us about any permit-controlled street, stairs and the full furniture list. If you are travelling separately, agree who will release the belongings and receive them at the destination.",
    metaDescription: "Prestwick man and van and home removals. Share parking restrictions, property access and key-handover arrangements for your moving quote.",
    highlights: ["Residential parking checks", "Key handovers while travelling", "Furniture and full-home quotes"],
    nearbyAreas: ["ayr", "troon", "irvine", "kilmarnock"],
    moveAdvice: [
      { title: "Check the street's permit arrangements", body: "Ayrshire Roads Alliance publishes a resident parking scheme for specified Prestwick streets. Tell us if your property is affected and check what arrangements apply to a visiting removal vehicle. A resident's own parking entitlement should not be treated as an automatic reserved place for the van.", source: { label: "Ayrshire Roads Alliance Prestwick resident parking", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Residents-Parking-Permits/Prestwick-Residents-Parking-Permit.aspx" } },
      { title: "Keep travel plans separate from property access", body: "If you leave Prestwick by air or rail on moving day, appoint somebody who can provide entry and confirm the agreed inventory. Give a reachable contact for the destination too. Do not depend on a flight arrival time alone for unloading; keys and access need their own confirmed arrangement." },
      { title: "List appliances and connection work separately", body: "Before an appliance leaves a Prestwick home, confirm it is ready for transport and disclose its dimensions and lifting route. Disconnecting services or installing an appliance is different from carrying it. Agree any additional work expressly, and identify appliance doors or handles that make the access tighter." }
    ],
    faqs: [
      { question: "Does my Prestwick resident permit cover the removal van?", answer: "Do not assume it does. Check the scheme and the current street signs, then discuss the visiting vehicle's loading arrangements before moving day. The plan needs a lawful space suitable for that vehicle." },
      { question: "Can someone else meet the crew at my Prestwick home?", answer: "Yes, arrange an authorised contact who can open the property and identify the agreed items. Share their availability and make sure delivery access is also covered while you are travelling." }
    ]
  },
  {
    slug: "girvan", name: "Girvan", region: "West Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Girvan",
    description: "For a Girvan collection, describe whether belongings leave a town-centre flat, a house or a property outside the town. A harbour-area landmark does not establish loading access. Furniture size, the final approach and the delivery key handover help determine a practical plan for a local move or a journey elsewhere in Britain.",
    metaDescription: "Girvan man and van for furniture and household removals. Check harbour-area access, rural approaches and long-distance delivery arrangements.",
    highlights: ["Harbour-area entrance details", "Outlying house access checks", "Long-distance unloading arrangements"],
    nearbyAreas: ["ayr", "prestwick", "troon", "cumnock"],
    moveAdvice: [
      { title: "Identify the door beyond the parking location", body: "The roads authority lists The Flushes, Chalmers Arcade and Knockcushan Street as Girvan car park locations. Give the collection entrance and a possible loading position separately. Check whether a bulky item must cross a public path or pass through a shared entrance before reaching the vehicle.", source: { label: "Ayrshire Roads Alliance Girvan parking locations", href: "https://www.ayrshireroadsalliance.org/Parking-Information/Off-Street-Parking/South-Ayrshire-Car-Parks.aspx" } },
      { title: "Explain access beyond Girvan itself", body: "For a collection outside the built-up town, add directions for the final lane and photographs of its narrowest point. Describe gates, low branches and the place a loaded van can turn. Let us know if livestock gates must be closed after entry or if another person controls access." },
      { title: "Coordinate an onward delivery before departure", body: "When belongings leave Girvan for a distant destination, confirm the receiving address and access window before arranging collection. Explain whether furniture goes straight into rooms or into temporary storage. Keep essentials and documents separate so you can travel independently of the load if required." }
    ],
    faqs: [
      { question: "Can you collect from a lane outside Girvan?", answer: "It can be assessed with the address, lane photographs, clearance and turning information. If the vehicle cannot approach the house safely, a longer carry or another arrangement must be agreed in advance." },
      { question: "Is delivery from Girvan to England available?", answer: "Yes, moves beginning in Scotland can go to destinations across Britain. A quote needs the full load and access at both ends, with collection and delivery timings confirmed for the particular journey." }
    ]
  },
  {
    slug: "bishopbriggs", name: "Bishopbriggs", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Bishopbriggs",
    description: "A Bishopbriggs furniture move needs the correct entrance and loading location, not simply a town-centre meeting point. Describe any shared stair, driveway or garden path and list furniture that needs dismantling. For a home-office move, label equipment separately from household boxes so the delivery can follow the intended room layout.",
    metaDescription: "Bishopbriggs man and van and removals. Plan town-centre loading, driveway access and home-office furniture with a complete item-based quote.",
    highlights: ["Town-centre loading-point checks", "Driveway and shared-stair measurements", "Home-office items labelled separately"],
    nearbyAreas: ["kirkintilloch", "bearsden", "glasgow", "milngavie"],
    moveAdvice: [
      { title: "Distinguish Kenmure Drive parking from loading access", body: "East Dunbartonshire lists Kenmure Drive among its charged car parks in Bishopbriggs. For a nearby collection, locate the building entrance and check the route for bulky items. A parking payment does not reserve space at a shop or flat entrance, so confirm the actual loading arrangement first.", source: { label: "East Dunbartonshire Council Bishopbriggs parking", href: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/roads-pavements-transport/pay-and-display-car-parks/" } },
      { title: "Check driveways for the loaded vehicle", body: "For a Bishopbriggs house, give the driveway width, slope and turning space as well as the number of cars normally parked there. Photograph any overhanging tree or porch near the approach. A clear driveway for a car may still be unsuitable for the size of van needed for the contents." },
      { title: "Keep office equipment identifiable", body: "If a Bishopbriggs home move includes desks, monitors or work storage, label the equipment by room and user. Back up and pack personal devices yourself, with cables kept together. List heavy desks and filing cabinets individually so carrying and any agreed dismantling can be planned around their dimensions." }
    ],
    faqs: [
      { question: "Can you move a Bishopbriggs home office with the house contents?", answer: "Yes, include it in the inventory and identify equipment needing particular handling. State whether desks are assembled and how the destination rooms are reached. Disconnection, packing or reassembly should be agreed separately where required." },
      { question: "What driveway photographs help with a Bishopbriggs quote?", answer: "Show the entrance from the road, narrowest width, overhead clearance and turning area. Also show the route from the house door to the proposed loading position so the crew can assess both vehicle and carrying access." }
    ]
  },
  {
    slug: "kirkintilloch", name: "Kirkintilloch", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Kirkintilloch",
    description: "For a Kirkintilloch move, identify the entrance used for carrying furniture and whether collection involves a flat, shop or house. Parking near Barleybank or the library may be separate from the building's goods access. Tell us about additional collection stops and the key-release time at your new home before the route is agreed.",
    metaDescription: "Kirkintilloch man and van for flats, homes and furniture. Check town-centre goods access, stairs and key handovers for your moving quote.",
    highlights: ["Town-centre goods entrances identified", "Flat stair and landing measurements", "Multi-stop routes agreed beforehand"],
    nearbyAreas: ["bishopbriggs", "glasgow", "bearsden", "stirling"],
    moveAdvice: [
      { title: "Separate visitor parking from a goods entrance", body: "Barleybank and William Patrick Library are named in the council's Kirkintilloch parking information. For premises nearby, ask the occupier where bulky deliveries or collections take place. Share that entrance with the quote, including access controls, rather than routing the van to a visitor parking landmark.", source: { label: "East Dunbartonshire Council Kirkintilloch parking", href: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/roads-pavements-transport/pay-and-display-car-parks/" } },
      { title: "Measure the landing before moving a tall unit", body: "A Kirkintilloch flat removal should include the ceiling clearance and tightest turn as well as door width. Tall wardrobes and bookcases may fit through an entrance but fail to turn on a landing. Send photographs with dimensions and say whether dismantling instructions or removable sections are available." },
      { title: "Avoid an unplanned second collection", body: "If belongings from Bishopbriggs or another address join your Kirkintilloch load, include that stop at the outset. Record the quantity, access and time window separately. Loading must accommodate both groups safely, with the items for an early delivery reachable without unloading the rest onto the pavement." }
    ],
    faqs: [
      { question: "Can you collect from a Kirkintilloch business?", answer: "Provide the goods entrance, responsible contact, item list and permitted collection hours. Ask whether the business requires a loading appointment or vehicle details in advance, and include those conditions in the enquiry." },
      { question: "How do I check a wardrobe will leave my Kirkintilloch flat?", answer: "Measure its height, width and depth, then the doorway, landing and stair turn. Photographs help assess the route. State whether it can be dismantled; safe removal should not be assumed from the room doorway alone." }
    ]
  },
  {
    slug: "bearsden", name: "Bearsden", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Bearsden",
    description: "Bearsden furniture collections range from a single bulky purchase to a complete household with garden and garage contents. Specify the loading point and the room each item leaves, including any drive slope or narrow side gate. Town-centre parking and private residential access need separate checks before the vehicle and crew are confirmed.",
    metaDescription: "Bearsden man and van and home removals. Describe driveway access, garden furniture and bulky items for a quote based on the full move.",
    highlights: ["Roman Road area entrance checks", "Driveway and garden access planning", "Large furniture and garage inventories"],
    nearbyAreas: ["milngavie", "clydebank", "bishopbriggs", "glasgow"],
    moveAdvice: [
      { title: "Clarify loading near the centre", body: "The council's Bearsden parking list includes Roman Road, the Hub, The Glebe and the station. Use the exact property entrance when describing a collection near these locations. Check signs and private access separately; a public parking option does not establish that furniture can be carried through an adjacent property.", source: { label: "East Dunbartonshire Council Bearsden parking locations", href: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/roads-pavements-transport/pay-and-display-car-parks/" } },
      { title: "Include both drive access and the side gate", body: "For a Bearsden house with furniture in a conservatory or garden room, describe whether items leave through the home or a side passage. Measure gates and any changes in level. Let us know where the van can stand while leaving neighbours' drives and pedestrian access usable." },
      { title: "Plan large pieces before packing the small ones", body: "List oversized dining tables, wardrobes and outdoor storage units separately in a Bearsden move. Establish whether they need dismantling and retain the correct fixings and instructions. Packing boxes first should not block the route needed to remove the largest furniture or inspect a difficult doorway." }
    ],
    faqs: [
      { question: "Can garden-room furniture be included in my Bearsden move?", answer: "Yes, list the pieces and describe the route through gates, paths or the house. Include measurements for broad items and let us know about steps or uneven ground so the handling can be assessed." },
      { question: "Should I dismantle furniture before a Bearsden collection?", answer: "Agree this before moving day. Share dimensions, access photographs and assembly instructions where available. Some pieces travel safely assembled; others may need preparation or specialist handling, which must be included in the quote." }
    ]
  },
  {
    slug: "milngavie", name: "Milngavie", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Milngavie",
    description: "For a Milngavie collection, identify the entrance that furniture can actually use and its distance from a suitable loading space. A town-centre business, upper-floor flat and house on the edge of town need different arrangements. Include fragile items and any storage stop when requesting a local or long-distance move.",
    metaDescription: "Milngavie man and van for furniture, flats and home moves. Plan loading access, fragile items and storage stops before confirming your quote.",
    highlights: ["Town-centre carrying routes", "Fragile furniture preparation", "Storage and onward delivery planning"],
    nearbyAreas: ["bearsden", "bishopbriggs", "clydebank", "glasgow"],
    moveAdvice: [
      { title: "Choose the right side of the building", body: "Douglas Street, Mugdock Road, Stewart Street and Woodburn Way appear in the council's Milngavie parking information. Give the actual goods or residential entrance for your collection. If the front door opens onto a walking route, ask the occupier about authorised vehicle access rather than assuming the van can stop outside.", source: { label: "East Dunbartonshire Council Milngavie parking", href: "https://www.eastdunbarton.gov.uk/services/a-z-of-services/roads-pavements-transport/pay-and-display-car-parks/" } },
      { title: "Describe fragile pieces as well as boxes", body: "For a Milngavie household containing glass cabinets, mirrors or artwork, send dimensions and explain how each piece is packed. Remove loose shelves where appropriate and identify the fragile faces. Ordinary box counts cannot describe an oversized framed item or determine whether additional protection is required." },
      { title: "Split storage and final-home deliveries clearly", body: "If part of your Milngavie load goes to storage while the rest goes to a new home, label each destination before collection. Supply storage access hours and the receiving contact for the house. The vehicle should be loaded in an order that keeps each group accessible without unnecessary handling." }
    ],
    faqs: [
      { question: "Can furniture be collected from a Milngavie pedestrian-facing entrance?", answer: "Describe the entrance and ask the occupier about the permitted loading route. The plan may involve another doorway or a longer carry. Vehicle access must be established before confirming where the van will stand." },
      { question: "Can a Milngavie move have two delivery addresses?", answer: "Yes, request this with separate item lists for each destination, access details and time windows. The route, unloading order and price need to include both deliveries from the start." }
    ]
  },
  {
    slug: "clydebank", name: "Clydebank", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Clydebank",
    description: "Clydebank collections need the building's correct entrance and loading arrangements, particularly for shopping-centre purchases or waterfront premises. A public parking space and a business goods bay are different access arrangements. Give the item list, floor and delivery address so a local furniture run or larger removal can be assessed accurately.",
    metaDescription: "Clydebank man and van for furniture and home removals. Confirm shopping-centre goods access, flat entrances and the complete delivery route.",
    highlights: ["Shopping-centre collection arrangements", "Waterfront and flat entrance details", "Cross-Clyde routes checked for the date"],
    nearbyAreas: ["dumbarton", "bearsden", "renfrew", "glasgow"],
    moveAdvice: [
      { title: "Ask the shopping centre about goods collection", body: "West Dunbartonshire Council identifies Clydebank town-centre parking as provided and maintained by the shopping centre. For furniture bought there, obtain the retailer's collection instructions and any loading appointment. Do not treat the customer car park as permission to use a service yard or leave a large vehicle unattended.", source: { label: "West Dunbartonshire Council parking information", href: "https://www.west-dunbarton.gov.uk/roads-parking-travel/parking-and-car-parks/parking" } },
      { title: "Check a cross-Clyde connection before handover", body: "Renfrewshire describes Renfrew Bridge as a connection between Renfrew and Clydebank/Yoker. If it forms part of your move, check its operating information for the day rather than assuming the shortest map route is available. Supply the receiving contact and any fixed appointment so the route can account for access changes.", source: { label: "Renfrewshire Council Renfrew Bridge information", href: "https://www1.renfrewshire.gov.uk/article/14445/Renfrew-Bridge" } },
      { title: "Specify the flat rather than the development name", body: "For a Clydebank apartment collection, provide the block entrance, floor, door number and entry instructions. Confirm whether the lift may be used for furniture and whether it needs booking. Measure its doorway as well as the cabin, and include the distance from the building exit to the loading point." }
    ],
    faqs: [
      { question: "Can you collect an item from a Clydebank shopping-centre store?", answer: "Yes, request a quote after the retailer confirms the goods collection location and release window. Include packed dimensions and any appointment or vehicle details the store requires. Customer parking access alone is not enough." },
      { question: "What do you need for a Clydebank apartment move?", answer: "The contents, block and flat numbers, floor, lift dimensions and loading distance. Tell us about entry codes, concierge arrangements or reserved delivery slots, and supply the same information for the destination." }
    ]
  },
  {
    slug: "dumbarton", name: "Dumbarton", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Dumbarton",
    description: "For a Dumbarton removal, give the exact property entrance rather than a general riverside or town-centre landmark. The town lies beside the Leven and Clyde, so the correct approach matters when addresses are close on a map. Include shared stairs, large furniture and any second collection in your enquiry.",
    metaDescription: "Dumbarton man and van and removals. Share the correct entrance, riverside approach, stairs and large-item dimensions for a tailored quote.",
    highlights: ["Exact entrance and approach directions", "Shared-stair furniture assessments", "Separate inventories for additional collections"],
    nearbyAreas: ["alexandria", "balloch", "clydebank", "erskine"],
    moveAdvice: [
      { title: "Use the property approach beside the rivers", body: "The council places Dumbarton beside the River Leven on the north bank of the Clyde. For a riverside collection, send the road entrance and loading location rather than a pin placed on the nearest path or landmark. The route for a vehicle must be distinguished from a pedestrian approach.", source: { label: "West Dunbartonshire Council Dumbarton location information", href: "https://www.west-dunbarton.gov.uk/leisure-parks-events/tourism-and-visitor-attractions/tourist-information" } },
      { title: "Check town-centre building access before dismantling", body: "If furniture leaves an older Dumbarton building, photograph the door recess, stair turns and any change in floor level. Measure the largest piece in its transport configuration. Agree whether feet or sections should be removed, and protect shared surfaces without obstructing other residents' exit route." },
      { title: "Account for belongings in another property", body: "A Dumbarton move that includes stored furniture in Alexandria or Clydebank needs all addresses listed. Identify which pieces are at each location and whether a keyholder must meet the crew. The proposed collection order should work with those access windows and the combined load, not just the distance between towns." }
    ],
    faqs: [
      { question: "Why does a Dumbarton quote need an entrance pin?", answer: "It helps distinguish the vehicle approach from a nearby path, courtyard or riverside landmark. Include the full address as well, plus any access restrictions and the distance between the entrance and a suitable loading point." },
      { question: "Can furniture from Alexandria join my Dumbarton move?", answer: "Yes, include it as an additional collection with its own item list and access window. Vehicle capacity, handling and collection order need to cover both addresses before the booking is confirmed." }
    ]
  },
  {
    slug: "alexandria", name: "Alexandria", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Alexandria",
    description: "This Alexandria service enquiry covers the Vale of Leven in West Dunbartonshire, south of Balloch. Give the complete address and entrance details for a household move or furniture collection. If belongings are split between Alexandria, Bonhill or another nearby address, list each stop and its contents before requesting a vehicle.",
    metaDescription: "Alexandria man and van in the Vale of Leven. Plan furniture access, separate collection addresses and moves from West Dunbartonshire across Britain.",
    highlights: ["Vale of Leven collection addresses", "Separate loads from nearby households", "Flat and house access planning"],
    nearbyAreas: ["balloch", "dumbarton", "clydebank", "milngavie"],
    moveAdvice: [
      { title: "Specify Alexandria in the Vale of Leven", body: "West Dunbartonshire Council identifies Alexandria as south of Balloch in the Vale of Leven. Use the full postal address and a precise entrance location when booking. If the property is described locally using Bonhill or another nearby place-name, clarify the road and house number so the right collection is assessed.", source: { label: "West Dunbartonshire Council Vale of Leven information", href: "https://www.west-dunbarton.gov.uk/leisure-parks-events/tourism-and-visitor-attractions/tourist-information" } },
      { title: "Describe the complete exit from a flat", body: "For an Alexandria flat, record the floor and any outside steps as separate parts of the carrying route. Send photographs of the widest furniture at the tightest turn. If a shared landing is also used for storage, arrange for it to be cleared before collection without blocking neighbouring doors." },
      { title: "Distinguish a household removal from a partial transfer", body: "When only part of an Alexandria home is moving, mark the items staying behind and identify what goes to each destination. Confirm whether packed boxes contain books or other dense contents. A small number of heavy boxes can require a different handling plan from the same number of light household cartons." }
    ],
    faqs: [
      { question: "Does this page refer to Alexandria near Loch Lomond?", answer: "Yes. It covers Alexandria in West Dunbartonshire's Vale of Leven, south of Balloch. Give the full collection address and postcode so the correct property and approach are used." },
      { question: "Can you move only selected furniture from my Alexandria home?", answer: "Yes, list the exact pieces and label them before collection. Include dimensions, floor access and the destination for each group. Make clear which furniture remains at the property." }
    ]
  },
  {
    slug: "balloch", name: "Balloch", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Balloch, Loch Lomond",
    description: "This page covers Balloch at the southern end of Loch Lomond in West Dunbartonshire. For a house move, holiday-property furniture transfer or single-item collection, identify the actual road entrance and any managed access. Please include the full postcode so it is not confused with Balloch near Inverness.",
    metaDescription: "Man and van in Balloch, Loch Lomond, West Dunbartonshire. Quote furniture and house moves with precise access and delivery across Britain.",
    highlights: ["Balloch at Loch Lomond clearly identified", "Managed-property access and key handovers", "Mainland moves from West Dunbartonshire"],
    nearbyAreas: ["alexandria", "dumbarton", "clydebank", "milngavie"],
    moveAdvice: [
      { title: "Confirm which Balloch and which entrance", body: "The council locates this Balloch at the southern end of Loch Lomond, with Loch Lomond Shores and the country park nearby. Give the residential or business entrance itself, not a visitor attraction's postcode. State West Dunbartonshire and the complete address to avoid confusion with the Balloch near Inverness.", source: { label: "West Dunbartonshire Council Balloch location", href: "https://www.west-dunbarton.gov.uk/leisure-parks-events/tourism-and-visitor-attractions/tourist-information" } },
      { title: "Arrange access to a managed or holiday property", body: "For furniture moving from a managed property around Balloch, confirm who holds the key and whether vehicles must use a particular entrance. Explain any changeover window and keep guest belongings separate from the transport inventory. The manager should approve access before a collection time is agreed." },
      { title: "Treat outside paths as part of the handling plan", body: "If furniture must travel along a path before reaching the van, send its length, surface and narrowest point. Identify gates and steps, and do not assume a visitor parking area can serve as a loading bay. The quote should reflect the actual carry, especially for wardrobes or broad sofas." }
    ],
    faqs: [
      { question: "Is this Balloch near Inverness or Loch Lomond?", answer: "This page is for Balloch by Loch Lomond in West Dunbartonshire. Include the full address and postcode with the enquiry. For a collection near Inverness, use the Inverness area information and identify the Highland address explicitly." },
      { question: "Can you move furniture from a managed Balloch property?", answer: "Yes, it can be assessed once the manager's access rules, keyholder and item list are supplied. Mention a fixed changeover period, private roads or a required loading appointment before the collection is confirmed." }
    ]
  },
  {
    slug: "giffnock", name: "Giffnock", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Giffnock",
    description: "A Giffnock home move benefits from a clear driveway and furniture access assessment before a van is assigned. Tell us about school-adjacent streets, steps to the front door and garden-room contents. A short transfer to Glasgow or Newton Mearns still needs the load, lifting requirements and destination access checked.",
    metaDescription: "Giffnock man and van and home moves. Plan driveway access, school-area collection timing and bulky furniture for a tailored removal quote.",
    highlights: ["School-area approach checked for the date", "Driveway and front-step measurements", "Household and garden-room furniture"],
    nearbyAreas: ["newton-mearns", "barrhead", "glasgow-southside", "east-kilbride"],
    moveAdvice: [
      { title: "Check the approach around Giffnock Primary", body: "The council's Neighbourhood Streets programme identifies Giffnock Primary School and Church Road among locations considered for access and crossing improvements. It contains proposals as well as completed work. Check current signs and the property approach for your move date, and avoid planning a bulky load across a busy school entrance.", source: { label: "East Renfrewshire Council Neighbourhood Streets programme", href: "https://getinvolved.eastrenfrewshire.gov.uk/neighbourhood-streets-2024" } },
      { title: "A driveway does not describe the whole carry", body: "For a Giffnock house, photograph the drive, front steps and any side passage used for large furniture. Measure the available opening with gates fully open and note a sloping surface. If belongings come from a garden room, include that separate route and the condition of the path." },
      { title: "Give dining and lounge furniture individual measurements", body: "A move from Giffnock containing a large dining table, display cabinet or corner sofa should identify these pieces individually. Record removable sections and any glass panels. Agree preparation before collection, then keep small fixings with their corresponding item so delivery is not delayed by missing parts." }
    ],
    faqs: [
      { question: "Can you quote a Giffnock home with front steps?", answer: "Yes, send the number and shape of steps, handrail clearance and photographs with the largest items' dimensions. Include any alternative side entrance. The crew and handling must be appropriate for the full route." },
      { question: "Does a short Giffnock-to-Newton Mearns move need a full inventory?", answer: "Yes. The contents, stairs and carrying distances determine the work even when the driving distance is short. Include garden and garage items rather than counting only the main rooms." }
    ]
  },
  {
    slug: "newton-mearns", name: "Newton Mearns", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Newton Mearns",
    description: "Newton Mearns removals should include the precise driveway or building entrance, the largest items and any belongings in a garage or garden room. If your route involves Barrhead Road or Aurs Road, check the current approach when arranging the move. Collection and delivery need to fit the key handovers at both properties.",
    metaDescription: "Newton Mearns man and van and removals. Plan driveway access, large furniture, Barrhead Road approaches and delivery key handovers.",
    highlights: ["Barrhead Road approach checks", "Driveway turning and garage contents", "Key-release timing included in planning"],
    nearbyAreas: ["giffnock", "barrhead", "glasgow-southside", "east-kilbride"],
    moveAdvice: [
      { title: "Recheck the Barrhead Road approach", body: "East Renfrewshire's active-corridor information covers Barrhead Road in Newton Mearns and its connection towards Aurs Road. The programme includes different phases and proposed changes. For a property along that approach, check current road access and identify the driveway rather than relying on an old route screenshot.", source: { label: "East Renfrewshire Council Barrhead Road Active Corridor", href: "https://getinvolved.eastrenfrewshire.gov.uk/barrheadroadactivecorridor" } },
      { title: "Make room for a vehicle and a working carry route", body: "At a Newton Mearns house, describe where household cars will stand while the removal takes place. Photograph the gate, drive bend and overhead clearance. Leave a clear route between the van and door without assuming the vehicle can reverse around a tight bend or use a neighbour's entrance." },
      { title: "Prepare for a delayed key release", body: "For a linked house purchase, tell us when the new Newton Mearns property or onward destination is expected to become available. Explain who will receive updates and where essentials are packed. Waiting arrangements need to be discussed before moving day, particularly when a full load cannot be left unattended at the destination." }
    ],
    faqs: [
      { question: "Can my Newton Mearns quote include garage and garden contents?", answer: "Yes, add them to the original inventory with photographs and dimensions for large pieces. Describe the route out and identify unusually heavy or restricted items so they can be assessed before the vehicle is selected." },
      { question: "What happens if keys are not ready at my new home?", answer: "Discuss that possibility when requesting the move and confirm an available contact. Waiting, storage or a changed delivery arrangement must be agreed; do not assume the van can remain indefinitely or unload without authorised access." }
    ]
  },
  {
    slug: "barrhead", name: "Barrhead", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Barrhead",
    description: "A Barrhead collection needs precise directions for the building entrance, especially where a service road differs from the main approach. Tell us about shared stairs, access through a garden and the quantity being moved. Furniture transfers towards Newton Mearns or Glasgow can be planned with any additional stop when the full route is supplied.",
    metaDescription: "Barrhead man and van for furniture, flats and house moves. Clarify service-road access, carrying routes and extra stops before booking.",
    highlights: ["Main-road and service-road entrances distinguished", "Auchenback approach checks", "Multiple collections planned around access"],
    nearbyAreas: ["newton-mearns", "giffnock", "paisley", "glasgow-southside"],
    moveAdvice: [
      { title: "Give the correct Aurs Road entrance", body: "The council's corridor information distinguishes Aurs Road improvements from proposed work on the service road in Auchenback, Barrhead. If your address uses a service road, mark the vehicle entrance clearly. Check the current layout and any temporary signs; the published project phases are not a guarantee that every road arrangement is complete.", source: { label: "East Renfrewshire Council Aurs Road and Barrhead Road programme", href: "https://getinvolved.eastrenfrewshire.gov.uk/barrheadroadactivecorridor" } },
      { title: "Keep a flat move clear of shared obstructions", body: "For a Barrhead flat, identify the close entrance, floor and the tightest stair landing before deciding how furniture should travel. Arrange access with the keyholder and keep other residents' doors usable. Ask before removing furniture parts and retain fixings so the item remains ready for the agreed delivery." },
      { title: "Add purchases to the inventory before collection", body: "If a Barrhead home move also collects a sofa or bed from a seller, give that address and time window in advance. Compare the purchased item's dimensions with the destination access. A newly added piece can change the space, crew and unloading order required for the entire move." }
    ],
    faqs: [
      { question: "Why should I specify a service-road entrance in Barrhead?", answer: "The address may be associated with the main road even when vehicle access is elsewhere. A pin, photograph and brief approach instructions help establish the correct entrance and avoid an unsuitable stopping point." },
      { question: "Can you collect a newly purchased bed during my Barrhead move?", answer: "Include the seller's address, release window, dimensions and whether the bed is dismantled. The extra collection and destination access must be assessed with the household inventory before it is added to the booking." }
    ]
  },
  {
    slug: "greenock", name: "Greenock", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Greenock",
    description: "Greenock removals need parking and building access considered together. Town-centre disc and permit arrangements do not replace a suitable loading plan, and an upper-floor property may add substantial carrying work. Share the floor, steps, item dimensions and receiving address for a local move or a Scotland-origin journey across Britain.",
    metaDescription: "Greenock man and van and removals. Check town-centre parking, stair access and furniture handling before arranging your collection and delivery.",
    highlights: ["Town-centre parking conditions checked", "Upper-floor and external-step details", "Fragile furniture assessed individually"],
    nearbyAreas: ["port-glasgow", "gourock", "largs", "erskine"],
    moveAdvice: [
      { title: "Check the specific Greenock parking zone", body: "Inverclyde's Greenock guidance distinguishes disc-controlled parking, paid car parks and resident permit areas. Identify the actual street and loading location before the move. Do not assume that a resident's permit or an advertised free parking period gives a visiting van the right to occupy any bay for the whole removal.", source: { label: "Inverclyde Council parking in Greenock", href: "https://www.inverclyde.gov.uk/environment/roads-lighting/parking-inverclyde/parking-inverclyde/parking-in-greenock" } },
      { title: "Record outside steps separately from internal stairs", body: "For a Greenock property, show every level change between the room and the van. An internal floor number does not describe garden steps, an external stair or a sloping carry. Send photographs and dimensions for bulky furniture so crew requirements reflect the full route rather than the number of rooms alone." },
      { title: "Plan a fragile cabinet as a complete item", body: "If a Greenock move includes a cabinet with glass shelves or a large mirror, identify removable and fragile components before packing. Label each part and say who will prepare it. The loading plan should protect the piece while keeping any furniture needed at an earlier delivery accessible." }
    ],
    faqs: [
      { question: "Does free town-centre parking make Greenock loading unrestricted?", answer: "No. The specific bay, vehicle, time conditions and loading restrictions still matter. Share the proposed stopping point and check current signs so the move is planned around lawful access." },
      { question: "What photos help quote a Greenock upper-floor move?", answer: "Show the entrance, each tight stair turn, outside steps and the proposed loading point. Add the dimensions of the largest pieces and explain whether a lift is available and suitable for furniture." }
    ]
  },
  {
    slug: "port-glasgow", name: "Port Glasgow", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Port Glasgow",
    description: "For Port Glasgow furniture and household moves, identify the exact building entrance and whether items are collected from a shop, flat or house. Town-centre parking conditions differ from access to a retail collection bay. Include the packed furniture dimensions and the route into the delivery room before booking transport.",
    metaDescription: "Port Glasgow man and van and house moves. Plan town-centre loading, retail collection instructions and delivery access for bulky furniture.",
    highlights: ["Fore Street and Shore Street area access", "Retail goods release instructions", "Complete doorway and stair measurements"],
    nearbyAreas: ["greenock", "gourock", "erskine", "renfrew"],
    moveAdvice: [
      { title: "Distinguish car park rules from street loading", body: "Inverclyde's Port Glasgow information treats Fore Street and Shore Street car parks separately from town-centre on-street parking. Identify where the van is expected to stand and check the rules for that location. A nearby public car park does not establish a loading route into the building.", source: { label: "Inverclyde Council parking in Port Glasgow", href: "https://www.inverclyde.gov.uk/environment/roads-lighting/parking-inverclyde/parking-inverclyde/parking-in-port-glasgow" } },
      { title: "Obtain the retailer's collection instructions", body: "For a Port Glasgow furniture purchase, ask where goods are released, whether an appointment is needed and what proof the collector must present. Use packed dimensions when the item is boxed. Confirm whether assembly or placement is requested at home so it can be assessed separately from transport." },
      { title: "Check the last part of the delivery route", body: "A large sofa can leave a spacious retail collection area yet meet a narrow stair at the receiving home. Measure the destination door, turns and landings before release. Tell us about removable sections and send access photos if the fit is uncertain; a successful collection does not establish a successful carry upstairs." }
    ],
    faqs: [
      { question: "Can you collect boxed furniture from a Port Glasgow retailer?", answer: "Yes, provide the retailer's release instructions, collection reference, packed dimensions and available window. Include the destination room and access so any carrying, unpacking or assembly request can be assessed in advance." },
      { question: "Can Port Glasgow belongings go to two homes?", answer: "Supply a separate inventory for each delivery address, with access and receiving windows. The quote needs both stops and a load order that allows the right furniture to be reached safely." }
    ]
  },
  {
    slug: "gourock", name: "Gourock", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Gourock",
    description: "A Gourock move needs the correct household entrance and an assessed loading point, even when a station or waterfront landmark is close by. Tell us about external steps, upper floors and the largest furniture. If your own travel involves a ferry, agree a keyholder separately so the collection is not dependent on an assumed connection.",
    metaDescription: "Gourock man and van and removals. Plan waterfront parking, external steps and keyholder arrangements for furniture and full household moves.",
    highlights: ["Waterfront and station-area loading checks", "External steps included in the quote", "Independent travel and key handovers"],
    nearbyAreas: ["greenock", "port-glasgow", "largs", "dumbarton"],
    moveAdvice: [
      { title: "Check the exact Gourock parking location", body: "Inverclyde identifies Station Road North and South as car parks beside Gourock station and publishes separate town-centre parking guidance. Use the property entrance for your collection instructions. If a public car park is proposed, check vehicle suitability, current conditions and the carry rather than assuming station parking serves the address.", source: { label: "Inverclyde Council parking in Gourock", href: "https://www.inverclyde.gov.uk/environment/roads-lighting/parking-inverclyde/parking-inverclyde/parking-in-gourock" } },
      { title: "Describe outdoor changes in level", body: "For a Gourock property with steps from the road, photograph the whole route and note landings, handrails and gate widths. Keep loose garden items clear of the path. Include the size and weight of broad furniture so its handling can be assessed against the approach as well as the indoor stair." },
      { title: "Agree a keyholder if you travel separately", body: "If you plan to leave Gourock by ferry or another connection while belongings travel by road, name an authorised person to meet the crew. Keep documents and essentials with you and confirm the receiving contact. The collection and delivery plan should not depend on an unconfirmed passenger arrival time." }
    ],
    faqs: [
      { question: "Can the van load near Gourock station?", answer: "Give the actual property address and proposed loading point. Current parking rules, vehicle dimensions and the carrying route need to be checked; the station being nearby does not automatically provide suitable household loading access." },
      { question: "Can you move furniture from a Gourock house with external steps?", answer: "It can be assessed using photographs, step measurements and the item list. Describe any alternative entrance and the distance to the van so an appropriate crew and handling plan can be agreed." }
    ]
  },
  {
    slug: "renfrew", name: "Renfrew", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Renfrew",
    description: "Renfrew moves can involve town-centre premises, a managed flat or a collection continuing across the Clyde. Give the exact entrance and any delivery-slot requirements, with both addresses and a complete furniture list. A bridge connection should be checked for the moving date before setting a fixed handover appointment.",
    metaDescription: "Renfrew man and van and home moves. Plan apartment access, town-centre collections and any cross-Clyde journey with a complete moving quote.",
    highlights: ["Renfrew Bridge route information checked", "Managed-flat delivery appointments", "Household and retail collections distinguished"],
    nearbyAreas: ["paisley", "erskine", "clydebank", "glasgow"],
    moveAdvice: [
      { title: "Check Renfrew Bridge when planning the route", body: "Renfrewshire Council describes Renfrew Bridge as an opening road bridge linking Renfrew with Clydebank and Yoker. Consult the council's operating information before choosing a route across the river. Include fixed access appointments at either property so a closure or altered approach can be accounted for in the schedule.", source: { label: "Renfrewshire Council Renfrew Bridge", href: "https://www1.renfrewshire.gov.uk/article/14445/Renfrew-Bridge" } },
      { title: "Reserve building access where the manager requires it", body: "For a managed Renfrew flat, ask about lift bookings, loading bays and permitted furniture-moving hours. Share the entrance location and lift dimensions before the quote is confirmed. A vehicle bay reservation and a lift appointment may be separate arrangements, each needing an authorised person to organise access." },
      { title: "Separate a shop purchase from the household load", body: "If a Renfrew move includes newly bought furniture, provide the retailer's release address and item dimensions alongside the home inventory. Confirm whether the item is packed or assembled. The extra collection should fit the agreed vehicle and delivery sequence, with any assembly work discussed explicitly." }
    ],
    faqs: [
      { question: "Will a Renfrew-to-Clydebank move always use the bridge?", answer: "The route should be assessed for the date, vehicle and access windows. Renfrew Bridge can form a connection, but its operating information needs checking; an assumed shortcut should not determine a guaranteed arrival time." },
      { question: "Do I need to book a lift for my Renfrew flat move?", answer: "Ask your building manager whether a reservation or protective arrangements are required. Supply the lift's usable dimensions and the furniture list. If the lift is unsuitable, stair access must be assessed before the move is confirmed." }
    ]
  },
  {
    slug: "johnstone", name: "Johnstone", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Johnstone",
    description: "For a Johnstone removal, explain the route from the front door or close to a lawful loading point. A town-centre entrance and a driveway elsewhere in the town can require different handling and vehicle access. Include winter path conditions, bulky furniture and any extra collection before agreeing the move.",
    metaDescription: "Johnstone man and van for flats, furniture and home moves. Plan town-centre access, steps and additional collections with the full inventory.",
    highlights: ["Town-centre entrance and loading checks", "Private paths considered in winter", "Additional seller collections planned upfront"],
    nearbyAreas: ["paisley", "renfrew", "erskine", "barrhead"],
    moveAdvice: [
      { title: "Plan access through the town centre", body: "Renfrewshire's winter-service information identifies pedestrian areas in Johnstone town centre among its treatment locations. For a nearby collection, give the lawful vehicle approach and the final carrying route separately. Check actual surface conditions on moving day, including private paths and steps beyond the public route.", source: { label: "Renfrewshire Council winter gritting information", href: "https://www.renfrewshire.gov.uk/community-and-neighbourhood-issues/community-safety/emergencies-and-severe-weather/gritting-winter-weather" } },
      { title: "Measure the exit from a shared close", body: "A Johnstone flat move needs the door width, stair turn and any outside steps described alongside the floor number. Tell us whether large furniture can be separated into sections. Arrange access so the crew can reach the property while other occupants retain a clear route through the shared entrance." },
      { title: "Allow for a collection elsewhere in Renfrewshire", body: "If a seller in Paisley or another town supplies furniture for your Johnstone move, add that address and its release window before booking. Keep the purchase distinct in the item list and check delivery measurements. A second stop changes the loading order even when it appears close to the main route." }
    ],
    faqs: [
      { question: "Does council gritting cover my Johnstone front path?", answer: "Do not assume it does. Check the actual route from the door to the loading point and make arrangements for private paths and steps. Tell us about unsafe or obstructed access before collection." },
      { question: "Can my Johnstone move collect a sofa in Paisley?", answer: "Yes, include the seller's address, availability, sofa measurements and access. The added collection must be assessed with the household contents and destination doorway before it is confirmed." }
    ]
  },
  {
    slug: "erskine", name: "Erskine", region: "Greater Glasgow", postcode: "", schemaType: "Place",
    headline: "Man and Van in Erskine",
    description: "Erskine collections need the road entrance rather than a nearby riverside path or visitor landmark. Explain whether the front door is reached from a parking court, driveway or separate footpath. If the move crosses the Clyde, provide the destination and access window so the route and collection timing can be assessed together.",
    metaDescription: "Erskine man and van and removals. Identify road access, parking courts and carrying paths for furniture or household delivery across Britain.",
    highlights: ["Road entrances distinguished from riverside paths", "Parking-court carrying distances", "Cross-Clyde delivery access planning"],
    nearbyAreas: ["renfrew", "paisley", "clydebank", "port-glasgow"],
    moveAdvice: [
      { title: "Use the house approach, not a riverside landmark", body: "The council identifies Boden Boo and Erskine Beach below Erskine Bridge, reached from the A726. Those visitor directions do not describe access to a nearby home. Supply your property's vehicle entrance and keep park gates and paths out of the loading plan unless use has been explicitly authorised.", source: { label: "Renfrewshire Council Boden Boo and Erskine Beach access", href: "https://www.renfrewshire.gov.uk/parks-libraries-and-culture/parks-gardens-and-outdoor-spaces/boden-boo-and-erskine-beach" } },
      { title: "Measure a carry from a parking court", body: "If your Erskine front door is separated from the road by a path, describe the distance, surface, steps and narrow points. Identify the nearest suitable loading space without assuming the van can drive onto the path. Broad furniture and heavy appliances need that extra carry included in the handling assessment." },
      { title: "Coordinate the receiving property across the Clyde", body: "For an Erskine move to Clydebank, Dumbarton or beyond, give the complete delivery address and any key or building appointment. Include additional stops before the route is agreed. The suitable crossing depends on the actual addresses and conditions, so a straight-line distance is not a delivery-time commitment." }
    ],
    faqs: [
      { question: "Can you collect from an Erskine house reached by a footpath?", answer: "Yes, the access can be assessed. Send the carry distance, path photographs, steps and the nearest lawful loading point. The van must use authorised vehicle access; a pedestrian route is not automatically suitable for driving." },
      { question: "Can an Erskine move include a delivery north of the Clyde?", answer: "Yes, provide both addresses and the receiving window so the road route and unloading can be planned. Additional collections, bridge constraints and access requirements should be declared before confirmation." }
    ]
  },
  {
    slug: "airdrie", name: "Airdrie", region: "Central Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Airdrie",
    description: "An Airdrie furniture collection needs a loading location suitable for the removal vehicle, not just the nearest car park. Give the building entrance, stair access and item measurements before booking. For a household move combining belongings from another address, list the separate loads and the delivery key handover.",
    metaDescription: "Airdrie man and van and home removals. Check loading-vehicle suitability, stairs and multi-address collections with a full furniture inventory.",
    highlights: ["Hallcraig Street vehicle rules considered", "Stairs and bulky furniture measured", "Combined household collections"],
    nearbyAreas: ["coatbridge", "motherwell", "hamilton", "glasgow"],
    moveAdvice: [
      { title: "Check vehicle suitability at Hallcraig Street", body: "North Lanarkshire's car-park regulations include Hallcraig Street in Airdrie and exclude vehicles over 3.5 tonnes from the listed sites. Check the assigned vehicle and current site conditions before proposing a car park as a waiting point. A removal still needs a suitable loading route to the property.", source: { label: "North Lanarkshire Council car-park regulations", href: "https://www.northlanarkshire.gov.uk/roads-streetlighting-parking-and-flooding/parking/car-parks" } },
      { title: "Give each heavy piece its own access check", body: "For an Airdrie flat move, list sofas, mattresses and tall cupboards individually rather than relying only on a room count. Measure the stair turn and landing with doors open. Explain whether furniture has removable sections and agree any preparation before the crew arrives to collect it." },
      { title: "Combine collections without mixing destinations", body: "If furniture from Coatbridge joins an Airdrie household load, label items by origin and final room. Give both collection windows and note anything going to storage instead. The combined inventory determines the vehicle capacity and should be complete before a price and route are confirmed." }
    ],
    faqs: [
      { question: "Can any removal vehicle wait in an Airdrie council car park?", answer: "No. Check the rules for the specific site and vehicle. North Lanarkshire's published conditions for its listed car parks include a restriction on vehicles over 3.5 tonnes; bay size and access must also be suitable." },
      { question: "Can my Airdrie move include another collection in Coatbridge?", answer: "Yes, provide the second inventory, address and access window before booking. Explain whether every item shares the same destination so vehicle capacity and unloading order can be assessed accurately." }
    ]
  },
  {
    slug: "coatbridge", name: "Coatbridge", region: "Central Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Coatbridge",
    description: "Coatbridge removals should identify the actual loading entrance and vehicle access before a collection slot is agreed. Furniture from a business may leave from a service yard, while a flat requires a stair and doorway assessment. Include every stop and any deadline for returning keys when requesting your quote.",
    metaDescription: "Coatbridge man and van for furniture, flats and house moves. Plan vehicle access, business collection points and key-return deadlines.",
    highlights: ["Summerlee-area vehicle access checked", "Business goods yards and flat entrances", "Key-return deadlines included in planning"],
    nearbyAreas: ["airdrie", "motherwell", "hamilton", "glasgow"],
    moveAdvice: [
      { title: "Check the vehicle before choosing Summerlee parking", body: "The council includes Summerlee, Coatbridge, in its managed car-park list with conditions on vehicle weight, opening hours and keeping aisles clear. Check the rules for the actual vehicle rather than using the parking area as an assumed removal staging point. Identify a lawful loading location beside the collection property.", source: { label: "North Lanarkshire Council Summerlee car-park conditions", href: "https://www.northlanarkshire.gov.uk/roads-streetlighting-parking-and-flooding/parking/car-parks" } },
      { title: "Confirm collection from a commercial address", body: "For furniture or office items leaving a Coatbridge business, obtain the goods entrance, responsible contact and release window. Ask whether a shutter, loading dock or security gate affects the collection. Pallets, heavy cabinets and specialist equipment need to be identified explicitly rather than described as ordinary boxes." },
      { title: "Work backwards from returning the keys", body: "If a Coatbridge tenancy ends on moving day, include the key-return deadline and any cleaning or inspection period in the enquiry. Pack essentials separately and agree which rooms must be emptied first. Collection timing should account for the whole carry, with delivery access confirmed rather than assumed." }
    ],
    faqs: [
      { question: "Can you collect office furniture from a Coatbridge unit?", answer: "Request a quote with the goods entrance, item dimensions, weights where known and the site's release requirements. Identify loading docks, security gates and any equipment needing specialist handling so suitable arrangements can be assessed." },
      { question: "Can you work around a Coatbridge tenancy handover?", answer: "Give the key-return deadline, inventory and access at both ends before booking. The collection window and any waiting arrangements need confirmation; a fixed property deadline should not be left until moving day." }
    ]
  },
  {
    slug: "rutherglen", name: "Rutherglen", region: "Central Scotland", postcode: "", schemaType: "Place",
    headline: "Man and Van in Rutherglen",
    description: "A Rutherglen move should be planned around the precise street and entrance, including any timed access near a school. Shared stairs and rear paths can make a short furniture transfer more involved than the drive suggests. Provide the full contents, loading location and destination access before the move is confirmed.",
    metaDescription: "Rutherglen man and van and removals. Plan Burnside school-area access, shared stairs and furniture collections with a complete moving quote.",
    highlights: ["Burnside school-zone checks", "Shared-stair and rear-path measurements", "Short moves assessed by handling needs"],
    nearbyAreas: ["glasgow-southside", "glasgow", "east-kilbride", "hamilton"],
    moveAdvice: [
      { title: "Check timed access around Burnside Primary", body: "South Lanarkshire lists Burnside Primary in Rutherglen as a car-free school-zone location. Check the mapped streets and current operating signs if the collection approach is nearby. A household's resident access arrangements should not be assumed to authorise a visiting removal vehicle during the restricted period.", source: { label: "South Lanarkshire Council car-free school zones", href: "https://www.southlanarkshire.gov.uk/parking-car-parks/car-free-school-zones" } },
      { title: "Show the shared stair and final exit", body: "For a Rutherglen flat, photograph the close entrance, turns and any rear steps as one continuous furniture route. Measure the narrowest point beside the largest piece and mention doors that cannot be secured open. Agree access with the keyholder while keeping the shared exit usable for neighbours." },
      { title: "Describe a short cross-boundary move fully", body: "A furniture transfer between Rutherglen and Glasgow Southside may involve little driving but several flights of stairs at each end. Give both floor numbers and every large item. If a seller has a fixed collection window, include it before the quote so the handling time is not confused with journey time." }
    ],
    faqs: [
      { question: "Can a removal van enter the Burnside school zone at any time?", answer: "Do not assume so. Check the current map, signs and exemption rules for the specific approach. Discuss a suitable collection window or obtain the required confirmation before planning access during a restricted period." },
      { question: "Is a Rutherglen-to-Glasgow sofa move automatically a small job?", answer: "No. Sofa dimensions, stair turns, loading distance and lifting help can determine the work more than the short drive. Provide access photographs and measurements at both properties for an accurate assessment." }
    ]
  },
];
