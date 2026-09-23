export interface ServiceFaq {
  question: string;
  answer: string;
  links?: {
    label: string;
    href: string;
  }[];
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  description: string;
  longDescription: string;
  includes: string[];
  whyUs: string[];
  startingFrom: number;
  priceUnit?: "hour";
  metaDescription: string;
  faqs: ServiceFaq[];
  bookingServiceSlug?: string;
  bookable?: boolean;
  indexable?: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "man-and-van",
    name: "Man and Van",
    tagline: "Flexible van-with-driver moves across Scotland",
    icon: "🚐",
    description:
      "A professional driver and van for small moves, single-item pickups, marketplace collections, and flexible local transport.",
    longDescription:
      "Need a man with a van for a smaller move? Our man and van service suits single rooms, a few pieces of furniture, marketplace collections and storage runs across Scotland. A driver helps with loading and unloading; the van and any additional crew depend on the items and access. Share both addresses, your item list and preferred date to get a quote for the work you need.",
    includes: [
      "Professional driver with the right van for the load",
      "Loading and unloading assistance",
      "Furniture blankets, straps, and trolleys",
      "One, two, or three-person crew options where available",
      "Hourly or fixed-price quote options depending on the job",
    ],
    whyUs: [
      "Clear quote before you book",
      "Same-day and short-notice slots when capacity allows",
      "Useful for single items, flat moves, and local business deliveries",
    ],
    startingFrom: 45,
    priceUnit: "hour",
    metaDescription:
      "Man and van, man with a van and van-with-driver moves across Scotland from £45/hr. Ideal for small moves, single items, furniture pickups and flat moves.",
    faqs: [
      {
        question: "Is man and van the same as van and man?",
        answer:
          "Yes. Both describe a van with a driver who helps move items. Choose this service when you need transport and loading help rather than self-drive van hire.",
      },
      {
        question: "How many hours do I need for a man and van move?",
        answer:
          "There is no reliable duration from bedroom count alone. The item list, distance, stairs, parking, walking distance to the van and packing all affect the time. Give us those details so the quote can allow for your move; ask about any minimum booking period before confirming.",
      },
      {
        question: "Can I help with loading?",
        answer:
          "Yes. If it is safe to do so, helping with loading can reduce the time needed. Tell us about heavy or awkward items so we can recommend the right crew size.",
      },
    ],
  },
  {
    slug: "flat-removals",
    name: "Flat Removals",
    tagline: "Flats, apartments, studios, and student moves",
    icon: "🏢",
    description:
      "Careful flat removals for studios, apartments, tenements, student rooms, and one or two-bedroom homes.",
    longDescription:
      "Moving a flat, apartment or studio means planning the route from your front door to the van. Shared stairs, lift size, tight hallways, loading bays and the floor at each address can matter as much as the number of bedrooms. We quote for the furniture and boxes you are taking, with crew and vehicle requirements based on the full load and access.",
    includes: [
      "Studio, one-bed, and two-bed flat move planning",
      "Lift, stair, and tight-access guidance before move day",
      "Furniture blankets and careful room-of-choice unloading",
      "Student room and shared-flat moves",
      "Optional dismantling support for beds, desks, and wardrobes",
    ],
    whyUs: [
      "Built around access details, not just mileage",
      "Strong fit for city flats and apartment blocks",
      "Quote based on your furniture, boxes and access",
    ],
    startingFrom: 45,
    priceUnit: "hour",
    metaDescription:
      "Flat removals across Scotland for apartments, studios, student rooms and one-bed moves. Van with driver and crew options from £45/hr.",
    bookingServiceSlug: "man-and-van",
    bookable: false,
    faqs: [
      {
        question: "Do you move flats with stairs and no lift?",
        answer:
          "Yes. Tell us the floor number, stair width, and any parking limits before booking so we can recommend the right crew and time allowance.",
      },
      {
        question: "Is a studio move cheaper than a house removal?",
        answer:
          "A smaller load can require less van space and crew time, but stairs, parking and travel still affect the cost. A lightly furnished studio and a fully furnished upper-floor flat can need very different quotes.",
      },
      {
        question: "Can you handle student moves?",
        answer:
          "Yes. Include the halls or flat address, your floor, the furniture and boxes, and any check-in or check-out slot. If several housemates are moving, list each collection and destination before requesting a quote.",
      },
    ],
  },
  {
    slug: "small-moves",
    name: "Small Moves",
    tagline: "Few items, one room, storage runs, and bulky pieces",
    icon: "📦",
    description:
      "Small move help for partial moves, single-room loads, bulky items, storage transfers, and short local journeys.",
    longDescription:
      "Not every move is a full home. Small moves cover a few boxes, bedroom furniture, bulky items, marketplace purchases, storage unit collections, and partial moves between Scottish towns. We keep these jobs simple: choose the right van size, describe the access, and get a clear quote before committing.",
    includes: [
      "Single-room and few-item moves",
      "Bulky item transport for sofas, beds, wardrobes, and appliances",
      "Storage unit collection and delivery",
      "Marketplace and private-seller pickups",
      "Local or intercity routes where capacity allows",
    ],
    whyUs: [
      "No need to book a full removal package",
      "Short-notice enquiries checked against availability",
      "Price based on the items and journey you provide",
    ],
    startingFrom: 45,
    priceUnit: "hour",
    metaDescription:
      "Small moves across Scotland from £45/hr. Move a few items, one room, bulky furniture, storage loads or marketplace collections.",
    bookingServiceSlug: "man-and-van",
    bookable: false,
    faqs: [
      {
        question: "What counts as a small move?",
        answer:
          "A small move is usually a few items, one room, a studio load, a storage transfer, or a single bulky item that needs a van and lifting help.",
      },
      {
        question: "Can you move one bulky item?",
        answer:
          "Yes. Sofas, beds, wardrobes, appliances, and large marketplace purchases are common small-move jobs. Send item dimensions where possible.",
      },
      {
        question: "Do small moves include disposal?",
        answer:
          "This page is for moving possessions from one place to another. Waste disposal or clearance is handled separately and only where the job can be completed compliantly.",
      },
    ],
  },
  {
    slug: "house-removal",
    name: "House Removals",
    tagline: "Whole-home moves, from small houses to full-house removals",
    icon: "🏠",
    description:
      "House removals for home moves of every size, with crew, van, loading support, and careful planning.",
    longDescription:
      "Plan a house removal around everything you are taking, from the main rooms to a garage, loft or garden store. Our full-house and smaller home moves across Scotland are quoted using your inventory, both addresses and access details. Tell us about fragile pieces, dismantling, key collection and packing help so the vehicle, crew and schedule fit the move.",
    includes: [
      "Crew and van matched to the property size",
      "Large or Luton van options where suitable",
      "Furniture dismantling and reassembly options",
      "Protective blankets, with packing materials available by quote",
      "Fixed-price quotes available for larger home moves",
    ],
    whyUs: [
      "Pre-move questions cover stairs, parking, and heavy items",
      "Good fit for local and Scotland-wide house moves",
      "Packing help available as an add-on",
    ],
    startingFrom: 120,
    metaDescription:
      "House removals and full-house moves across Scotland from £120. Crew, van, furniture protection and fixed-price quotes available.",
    faqs: [
      {
        question: "Do you provide boxes and packing materials?",
        answer:
          "We can supply packing materials or quote for a packing service. If you pack yourself, label boxes by room and flag fragile items before move day.",
      },
      {
        question: "How far in advance should I book a house removal?",
        answer:
          "For weekend and month-end moves, book as early as possible. Weekday moves can sometimes be arranged with shorter notice, subject to capacity.",
      },
      {
        question: "Do you quote full-house removals at a fixed price?",
        answer:
          "Yes. For larger homes, a fixed quote is often better than hourly pricing because it lets both sides agree the scope before move day.",
      },
    ],
  },
  {
    slug: "long-distance-removals",
    name: "Long-Distance Removals",
    tagline: "Intercity and Scotland-wide transport",
    icon: "🛣️",
    description:
      "Long-distance removals and intercity moving for customers travelling between Scottish towns and cities.",
    longDescription:
      "For a move between Scottish towns or cities, plan the collection and delivery together. Long-distance removals can suit a full home, a flat or a smaller load travelling further. The quote takes account of the items, route distance in miles, loading time and access at both ends. Include key handover times and every stop before the journey is confirmed.",
    includes: [
      "Scotland intercity and longer local routes",
      "Dedicated van quotes for direct moves",
      "Furniture protection for longer journeys",
      "Timing planned around keys, access, and delivery windows",
      "Suitable for homes, flats, students, and business moves",
    ],
    whyUs: [
      "Clear route-based quote before booking",
      "Useful for city-to-city moves and rural access",
      "Collection and delivery requirements agreed together",
    ],
    startingFrom: 120,
    metaDescription:
      "Long-distance removals across Scotland for intercity home, flat, student and office moves. Clear route-based quotes from £120.",
    bookingServiceSlug: "house-removal",
    bookable: false,
    faqs: [
      {
        question: "Do you move between Scottish cities?",
        answer:
          "Yes. We can quote intercity routes across Scotland. Tell us the collection and delivery postcodes, load size, access, and preferred date.",
      },
      {
        question: "Is long-distance pricing hourly or fixed?",
        answer:
          "Many long-distance moves work best as a fixed quote because mileage and crew time can be estimated before the job starts.",
      },
      {
        question: "Do you move outside Scotland?",
        answer:
          "Routes outside Scotland need separate confirmation. Contact the team with both postcodes and your item list before making plans; an online enquiry does not confirm coverage or a collection slot.",
      },
    ],
  },
  {
    slug: "office-removal",
    name: "Office Removals",
    tagline: "Business, office, and commercial relocations",
    icon: "💼",
    description:
      "Office removals and business relocations planned around your equipment, building access and staff handover.",
    longDescription:
      "An office removal starts with an inventory and a plan for both buildings. Desks, chairs, filing cabinets, boxed equipment and suitable commercial stock need clear labels and agreed destinations. Tell us about loading bays, service lifts, access permissions and the time your team needs to resume work. Shop, studio and other business moves are assessed against the items and handling required.",
    includes: [
      "Out-of-hours and weekend scheduling where available",
      "Desk, chair, file, and equipment moving",
      "Labelled loading and room-by-room unloading",
      "Crates or packing materials on request",
      "Building access and handover requirements discussed before confirmation",
    ],
    whyUs: [
      "Planned around downtime and access windows",
      "Suitable for small offices, clinics, studios, and retail units",
      "Clear scope before move day",
    ],
    startingFrom: 150,
    metaDescription:
      "Office removals, business relocation and commercial moves across Scotland from £150. Out-of-hours options and equipment moving support.",
    faqs: [
      {
        question: "Can you move office IT equipment?",
        answer:
          "We can physically move monitors, desks, and boxed IT equipment. Your IT team should disconnect, back up, and reconnect systems unless a specialist has been arranged.",
      },
      {
        question: "Can you work outside office hours?",
        answer:
          "Evening and weekend moves can often be arranged so staff can return to work with less disruption. Availability depends on crew and route capacity.",
      },
      {
        question: "Do you handle commercial stock or shop moves?",
        answer:
          "Yes, where the stock is safe and lawful to transport. Tell us about volume, access, fragility, and any time-sensitive handover requirements.",
      },
    ],
  },
  {
    slug: "student-move",
    name: "Student Moves",
    tagline: "Affordable moves for students and shared flats",
    icon: "🎓",
    description:
      "Student moves for halls, shared flats, term-time moves, storage transfers, and family collections.",
    longDescription:
      "Moving in at the start of term or out at the end should be simple. Our student move service is built for smaller loads, halls of residence, shared flats, suitcases, boxes, desks, beds, and short-notice parent collections.",
    includes: [
      "Compact van options for smaller loads",
      "Box, suitcase, and small furniture loading help",
      "Shared-flat and group move options where practical",
      "Short-distance city moves and storage transfers",
      "Simple quote before booking",
    ],
    whyUs: [
      "Good fit for halls, studios, and shared flats",
      "Works for parents collecting at term end",
      "Book early for September and month-end dates",
    ],
    startingFrom: 80,
    metaDescription:
      "Student moves across Scotland from £80. Halls, shared flats, storage transfers, suitcases, boxes and small furniture moved safely.",
    faqs: [
      {
        question: "Do I need to be a registered student?",
        answer:
          "No. The service is priced around student-volume loads, so it can also suit small rooms, shared flats, or family collections.",
      },
      {
        question: "Can I share a van with a housemate?",
        answer:
          "Often, yes, if the pickup and drop-off route is practical. Add the details when requesting a quote so the time and van size are realistic.",
      },
      {
        question: "Do you move items into and out of storage?",
        answer:
          "Yes. Storage transfers are common for student moves. Provide the storage facility address and any access code or opening-hour restrictions.",
      },
    ],
  },
  {
    slug: "furniture-delivery",
    name: "Furniture Removals, Collection & Delivery",
    tagline: "Sofas, beds, wardrobes, and room-of-choice delivery",
    icon: "🛋️",
    description:
      "Furniture removals, collection and delivery from retailers, private sellers, storage units, and homes.",
    longDescription:
      "Arrange furniture removals, collection and delivery for a sofa, bed, wardrobe, table or several bulky pieces. Collections can be from a home, retailer, private seller or storage unit, with delivery to the agreed room where the item fits and access is safe. Measure the furniture and the route through doors, stairs and lifts at both addresses before requesting your quote.",
    includes: [
      "Collection from retailers, showrooms, storage, or private sellers",
      "Protective blankets and strapping",
      "Room-of-choice placement where access is safe",
      "Assembly or dismantling support by quote",
      "Collection and delivery contacts recorded for the job",
    ],
    whyUs: [
      "Built for bulky and awkward items",
      "Clear collection and delivery instructions before the job",
      "Useful for marketplace purchases and single-item removals",
    ],
    startingFrom: 60,
    metaDescription:
      "Furniture removals, collection and delivery across Scotland from £60. Sofas, beds, wardrobes, bulky items and marketplace pickups.",
    faqs: [
      {
        question: "Can you collect furniture from a private seller?",
        answer:
          "Yes. Share the collection address, seller contact details, item dimensions and agreed collection window. Settle the purchase with the seller and confirm that the item is ready to release before the van arrives.",
      },
      {
        question: "Do you deliver furniture upstairs?",
        answer:
          "Where it is safe and the item fits, yes. Tell us about stairs, lifts, tight turns, and parking so we can send the right crew.",
      },
      {
        question: "What if the furniture does not fit?",
        answer:
          "We will not force an item through an unsafe access route. If fit is uncertain, send dimensions and photos before booking.",
      },
    ],
  },
  {
    slug: "ikea-delivery",
    name: "IKEA Delivery & Assembly",
    tagline: "Flat-pack collection, delivery, and build help",
    icon: "🔧",
    description:
      "IKEA collection, home delivery, and flat-pack assembly help for furniture orders and room refreshes.",
    longDescription:
      "If your order is too big for the car, we can collect, deliver, and quote for assembly support. Provide the order details, item list, collection point, and access information so the right van and time allowance can be planned.",
    includes: [
      "Collection from agreed IKEA collection points",
      "Delivery to the room where access allows",
      "Flat-pack assembly available by quote",
      "Packaging handling discussed before booking",
      "Same-day or next-day slots where capacity allows",
    ],
    whyUs: [
      "Practical for bulky flat-pack furniture",
      "Room-of-choice delivery saves repeated lifting",
      "Assembly can be added when the scope is clear",
    ],
    startingFrom: 70,
    metaDescription:
      "IKEA collection, delivery and assembly help across Scotland from £70. Flat-pack furniture moved to the room where access allows.",
    faqs: [
      {
        question: "Do I need to be at IKEA when you collect?",
        answer:
          "That depends on the retailer's collection rules and order setup. We will confirm what is needed before accepting the job.",
      },
      {
        question: "Can you assemble wardrobes and beds?",
        answer:
          "Assembly can be quoted when you provide the item list. Complex builds may need extra time or a separate quote.",
      },
      {
        question: "Do you remove packaging?",
        answer:
          "Packaging removal can be discussed before booking. It is not assumed unless it is included in the quote.",
      },
    ],
  },
  {
    slug: "rubbish-removal",
    name: "Light Clearance Enquiries",
    tagline: "Separate from removals and quoted only where suitable",
    icon: "♻️",
    description:
      "Light clearance enquiries for items that are not being moved to another address. This is separate from removals.",
    longDescription:
      "SpeedyVan's main service is moving possessions, not self-drive van hire or general waste disposal. Light clearance requests are reviewed separately and accepted only where the job can be handled safely and compliantly. If you need furniture moved to a new address, use furniture delivery or man and van instead.",
    includes: [
      "Separate review before acceptance",
      "Furniture and bulky-item enquiries only where suitable",
      "No hazardous, restricted, or unsafe materials",
      "Quote confirmed before any work starts",
      "Removal-to-new-address jobs routed to moving services",
    ],
    whyUs: [
      "Clear distinction from moving services",
      "Acceptance confirmed for each individual enquiry",
      "Phone confirmation before booking",
    ],
    startingFrom: 90,
    metaDescription:
      "Light clearance enquiries are reviewed separately from removals. For moving furniture to another address, use SpeedyVan furniture delivery or man and van.",
    indexable: false,
    faqs: [
      {
        question: "Is this the same as a removals service?",
        answer:
          "No. Removals move possessions to another address. Clearance enquiries are reviewed separately and may not be accepted.",
      },
      {
        question: "Can you dispose of hazardous materials?",
        answer:
          "No. We do not accept hazardous, restricted, unsafe, or unlawful materials.",
      },
      {
        question: "Which page should I use for furniture I want to keep?",
        answer:
          "Use furniture delivery or man and van if the item is being moved to a new address.",
      },
    ],
  },
  {
    slug: "piano-moving",
    name: "Piano Moving",
    tagline: "Careful planning for heavy, fragile instruments",
    icon: "🎹",
    description:
      "Piano moving enquiries for upright, digital, and other heavy instruments where access and equipment can be assessed.",
    longDescription:
      "Pianos need careful planning because weight, balance, stairs, turns, and declared value all matter. We quote piano moves only after understanding the instrument, pickup access, delivery access, and whether specialist equipment or extra crew is required.",
    includes: [
      "Access and item details reviewed before booking",
      "Protective wrapping and careful handling",
      "Crew size matched to the instrument and route",
      "Advice on declared value and cover requirements",
      "Local and longer Scottish routes by quote",
    ],
    whyUs: [
      "No blind quote for complex access",
      "Suitable for uprights and digital pianos",
      "Tuning after transport can be arranged separately by the customer",
    ],
    startingFrom: 200,
    metaDescription:
      "Piano moving enquiries across Scotland from £200. Upright and digital pianos quoted after access, item and route details are reviewed.",
    faqs: [
      {
        question: "Can you move a piano upstairs?",
        answer:
          "Possibly, but it must be assessed before booking. Stair width, turns, landing space, and instrument type all affect whether it is safe.",
      },
      {
        question: "Should I tune the piano after moving?",
        answer:
          "Many owners arrange tuning after the instrument settles in its new environment. Ask your piano tuner for timing advice.",
      },
      {
        question: "Do you move digital pianos?",
        answer:
          "Yes, where the item, weight, and access are suitable. Digital pianos still need careful protection during transport.",
      },
    ],
  },
  {
    slug: "same-day-delivery",
    name: "Same-Day Delivery",
    tagline: "Urgent item transport when timing matters",
    icon: "⚡",
    description:
      "Same-day item delivery for urgent point-to-point transport, documents, parcels, and larger items that need a van.",
    longDescription:
      "When next-day is too slow, same-day delivery can move items directly from pickup to destination. It works for documents, parcels, business items, furniture, replacement parts, and urgent personal transport where the route and capacity are available.",
    includes: [
      "Point-to-point collection and delivery",
      "Item and route details checked before confirmation",
      "Photo or signature proof where supported",
      "Small parcel through van-sized item options",
      "Business and personal urgent transport",
    ],
    whyUs: [
      "Good fit for urgent route-based transport",
      "Direct delivery avoids depot sorting",
      "Larger items can be quoted with van capacity in mind",
    ],
    startingFrom: 55,
    metaDescription:
      "Same-day delivery across Scotland from £55 for urgent point-to-point transport, documents, parcels, furniture and business items.",
    faqs: [
      {
        question: "How quickly can you collect?",
        answer:
          "Collection depends on driver capacity, route, and item size. Short-notice work is accepted when the team can safely cover it.",
      },
      {
        question: "What size items can go same-day?",
        answer:
          "Anything from documents to van-sized loads can be considered. Send item dimensions for bulky or heavy goods.",
      },
      {
        question: "Is same-day delivery the right page for a house move?",
        answer:
          "No. Use house removals, flat removals, or man and van for moving home. Same-day delivery is for urgent item transport.",
      },
    ],
  },
  {
    slug: "packing-service",
    name: "Packing Service",
    tagline: "Packing help before a move",
    icon: "📦",
    description:
      "Packing support for homes, flats, fragile items, and office moves when booked with a suitable removal.",
    longDescription:
      "Packing is often the part of a move that takes longest. We can quote for full or partial packing, fragile-only packing, wardrobe boxes, labelling, and unpacking support where it is practical for the move size and schedule.",
    includes: [
      "Full or partial packing by quote",
      "Fragile-item wrapping",
      "Wardrobe boxes for hanging clothes",
      "Box labelling by room",
      "Optional unpacking support where agreed",
    ],
    whyUs: [
      "Useful for busy households and fragile loads",
      "Pairs with house, flat, and office removals",
      "Scope confirmed before the move",
    ],
    startingFrom: 100,
    metaDescription:
      "Packing service across Scotland from £100. Full, partial and fragile-item packing for house, flat and office removals.",
    faqs: [
      {
        question: "Can I choose only certain rooms?",
        answer:
          "Yes. You can ask for full packing, fragile-only packing, or selected rooms such as kitchens, bedrooms, or home offices.",
      },
      {
        question: "Do you provide boxes?",
        answer:
          "Boxes and materials can be included in the quote. We will confirm what is supplied before booking.",
      },
      {
        question: "Can you unpack at the destination?",
        answer:
          "Unpacking can be quoted where the move schedule allows it. It is not included unless agreed before the job.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getBookableService(service: Service): Service {
  if (service.bookable === false && service.bookingServiceSlug) {
    return getServiceBySlug(service.bookingServiceSlug) ?? service;
  }

  return service;
}

const servicePriceFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function getServicePriceLabel(service: Service): string {
  const price = servicePriceFormatter.format(service.startingFrom);
  return service.priceUnit === "hour" ? `${price}/hour` : price;
}
