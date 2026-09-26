export interface NearbyAreaPlace {
  slug: string;
  name: string;
  description: string;
  areaSlug?: string;
}

export interface NearbyAreaGroup {
  id: string;
  title: string;
  introduction: string;
  places: NearbyAreaPlace[];
}

const GLASGOW_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "central-and-west-glasgow",
    title: "Central and west Glasgow",
    introduction:
      "Central and west-side Glasgow enquiries often involve flats, managed buildings, tenements, student rooms and furniture collections. Give the exact entrance, floor, loading point and destination access rather than only the neighbourhood name, because two short Glasgow journeys can need very different lifting and parking plans.",
    places: [
      {
        slug: "city-centre-moves",
        name: "Glasgow City Centre",
        description:
          "For city-centre moves, identify the service entrance or close used for large items and mention any building-managed loading bay. The Low Emission Zone, one-way streets and timed access can affect the vehicle route, so provide both full postcodes and access notes before confirming a collection window.",
      },
      {
        slug: "merchant-city",
        name: "Merchant City",
        description:
          "A Merchant City furniture collection or apartment move may use a different loading entrance from the public doorway. Confirm lift dimensions, concierge rules and seller handover before booking, and list every loose item so the van plan matches the real load.",
      },
      {
        slug: "finnieston",
        name: "Finnieston",
        description:
          "For Finnieston flats and riverside apartments, describe the route from the van to the lift or stair and any booked loading area. If the delivery is to the West End, Southside or another Scottish city, include receiving access as carefully as the collection address.",
      },
      {
        slug: "partick",
        name: "Partick",
        description:
          "Partick enquiries often involve student rooms, shared flats and furniture collections. Separate your own belongings from housemates' items, measure awkward furniture against stair turns, and give any storage or second collection stop when requesting a quote.",
      },
      {
        slug: "glasgow-west-end",
        name: "Glasgow West End",
        areaSlug: "glasgow-west-end",
        description:
          "West End tenement and student moves need floor numbers, close details and item measurements before the crew and time can be assessed. Use the local page for more detail on Byres Road, Hillhead, Hyndland, Partick and nearby streets.",
      },
    ],
  },
  {
    id: "south-and-east-glasgow",
    title: "South and east Glasgow",
    introduction:
      "Southside and east-side moves often combine flat access, garden paths, storage collections and short cross-city routes. Include the carrying distance from the loading point, any shared entrance and the full delivery address so the quote covers the actual job rather than just the drive.",
    places: [
      {
        slug: "glasgow-southside",
        name: "Glasgow Southside",
        areaSlug: "glasgow-southside",
        description:
          "Southside moves around Shawlands, Pollokshields, Mount Florida and nearby streets should include stairs, garden paths, long carries and any additional stop. Use the Southside guide for more specific planning notes.",
      },
      {
        slug: "shawlands",
        name: "Shawlands",
        description:
          "For a Shawlands flat, furniture collection or small house move, state whether the entrance is from the main road, a side street or a shared close. Give the number of boxes and the largest furniture dimensions so capacity and lifting help can be checked.",
      },
      {
        slug: "pollokshields",
        name: "Pollokshields",
        description:
          "Pollokshields enquiries can involve larger homes, tenement flats or collections from a second address. List outdoor, garage and storage items separately and flag any long path or restricted stopping point near the property.",
      },
      {
        slug: "dennistoun",
        name: "Dennistoun",
        description:
          "For Dennistoun tenements and apartment blocks, describe shared stairs, entry systems and where the van can legally load. A sofa, mattress or wardrobe should be measured against the stair route before collection is agreed.",
      },
      {
        slug: "parkhead",
        name: "Parkhead",
        description:
          "Parkhead furniture and household moves should include full item details, any seller handover and the delivery floor. If the route continues to Rutherglen, Cambuslang or another town, include every stop in one enquiry.",
      },
    ],
  },
  {
    id: "greater-glasgow-towns",
    title: "Greater Glasgow towns",
    introduction:
      "The towns around Glasgow can be served for local moves, furniture deliveries and routes into or out of the city. Where a dedicated town page exists, use it for local access notes; otherwise include the full postcode, property entrance and route details in the booking enquiry.",
    places: [
      {
        slug: "paisley",
        name: "Paisley",
        areaSlug: "paisley",
        description:
          "Paisley moves often connect with Glasgow, Renfrew and storage stops. Include the complete route, item list and access at both ends so the vehicle, collection order and delivery window can be planned together.",
      },
      {
        slug: "renfrew",
        name: "Renfrew",
        areaSlug: "renfrew",
        description:
          "For Renfrew and Braehead-area collections, confirm the actual goods entrance, seller or shop handover and the receiving access. A short route into west Glasgow still needs floor and lifting details.",
      },
      {
        slug: "clydebank",
        name: "Clydebank",
        areaSlug: "clydebank",
        description:
          "Clydebank enquiries can include local flat moves, furniture delivery and onward moves into Glasgow or West Dunbartonshire. Give full postcodes, stairs, lift details and any additional collection before requesting a price.",
      },
      {
        slug: "bearsden",
        name: "Bearsden",
        areaSlug: "bearsden",
        description:
          "Bearsden moves should describe driveway access, room inventory and any furniture requiring dismantling. If the route includes Milngavie, Anniesland or Glasgow West End, list the stops and key timings from the start.",
      },
      {
        slug: "milngavie",
        name: "Milngavie",
        areaSlug: "milngavie",
        description:
          "For Milngavie furniture collections and house moves, include the full route and any driveway, gate or narrow access details. Tell us whether the load travels locally, into Glasgow or to another destination in Britain.",
      },
      {
        slug: "bishopbriggs",
        name: "Bishopbriggs",
        areaSlug: "bishopbriggs",
        description:
          "Bishopbriggs moves can cover smaller loads, full home removals and north Glasgow links. Provide both addresses, the inventory and any loading restrictions before arranging the vehicle and crew.",
      },
      {
        slug: "rutherglen",
        name: "Rutherglen",
        areaSlug: "rutherglen",
        description:
          "Rutherglen enquiries often connect with Glasgow Southside, Cambuslang and Hamilton. Add destination access, key handover and any extra stop so the quote covers the complete route.",
      },
      {
        slug: "cambuslang",
        name: "Cambuslang",
        description:
          "For Cambuslang collections or moves into Glasgow, list the exact items and access at each property. If belongings are split between storage and a home, label the groups before the van is planned.",
      },
    ],
  },
  {
    id: "outer-places-close-to-glasgow",
    title: "Outer places close to Glasgow",
    introduction:
      "Outer villages and smaller communities need more precise address details than a city-centre move. Give the property name or number, full postcode, driveway or gate details, and any turning limitations so access can be checked before booking.",
    places: [
      {
        slug: "kirkintilloch",
        name: "Kirkintilloch",
        areaSlug: "kirkintilloch",
        description:
          "Kirkintilloch moves may involve a local collection, a route into north Glasgow or a longer delivery. Include the full route and whether any access is from a lane, driveway or shared entrance.",
      },
      {
        slug: "giffnock",
        name: "Giffnock",
        areaSlug: "giffnock",
        description:
          "For Giffnock household moves and furniture delivery, describe driveway space, internal stairs and the receiving room. If the move links to Newton Mearns or Glasgow Southside, provide each stop in the enquiry.",
      },
      {
        slug: "newton-mearns",
        name: "Newton Mearns",
        areaSlug: "newton-mearns",
        description:
          "Newton Mearns moves should include room-by-room contents, driveway access and any heavy garden or garage items. Mention whether the delivery stays local or goes to Glasgow, Renfrewshire or another UK city.",
      },
      {
        slug: "barrhead",
        name: "Barrhead",
        areaSlug: "barrhead",
        description:
          "For Barrhead collections and removals, list the load and any shared or narrow access. A move into Glasgow or East Renfrewshire should include key timings and unloading details at the destination.",
      },
      {
        slug: "erskine",
        name: "Erskine",
        areaSlug: "erskine",
        description:
          "Erskine moves can connect with Renfrew, Paisley, Glasgow Airport and west Glasgow. Provide every stop and the property access so the route and lifting work can be assessed together.",
      },
      {
        slug: "johnstone",
        name: "Johnstone",
        areaSlug: "johnstone",
        description:
          "For Johnstone moves, include house, flat, seller or storage details in one item list. If the delivery goes to Glasgow or another town, provide the complete destination rather than a broad area name.",
      },
    ],
  },
];

