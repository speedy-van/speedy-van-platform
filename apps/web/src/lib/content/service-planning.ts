export interface ServicePlanning {
  suitableFor: string;
  vehicleAndCrew: string;
  pricing: string;
  notIncluded: string[];
  preparation: { title: string; body: string }[];
}

export const SERVICE_PLANNING: Partial<Record<string, ServicePlanning>> = {
  "man-and-van": {
    suitableFor:
      "Choose man and van for a smaller load that needs transport and lifting help: a room move, furniture collection, a storage run or a few bulky items. For a full household, compare house removals so packing and the complete inventory can be planned together.",
    vehicleAndCrew:
      "A van with a driver is supplied, rather than a self-drive hire vehicle. The load dimensions, weight and access determine the vehicle and number of movers. Mention a sofa on stairs, a heavy appliance or any item that needs two people; do not assume the driver can lift every item alone.",
    pricing:
      "The hourly guide price is a starting point, not a total for your move. Loading, travel, unloading, crew requirements and any agreed extras affect the quote. Confirm the charging basis and any minimum time with the team before accepting.",
    notIncluded: [
      "Self-drive van hire or passenger transport.",
      "Packing, furniture assembly or dismantling unless included in your quote.",
      "Waste disposal, hazardous materials or unassessed specialist lifting.",
    ],
    preparation: [
      {
        title: "List the whole load",
        body: "Include boxes as well as furniture, and measure the largest items. Add every collection or delivery stop so the journey and van space can be assessed.",
      },
      {
        title: "Describe both access routes",
        body: "Give floor numbers, lift size, narrow turns and the walking distance from a legal loading space to each door. Photos help explain awkward access.",
      },
      {
        title: "Be ready to load",
        body: "Seal and label boxes, empty loose drawers and keep keys and entry arrangements ready. Ask about extra crew if you cannot help with lifting.",
      },
    ],
  },
  "furniture-delivery": {
    suitableFor:
      "This service suits furniture you want to keep or have purchased: a single sofa, a bed and mattress, a wardrobe, dining furniture or several pieces. Use it for collection and delivery between homes, shops, private sellers and storage.",
    vehicleAndCrew:
      "The item dimensions and weight determine the van and handling requirements. Stairs, tight turns and room-of-choice delivery may require additional movers. A large item must fit both the vehicle and the full access route at the destination.",
    pricing:
      "Your furniture quote depends on the item list, route, crew, floors and access. Assembly, dismantling, extra stops or waiting for a seller need to be discussed before confirmation. The guide price is not a fixed price for every item or distance.",
    notIncluded: [
      "Purchasing furniture or paying a private seller on your behalf.",
      "Appliance plumbing, electrical installation or wall mounting.",
      "Removal of unwanted furniture or packaging unless separately agreed and accepted.",
    ],
    preparation: [
      {
        title: "Measure before buying",
        body: "Check width, depth and height against doorways, stair turns, corridors and lifts. Include detachable legs or sections and ask about dismantling if the fit is uncertain.",
      },
      {
        title: "Arrange the collection",
        body: "Confirm the seller or retailer can release the goods to your collector. Provide the order reference where required and an agreed time when someone will be present.",
      },
      {
        title: "Prepare the destination",
        body: "Clear a safe route to the intended room and protect loose belongings. Appliances should be emptied and safely disconnected before collection; follow the manufacturer's preparation instructions.",
      },
    ],
  },
  "house-removal": {
    suitableFor:
      "House removals suit a complete household or a larger home move where the rooms, storage spaces and key handover need one plan. Bedroom count helps start the quote, but the actual furniture and boxes determine the load.",
    vehicleAndCrew:
      "The complete inventory determines vehicle size, crew and whether more than one load is needed. Larger or Luton van options can be discussed for suitable moves. Flag heavy, fragile or high-value pieces before the vehicle and crew are confirmed.",
    pricing:
      "House removal quotes take account of volume, route distance, loading time, access and any packing or dismantling requested. A fixed quote covers the agreed scope. Add loft, garage, garden and storage items before accepting so they are included in the assessment.",
    notIncluded: [
      "Packing materials, full packing or unpacking unless specified in the quote.",
      "Disconnecting utilities, plumbing or electrical work.",
      "Storage, disposal or extra trips unless separately agreed.",
    ],
    preparation: [
      {
        title: "Check every room",
        body: "List furniture and boxes from the kitchen, bedrooms, living spaces, shed and garage. Identify items that must be dismantled or need special handling.",
      },
      {
        title: "Plan around the keys",
        body: "Give expected collection and completion times, and explain any uncertainty over destination access. Ask how a change to the handover time would affect the agreed plan.",
      },
      {
        title: "Keep essentials with you",
        body: "Pack medicines, documents, chargers and first-night items separately. Label other boxes by destination room and keep the loading route clear.",
      },
    ],
  },
  "flat-removals": {
    suitableFor:
      "Choose flat removals for a studio, apartment, tenement flat or shared home. A one-bedroom move can still involve a full furniture load; include what you own rather than relying only on the property size.",
    vehicleAndCrew:
      "Crew needs depend on the load and the stairs or lift at both buildings. A lift that carries people may not fit a sofa or wardrobe. Provide lift dimensions and weight limits where available, and tell us if the loading entrance differs from the main entrance.",
    pricing:
      "The hourly guide price is not the total cost of moving a flat. Floors, walking distance, vehicle access, waiting for a lift and the size of the load can change the work required. Ask for the charging basis and any minimum time before confirming.",
    notIncluded: [
      "Booking a building lift, loading bay or council parking space on your behalf unless agreed.",
      "Hoisting furniture through windows or balconies without a separate specialist assessment.",
      "Packing or furniture dismantling unless included in the quote.",
    ],
    preparation: [
      {
        title: "Check the building rules",
        body: "Ask the factor, concierge or landlord about moving hours, service lifts and loading bays. Include entry codes and a contact for access on the day.",
      },
      {
        title: "Photograph tight turns",
        body: "Show narrow closes, half-landings and doorways beside large furniture. Measure the item and the tightest parts of its route before the move is agreed.",
      },
      {
        title: "Keep shared spaces clear",
        body: "Pack within the flat and leave communal doors and stairs usable. Label furniture and boxes with the destination room, especially when housemates have separate loads.",
      },
    ],
  },
  "office-removal": {
    suitableFor:
      "Office removals suit desks, chairs, filing cabinets and boxed office equipment moving to another workplace. If the job is a shop, studio, commercial stock room or wider business move, use business removals so the scope is reviewed separately.",
    vehicleAndCrew:
      "Send the inventory, equipment dimensions and both building access arrangements. The loading bay, goods lift, floor plan and permitted moving hours help determine crew and vehicle needs. Tell us about heavy cabinets or equipment that cannot use the normal access route.",
    pricing:
      "An office removal quote depends on the office furniture and equipment, route, crew time, access windows and agreed packing or dismantling. Evening or weekend work is subject to availability. Include staged moves and extra workplace areas in the scope before confirmation.",
    notIncluded: [
      "IT disconnection, data migration, system configuration or reconnection.",
      "Handling confidential records without an agreed packing and handover plan.",
      "Specialist machinery installation, hazardous goods or waste disposal.",
    ],
    preparation: [
      {
        title: "Give every item a destination",
        body: "Label desks, chairs and boxes by team or room and share the destination layout. Keep an inventory for equipment and nominate a contact at each building.",
      },
      {
        title: "Coordinate with your IT team",
        body: "Back up systems and have equipment safely disconnected before loading. Pack cables with the matching equipment and arrange reconnection separately.",
      },
      {
        title: "Agree building access",
        body: "Confirm lift and loading bay reservations with building management. Share any access paperwork or restrictions before the move is accepted.",
      },
    ],
  },
  "business-removals": {
    suitableFor:
      "Business removals suit commercial moves that are wider than an office desk move: shops, studios, business furniture, boxed stock, display pieces and suitable equipment. Specialist machinery, regulated goods and hazardous materials need separate assessment before acceptance.",
    vehicleAndCrew:
      "The business inventory, release contact, service entrance, loading bay, lift and access window determine the vehicle and crew. Tell us whether items are packed, palletised, boxed, loose, fragile or displayed so handling can be assessed before confirmation.",
    pricing:
      "Business relocation pricing uses the commercial inventory, route, crew time, access constraints, date and any agreed packing, dismantling or additional stops. Shops, studios and wider commercial loads should be described as business removals so the quote keeps the right scope and labels.",
    notIncluded: [
      "Specialist machinery installation, regulated goods, hazardous materials or waste disposal.",
      "IT system disconnection, data migration or reconnection.",
      "Moving unlisted stock, fixtures or extra premises that were not included in the agreed scope.",
    ],
    preparation: [
      {
        title: "List commercial items clearly",
        body: "Separate stock, shelving, display furniture, business equipment and boxed files. Mark fragile items and anything that must stay upright.",
      },
      {
        title: "Confirm business access",
        body: "Ask the premises manager about loading bays, goods lifts, alarm procedures and moving hours. Provide the release contact and destination contact before booking.",
      },
      {
        title: "Plan business continuity",
        body: "Identify what must move first and what can wait. Keep tills, records, keys and essential equipment controlled by your team unless separate handling is agreed.",
      },
    ],
  },
  "storage-transport": {
    suitableFor:
      "Storage transport suits belongings moving into or out of a booked storage unit: furniture, boxes, student belongings, small loads and temporary moves between tenancies. It is transport only, not storage-space rental.",
    vehicleAndCrew:
      "The unit floor, lift, trolley access, facility opening hours and home access determine the crew and vehicle. Include the unit number or release process privately in the booking details where needed, but do not publish full access codes.",
    pricing:
      "Storage transport is priced from the storage moving intent using the route, load, access, crew and any additional stops. Add both the home and storage facility details before confirming so the quote covers the whole job.",
    notIncluded: [
      "Storage-space rental, insurance or facility fees.",
      "Packing, dismantling, assembly or extra helpers unless included in the quote.",
      "Waiting for facility access that was not included in the agreed scope.",
    ],
    preparation: [
      {
        title: "Check the unit access",
        body: "Confirm opening hours, gate entry, lift size, unit floor and whether trolleys are available. Share any access process needed for collection or delivery.",
      },
      {
        title: "Separate storage loads",
        body: "Label what goes into storage and what travels to the final address. List furniture, boxes and bags instead of describing the load only by unit size.",
      },
      {
        title: "Keep the route clear",
        body: "At home and at the facility, leave a clear route for bulky pieces. Measure sofas, wardrobes and beds against the unit corridor and lift as well as the property.",
      },
    ],
  },
  "small-moves": {
    suitableFor:
      "A small move can be a bedroom, a few boxes and furniture, a single bulky item or a storage transfer. It is useful when you are moving part of a household rather than everything in the property.",
    vehicleAndCrew:
      "Small describes the load, not necessarily the lifting effort. A single sofa on an upper floor can need more crew than several boxes at ground level. Include dimensions, approximate weight and access so the vehicle and handling are suitable.",
    pricing:
      "The hourly guide price depends on the job details and does not establish a minimum total. Route distance, loading time, crew and access all matter even for one item. Confirm any minimum booking period and whether the quote is hourly or fixed.",
    notIncluded: [
      "Waste clearance or disposal of possessions you no longer want.",
      "Packing, dismantling or assembly unless agreed in advance.",
      "Additional items or stops that have not been included in the quote.",
    ],
    preparation: [
      {
        title: "Separate the items being moved",
        body: "Mark the furniture and boxes that belong to this job, especially in a shared home or storage unit. Include everything when requesting the quote.",
      },
      {
        title: "Check storage access",
        body: "Give the facility address, opening hours, loading point and unit floor. Arrange entry with the storage operator and check whether trolleys or lifts are available.",
      },
      {
        title: "Prepare bulky items",
        body: "Empty drawers and cupboards, secure loose parts and measure tight doorways. Request dismantling or extra crew if the item cannot be moved safely as it is.",
      },
    ],
  },
  "student-move": {
    suitableFor:
      "Student moves suit boxes, suitcases and small furniture travelling between halls, a shared flat, a family home or storage. List the belongings you are taking, including furniture, rather than relying only on the size of your room. If housemates are moving together, describe each person's load and destination.",
    vehicleAndCrew:
      "The combined load and access at both buildings determine the van and lifting help needed. Include desks, beds and other bulky pieces alongside bags and boxes. Tell us about stairs, lift dimensions, loading entrances and any time limit set by the accommodation team.",
    pricing:
      "Request a quote with your item list, both addresses, floor and lift access, date and any extra help needed. Shared collections, additional stops and a later return journey must be discussed before confirmation; they are not automatically included in a one-way move.",
    notIncluded: [
      "Storage-space rental; arrange the unit and access with your storage provider.",
      "Packing, furniture dismantling or assembly unless included in your quote.",
      "Accommodation keys, lift reservations or parking permissions unless separately agreed.",
    ],
    preparation: [
      {
        title: "Check your halls or flat access",
        body: "Confirm the check-in or check-out window, when keys are available and where the van may load. Ask about lift bookings and entry arrangements. If a parent or housemate will be there instead of you, agree who will hand over and receive the items.",
      },
      {
        title: "Keep shared loads separate",
        body: "Label boxes and furniture with their owner and destination. Keep your housemates' belongings separate, seal loose items in suitable boxes and include every collection or delivery address when requesting the quote.",
      },
      {
        title: "Arrange storage access in advance",
        body: "For a storage transfer, book your storage space separately and confirm the opening hours, unit floor, loading entrance and how the collector can gain access. A later collection from storage needs its own agreed date and transport arrangements.",
      },
    ],
  },
  "long-distance-removals": {
    suitableFor:
      "Choose long-distance removals for a move within Scotland or from Scotland to anywhere in Britain, including England and Wales. This can cover a home, flat, student belongings or furniture. Provide the actual collection and destination addresses so both ends of the move can be planned.",
    vehicleAndCrew:
      "The vehicle must suit the whole agreed load, while the crew must be suitable for access at both properties. A direct van journey can be quoted where appropriate. Discuss additional stops, remote access and any route restrictions before the schedule is agreed.",
    pricing:
      "A longer journey is quoted using route distance in miles, vehicle and crew requirements, loading and unloading time and agreed extras. Fixed quotes apply to the stated route and inventory. For a move from Scotland to England or Wales, include all destination access and timing details in the same enquiry.",
    notIncluded: [
      "Ferry fares, crossings or overnight arrangements unless included in the agreed route and quote.",
      "Overnight storage, additional stops or onward deliveries unless agreed.",
      "Packing, assembly or specialist handling unless included in the quote.",
    ],
    preparation: [
      {
        title: "Coordinate both addresses",
        body: "Confirm key availability and nominate a contact at collection and delivery. Share opening hours, building access windows and any unavoidable arrival deadline.",
      },
      {
        title: "Describe the complete route",
        body: "Include storage stops and any narrow lane, height restriction or difficult turning area. Do not assume the van can use the same access as a car.",
      },
      {
        title: "Pack for the journey",
        body: "Use sound boxes, fill empty space around fragile items and label anything that must stay upright. Keep essential documents and personal items with you.",
      },
    ],
  },
};

export const SERVICE_BOOKING_STEPS = [
  {
    title: "Describe your move",
    body: "Start a quote with collection and destination details, your inventory and the help you need. Add stairs, parking, large items and any extra stops.",
  },
  {
    title: "Choose a date and review the quote",
    body: "Check the available options, price and included work. For unusual access or specialist items, contact the team before confirming.",
  },
  {
    title: "Confirm and prepare",
    body: "Complete the booking and keep the confirmation details. If the items, addresses or access change, contact the team so the plan and price can be reviewed.",
  },
];
