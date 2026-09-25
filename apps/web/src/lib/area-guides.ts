import type { ServiceFaq } from "@/lib/services";

interface AreaGuideService {
  slug: string;
  description: string;
}

interface AreaGuideSection {
  id: string;
  title: string;
  paragraphs: string[];
  checklist?: string[];
  reference?: { href: string; label: string };
}

export interface AreaGuide {
  metadataTitle: string;
  introduction: string;
  services: AreaGuideService[];
  sections: AreaGuideSection[];
  bookingSteps: { title: string; description: string }[];
  faqs: ServiceFaq[];
}

const AREA_GUIDES: Record<string, AreaGuide> = {
  edinburgh: {
    metadataTitle: "Man and Van Edinburgh | Flat, Student & Home Moves",
    introduction:
      "Choose a man and van in Edinburgh for a smaller load or furniture collection, or plan a removal around the contents of your home. An Old Town stair, a New Town basement and a managed Leith apartment need different access details. Start with the service that fits your belongings, then include the floors, loading point and handover window in your quote.",
    services: [
      { slug: "man-and-van", description: "Boxes, single-room loads and collections. List every item and stop, and explain the lifting help and access needed at both addresses." },
      { slug: "flat-removals", description: "Tenement, basement and apartment moves. Measure stair turns, shared entrances and lifts against the largest furniture before agreeing the handling." },
      { slug: "student-move", description: "Halls, shared flats and end-of-tenancy moves. Plan around room access, key collection and any separately arranged storage transfer." },
      { slug: "furniture-delivery", description: "Sofas, beds and other furniture from a shop or private seller. Confirm measurements, collection readiness and who can receive the delivery." },
      { slug: "house-removal", description: "A complete home move, including loft, garage and garden belongings. Include key handover and any packing or dismantling in the enquiry." },
      { slug: "office-removal", description: "Desks, chairs, files and office equipment. Check building access, booked loading slots and the order in which workspaces need to reopen." },
      { slug: "packing-service", description: "Packing help and materials for the rooms or items you specify. Identify fragile belongings and agree what will be packed before the move." },
      { slug: "long-distance-removals", description: "Moves starting in Edinburgh and continuing across Britain. Give the full destination, receiving arrangements and complete load for a route-specific quote." },
    ],
    sections: [
      {
        id: "flat-access",
        title: "Edinburgh flat removals: check the whole carrying route",
        paragraphs: [
          "For an Old Town or New Town flat, measure the route from the room to the street, including internal steps, shared stair turns, basement entrances and the close door. Record the dimensions of a sofa, mattress or wardrobe before deciding whether it can travel assembled. The floor number alone does not describe the work.",
          "At a Leith apartment or another managed building, check lift dimensions and any moving slot with the building manager. Give the distance from a lawful loading point to the entrance and arrange entry at both properties. Discuss awkward or heavy items before confirming the crew and handling method.",
        ],
        checklist: [
          "Collection and delivery floors, including internal stairs or basement steps.",
          "Largest item dimensions, tight turns and any agreed dismantling.",
          "Building entry, lift booking and the walk between the van and the door.",
        ],
      },
      {
        id: "student-moves",
        title: "Student removals between Edinburgh halls, flats and home",
        paragraphs: [
          "Use your actual residence instructions to confirm the room address, key collection and delivery window. When leaving University of Edinburgh accommodation, check the moving-out guidance and your property's arrangements for clearing the room and returning keys. Keep packing and the removal collection separate from the final room check.",
          "Count your boxes, suitcases and furniture separately from your housemates' belongings. If several students want to move together, supply each collection and delivery address and a combined inventory. The route, available capacity and access need to be assessed before a shared move can be confirmed.",
        ],
        reference: { href: "https://www.accom.ed.ac.uk/living-with-us/moving-out", label: "University of Edinburgh moving-out guidance" },
      },
      {
        id: "parking",
        title: "Loading and parking for an Edinburgh removal van",
        paragraphs: [
          "Check the street restrictions at both addresses before choosing the collection window. Edinburgh Council treats a parking dispensation and a suspended parking bay as different arrangements. Use the council's current guidance to establish which application, notice period and charge apply to the actual loading location.",
          "Agree who will arrange any required permission and include it in the move details. A resident permit or an empty space does not reserve a loading point for the van. Tell us if a street restriction or building loading bay means the crew must carry items farther than the front door.",
        ],
        reference: { href: "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions", label: "Edinburgh Council parking dispensations and suspensions" },
      },
      {
        id: "storage-transfers",
        title: "A tenancy gap or a collection from storage",
        paragraphs: [
          "A move into storage needs the facility address, access hours, unit location and loading arrangements as well as your home address. Arrange the storage space separately and check that it is ready to receive your belongings. A transport quote does not by itself reserve a storage unit.",
          "If you need delivery to a new flat later, give both dates and explain which items travel on each trip. Keep documents, medicines and essentials with you, and label the stored boxes by room so the later collection can be planned from a clear inventory.",
        ],
      },
      {
        id: "quote",
        title: "How much does a man and van in Edinburgh cost?",
        paragraphs: [
          "The quote needs your load, both addresses, date and access. Compare the work included rather than the driving distance alone: a small student load with a lift can involve different handling from a sofa carried down several flights of stairs. Include every stop and any waiting for keys.",
          "Ask whether the price is fixed or hourly, whether a minimum applies and what loading, unloading and travel are included. Confirm packing materials, dismantling, reassembly and parking costs where relevant. Review the complete scope and available slot before booking.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Short-notice furniture collections and onward moves",
        paragraphs: [
          "For an urgent Edinburgh collection, give the seller's window, item dimensions, both addresses and access details together. Call to check options before promising a collection time to the seller. Same-day work depends on a suitable vehicle, crew and slot being confirmed.",
          "For a move to Glasgow, Aberdeen, Inverness or a destination elsewhere in Britain, include receiving access and the delivery window. Explain any storage stop or key collection so the loading, journey and unloading can be considered together.",
        ],
      },
    ],
    bookingSteps: [
      { title: "List the belongings and stops", description: "Count boxes, add bulky-item measurements and provide both addresses plus any seller or storage collection." },
      { title: "Confirm access and timing", description: "Check floors, stair turns, lifts, parking and the room or key handover window at each property." },
      { title: "Review the complete quote", description: "Confirm the included work, total, available slot and any separate storage or parking arrangements before booking." },
    ],
    faqs: [
      { question: "Can I book a small student removal in Edinburgh?", answer: "Request a quote with your boxes, suitcases and furniture, both addresses, floors and preferred date. Include residence access and key collection times so loading and delivery can be assessed together." },
      { question: "Can a student move include transport to storage?", answer: "Include the storage facility, access hours and inventory in the enquiry. Storage space must be arranged separately. If a later collection is needed, provide that date and destination too." },
      { question: "Can you move furniture from an Edinburgh flat without a lift?", answer: "Give the number of flights, stair turns, entrance dimensions and size of the largest items. The handling and crew need to be assessed, including any dismantling, before the move is confirmed." },
      { question: "Who arranges parking for the removal van?", answer: "Agree this when planning the job. Check Edinburgh Council's current guidance for any dispensation or bay suspension required at your address; permission and parking charges are not automatically included in a quote." },
      { question: "Can I share a move with another student?", answer: "Provide everyone's belongings, stops and access windows in one enquiry. A shared move depends on compatible timings, the route and vehicle capacity; it is not automatically cheaper or available." },
      { question: "Can I move from Edinburgh to another city?", answer: "Request a quote using the full destination address, inventory and date. Include the receiving floor, loading access and key arrangements, including any additional stop on the journey." },
    ],
  },
  glasgow: {
    metadataTitle: "Man and Van Glasgow | Furniture & Home Moves",
    introduction:
      "Choose a Glasgow man and van for a furniture collection or smaller load, or use a removal service for a complete home or office. The useful starting point is your inventory and access: a short trip across the city can still involve several flights of tenement stairs. Select a service below for local planning advice before requesting your quote.",
    services: [
      { slug: "man-and-van", description: "Boxes, storage collections and manageable loads. Explain whether you need lifting help and list every collection and delivery stop." },
      { slug: "furniture-delivery", description: "Sofas, beds and other furniture collected from a seller or shop. Confirm dimensions, readiness and the route through both properties." },
      { slug: "house-removal", description: "A complete home move, including rooms, loft storage and garden items. Plan the vehicle and crew around the full inventory and key handover." },
      { slug: "flat-removals", description: "Tenement, apartment and studio moves. Share floor numbers, stair turns, lift limits and the carrying distance from a lawful loading point." },
      { slug: "office-removal", description: "Desks, chairs, boxed files and office equipment. Agree building access, loading slots and any dismantling before moving day." },
      { slug: "student-move", description: "Student rooms, shared flats and storage stops. Separate your belongings and check collection arrangements with halls or the property manager." },
      { slug: "packing-service", description: "Ask for the packing help and materials your move needs. Identify fragile items and agree which rooms or furniture are included." },
      { slug: "long-distance-removals", description: "Moves from Glasgow to destinations across Britain. Provide the onward address, receiving arrangements and complete load for a route-specific quote." },
    ],
    sections: [
      {
        id: "tenement-access",
        title: "Moving furniture through a Glasgow tenement",
        paragraphs: [
          "For a West End or Southside flat, describe the whole carrying route: the room, flat door, stair landings, shared close and pavement. Measure the largest item against the tightest turn, including any half-landing. A sofa that fits through the front door may still need dismantling to clear the stairs.",
          "Give the floor at collection and delivery, and explain whether a usable lift is available. Photos can help describe awkward access when discussing the quote. Keep communal routes clear and agree any dismantling and reassembly before the move; specialist lifting should be assessed separately.",
        ],
        checklist: [
          "List bulky items with dimensions and any removable legs or sections.",
          "Describe the stair flights, landing turns and distance to the van.",
          "Tell us about entry arrangements and any building access window.",
        ],
      },
      {
        id: "parking",
        title: "Plan the loading point before moving day",
        paragraphs: [
          "Identify where a van can lawfully load at each address. A nearby parking space and permission to use it are separate questions. Check street signs and building arrangements, and tell us if the carrying route crosses a busy pavement or requires a long walk from the entrance.",
          "If you need a parking dispensation or a bay suspension, consult Glasgow City Council's current application guidance before choosing the collection time. Do not assume a resident permit reserves a bay for the removal vehicle. Include any agreed parking arrangements when confirming the job.",
        ],
        reference: { href: "https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension", label: "Glasgow City Council parking dispensation and suspension guidance" },
      },
      {
        id: "city-centre",
        title: "City-centre access and the Low Emission Zone",
        paragraphs: [
          "Share the full collection and delivery addresses so vehicle access can be checked against the city-centre Low Emission Zone and any street restrictions. Check the council's current guidance for the zone and vehicle requirements; the route and assigned vehicle need to suit the actual move.",
          "For an office or managed apartment building, ask the building manager about loading bays, goods lifts and booked access slots. Include security check-in arrangements and the time by which the loading area must be clear.",
        ],
        reference: { href: "https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information", label: "Glasgow City Council Low Emission Zone guidance" },
      },
      {
        id: "furniture-collection",
        title: "Collecting a sofa or furniture from a Glasgow seller",
        paragraphs: [
          "Agree the seller's collection window and check that the furniture is ready to release. Include all pieces in the enquiry: sofa sections, dining chairs, bed parts and any loose glass. Confirm whether an item will already be dismantled or whether you need that work assessed.",
          "Check access at the destination before committing to collection. Give the receiving floor and the item's dimensions, and arrange for someone to provide access. Any extra storage stop or change of address belongs in the quote.",
        ],
      },
      {
        id: "quote",
        title: "How much does a man and van in Glasgow cost?",
        paragraphs: [
          "Request a price for the complete job: items, route in miles, crew, stairs, carrying distance and preferred date. A ground-floor furniture collection and an upper-floor flat move may need different handling even when the drive is the same length.",
          "Check whether the quote is hourly or fixed, any minimum charge, and what loading, unloading and travel it includes. Ask separately about packing materials, dismantling, reassembly, waiting for keys and parking costs. Confirm the scope and total before booking.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Short-notice and onward moves from Glasgow",
        paragraphs: [
          "For an urgent collection, give both addresses, the full item list and the latest handover time together. Call to check the available options. Same-day or next-day work depends on a suitable vehicle, crew and time slot; an enquiry is not a confirmed booking.",
          "For a Glasgow-to-Edinburgh journey or a longer move into England or Wales, include the destination access and receiving arrangements. Add storage stops and key collection windows so loading, travel and delivery can be planned together.",
        ],
      },
    ],
    bookingSteps: [
      { title: "Describe the load and route", description: "Enter both addresses, your preferred date and the complete inventory, including awkward furniture and extra stops." },
      { title: "Explain access at both ends", description: "Include floors, stair turns, lift dimensions and loading arrangements so the vehicle, crew and work can be assessed." },
      { title: "Review and confirm", description: "Check the price, available slot and included tasks before arranging sellers, keys or building access around the move." },
    ],
    faqs: [
      { question: "Can I book a man and van for one item in Glasgow?", answer: "Request a quote with the item dimensions, collection and delivery addresses, floors and available collection window. One large item can still need two people or dismantling, so include the access details as well as the furniture." },
      { question: "Can you move furniture from a Glasgow tenement without a lift?", answer: "Describe both staircases, the floor numbers and the largest item. Tight turns and heavy pieces need assessment before the crew and handling are agreed. Do not assume an item will fit without checking the carrying route." },
      { question: "Do I need to arrange parking for a removal van?", answer: "Check the actual loading location at both addresses. Tell us about restrictions and any building-managed loading bay. Where a dispensation or suspension is needed, check the council's current requirements and confirm the arrangements before moving day." },
      { question: "Can a Glasgow student move include a storage stop?", answer: "Include the storage address, opening hours and access arrangements in the quote request. List what is collected at each stop and separate your belongings from those of housemates so the combined load is clear." },
      { question: "Is a same-day man and van in Glasgow guaranteed?", answer: "No. Call with the addresses, inventory, access and required collection window to check short-notice availability. The vehicle, crew and time slot must be confirmed before you make dependent arrangements." },
      { question: "Can I move from Glasgow to another UK city?", answer: "You can request a quote for a move originating in Glasgow to a destination across Britain. Provide the destination postcode, full inventory, date and access at both properties. Collection and delivery arrangements are confirmed for the particular route and load." },
    ],
  },
  aberdeen: {
    metadataTitle: "Man and Van Aberdeen | Get a Moving Quote",
    introduction:
      "Hire a man with a van in Aberdeen for a furniture collection or smaller load, or plan a house, flat or office removal around the full inventory. From a sofa bought from a seller to the contents of a shared home, start with the service below and request a price for your items, route and lifting help.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For manageable loads and flexible collections. Tell us what needs lifting, whether you can help and where the van can stop so the quote allows for the right support.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Furniture collection and delivery for sofas, tables, chairs, beds and wardrobes. Share measurements, the seller's collection window and the destination floor so the lifting and access can be planned.",
      },
      {
        slug: "house-removal",
        description:
          "For a full-house move, list every room and any garage or garden items. Include key collection times and the unloading plan before agreeing vehicle capacity and crew requirements.",
      },
      {
        slug: "flat-removals",
        description:
          "Apartment and studio moves need more than a floor number. Describe shared entrances, stair turns, lift size and the walk from the building to the loading point.",
      },
      {
        slug: "office-removal",
        description:
          "Plan office or business removals around building access, desks, equipment and the agreed handover. Identify items requiring specialist handling and confirm what packing or dismantling is included.",
      },
      {
        slug: "small-moves",
        description:
          "A few boxes, bedroom furniture or a storage collection can be quoted as a smaller load. Include every stop and bulky item so the planned capacity is realistic.",
      },
      {
        slug: "long-distance-removals",
        description:
          "For a move to or from Aberdeen, provide the full route and delivery window. Availability beyond the city depends on the addresses, load and date being assessed.",
      },
      {
        slug: "student-move",
        description:
          "Moving between halls, a shared flat and home? List boxes and furniture separately, check the residence loading arrangements and agree collection around your room handover.",
      },
    ],
    sections: [
      {
        id: "moving-costs",
        title: "Planning a lower-cost man and van move in Aberdeen",
        paragraphs: [
          "For a smaller Aberdeen flat move, list only the items travelling with you and have boxes packed before the agreed collection. Separate your belongings from a housemate's and check whether a bed or table can be prepared in advance. These details help plan the load and time needed.",
          "If your date or seller's collection window is flexible, include the options in your quote request. Choose lifting help around the furniture and stairs: reducing the crew is not a useful saving if the load cannot be moved safely.",
        ],
      },
      {
        id: "furniture-collection",
        title: "Furniture movers in Aberdeen: sofas, tables, chairs and beds",
        paragraphs: [
          "Buying a sofa from a private seller or collecting a dining set from a shop? Agree when the items will be ready and send a complete list, including matching chairs, cushions or bed parts. For an upper-floor delivery, measure the largest piece against the shared entrance and stair turns before arranging collection.",
          "Tell us whether the seller can dismantle an item or whether you need that work included in the enquiry. Keep fixings with the furniture and identify fragile glass or loose panels so handling can be planned.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Need an urgent man and van in Aberdeen?",
        paragraphs: [
          "For a short-notice flat move or a seller who needs furniture collected soon, send both addresses, the item list and the latest collection time together. Include the floor and loading point so the enquiry can be assessed without missing access details.",
          "Call to discuss the deadline if it is urgent. Same-day or next-day moves depend on a suitable vehicle, crew and slot being available; confirm the collection before promising a handover time.",
        ],
      },
      {
        id: "long-distance",
        title: "Long-distance man and van from Aberdeen",
        paragraphs: [
          "A load leaving Aberdeen for another Scottish city or a destination in England or Wales needs a plan for arrival as well as departure. We accept Scotland-origin moves across Britain. Provide the destination postcode, key handover time and any final stop at storage. Furniture and boxes for different stops should be identified in the inventory.",
          "For a flat-to-flat journey, share the stairs or lift details at both ends. Ask for the complete route and handling to be included in the quote, then agree the available collection and delivery window.",
        ],
      },
      {
        id: "access",
        title: "Parking, shared stairs and access in Aberdeen",
        paragraphs: [
          "Check the collection street and the destination before requesting a quote. A space near the entrance can change, and a residents' permit does not reserve a bay or override parking restrictions. Read the signs for the actual loading point and tell us about any building arrangements.",
          "Measure awkward furniture against doorways and stair turns. For a flat above ground level, give the floor, whether the lift is suitable and the approximate carry distance. Office premises may also require loading-bay access to be arranged with building management.",
        ],
        checklist: [
          "Share access details for both addresses, including entry codes when arranging the move.",
          "Flag restricted loading times, long carries and any change of floor.",
          "Confirm any parking permission with the council or property manager responsible.",
        ],
        reference: {
          href: "https://sites.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/residential-parking-permits",
          label: "Aberdeen City Council parking permit guidance",
        },
      },
      {
        id: "quote",
        title: "What your Aberdeen moving quote needs to cover",
        paragraphs: [
          "The useful comparison is the price for your complete job: load, route in miles, crew, time and access. Ask which vehicle and lifting support suit the inventory, whether the quote is hourly or fixed, and whether a minimum charge applies.",
          "Confirm collection, loading, transport and unloading in the agreed scope. Ask separately about packing materials, dismantling, reassembly, waiting, extra stops and parking costs. Disposal, appliance disconnection and specialist lifting should not be assumed to be part of a standard move. Agree any extra work before booking.",
        ],
      },
    ],
    bookingSteps: [
      {
        title: "Describe the move",
        description:
          "Enter both addresses, your preferred date and a complete item list, including heavy or awkward pieces.",
      },
      {
        title: "Check the scope",
        description:
          "Explain stairs, parking and collection deadlines. Review the proposed crew, vehicle, price and any additional work.",
      },
      {
        title: "Confirm the arrangements",
        description:
          "Agree the available slot and booking details before coordinating keys, sellers or building access.",
      },
    ],
    faqs: [
      {
        question: "Can I book a man and van for one item in Aberdeen?",
        answer:
          "Request a quote with the item dimensions, both addresses and any stairs. A single large sofa can require more lifting support than several boxes, so describe the access as well as the load.",
      },
      {
        question: "Can you quote for Aberdeen to another city?",
        answer:
          "Yes, you can request an intercity quote. Give the destination postcode, full inventory and required delivery date. The route and available capacity need confirmation before you rely on a particular slot.",
      },
      {
        question: "How much does a man and van in Aberdeen cost?",
        answer:
          "Request a price using your full item list, both addresses and access details. The load, journey, lifting help and handling time affect the quote. Compare the included work and ask whether the price is hourly or fixed and whether a minimum charge applies.",
      },
      {
        question: "Can I request an urgent or same-day Aberdeen collection?",
        answer:
          "Yes, send the item list, addresses and latest collection time, or call to discuss a short-notice enquiry. Same-day availability is not guaranteed. A suitable slot, vehicle and lifting help must be confirmed before the collection is booked.",
      },
    ],
  },
  inverness: {
    metadataTitle: "Man and Van Inverness | Get a Moving Quote",
    introduction:
      "Looking for a man with a van in Inverness? Request a quote for a furniture collection, student room, flat or full-house removal. Choose the service for your load and describe the complete journey, including any onward Highland address. Whether you need a van and man for a few items or more lifting help for a home move, the plan starts with your inventory.",
    services: [
      {
        slug: "man-and-van",
        description:
          "For smaller loads and individual collections, provide an item list and the full route. Ask what loading help is included and which crew arrangement suits your access.",
      },
      {
        slug: "furniture-delivery",
        description:
          "Collect sofas, tables, chairs and beds from a seller or shop in Inverness. Include every piece, its measurements and the delivery address, with any gate, narrow entrance or staircase on the way in.",
      },
      {
        slug: "house-removal",
        description:
          "For a whole-home move, include cupboards, outdoor items and storage spaces in the inventory. Discuss the required capacity, crew and key handover before settling the schedule.",
      },
      {
        slug: "flat-removals",
        description:
          "Studios and apartments need a clear access plan. Give both floor numbers, lift details and the distance from a suitable loading point to each entrance.",
      },
      {
        slug: "office-removal",
        description:
          "For an office or small business relocation, list desks, boxed records and equipment. Agree access times and label destination rooms to make the planned unloading clear.",
      },
      {
        slug: "small-moves",
        description:
          "A room's contents, a storage transfer or several bulky items need a realistic load estimate. Mention additional stops and any furniture that cannot travel fully assembled.",
      },
      {
        slug: "long-distance-removals",
        description:
          "For a longer journey to or from Inverness, request assessment of the full route. Include the destination access and delivery deadline rather than estimating the job from mileage alone.",
      },
      {
        slug: "student-move",
        description:
          "Leaving halls or moving into a shared flat? Check room handover and vehicle access with the accommodation provider, then list boxes, bedding and any furniture needing transport.",
      },
    ],
    sections: [
      {
        id: "moving-costs",
        title: "Keep your Inverness man and van costs under control",
        paragraphs: [
          "When comparing low-cost man and van quotes, use an accurate load rather than a rough count of rooms. Group boxes by destination and include furniture from sheds or storage before requesting a quote. If a shop collection and a home collection are part of the same move, list both stops together.",
          "For a delivery beyond Inverness, confirm that someone can receive the items and open any gate when the van arrives. Good preparation helps avoid a preventable wait or an extra journey; ask what any change to the agreed route would cost.",
        ],
      },
      {
        id: "furniture-collection",
        title: "Furniture collection and delivery in Inverness",
        paragraphs: [
          "Use a furniture moving quote for a single sofa, a dining table and chairs, a bed or several larger pieces. Check the seller's collection arrangements, measure assembled items and explain where each piece will go at delivery. A mattress and a dismantled bed frame should both appear on the list.",
          "For delivery from Inverness to a rural property, include the entrance, turning space and distance to the door. Ask about dismantling or reassembly when requesting the quote so the planned work matches the furniture.",
        ],
      },
      {
        id: "urgent-moves",
        title: "Urgent man and van enquiries in Inverness",
        paragraphs: [
          "Need to leave a room at short notice or collect furniture before a seller's deadline? Give the earliest and latest collection times, the complete load and the delivery address. A city collection with an onward rural journey needs enough time for both parts.",
          "Call to discuss an urgent request and whether an alternative time could work. Same-day and next-day slots are subject to availability; confirm the route, crew and collection before finalising other arrangements.",
        ],
      },
      {
        id: "long-distance",
        title: "Long-distance man and van to or from Inverness",
        paragraphs: [
          "For a longer Highland journey or a move from Inverness to England or Wales, give the full destination rather than a broad area name. We accept moves from Scotland to destinations across Britain. Include the number of stops, when the property will be accessible and whether delivery must fit around keys or a storage facility's opening times.",
          "Describe any narrow approach, vehicle-size limit or restricted turning space before the vehicle is selected. Route suitability and the available date are assessed together, with the quote based on the full load and journey in miles.",
        ],
      },
      {
        id: "access",
        title: "Plan Inverness loading and Highland access",
        paragraphs: [
          "For an Inverness loading point, check the signs rather than treating an empty bay as unrestricted parking. Highland Council explains that loading bays can specify operating times and vehicle types; they are for active loading and unloading. Tell us where the van can lawfully stop and how far items must be carried.",
          "If either address is outside the city, describe narrow approaches, gates, steep driveways, turning space and any limit on vehicle size. Supply the exact destination and a contact for access. A city collection does not by itself confirm that every onward Highland route or requested date is available.",
        ],
        checklist: [
          "Measure doors and stair turns for sofas, wardrobes and other awkward items.",
          "Report every floor, lift restriction and long carry at both properties.",
          "Check loading permissions and any timed access with the relevant property manager.",
        ],
        reference: {
          href: "https://www.highland.gov.uk/parking-fines-enforcement/good-parking-guidance/5",
          label: "Highland Council loading-bay guidance",
        },
      },
      {
        id: "quote",
        title: "Compare the full Inverness removal quote",
        paragraphs: [
          "Your inventory, distance in miles, access and handling time help determine the quote. Ask whether the proposed vehicle has suitable capacity, how much lifting help is included and whether the price is hourly or fixed. Confirm any minimum charge before comparing offers.",
          "Check that the agreed scope describes collection, loading, transport and unloading. Packing, dismantling, reassembly, waiting, parking and extra collection points may need separate agreement. Do not assume disposal, appliance disconnection or specialist handling is included. Tell us about unusually heavy or fragile items while the move is being assessed.",
        ],
      },
    ],
    bookingSteps: [
      {
        title: "Share both addresses",
        description:
          "Start with the collection, destination, preferred date and inventory, including anything kept outside the main rooms.",
      },
      {
        title: "Explain the access",
        description:
          "Add stairs, loading restrictions and rural approach details so the vehicle, crew and route can be assessed.",
      },
      {
        title: "Agree the move",
        description:
          "Review the price and included work, then confirm the available date before finalising collection and handover arrangements.",
      },
    ],
    faqs: [
      {
        question: "Can I request a furniture collection in Inverness?",
        answer:
          "Yes. Include the seller's collection address, agreed collection window, item dimensions and destination access. Ask about dismantling and lifting support before paying for an item that may be difficult to move.",
      },
      {
        question: "Do you assess moves beyond Inverness into the Highlands?",
        answer:
          "Provide the exact addresses and proposed date for assessment. Rural access, journey length, load and capacity affect what can be arranged. Confirm the route and slot before making dependent travel or handover plans.",
      },
      {
        question: "Can I request a same-day man and van in Inverness?",
        answer:
          "You can enquire about a short-notice move with your addresses, items and required collection window. Call if the deadline is urgent. Same-day service depends on a suitable slot and crew being available, including enough time for any onward journey.",
      },
      {
        question: "What affects the price of a man and van in Inverness?",
        answer:
          "The full route, load, lifting help and access affect the quote. An onward rural delivery, extra stop or long carry can change the work even with only a few items. Include these details and check the minimum charge, included time and any separately agreed packing or assembly.",
      },
    ],
  },
};

export function getAreaGuide(slug: string): AreaGuide | undefined {
  return Object.prototype.hasOwnProperty.call(AREA_GUIDES, slug)
    ? AREA_GUIDES[slug]
    : undefined;
}