const EDINBURGH_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "edinburgh-neighbourhoods",
    title: "Edinburgh neighbourhood moves",
    introduction:
      "Edinburgh moves often depend on the exact close, stair, lift and loading arrangement rather than the neighbourhood name alone. Use the linked local guides where they exist, and include both access plans when a move crosses between the city centre, Leith, South Edinburgh and nearby towns.",
    places: [
      {
        slug: "edinburgh-leith",
        name: "Edinburgh Leith",
        areaSlug: "edinburgh-leith",
        description:
          "Leith flat moves and furniture collections need the collection entrance, floor, lift or stair details and any managed-building instructions. Use the Leith guide when the move starts or finishes around The Shore, Easter Road, Bonnington or nearby streets.",
      },
      {
        slug: "edinburgh-south",
        name: "Edinburgh South",
        areaSlug: "edinburgh-south",
        description:
          "South Edinburgh moves can involve shared flats, student rooms and larger homes around Morningside, Marchmont and Bruntsfield. Give the close entry, floor, parking plan and any additional stop before requesting a quote.",
      },
    ],
  },
  {
    id: "east-lothian-towns",
    title: "East Lothian towns linked to Edinburgh",
    introduction:
      "East Lothian enquiries often combine a local collection with a delivery into Edinburgh, or an Edinburgh seller collection with delivery along the coast. Confirm the Edinburgh dispensation or loading arrangement where it applies, then give the town address, doorway and item list for the local end.",
    places: [
      {
        slug: "musselburgh",
        name: "Musselburgh",
        areaSlug: "musselburgh",
        description:
          "Musselburgh moves near Fisherrow, the High Street and town-centre flats need the actual loading entrance and carrying distance. Use the Musselburgh guide for local access notes before linking the route into Edinburgh or another destination.",
      },
      {
        slug: "prestonpans",
        name: "Prestonpans",
        areaSlug: "prestonpans",
        description:
          "For Prestonpans furniture collections and home moves, describe the street access, largest items and delivery floor. If the journey continues into Edinburgh, include the city-side loading permission or building instructions in the same enquiry.",
      },
      {
        slug: "tranent",
        name: "Tranent",
        areaSlug: "tranent",
        description:
          "Tranent moves should separate household contents, seller collections and storage stops before the van is planned. Include both postcodes and the access at each end, especially when the route runs between Tranent and Edinburgh.",
      },
      {
        slug: "haddington",
        name: "Haddington",
        areaSlug: "haddington",
        description:
          "A Haddington house move can involve garage, garden and outbuilding contents as well as the main rooms. Give the complete inventory and key handover times so a route into Edinburgh or further afield is planned as one job.",
      },
      {
        slug: "north-berwick",
        name: "North Berwick",
        areaSlug: "north-berwick",
        description:
          "North Berwick enquiries need the property entrance and lawful loading point identified before collection. Coastal town access, parking pressure and Edinburgh destination rules should be described together when requesting a quote.",
      },
      {
        slug: "dunbar",
        name: "Dunbar",
        areaSlug: "dunbar",
        description:
          "For Dunbar removals or furniture delivery, list the full route rather than only the town names. Add stair, driveway, seller handover and any Edinburgh receiving access so the vehicle and timing can be assessed.",
      },
    ],
  },
  {
    id: "midlothian-and-south-edinburgh",
    title: "Midlothian and south Edinburgh links",
    introduction:
      "Midlothian moves into or out of Edinburgh can look short on a map but still depend on stairs, loading points and handover times. Provide the route in order and identify anything that must unload first when the job includes more than one town or storage stop.",
    places: [
      {
        slug: "dalkeith",
        name: "Dalkeith",
        areaSlug: "dalkeith",
        description:
          "Dalkeith moves should include the property entrance, any shared access and the delivery floor. If the route connects with South Edinburgh or Leith, give those access details with the Dalkeith inventory.",
      },
      {
        slug: "bonnyrigg",
        name: "Bonnyrigg",
        areaSlug: "bonnyrigg",
        description:
          "For Bonnyrigg home moves and furniture runs, note driveway access, garden items and any narrow internal route. Add the Edinburgh receiving arrangements early if the delivery is inside controlled streets.",
      },
      {
        slug: "penicuik",
        name: "Penicuik",
        areaSlug: "penicuik",
        description:
          "Penicuik enquiries can combine local household contents with a city flat delivery. Share the largest item dimensions, stairs and complete destination address before a collection time is agreed.",
      },
      {
        slug: "loanhead",
        name: "Loanhead",
        areaSlug: "loanhead",
        description:
          "Loanhead furniture collections and moves often connect with South Edinburgh, Dalkeith and storage stops. List each stop separately with release contacts, access windows and lifting details.",
      },
      {
        slug: "gorebridge",
        name: "Gorebridge",
        areaSlug: "gorebridge",
        description:
          "A Gorebridge move should describe the approach, parking or driveway and any items stored outside the main rooms. If delivery is into Edinburgh, include the city-side floor, close entry and loading permission notes.",
      },
    ],
  },
  {
    id: "west-lothian-routes",
    title: "West Lothian routes to Edinburgh",
    introduction:
      "West Lothian moves often run along the M8 into Edinburgh, Glasgow or another Scottish town. The road distance is only part of the job; the quote also needs the exact Bathgate, Livingston or village access and the delivery-side restrictions.",
    places: [
      {
        slug: "livingston",
        name: "Livingston",
        areaSlug: "livingston",
        description:
          "Livingston moves can combine house contents, business collections and storage stops before travelling into Edinburgh. Use the Livingston guide for local access planning, then add the receiving address and key timing.",
      },
      {
        slug: "bathgate",
        name: "Bathgate",
        areaSlug: "bathgate",
        description:
          "Bathgate enquiries should check the collection street, roadworks and M8 route as well as the inventory. The Bathgate guide covers local access details before linking the journey to Edinburgh, Glasgow or another destination.",
      },
      {
        slug: "linlithgow",
        name: "Linlithgow",
        areaSlug: "linlithgow",
        description:
          "Linlithgow moves may involve closes, courtyards and older property access. Give the carrying route and any dismantling request alongside Edinburgh delivery permissions or unloading details.",
      },
      {
        slug: "broxburn",
        name: "Broxburn",
        areaSlug: "broxburn",
        description:
          "Broxburn furniture and home moves should include driveway or shared access, the complete inventory and any additional Uphall or Livingston stop. Add destination access before the vehicle is planned.",
      },
      {
        slug: "armadale",
        name: "Armadale",
        areaSlug: "armadale",
        description:
          "For Armadale moves, list household contents and any second West Lothian collection separately. If delivery continues to Edinburgh, the city loading and key handover details need to be included in the same request.",
      },
      {
        slug: "whitburn",
        name: "Whitburn",
        areaSlug: "whitburn",
        description:
          "Whitburn enquiries can include local flat moves, seller collections and onward transport. Provide full postcodes, access notes and the largest item dimensions rather than relying on the town name.",
      },
      {
        slug: "uphall",
        name: "Uphall",
        areaSlug: "uphall",
        description:
          "Uphall moves should identify the actual entrance, parking or driveway and the order of any linked West Lothian stops. Add Edinburgh receiving restrictions if the delivery enters the city.",
      },
    ],
  },
];

