export interface Area {
  slug: string;
  name: string;
  region: string;
  postcode: string;
  headline: string;
  description: string;
  highlights: string[];
  nearbyAreas: string[];
  metaDescription: string;
  schemaType?: "City" | "Place" | "AdministrativeArea";
  moveAdvice?: {
    title: string;
    body: string;
    source?: { label: string; href: string };
  }[];
  faqs?: { question: string; answer: string }[];
}

export const AREAS: Area[] = [
  // Greater Glasgow
  {
    slug: "glasgow",
    name: "Glasgow",
    region: "Greater Glasgow",
    postcode: "G1–G78",
    headline: "Man and Van in Glasgow",
    description:
      "Arrange a man and van, flat removal or furniture delivery in Glasgow with a quote based on your items and both addresses. For a tenement move in the West End or Southside, tell us about the close, floor, stair turns and where a van can load. Larger house and office moves need the complete inventory and access details before the plan is confirmed.",
    highlights: [
      "Tenement and shared-stair access planning",
      "Furniture collections and smaller moves",
      "Home and office removal enquiries"
    ],
    nearbyAreas: ["glasgow-west-end", "glasgow-southside", "paisley", "hamilton"],
    metaDescription:
      "Man and van in Glasgow for flat moves, furniture collection and home removals. Share your items, stairs, parking and both addresses for a tailored quote.",
    moveAdvice: [
      {
        title: "Tenement stairs and close entrances",
        body: "For a West End or Southside flat, include the floor, number of stair flights and the tightest turn between the room and the street. Send photos of large furniture beside doorways or landings if access is uncertain. A two-person lift and a one-person load need different plans."
      },
      {
        title: "Parking near the collection address",
        body: "Check the signs and loading restrictions at each property before choosing a time. If a bay needs to be reserved or a restriction affects the move, discuss the arrangements with the relevant council or building manager in advance. Do not assume a resident permit provides permission for a removal van."
      },
      {
        title: "Cross-city and onward moves",
        body: "Give the delivery address as well as the collection postcode. A local furniture run, a move between the West End and Southside, and a Glasgow-to-Edinburgh journey require different route and timing plans. Include key handovers and additional stops in the quote."
      },
      {
        title: "Student rooms and shared homes",
        body: "Separate the belongings being moved from your housemates' items. Halls or managed flats may have designated entrances, lift reservations or time slots. Confirm those arrangements and label the boxes before collection."
      }
    ],
    faqs: [
      {
        question: "Can you quote a Glasgow tenement move without a lift?",
        answer: "Yes. Include the floor at both addresses, photos of tight turns and the largest item dimensions. The crew and handling must be suitable for the stairs; no item should be assumed to fit without checking."
      },
      {
        question: "Is a short Glasgow move always a small job?",
        answer: "No. A short drive can still involve a full furniture load, several flights of stairs or a long carry from the loading space. The quote takes those details into account alongside the route."
      },
      {
        question: "Can you collect furniture from a Glasgow seller?",
        answer: "Furniture collection can be quoted using the seller's address, item dimensions, destination and agreed collection window. Confirm the item is paid for and ready to release, and check it fits the delivery access."
      },
      {
        question: "Do you offer moves from Glasgow to Edinburgh?",
        answer: "You can request a quote for a Scottish intercity move. Include the complete inventory and access at both properties; the collection date, route and delivery arrangements need confirmation before booking."
      }
    ]
  },
  {
    slug: "glasgow-west-end",
    name: "Glasgow West End",
    region: "Greater Glasgow",
    postcode: "G11, G12, G13, G20",
    headline: "Man and Van in Glasgow West End",
    description:
      "Moving furniture through a West End tenement needs a clear route from the room to the van. For collections around Byres Road, Hyndland or Partick, include stair turns, entry arrangements and loading access. Student rooms and larger homes can need different vehicles and crew, even on the same street.",
    highlights: [
      "Tenement furniture and flat moves",
      "Student rooms and shared homes",
      "Stairs and loading details included in the quote"
    ],
    nearbyAreas: ["glasgow", "glasgow-southside", "partick", "anniesland"],
    metaDescription: "Man and van in Glasgow West End for furniture, student rooms and flat moves. Plan stair access, parking and collections around your item list."
  },
  {
    slug: "glasgow-southside",
    name: "Glasgow Southside",
    region: "Greater Glasgow",
    postcode: "G41, G42, G43, G44, G45",
    headline: "Man and Van in Glasgow Southside",
    description:
      "Request a quote for furniture, flat or house moves in Glasgow Southside, around Shawlands, Pollokshields and Mount Florida. Provide the full addresses and item list, and describe shared stairs, garden paths or any long carry between the door and a loading space.",
    highlights: [
      "Flat and house removal enquiries",
      "Furniture collection and delivery",
      "Crew planned around items and access"
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "rutherglen", "hamilton"],
    metaDescription: "Man and van and removals in Glasgow Southside. Request a quote for flat moves, furniture collections and house moves using your addresses and inventory."
  },
  {
    slug: "paisley",
    name: "Paisley",
    region: "Greater Glasgow",
    postcode: "PA1–PA3",
    headline: "Man and Van in Paisley",
    description:
      "Plan a Paisley move around the furniture, boxes and access at each property. A tenement flat, a house and a storage collection can have different loading needs. For a local journey or a route towards Glasgow, include every stop and the time access will be available.",
    highlights: [
      "Local and Glasgow-linked route enquiries",
      "Flats, homes and storage collections",
      "Loading and parking details reviewed"
    ],
    nearbyAreas: ["glasgow", "glasgow-west-end", "johnstone", "renfrew"],
    metaDescription: "Man and van in Paisley for flat moves, furniture delivery and home removals. Include both addresses, access and your item list when requesting a quote."
  },
  // Edinburgh & Lothians
  {
    slug: "edinburgh",
    name: "Edinburgh",
    region: "Edinburgh & Lothians",
    postcode: "EH1–EH17",
    headline: "Man and Van in Edinburgh",
    description:
      "Plan an Edinburgh move with the stairs, parking and building access included from the start. A New Town flat, an Old Town address or a Leith apartment can need a different loading plan even with the same furniture. Request man and van, house removals or furniture delivery using both addresses, your inventory and the dates that work for you.",
    highlights: [
      "Flat, studio and tenement move planning",
      "Furniture collections and home removals",
      "Parking and building access considered"
    ],
    nearbyAreas: ["edinburgh-leith", "edinburgh-south", "livingston", "glasgow"],
    metaDescription:
      "Man and van and removals in Edinburgh for flats, houses and furniture. Plan stairs, lifts and parking, then request a quote for your items and route.",
    moveAdvice: [
      {
        title: "Shared stairs, basements and large furniture",
        body: "For an Old Town or New Town property, describe the route from each room to the street. Basement steps, half-landings and narrow entrance doors can affect a sofa or wardrobe even when the van has enough space. Include floor numbers and useful access photos."
      },
      {
        title: "Parking for a removal van",
        body: "Edinburgh Council distinguishes between parking dispensations and suspended parking bays. A dispensation may be needed for longer loading on a single yellow line, while reserving a bay uses a different application. Check the council's current conditions, notice periods and charges before agreeing the move time.",
        source: {
          label: "Edinburgh Council parking dispensations and suspensions",
          href: "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        title: "Leith apartments and managed buildings",
        body: "If a building has a concierge, service lift or loading entrance, check the moving arrangements in advance. Tell us the lift dimensions, any booking window and whether the van must use a different entrance from residents."
      },
      {
        title: "Dates, keys and collection windows",
        body: "Give your key handover time and any restrictions from the landlord, halls or storage facility. During busy city events or student move periods, check access and the available date before making dependent arrangements."
      }
    ],
    faqs: [
      {
        question: "Can you move an Edinburgh flat with stairs?",
        answer: "Stair access can be included in the assessment. Give the floor, number of flights, narrow turns and largest items at both properties so the crew and handling requirements are understood before confirmation."
      },
      {
        question: "Who arranges parking for an Edinburgh removal?",
        answer: "Discuss parking with the team before booking and agree who will make any required application. A parking space or council permission is not automatically included in a removal quote."
      },
      {
        question: "Can I book a small Edinburgh student move?",
        answer: "Request a quote for your boxes, suitcases and any furniture. Include the halls or flat address, collection window, floor and destination. Different room sizes and access arrangements can require different quotes."
      },
      {
        question: "Can you quote a house removal as well as man and van?",
        answer: "Yes. Provide the furniture and boxes from every room, plus garage or storage items, and describe the access at both addresses. Larger loads, packing or dismantling should be included in the enquiry from the start."
      }
    ]
  },
  {
    slug: "edinburgh-leith",
    name: "Edinburgh Leith",
    region: "Edinburgh & Lothians",
    postcode: "EH6, EH7",
    headline: "Man and Van in Leith, Edinburgh",
    description:
      "For a move in Leith, check whether the collection uses a shared stair, a lift or a managed loading entrance. Tell us about the building rules and the size of the largest furniture before requesting a man and van or removal quote. Include any retailer or private-seller collection as a separate stop.",
    highlights: [
      "Flats and shared-stair access",
      "Furniture and private-seller collections",
      "Loading entrances and lift limits checked"
    ],
    nearbyAreas: ["edinburgh", "edinburgh-south", "musselburgh", "portobello"],
    metaDescription: "Man and van in Leith, Edinburgh, for flat moves and furniture collections. Request a quote with your item list, lift or stair details and both addresses."
  },
  {
    slug: "edinburgh-south",
    name: "Edinburgh South",
    region: "Edinburgh & Lothians",
    postcode: "EH9, EH10, EH16",
    headline: "Man and Van in South Edinburgh",
    description:
      "Moving from a room, flat or family home in South Edinburgh starts with a complete item list. For addresses around Morningside, Marchmont or Bruntsfield, describe the stairs, entry system and loading point. If housemates have different destinations, list each stop before asking for a quote.",
    highlights: [
      "Shared flats and student rooms",
      "Furniture and family-home moves",
      "Collection and destination access planning"
    ],
    nearbyAreas: ["edinburgh", "edinburgh-leith", "penicuik", "dalkeith"],
    metaDescription: "Man and van in South Edinburgh for student rooms, flats and home moves. Share your furniture, boxes, stairs and destination for a tailored quote."
  },
  {
    slug: "livingston",
    name: "Livingston",
    region: "Edinburgh & Lothians",
    postcode: "EH54",
    headline: "Man and Van in Livingston",
    description:
      "For Livingston collections and deliveries, give the actual loading entrance as well as the postal address. Estate roads, parking courts and paths can affect the distance from the van to the door. Include your full furniture list when requesting a local move or a route elsewhere in Scotland.",
    highlights: [
      "Home and furniture moving enquiries",
      "Parking courts and access routes considered",
      "Local and intercity quotes"
    ],
    nearbyAreas: ["edinburgh", "falkirk", "bathgate", "linlithgow"],
    metaDescription: "Man and van in Livingston for home moves and furniture delivery. Request a quote based on the items, route, parking and access at both properties."
  },
  // Tayside & Fife
  {
    slug: "dundee",
    name: "Dundee",
    region: "Tayside & Fife",
    postcode: "DD1–DD5",
    headline: "Man and Van in Dundee",
    description:
      "Request a Dundee moving quote for a student room, flat, furniture collection or larger home. Include the floor and lift access at both addresses, together with any halls check-in slot or storage opening time. The inventory and access determine the van and crew required.",
    highlights: [
      "Student and shared-flat moves",
      "Furniture and home removal enquiries",
      "Halls and storage access times considered"
    ],
    nearbyAreas: ["perth", "kirkcaldy", "st-andrews", "arbroath"],
    metaDescription: "Man and van in Dundee for student rooms, flat moves and furniture delivery. Share your inventory, dates and access details to check your options."
  },
  {
    slug: "perth",
    name: "Perth",
    region: "Tayside & Fife",
    postcode: "PH1, PH2",
    headline: "Man and Van in Perth",
    description:
      "For a Perth move, list the furniture and boxes and explain how the van can reach each property. A town-centre flat and a property outside town may need different loading arrangements. Include any narrow approach, stairs or long carry so the route can be assessed before booking.",
    highlights: [
      "Furniture and household moves",
      "Town and surrounding-route enquiries",
      "Vehicle access reviewed before confirmation"
    ],
    nearbyAreas: ["dundee", "stirling", "st-andrews", "pitlochry"],
    metaDescription: "Man and van in Perth for furniture collections, flat moves and home removals. Get a quote using your item list, route and loading access."
  },
  {
    slug: "kirkcaldy",
    name: "Kirkcaldy",
    region: "Tayside & Fife",
    postcode: "KY1, KY2",
    headline: "Man and Van in Kirkcaldy",
    description:
      "Arrange a quote for a Kirkcaldy collection or move using both addresses and the items you need transported. For flats, include the floor and shared-stair access; for houses, include paths and the nearest legal loading space. Storage and private-seller collections need agreed handover times.",
    highlights: [
      "Flat and house moving enquiries",
      "Storage and furniture collections",
      "Access and handover times considered"
    ],
    nearbyAreas: ["dunfermline", "dundee", "st-andrews", "glenrothes"],
    metaDescription: "Man and van in Kirkcaldy for furniture, flat and house moves. Request a quote with your inventory, collection and delivery details."
  },
  {
    slug: "dunfermline",
    name: "Dunfermline",
    region: "Tayside & Fife",
    postcode: "KY11, KY12",
    headline: "Man and Van in Dunfermline",
    description:
      "Plan a Dunfermline removal around the full inventory and access at each address. If the destination is across the Forth or elsewhere in Scotland, include the delivery time and any extra stop in the enquiry. Furniture size, stairs and loading distance help determine the handling required.",
    highlights: [
      "Local and longer-route enquiries",
      "Furniture and household moves",
      "Collection and delivery planned together"
    ],
    nearbyAreas: ["kirkcaldy", "edinburgh", "livingston", "alloa"],
    metaDescription: "Man and van in Dunfermline for furniture delivery and household moves. Share your route, item list and access requirements for a quote."
  },
  {
    slug: "st-andrews",
    name: "St Andrews",
    region: "Tayside & Fife",
    postcode: "KY16",
    headline: "Man and Van in St Andrews",
    description:
      "For a St Andrews student or household move, include all boxes and furniture and check when both properties can be accessed. Halls, shared flats and storage facilities may have collection windows or loading rules. Put those details in the enquiry so the move can be planned around them.",
    highlights: [
      "Student rooms and shared flats",
      "Furniture and household collections",
      "Check-in and collection times considered"
    ],
    nearbyAreas: ["dundee", "kirkcaldy", "cupar", "anstruther"],
    metaDescription: "Man and van in St Andrews for student rooms, shared flats and furniture moves. Request a quote based on your items, dates and access."
  },
  // Grampian
  {
    slug: "aberdeen",
    name: "Aberdeen",
    region: "Grampian",
    postcode: "AB10–AB25",
    headline: "Man and Van in Aberdeen",
    description:
      "Get a man and van quote for your Aberdeen furniture collection, flat move or house removal. Moving a sofa, a student room or a full home? Share your items, both addresses and preferred date to plan the right vehicle and lifting help. Local moves, office removals and longer journeys start with your route and access details.",
    highlights: [
      "Furniture collection and small moves",
      "House, flat and office removals",
      "Local and long-distance moving quotes",
    ],
    nearbyAreas: ["inverurie", "westhill", "ellon", "stonehaven"],
    metaDescription:
      "Get an Aberdeen man and van quote for furniture, flats and house removals. Plan local or long-distance moves with the right vehicle and lifting help.",
  },
  {
    slug: "inverurie",
    name: "Inverurie",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB51",
    headline: "Man and Van in Inverurie",
    description:
      "For an Inverurie collection or removal, tell us about the approach to the property, parking and any turning space. A route towards Aberdeen or another town needs the complete item list and delivery details. Rural access and extra stops should be discussed before a booking is confirmed.",
    highlights: [
      "Furniture and household moving enquiries",
      "Aberdeen-linked routes by quote",
      "Property approach and turning space reviewed"
    ],
    nearbyAreas: ["aberdeen", "westhill", "ellon"],
    metaDescription: "Man and van enquiries in Inverurie for furniture and home moves. Share both addresses, the load and vehicle access details for a route-based quote.",
    moveAdvice: [
      {
        title: "Market Place and Burn Lane loading",
        body: "Inverurie has council resident permit arrangements around Market Place and Burn Lane. For a flat or business move there, identify the actual entrance and a suitable loading position before booking. A resident's parking arrangement does not establish access for the removal vehicle. Share any restrictions and the carrying distance so the crew can plan the load safely.",
        source: {
          label: "Aberdeenshire Council Inverurie parking information",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/inverurie"
        }
      },
      {
        title: "Collections around Kintore and Oldmeldrum",
        body: "Include the complete address when a collection is outside Inverurie, including Kintore, Oldmeldrum or a property reached by a private road. Provide the entrance location, gate width, surface and turning space where relevant. A postcode alone may leave the loading point unclear. Tell us about additional furniture collections before the route and vehicle are agreed."
      },
      {
        title: "Furniture to Aberdeen or another destination",
        body: "For an Inverurie furniture purchase being delivered to Aberdeen, confirm when the seller can release the item and whether it needs dismantling. Measure the furniture and the tightest doorway at the destination, including stair turns. If a storage stop or several deliveries are required, list them together so the quote covers the complete journey and handling."
      }
    ],
    faqs: [
      {
        question: "Can you move furniture from Inverurie to an Aberdeen flat?",
        answer: "Yes. Provide the collection and delivery addresses, item dimensions and the floor at the Aberdeen property. Include lift size or stair turns and the seller's collection window. The vehicle, lifting help and time are confirmed for the whole journey."
      },
      {
        question: "Do you collect outside Inverurie towards Kintore and Oldmeldrum?",
        answer: "Yes, you can request a collection or delivery in these surrounding communities. Send the exact address and explain any private lane, gate or limited turning space. Availability is checked for your date and load; a nearby town name does not set the arrival time."
      },
      {
        question: "What affects the price of an Inverurie move?",
        answer: "The inventory, collection and destination, crew requirements, stairs and loading distance all contribute. A small furniture collection differs from a full household move with several stops. List packing or dismantling requests in advance so their suitability and any additional cost can be confirmed."
      }
    ]
  },
  {
    slug: "westhill",
    name: "Westhill",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB32",
    headline: "Man and Van in Westhill, Aberdeenshire",
    description:
      "Book a man and van in Westhill, Aberdeenshire, for furniture delivery, a flat move or house removals. For a move around Westhill and Elrick, share the collection entrance, driveway space and destination access alongside your inventory. An office relocation needs its desks, equipment and building arrangements listed separately so the crew and loading plan match the job.",
    highlights: [
      "Westhill and Elrick home moves",
      "Furniture delivery to and from Aberdeen",
      "Office access and equipment planning"
    ],
    nearbyAreas: ["aberdeen", "inverurie", "ellon", "stonehaven"],
    metaDescription: "Man and van in Westhill, Aberdeenshire, for furniture delivery, house and office moves. Share your items and access details to get a moving quote.",
    moveAdvice: [
      {
        title: "Identify the Westhill collection address",
        body: "Use the full AB32 address for Westhill in Aberdeenshire and include Elrick when that is the collection location. Explain whether loading is from a driveway, shared parking area or a separate entrance. Measure any gate or tight approach rather than assuming the van will fit. The address and access notes help prevent confusion with other places named Westhill.",
        source: {
          label: "Aberdeenshire Council Westhill and Elrick area information",
          href: "https://www.aberdeenshire.gov.uk/environment/natural-heritage/local-nature-reserves"
        }
      },
      {
        title: "Plan an office or business move",
        body: "For Westhill office removals, identify the reception contact, goods entrance and permitted loading window. List desks, chairs, cabinets and boxed equipment, including items that need dismantling. Agree lift access and any building protection requirements with the premises manager. Specialist machinery or unusually heavy items need separate assessment; an office furniture quote should not be assumed to include them."
      },
      {
        title: "Furniture collections with an Aberdeen stop",
        body: "If you are collecting furniture in Aberdeen for a Westhill home, give the seller's address and release time as well as your delivery details. Check the destination room, doorway widths and stairs before purchase. Add every collection stop to the enquiry, and confirm whether each item will be assembled or dismantled when the crew arrives to collect it."
      }
    ],
    faqs: [
      {
        question: "Is this man and van service for Westhill in Aberdeenshire?",
        answer: "Yes, this page covers Westhill in Aberdeenshire and neighbouring Elrick. Enter your full address and postcode when requesting a quote. That identifies the correct collection point and allows the route, access and available date to be checked before confirmation."
      },
      {
        question: "Can you collect a sofa in Aberdeen and deliver it to Westhill?",
        answer: "Yes. Share the seller's collection address, sofa dimensions, delivery address and agreed collection window. Include steps or narrow doorways at either end and say whether the sofa separates into sections. Suitable lifting help and transport are arranged around those details."
      },
      {
        question: "Can I request an office move in Westhill?",
        answer: "Yes. Provide a desk and furniture inventory, equipment details and the building's loading arrangements. Confirm access times with the premises manager and flag heavy or specialist equipment separately. Packing, dismantling and any work outside normal access hours need agreement in the quote."
      }
    ]
  },
  {
    slug: "stonehaven",
    name: "Stonehaven",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB39",
    headline: "Man and Van in Stonehaven",
    description:
      "Arrange man and van in Stonehaven for a furniture collection, a flat move or a full house removal. Town-centre loading around Allardice Street and Market Square needs a different plan from a property with its own driveway. Include both addresses, the size of your load and any stairs, then request a quote for a local move or delivery towards Aberdeen and beyond.",
    highlights: [
      "Town-centre and household removals",
      "Sofa, bed and furniture collections",
      "Aberdeen and coastal-route enquiries"
    ],
    nearbyAreas: ["aberdeen", "westhill", "ellon"],
    metaDescription: "Man and van in Stonehaven for furniture collection, flat and house removals. Plan town-centre loading and your destination, then get a tailored quote.",
    moveAdvice: [
      {
        title: "Allardice Street and Market Square access",
        body: "The council lists resident parking zones around Allardice Street, Market Square and nearby streets. Check the signs at your actual address and identify a suitable loading position before the move. Share the distance between the entrance and van, plus any steps or shared passage. Parking arrangements for a resident do not automatically settle access for a removal vehicle.",
        source: {
          label: "Aberdeenshire Council Stonehaven parking zones",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/stonehaven"
        }
      },
      {
        title: "Harbour-area furniture and flat moves",
        body: "For a property near Stonehaven Harbour, describe the entrance and route from the room to the street rather than relying on the postcode. Send dimensions for a sofa, bed frame or wardrobe and flag narrow stairs, outside steps or a shared doorway. Agree a safe loading point and collection window before asking a seller or landlord to attend."
      },
      {
        title: "Delivery towards Newtonhill and Aberdeen",
        body: "A Stonehaven collection with delivery to Newtonhill, Portlethen or Aberdeen needs access details for both ends of the journey. Include any additional stop, key handover time or seller deadline when requesting the quote. For a house move, add the garage and outdoor furniture to the inventory so the vehicle is planned around the full load, not only bedrooms."
      }
    ],
    faqs: [
      {
        question: "Can you collect furniture from Stonehaven for delivery to Aberdeen?",
        answer: "Yes. Give the collection address, seller's time window, destination and item sizes. Tell us about loading restrictions and any stairs at both properties. The quote covers the assessed route and handling, with any extra stops included before the booking is confirmed."
      },
      {
        question: "What do you need for a Stonehaven town-centre flat move?",
        answer: "Share the floor, stairs or lift details, entrance location and furniture dimensions. Identify where loading can take place and the carrying distance to the door. Check local signs or building rules before the date; nearby public parking does not guarantee a suitable removal loading space."
      },
      {
        question: "Do you cover Newtonhill and Portlethen as well as Stonehaven?",
        answer: "Yes, collections and deliveries in these surrounding communities can be included. Use the full addresses and list each stop, even for a short coastal journey. The available date, vehicle and lifting help are checked for your specific inventory and property access."
      }
    ]
  },
  {
    slug: "ellon",
    name: "Ellon",
    schemaType: "Place",
    region: "Grampian",
    postcode: "AB41",
    headline: "Man and Van in Ellon",
    description:
      "Get a man and van quote in Ellon for furniture transport, a small move or house removals. Whether collecting near the town centre or from a home outside town, include the exact entrance and loading access. Deliveries to Aberdeen, nearby villages or a longer destination can be planned together when you provide every stop and the full item list.",
    highlights: [
      "Ellon and surrounding village collections",
      "Small moves and full home enquiries",
      "Town-centre and rural loading plans"
    ],
    nearbyAreas: ["aberdeen", "inverurie", "westhill", "stonehaven"],
    metaDescription: "Man and van in Ellon for furniture, small moves and house removals. Include town-centre or rural access and your delivery route to request a quote.",
    moveAdvice: [
      {
        title: "Market Street, The Square and Station Road",
        body: "Ellon's council parking information identifies resident permit arrangements around Market Street, The Square, Schoolhill Road and Station Road East. For a collection there, describe the entrance and check the current loading conditions at the property. Discuss any long carry or stair access in advance. A permit or nearby car park should not be treated as a reserved loading space.",
        source: {
          label: "Aberdeenshire Council Ellon parking information",
          href: "https://www.aberdeenshire.gov.uk/roads-and-travel/car-parking/ellon"
        }
      },
      {
        title: "Village and rural approaches outside Ellon",
        body: "For collections around Newburgh, Tarves or Pitmedden, include the property name and full address, together with directions to the loading entrance if needed. Note private tracks, gate widths, low branches and whether a van can turn. Tell us about the surface and any long walk from the road so the appropriate vehicle and handling can be assessed."
      },
      {
        title: "Combine furniture collection and delivery details",
        body: "A furniture collection in Ellon and a delivery to Aberdeen may involve different access constraints at each end. Ask the seller for dimensions and confirm who will release the item, then check your destination doors and stairs. If you are moving an entire home, list boxes and furniture room by room and include any storage stop in the original enquiry."
      }
    ],
    faqs: [
      {
        question: "Can I book a small move between Ellon and Aberdeen?",
        answer: "Yes. List your furniture, boxes and other belongings, then provide both addresses and your preferred date. Include any stairs, loading restrictions or storage stop. A small load still needs a suitable vehicle and lifting plan, so the quote is based on the full job."
      },
      {
        question: "Do you collect in villages outside Ellon?",
        answer: "Yes, including enquiries from Newburgh, Tarves and Pitmedden. Provide the exact property address and describe private roads, gates or turning limits. The team checks access, the complete route and availability for your requested date before confirming the collection arrangements."
      },
      {
        question: "Can you arrange an urgent furniture collection in Ellon?",
        answer: "Send the item details, both addresses and the latest collection time you can accept. Short-notice availability depends on the vehicle, crew and route needed. Wait for confirmation of the collection window before promising a seller that the item will be collected that day."
      }
    ]
  },
  // Highlands
  {
    slug: "inverness",
    name: "Inverness",
    region: "Highlands",
    postcode: "IV1–IV3",
    headline: "Man and Van in Inverness",
    description:
      "Get a man and van quote in Inverness for furniture collection, a small move or house removals. Share your items, collection and delivery addresses, and preferred date to check the price and availability. Planning a longer Highland journey? Include the full route and property access so the right vehicle and crew can be arranged.",
    highlights: [
      "Sofa, bed and furniture collections",
      "Student, flat and house moves",
      "Local and longer-route quote enquiries",
    ],
    nearbyAreas: ["nairn", "dingwall", "fort-william"],
    metaDescription:
      "Get a quote for man and van in Inverness, furniture collection and house removals. Share your items and route to check price and availability.",
  },
  {
    slug: "nairn",
    name: "Nairn",
    schemaType: "Place",
    region: "Highlands",
    postcode: "IV12",
    headline: "Man and Van in Nairn",
    description:
      "Arrange man and van in Nairn for furniture delivery, flat moves and house removals. A collection near Fishertown or the High Street needs clear entrance and loading details; a home outside town may need directions to a driveway or private lane. Share your items and both addresses for a local move or a route between Nairn and Inverness.",
    highlights: [
      "Nairn and Inverness furniture deliveries",
      "Fishertown and town-centre access planning",
      "Small moves and complete home enquiries"
    ],
    nearbyAreas: ["inverness", "dingwall"],
    metaDescription: "Man and van in Nairn for furniture delivery, flat and house removals. Share your load, access and Nairn or Inverness route to get a moving quote.",
    moveAdvice: [
      {
        title: "Fishertown and High Street entrances",
        body: "For a Fishertown or High Street collection, identify the actual door, any shared passage and where loading is possible. Measure large furniture against the tightest part of its exit route and mention external steps or narrow turns. Check current parking signs and discuss any permission required with Highland Council; a convenient space nearby does not establish loading access.",
        source: {
          label: "Highland Council parking and permits",
          href: "https://www.highland.gov.uk/parking"
        }
      },
      {
        title: "Furniture between Nairn and Inverness",
        body: "For a Nairn to Inverness collection or delivery, give both complete addresses and the seller's agreed release window. Include dimensions for sofas, wardrobes and beds, and check the destination entrance before purchase. If dismantling is required, discuss it before confirmation. Additional collections or storage stops should be included when the full route is quoted rather than added on collection day."
      },
      {
        title: "Homes around Auldearn and Cawdor",
        body: "For an address around Auldearn or Cawdor, provide the property name and an entrance description as well as the postcode. Flag private lanes, gates, surface conditions and limited turning space. A full house move should include outbuildings and garden furniture in the inventory. Those details help match the vehicle and crew to the property, not simply to a bedroom count."
      }
    ],
    faqs: [
      {
        question: "Can you deliver furniture from Inverness to Nairn?",
        answer: "Yes. Provide the collection address, item sizes, delivery address and seller or retailer collection window. Include the floor and doorway access at your Nairn property. The crew and vehicle are assessed for the items and the route before the booking is confirmed."
      },
      {
        question: "Do you cover Auldearn and Cawdor near Nairn?",
        answer: "Yes, you can request collections and deliveries in these surrounding communities. Send the full property address and details of any private lane, gate or turning restriction. Availability and access are checked for your preferred date; the postcode district is a guide, not a service boundary."
      },
      {
        question: "What should I include for a Nairn house removal quote?",
        answer: "List furniture and boxes from each room, plus garden, garage or outbuilding items. Explain access at both properties, including stairs and the distance from the loading point. Add any packing or dismantling request and key handover times so the scope can be agreed in advance."
      }
    ]
  },
  {
    slug: "dingwall",
    name: "Dingwall",
    schemaType: "Place",
    region: "Highlands",
    postcode: "IV15",
    headline: "Man and Van in Dingwall",
    description:
      "Get a man and van quote in Dingwall for a single furniture collection, a flat move or house removals. High Street access needs checking before arranging a loading time, while properties around the town may have private approaches or longer carries. Include the complete load and destination for local moves, Inverness deliveries and surrounding village collections.",
    highlights: [
      "Dingwall and surrounding village moves",
      "Furniture collections to and from Inverness",
      "High Street loading and property access reviewed"
    ],
    nearbyAreas: ["inverness", "nairn"],
    metaDescription: "Man and van in Dingwall for furniture collection, flat and house removals. Plan High Street or rural access and request a quote for your full route.",
    moveAdvice: [
      {
        title: "Check High Street vehicle access first",
        body: "Dingwall High Street includes a pedestrian section, so do not plan on loading outside a property without checking current vehicle access arrangements. Give the exact entrance, floor and nearest suitable loading point when requesting your quote. Ask Highland Council about any permission needed and confirm the available window before coordinating a landlord, seller or key handover.",
        source: {
          label: "Highland Council Dingwall High Street property information",
          href: "https://www.highland.gov.uk/directory-record/11205/office-3-mayfield-dingwall"
        }
      },
      {
        title: "Maryburgh, Conon Bridge and Muir of Ord",
        body: "For a collection around Maryburgh, Conon Bridge or Muir of Ord, use the exact address instead of only describing it as near Dingwall. Include gates, driveway width and turning space, particularly where the entrance is away from the main road. Note every collection and delivery stop so the route can be quoted together with its loading and unloading requirements."
      },
      {
        title: "Choose the load before choosing the van",
        body: "For a move between Dingwall and Inverness, list bulky furniture and box quantities before deciding whether it is a small move or a house removal. A short route can still require a larger vehicle or extra lifting help. Tell us about stairs, awkward items and dismantling, and give any key handover deadline so the collection plan reflects the whole job."
      }
    ],
    faqs: [
      {
        question: "Can a removal van collect from Dingwall High Street?",
        answer: "The exact address and current access conditions need checking first because part of High Street is pedestrianised. Share your entrance and proposed loading point. Any council permission or time restriction must be resolved before confirming a collection that relies on driving into a restricted section."
      },
      {
        question: "Do you cover Maryburgh, Conon Bridge and Muir of Ord?",
        answer: "Yes. Include the full collection and destination addresses, load and preferred date in your enquiry. For a private driveway or lane, describe the entrance, surface and turning space. The team confirms vehicle suitability, access and availability for the specific journey."
      },
      {
        question: "Can I book a man and van from Dingwall to Inverness?",
        answer: "Yes, for furniture collections, smaller moves or a larger household load. Give an item list and access details at both properties, including stairs and parking. The quote depends on the load, route and required crew; a short drive alone does not determine the price."
      }
    ]
  },
  {
    slug: "fort-william",
    name: "Fort William",
    region: "Highlands",
    postcode: "PH33",
    headline: "Man and Van in Fort William",
    description:
      "For Fort William and surrounding-route enquiries, provide both full addresses and describe access from the road to each door. Narrow approaches, turning space and loading distance can affect the vehicle and crew needed. Longer or remote journeys need route confirmation before booking.",
    highlights: [
      "Furniture and home moving enquiries",
      "Longer journeys assessed before booking",
      "Approach roads and loading space considered"
    ],
    nearbyAreas: ["inverness", "oban", "mallaig", "spean-bridge"],
    metaDescription: "Man and van enquiries in Fort William for furniture and home moves. Share your route, inventory and vehicle access to check suitability and availability."
  },
  // Central Scotland
  {
    slug: "stirling",
    name: "Stirling",
    region: "Central Scotland",
    postcode: "FK7, FK8, FK9",
    headline: "Man and Van in Stirling",
    description:
      "Request a Stirling quote for a student room, flat, furniture collection or household move. Include floors, lift availability and the nearest loading point, together with any key handover or halls access window. For a route outside the city, add the full destination address.",
    highlights: [
      "Student rooms and flat moves",
      "Household and furniture enquiries",
      "Local and intercity route planning"
    ],
    nearbyAreas: ["falkirk", "alloa", "perth", "glasgow"],
    metaDescription: "Man and van in Stirling for student moves, furniture and home removals. Request a quote using both addresses, your inventory and access requirements."
  },
  {
    slug: "falkirk",
    name: "Falkirk",
    region: "Central Scotland",
    postcode: "FK1, FK2",
    headline: "Man and Van in Falkirk",
    description:
      "For a Falkirk removal or furniture collection, share the complete item list and both addresses. A short journey can still need extra loading time if stairs, parking or a long path are involved. Include those details and any onward stop when asking for your quote.",
    highlights: [
      "Furniture collections and small moves",
      "House and flat removal enquiries",
      "Route and loading details reviewed"
    ],
    nearbyAreas: ["stirling", "livingston", "alloa", "glasgow"],
    metaDescription: "Man and van in Falkirk for furniture collections, flat moves and home removals. Check your options using the full route, inventory and access details."
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Central Scotland",
    postcode: "ML3",
    headline: "Man and Van in Hamilton",
    description:
      "Arrange a quote for a Hamilton furniture collection, flat move or house removal. List everything being moved and explain the loading access, stairs and parking at both addresses. For a route elsewhere in Lanarkshire or beyond, provide the full destination and your preferred date.",
    highlights: [
      "Hamilton and Lanarkshire route enquiries",
      "Furniture, flats and home moves",
      "Inventory and access-based quotes"
    ],
    nearbyAreas: ["glasgow", "east-kilbride", "motherwell", "strathaven"],
    metaDescription: "Man and van in Hamilton for furniture delivery, flat moves and house removals. Request a quote with your addresses, dates and item list."
  },
  {
    slug: "east-kilbride",
    name: "East Kilbride",
    region: "Central Scotland",
    postcode: "G74, G75",
    headline: "Man and Van in East Kilbride",
    description:
      "For an East Kilbride move, give the entrance and nearest loading point as well as the address. Parking courts, paths, steps and building lifts can change the carrying distance. Include all furniture and boxes so the van and crew can be assessed for your route.",
    highlights: [
      "Flat and home moving enquiries",
      "Furniture collection and delivery",
      "Parking courts and carrying distances considered"
    ],
    nearbyAreas: ["glasgow", "hamilton", "glasgow-southside", "strathaven"],
    metaDescription: "Man and van in East Kilbride for furniture, flat and household moves. Request a quote based on your inventory, route and loading access."
  },
  {
    slug: "motherwell",
    name: "Motherwell",
    region: "Central Scotland",
    postcode: "ML1",
    headline: "Man and Van in Motherwell",
    description:
      "Request a Motherwell moving quote with the full collection and delivery addresses, furniture list and box estimate. Include steps, shared stairs, lifts and any restrictions on parking. If the move also involves storage or another collection, add it before the route is quoted.",
    highlights: [
      "Furniture and household moving enquiries",
      "Flat moves and storage transfers",
      "Extra stops included in route planning"
    ],
    nearbyAreas: ["hamilton", "glasgow", "east-kilbride", "airdrie"],
    metaDescription: "Man and van in Motherwell for furniture collections and home moves. Share your item list, addresses and access details for a tailored quote."
  },
  // West Scotland
  {
    slug: "ayr",
    name: "Ayr",
    region: "West Scotland",
    postcode: "KA7, KA8",
    headline: "Man and Van in Ayr",
    description:
      "For an Ayr furniture collection or home move, describe the rooms, items and access at both properties. Include stairs and the distance to a suitable loading point. If the journey involves another Ayrshire town or a longer Scottish route, provide every address before confirmation.",
    highlights: [
      "Furniture and household removal enquiries",
      "Ayrshire-linked routes by quote",
      "Stairs and loading access considered"
    ],
    nearbyAreas: ["kilmarnock", "troon", "prestwick", "glasgow"],
    metaDescription: "Man and van in Ayr for furniture delivery and household moves. Request a quote with your items, both addresses and access requirements."
  },
  {
    slug: "kilmarnock",
    name: "Kilmarnock",
    region: "West Scotland",
    postcode: "KA1, KA3",
    headline: "Man and Van in Kilmarnock",
    description:
      "Plan a Kilmarnock move using the actual furniture, boxes and route you need. Tell us about shared stairs, tight doorways and where the van can load at each address. For collections from a seller or storage unit, confirm when the goods will be ready for release.",
    highlights: [
      "Small moves and household enquiries",
      "Furniture and storage collections",
      "Collection times and access reviewed"
    ],
    nearbyAreas: ["ayr", "glasgow", "irvine", "cumnock"],
    metaDescription: "Man and van in Kilmarnock for small moves, furniture and household removals. Share the item list, route and access details to request a quote."
  },
  {
    slug: "oban",
    name: "Oban",
    region: "West Scotland",
    postcode: "PA34",
    headline: "Man and Van in Oban",
    description:
      "For an Oban removal enquiry, provide the exact collection and delivery addresses, inventory and vehicle access details. Confirm longer journeys with the team before booking. If a route involves an island or ferry, mention it at the enquiry stage so suitability and availability can be checked separately.",
    highlights: [
      "Furniture and household move enquiries",
      "Longer routes assessed before confirmation",
      "Ferry-dependent enquiries reviewed separately"
    ],
    nearbyAreas: ["fort-william", "inveraray", "lochgilphead", "campbeltown"],
    metaDescription: "Man and van enquiries in Oban for furniture and household moves. Confirm your route, access and any ferry requirement before booking."
  },
  // Borders & South West
  {
    slug: "dumfries",
    name: "Dumfries",
    region: "Borders & South West",
    postcode: "DG1, DG2",
    headline: "Man and Van in Dumfries",
    description:
      "For a Dumfries move, describe both property access routes along with the load. Include narrow approaches, turning space, steps and any long carry from the van. Routes outside Scotland need separate confirmation; provide both full postcodes when making the enquiry.",
    highlights: [
      "Household and furniture moving enquiries",
      "Rural access details considered",
      "Longer routes confirmed before booking"
    ],
    nearbyAreas: ["carlisle", "ayr", "kilmarnock", "stranraer"],
    metaDescription: "Man and van enquiries in Dumfries for furniture and home moves. Request a quote using the full route, inventory and property access details."
  },
  {
    slug: "galashiels",
    name: "Galashiels",
    region: "Borders & South West",
    postcode: "TD1",
    headline: "Man and Van in Galashiels",
    description:
      "Request a Galashiels moving quote with the full item list, addresses and preferred date. Explain shared stairs, parking, access from the road and any extra stop. For a journey towards Edinburgh or another Borders town, include destination access and handover arrangements.",
    highlights: [
      "Furniture, flat and household enquiries",
      "Borders and Edinburgh-linked routes by quote",
      "Destination access and timings considered"
    ],
    nearbyAreas: ["edinburgh", "hawick", "jedburgh", "peebles"],
    metaDescription: "Man and van in Galashiels for furniture and household moves. Share your route, load and access details to check options for your preferred date."
  }
];

export function getAreaBySlug(slug: string): Area | undefined {
  return AREAS.find((area) => area.slug === slug);
}

export const FEATURED_AREAS = AREAS.filter(
  (area, index) => index < 10 || ["aberdeen", "inverness"].includes(area.slug)
);
