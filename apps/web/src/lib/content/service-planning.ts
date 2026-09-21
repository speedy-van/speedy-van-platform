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
      "Office removals suit desks, chairs, filing cabinets and boxed business equipment moving to another workplace. Commercial relocation enquiries can also cover studios, shops and suitable stock; specialist machinery or regulated goods need assessment before acceptance.",
    vehicleAndCrew:
      "Send the inventory, equipment dimensions and both building access arrangements. The loading bay, goods lift, floor plan and permitted moving hours help determine crew and vehicle needs. Tell us about heavy cabinets or equipment that cannot use the normal access route.",
    pricing:
      "A business removal quote depends on the furniture and equipment, route, crew time, access windows and agreed packing or dismantling. Evening or weekend work is subject to availability. Include staged moves and extra premises in the scope before confirmation.",
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
  "long-distance-removals": {
    suitableFor:
      "Choose long-distance removals when your home, flat, student belongings or furniture are travelling between Scottish towns and cities. Provide the actual collection and destination addresses so both ends of the move can be assessed.",
    vehicleAndCrew:
      "The vehicle must suit the whole agreed load, while the crew must be suitable for access at both properties. A direct van journey can be quoted where appropriate. Discuss additional stops, remote access and any route restrictions before the schedule is agreed.",
    pricing:
      "A longer journey is quoted using route distance in miles, vehicle and crew requirements, loading and unloading time and agreed extras. Fixed quotes apply to the stated route and inventory. Routes outside Scotland need separate confirmation before booking.",
    notIncluded: [
      "Routes outside Scotland or involving ferries unless separately confirmed.",
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