const INVERNESS_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "east-inverness-and-nairn",
    title: "East Inverness, Ardersier and Nairn",
    introduction:
      "We cover these communities for man and van moves, furniture deliveries and home removals. Include every collection and delivery address, even when the journey stays close to Inverness, so the load, lifting help and available date can be confirmed together.",
    places: [
      {
        slug: "culloden",
        name: "Culloden",
        description:
          "For a Culloden furniture collection or move across Inverness, list the largest pieces and describe the route from each room to the van. A short journey still needs the right lifting help; include steps, shared entrances and any furniture that needs dismantling.",
      },
      {
        slug: "smithton",
        name: "Smithton",
        description:
          "Moving a bedroom or a few household items in Smithton? Separate your load from anything staying behind and count boxes alongside furniture. Tell us whether collection uses the front door, a side entrance or shared access, and agree when everything will be packed and ready.",
      },
      {
        slug: "balloch",
        name: "Balloch",
        description:
          "Use the full postcode for your Balloch address near Inverness when requesting a house move or delivery. For bulky garden or garage items, include dimensions and the path to the loading point; flag any gate or doorway that limits how they can be carried.",
      },
      {
        slug: "ardersier",
        name: "Ardersier",
        description:
          "For furniture travelling between Ardersier, Inverness and Nairn, include the seller's collection window and who can release the item. Check the delivery entrance before committing to a large sofa or wardrobe, and state whether you need help placing it in an upstairs room.",
      },
      {
        slug: "croy",
        name: "Croy",
        description:
          "Planning a move in Croy near Inverness? Provide the property name or number and full postcode, plus directions to the actual entrance if it is not obvious. Describe any private approach and turning space so vehicle access can be assessed before the collection is agreed.",
      },
      {
        slug: "nairn",
        name: "Nairn",
        areaSlug: "nairn",
        description:
          "A Nairn move can involve a single furniture delivery, a complete home or an onward journey through Inverness. Give both addresses and key handover times, and identify any separate collection stop. The quote needs to cover loading and unloading as well as the journey.",
      },
    ],
  },
  {
    id: "beauly-and-dingwall",
    title: "Beauly, Muir of Ord and the Dingwall area",
    introduction:
      "Home moves and smaller collections are available across these towns and villages. If a journey combines several addresses, describe the stops in order and identify what belongs at each destination; a town name alone is not enough to plan the complete route.",
    places: [
      {
        slug: "beauly",
        name: "Beauly",
        description:
          "For a Beauly shop or private-seller collection, confirm the item is ready to release and give the collection contact's agreed time window. Include any onward delivery to Inverness or another village, with dimensions for glass, mirrors or furniture that needs separate protection.",
      },
      {
        slug: "muir-of-ord",
        name: "Muir of Ord",
        description:
          "Request a Muir of Ord house-removal quote with furniture, packed boxes and any shed or garage contents listed separately. If belongings are split between properties, explain which stop comes first and who will provide access. Include any preparation or dismantling you need quoted.",
      },
      {
        slug: "conon-bridge",
        name: "Conon Bridge",
        description:
          "Moving between Conon Bridge and Dingwall, or further afield? Tell us when keys become available at the destination and whether the whole load can be delivered together. For a property with a driveway, check whether it will be clear and suitable for loading on the day.",
      },
      {
        slug: "dingwall",
        name: "Dingwall",
        areaSlug: "dingwall",
        description:
          "For a Dingwall flat, house or business move, explain the collection floor and the destination access as separate parts of the enquiry. A larger load may need more crew or capacity than a furniture run; include heavy pieces and any agreed building access times.",
      },
    ],
  },
  {
    id: "loch-ness-communities",
    title: "Drumnadrochit and Loch Ness enquiries",
    introduction:
      "We also cover Drumnadrochit for local and onward moves. Provide the exact addresses for any journey towards Loch Ness, together with the load and preferred date, so the collection and delivery arrangements can be checked before you book.",
    places: [
      {
        slug: "drumnadrochit",
        name: "Drumnadrochit",
        description:
          "For a Drumnadrochit collection or a move to Inverness, give the full destination rather than only a Loch Ness area name. If either property has an unfamiliar approach, share entrance details and any access limitations. Agree the delivery window around keys and the complete journey.",
      },
    ],
  },
];

const ABERDEEN_NEARBY_AREA_GROUPS: readonly NearbyAreaGroup[] = [
  {
    id: "north-aberdeen-and-inverurie",
    title: "North Aberdeen, Ellon and the Inverurie area",
    introduction:
      "We cover these communities for furniture collections, smaller moves and full home removals. Give the full postcode at each end and include any additional stop; an Aberdeen postal address can describe a journey beyond the city itself.",
    places: [
      {
        slug: "balmedie",
        name: "Balmedie",
        description:
          "For a Balmedie furniture delivery, measure the largest piece and the entrance it must pass through at its destination. Include the collection address in Aberdeen or elsewhere, whether the item is assembled, and who will meet the crew to confirm where it should be placed.",
      },
      {
        slug: "ellon",
        name: "Ellon",
        areaSlug: "ellon",
        description:
          "Plan an Ellon house move around the full inventory and the point when both properties are accessible. If you are collecting items from storage or another household on the way, list that stop in the enquiry and label the belongings for their final rooms.",
      },
      {
        slug: "newmachar",
        name: "Newmachar",
        description:
          "For a smaller Newmachar move, count your boxes and list furniture separately so suitable capacity can be planned. Tell us whether the load is going to one address or being divided between homes, and include the floor and lifting requirements at each stop.",
      },
      {
        slug: "oldmeldrum",
        name: "Oldmeldrum",
        description:
          "An Oldmeldrum collection needs the exact property address and an agreed handover, particularly when someone else is releasing the furniture. Share item dimensions and photographs of awkward access where useful. If the destination is outside the town, include the complete delivery address before requesting a price.",
      },
      {
        slug: "blackburn",
        name: "Blackburn",
        description:
          "Use the full Aberdeenshire postcode for a Blackburn removal or furniture enquiry. For a move between Blackburn and Aberdeen, describe access at the city address as well as the collection point; shared stairs, lift bookings or a longer carry can affect the handling needed.",
      },
      {
        slug: "kintore",
        name: "Kintore",
        description:
          "For a Kintore move involving beds, wardrobes or dining furniture, say what will be dismantled before collection and what help you need included. Keep fixings with each item and record any fragile panels. Include the delivery access even if the journey is only to nearby Inverurie.",
      },
      {
        slug: "inverurie",
        name: "Inverurie",
        areaSlug: "inverurie",
        description:
          "Inverurie enquiries can combine home removals, office furniture and individual collections, but each needs its own item list and access plan. For business premises, arrange loading access with the person responsible and identify equipment requiring specialist handling before confirming the scope of the move.",
      },
    ],
  },
  {
    id: "westhill-and-peterculter",
    title: "Westhill and Peterculter",
    introduction:
      "Moves west of Aberdeen can involve homes, workplace collections and deliveries into the city. Explain both ends of the journey and any access appointment, so the agreed collection slot allows for the work required at the destination as well.",
    places: [
      {
        slug: "westhill",
        name: "Westhill",
        areaSlug: "westhill",
        description:
          "For a Westhill home or office move, separate desks, chairs and boxed belongings from items staying behind. Check any building access appointment and confirm whether dismantling is required. List the heaviest pieces so lifting help can be assessed before the collection date is booked.",
      },
      {
        slug: "peterculter",
        name: "Peterculter",
        description:
          "For a Peterculter collection or onward Deeside move, supply the full route and any time you must vacate the property. If the loading point is away from the entrance, describe the carry and any steps rather than assuming a van can reach the door.",
      },
    ],
  },
  {
    id: "portlethen-to-stonehaven",
    title: "Portlethen, Newtonhill and Stonehaven",
    introduction:
      "We cover these communities south of Aberdeen for man and van work and larger removals. A furniture collection and a full-house move need different plans; describe the load, crew requirements and destination before relying on a particular collection time.",
    places: [
      {
        slug: "portlethen",
        name: "Portlethen",
        description:
          "For a Portlethen collection from a seller or shop, confirm when the item will be available and whether it is packaged or assembled. Include accessories and matching pieces in the list. Ask for the collection, transport and delivery handling to be included in the agreed scope.",
      },
      {
        slug: "newtonhill",
        name: "Newtonhill",
        description:
          "Moving furniture in Newtonhill? Describe the actual entrance and any steps between the loading point and the room, including at the destination. For a smaller household move, pack and label loose belongings in advance and identify anything that requires two people to lift safely.",
      },
      {
        slug: "stonehaven",
        name: "Stonehaven",
        areaSlug: "stonehaven",
        description:
          "For Stonehaven removals or an Aberdeen furniture collection delivered to town, coordinate the seller or key holder at each address. Tell us about floor changes, tight doorways and the proposed loading position. Include any onward stop so the quote covers the full journey and handling.",
      },
    ],
  },
];

export function getNearbyAreaGroups(slug: string): readonly NearbyAreaGroup[] {
  if (slug === "glasgow") return GLASGOW_NEARBY_AREA_GROUPS;
  if (slug === "edinburgh") return EDINBURGH_NEARBY_AREA_GROUPS;
  if (slug === "inverness") return INVERNESS_NEARBY_AREA_GROUPS;
  if (slug === "aberdeen") return ABERDEEN_NEARBY_AREA_GROUPS;
  return [];
}
