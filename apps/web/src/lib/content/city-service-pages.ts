export interface LocalServicePage {
  areaSlug: string;
  serviceSlug: string;
  title: string;
  description: string;
  introduction: string;
  sections: { title: string; body: string; source?: { label: string; href: string } }[];
  faqs: { question: string; answer: string }[];
}

// Authored, reviewed entries only: do not generate city/service combinations.
export const LOCAL_SERVICE_PAGES: LocalServicePage[] = [
  {
    "areaSlug": "glasgow",
    "serviceSlug": "house-removal",
    "title": "House removals in Glasgow",
    "description": "Plan a Glasgow house move around the full inventory, loading access, key handover and delivery address anywhere in Britain.",
    "introduction": "Moving a whole household from Glasgow needs an inventory that includes the spaces beyond the bedrooms. Record loft boxes, garden furniture and garage contents alongside the rooms you use daily, then match the loading plan to the actual entrance.",
    "sections": [
      {
        "title": "Make the loading space part of the move",
        "body": "Glasgow Council provides parking suspension and dispensation applications. Check which arrangement suits the collection address before fixing the loading sequence. A driveway should be measured with household cars removed; for a street collection, note where the van could stand and the distance from the front door.",
        "source": {
          "label": "Glasgow parking suspensions and dispensations",
          "href": "https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension"
        }
      },
      {
        "title": "Describe the house and any shared approach",
        "body": "If the move includes a Glasgow tenement or a house reached through a shared close, record every door and flight between the room and the street. Photograph awkward turns with the largest sofa or wardrobe dimensions to hand. Keep neighbour access clear while each room is emptied.",
        "source": {
          "label": "Glasgow common property guidance",
          "href": "https://www.glasgow.gov.uk/article/3523/Common-Property-Repairs-and-Maintenance"
        }
      },
      {
        "title": "Separate loading readiness from key release",
        "body": "Agree which possessions must remain accessible until the keys change hands. Label the first-night bedding and kitchen essentials for early unloading, and provide a receiving contact if the destination is elsewhere in Britain. Tell us about uncertain completion times before assuming the van can unload immediately."
      }
    ],
    "faqs": [
      {
        "question": "Does a Glasgow house quote cover the garage automatically?",
        "answer": "List its contents separately, including shelving, tools and bulky outdoor items. Bedroom count alone does not describe those loads or any extra handling they need."
      },
      {
        "question": "Can the move finish outside Scotland?",
        "answer": "Yes, collection can start at your Glasgow home and delivery can be elsewhere in Britain. Supply the destination access and key arrangements with the inventory."
      }
    ]
  },
  {
    "areaSlug": "glasgow",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Glasgow",
    "description": "Prepare a Glasgow flat move with close and stair measurements, lift arrangements, shared access and an accurate room inventory.",
    "introduction": "A Glasgow flat removal starts at the shared entrance, not at the flat door. Floor level, stair turns and the route through the close can change how furniture needs to be handled even when the two addresses are nearby.",
    "sections": [
      {
        "title": "Measure the complete route through the close",
        "body": "Glasgow Council identifies closes and stairs among common tenement elements. For your move, measure the narrowest doorway, landing turn and any internal stair. A short video from street to room can explain the route better than a floor number; identify fragile glazing and handrails that need protecting.",
        "source": {
          "label": "Glasgow common property guidance",
          "href": "https://www.glasgow.gov.uk/article/3523/Common-Property-Repairs-and-Maintenance"
        }
      },
      {
        "title": "Coordinate the building before reserving the van",
        "body": "Ask the factor or building manager whether a goods lift must be booked, whether its doors and cabin fit the largest item, and how entry will be provided. If the flat is in the city-centre LEZ, the vehicle approach also needs checking; lift access and road access are separate questions.",
        "source": {
          "label": "Glasgow LEZ information",
          "href": "https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information"
        }
      },
      {
        "title": "Keep the stair usable while rooms are cleared",
        "body": "Pack and label inside the flat rather than stacking boxes on landings. Put dismantled bed fittings in a labelled bag and keep them with the corresponding frame. Tell us which items cannot be dismantled and whether the receiving flat has a different stair or lift arrangement."
      }
    ],
    "faqs": [
      {
        "question": "Is the floor number enough for my Glasgow flat quote?",
        "answer": "No. Include the number of flights, turns, lift availability and distance from a lawful loading point. A mezzanine or split-level room adds handling within the flat."
      },
      {
        "question": "Can you work around a shared entry system?",
        "answer": "Provide the buzzer details and arrange for someone to open the building during loading. Discuss any caretaker or factor restrictions before confirming the move."
      }
    ]
  },
  {
    "areaSlug": "glasgow",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Glasgow",
    "description": "Arrange Glasgow furniture collection with item dimensions, seller handover, close measurements and the receiving room clearly described.",
    "introduction": "Collecting a sofa or dining set in Glasgow is a different job from moving a full home. The important details are the exact pieces, whether they are assembled, and how they will pass through both buildings.",
    "sections": [
      {
        "title": "Check the seller’s item against your entrance",
        "body": "Obtain width, height and depth before agreeing collection. For a tenement delivery, compare those measurements with the shared close and stair turns as well as your own door. Photographs should show the legs, arms and detachable sections; do not assume a sofa will separate because similar models do.",
        "source": {
          "label": "Glasgow common property guidance",
          "href": "https://www.glasgow.gov.uk/article/3523/Common-Property-Repairs-and-Maintenance"
        }
      },
      {
        "title": "Identify the collection point precisely",
        "body": "A shop loading entrance may differ from its public entrance. For a private sale, confirm the seller will be present and whether the item is upstairs. City-centre collection routes need the Glasgow LEZ checked against the actual access street, even when the journey within Glasgow is short.",
        "source": {
          "label": "Glasgow LEZ information",
          "href": "https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information"
        }
      },
      {
        "title": "Agree what delivery includes",
        "body": "State whether the furniture needs dismantling, carrying upstairs or positioning in a particular room. Describe glass panels and loose shelves individually. Removal of an old item, assembly and disposal are separate requirements to discuss; they should not be assumed from a request to transport the new furniture."
      }
    ],
    "faqs": [
      {
        "question": "Can I give only the online advert for a Glasgow collection?",
        "answer": "Send the advert plus confirmed dimensions, quantity and both access details. Sellers may describe a set without listing every chair or detachable part."
      },
      {
        "question": "What if the sofa is too large for my close?",
        "answer": "Flag that before collection. The entrance and furniture measurements need reviewing; window access or specialist lifting is not automatically included in a delivery."
      }
    ]
  },
  {
    "areaSlug": "glasgow",
    "serviceSlug": "office-removal",
    "title": "Office removals in Glasgow",
    "description": "Plan a Glasgow office relocation with desk inventories, building access, equipment handling and a staged handover for your team.",
    "introduction": "An office move from Glasgow needs a clear handover between the people releasing the equipment and those receiving it. Start with a desk-by-desk list and a floor plan, then agree the building access needed for each stage.",
    "sections": [
      {
        "title": "Separate building permissions from road access",
        "body": "For a city-centre office, check the Glasgow LEZ approach and identify the service entrance with the facilities manager. Confirm goods-lift dimensions, loading-bay bookings and any induction requirement. An employee car-park pass should not be treated as permission to use a delivery bay.",
        "source": {
          "label": "Glasgow LEZ information",
          "href": "https://www.glasgow.gov.uk/article/3982/Glasgow-s-LEZ-Key-Information"
        }
      },
      {
        "title": "Reserve enough space for the actual load",
        "body": "If loading depends on a public street, use Glasgow Council’s suspension or dispensation guidance to establish what must be arranged. Describe the quantity of desks, chairs and storage units before estimating the loading period. Keep a named person available to resolve security and access questions.",
        "source": {
          "label": "Glasgow parking suspensions and dispensations",
          "href": "https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension"
        }
      },
      {
        "title": "Move equipment in a controlled sequence",
        "body": "Label monitors and cables by workstation, identify leased equipment and assign your IT team responsibility for shutdown and reconnection. Keep confidential files in containers controlled by your organisation. Agree which desks move first if staff need to keep working; no downtime guarantee follows from choosing an evening slot."
      }
    ],
    "faqs": [
      {
        "question": "Can our Glasgow office remain partly operational?",
        "answer": "Discuss a staged move with separate inventories and access windows. Your team should identify which workstations and network equipment must remain available until the last stage."
      },
      {
        "question": "Does office transport include reconnecting our IT?",
        "answer": "Do not assume it does. Agree equipment handling separately and have your IT provider plan backups, shutdown, reconnection and testing."
      }
    ]
  },
  {
    "areaSlug": "glasgow",
    "serviceSlug": "student-move",
    "title": "Student moves in Glasgow",
    "description": "Plan a Glasgow student move around residence keys, personal belongings, shared-flat access and the exact collection address.",
    "introduction": "A student move in Glasgow may mean leaving halls, changing a room in a shared flat or taking belongings home elsewhere in Britain. Count your own boxes and furniture first, keeping housemates’ and residence-owned items separate.",
    "sections": [
      {
        "title": "Use the residence instructions for your own building",
        "body": "The University of Glasgow publishes residence-specific arrival and key collection information. Check the instructions for your allocated residence rather than using the main campus as the destination. Keep your key collection time separate from the time at which belongings can enter the room.",
        "source": {
          "label": "University of Glasgow arrival and key collection information",
          "href": "https://www.gla.ac.uk/myglasgow/accommodation/arrivalsessentials/arrivalinformation-keycollection/"
        }
      },
      {
        "title": "Make a room-sized inventory",
        "body": "Count bags, sealed boxes, the desk chair, screens and any bicycle individually. Ask what furniture is already supplied before arranging to move your own bed or desk. For a shared Glasgow flat, include the close, floor and entry arrangements; a small load can still involve several stair trips.",
        "source": {
          "label": "Glasgow common property guidance",
          "href": "https://www.glasgow.gov.uk/article/3523/Common-Property-Repairs-and-Maintenance"
        }
      },
      {
        "title": "Plan the gap between tenancies",
        "body": "Tell us if the old room must be emptied before the new key is available. Storage or a later delivery requires a separate agreed arrangement. Keep medication, identity documents, laptop and the first change of clothes with you so they do not disappear among boxes at handover."
      }
    ],
    "faqs": [
      {
        "question": "Can two Glasgow housemates combine belongings?",
        "answer": "Provide separate labelled inventories and every collection or delivery address. Any additional stop and the total load need to be included when the move is arranged."
      },
      {
        "question": "Will a residence reception accept my boxes?",
        "answer": "Ask the residence directly. A reception address or key desk is not confirmation that staff can take custody of a delivery or store belongings for you."
      }
    ]
  },
  {
    "areaSlug": "glasgow",
    "serviceSlug": "packing-service",
    "title": "Packing help in Glasgow",
    "description": "Prepare for packing help in Glasgow with a room inventory, fragile-item list and a clear plan for closes, stairs and moving-day essentials.",
    "introduction": "Packing support for a Glasgow move should be agreed around what you own and what you want to pack yourself. Identify fragile items, cupboard contents and belongings that must stay accessible before materials and time are planned.",
    "sections": [
      {
        "title": "Leave working space inside the property",
        "body": "Where your Glasgow home uses a shared close, plan an indoor packing area that does not obstruct it. The council’s common-property guidance identifies those shared elements. Keep full boxes away from doors and stairs; arrange room-by-room packing if there is little spare floor space.",
        "source": {
          "label": "Glasgow common property guidance",
          "href": "https://www.glasgow.gov.uk/article/3523/Common-Property-Repairs-and-Maintenance"
        }
      },
      {
        "title": "Pack for the route as well as the item",
        "body": "Tell us about stair turns and whether large furniture must be dismantled before wrapping. Use smaller loads for books and dense kitchenware, and describe mirrors, framed glass and unusually delicate pieces. Mark the destination room on more than one side so labels remain visible after loading."
      },
      {
        "title": "Distinguish the packing visit from loading day",
        "body": "If packing and collection take place on different days, confirm access for both visits. Glasgow’s parking permission process should be checked where either visit requires street access; a moving-day arrangement should not be assumed to cover another date. Keep a clearly marked group of essentials unpacked.",
        "source": {
          "label": "Glasgow parking suspensions and dispensations",
          "href": "https://www.glasgow.gov.uk/article/3801/Apply-for-Dispensation-or-a-Parking-Suspension"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can I request packing only for fragile items in Glasgow?",
        "answer": "Specify the rooms and objects that need help, along with what you will pack yourself. The agreed scope should identify materials and any dismantling separately."
      },
      {
        "question": "Should I seal all boxes before the packing team arrives?",
        "answer": "Seal items you are packing yourself, but keep the agreed packing work accessible. Identify valuable or fragile contents and tell the team which belongings must remain with you."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "house-removal",
    "title": "House removals in Edinburgh",
    "description": "Prepare an Edinburgh house move with a complete room inventory, loading permissions, key timings and delivery access across Britain.",
    "introduction": "For an Edinburgh household move, the address alone does not explain the loading job. A front door on the street, a basement entrance and a home behind a close need different arrangements. Build the move plan around the entrance actually used.",
    "sections": [
      {
        "title": "Choose the right loading arrangement",
        "body": "Edinburgh Council distinguishes dispensations for extended loading from suspensions of parking bays. Describe the collection frontage and likely loading period before deciding what to request. Check the current application requirements early; paying to park nearby does not establish a reserved loading space outside your home.",
        "source": {
          "label": "Edinburgh dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        "title": "Survey the route from every floor",
        "body": "In the Old Town, narrow closes can connect a street to an entrance set farther back. Walk the complete route with furniture dimensions, including any cellar or attic items. Photograph bends and changes of level so the moving plan accounts for the carrying route, not just the number of bedrooms.",
        "source": {
          "label": "Edinburgh World Heritage: Old Town",
          "href": "https://ewh.org.uk/the-old-town/"
        }
      },
      {
        "title": "Prepare for completion-day uncertainty",
        "body": "Keep the solicitor or agent’s key-release contact available and explain any delivery deadline at the next home. For a move from Edinburgh to another part of Britain, identify who will receive the load and whether access depends on a concierge, lift booking or a separate collection of keys."
      }
    ],
    "faqs": [
      {
        "question": "Do basement rooms count in an Edinburgh house inventory?",
        "answer": "Yes. Include their furniture and boxes, plus the steps and entrance used to remove them. A basement item can need a different carrying route from the main house."
      },
      {
        "question": "Can the loading permission cover both Edinburgh addresses?",
        "answer": "Check each location separately with the council. Give the actual addresses and times; permission for one frontage should not be assumed to cover the receiving property."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Edinburgh",
    "description": "Plan an Edinburgh flat removal around closes, stairs, entry systems, furniture measurements and the receiving building.",
    "introduction": "An Edinburgh flat move needs two access descriptions: the route out and the route in. Record the flat’s floor, all intermediate steps and the distance between the lawful loading point and the building entrance before choosing the handling plan.",
    "sections": [
      {
        "title": "Map the close before measuring the flat door",
        "body": "Edinburgh’s Old Town includes narrow wynds and closes. For a flat reached through one, measure turns and changes of level all the way from the street. A wide front door does not solve a tighter passage outside it; show the team where the longest furniture must turn.",
        "source": {
          "label": "Edinburgh World Heritage: Old Town",
          "href": "https://ewh.org.uk/the-old-town/"
        }
      },
      {
        "title": "Coordinate shared stairs and entry",
        "body": "Arrange a reliable person to manage the buzzer and obtain building-specific instructions from the factor or landlord. Keep packed boxes inside the flat until they are carried to the vehicle. If there is a lift, confirm it is available for goods and record its door opening, not just its stated capacity."
      },
      {
        "title": "Match the loading window to the stair work",
        "body": "Edinburgh’s dispensation and suspension guidance includes furniture and home removals. Explain the full stair route when planning the loading period, particularly if furniture needs dismantling indoors. Review the receiving address separately so an unexpectedly smaller lift does not become a delivery-day surprise.",
        "source": {
          "label": "Edinburgh dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      }
    ],
    "faqs": [
      {
        "question": "Do I need to measure a spiral or turning stair?",
        "answer": "Yes. Send photographs and usable widths, landing space and the largest item dimensions. The shape of the stair matters as much as the number of floors."
      },
      {
        "question": "What if the Edinburgh flat has no lift?",
        "answer": "Tell us the floor and all flights in advance, including entrance steps. The inventory and access will determine the handling required; absence of a lift should never be left until arrival."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Edinburgh",
    "description": "Plan Edinburgh furniture collection and delivery with seller confirmation, close measurements, loading access and room placement details.",
    "introduction": "Before collecting furniture in Edinburgh, make sure the item and the receiving property are a practical match. An attractive online listing gives little information about the stair turn, rear entrance or route through a close.",
    "sections": [
      {
        "title": "Check the furniture before paying for transport",
        "body": "Ask the seller for exact assembled dimensions and photographs of removable parts. Measure the intended route into your room. In an Old Town close, include the passage and its turns; deciding where the item can be carried should happen before it is removed from the seller’s property.",
        "source": {
          "label": "Edinburgh World Heritage: Old Town",
          "href": "https://ewh.org.uk/the-old-town/"
        }
      },
      {
        "title": "Give both parties one collection plan",
        "body": "Confirm the seller’s availability, which floor the furniture is on and whether loose cushions, shelves or fittings are included. If extended street loading is necessary, review Edinburgh Council’s permission guidance. Do not tell the seller to leave furniture on the pavement while access remains unresolved.",
        "source": {
          "label": "Edinburgh dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        "title": "Define delivery beyond the front door",
        "body": "State the destination floor and room and identify any assembly you need discussed. Photograph pre-existing marks before handing over a used item. An old sofa or mattress to remove is an additional load with its own destination; it is not automatically part of collecting its replacement."
      }
    ],
    "faqs": [
      {
        "question": "Can a furniture delivery include several Edinburgh sellers?",
        "answer": "List each collection address, seller’s time window and all items. The route and handling need to be agreed for the combined job rather than added during collection."
      },
      {
        "question": "Will the team remove a window if furniture does not fit?",
        "answer": "Window removal and specialist lifting are not routine furniture delivery. Raise access concerns with measurements before collection so a suitable approach can be assessed."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "office-removal",
    "title": "Office removals in Edinburgh",
    "description": "Organise an Edinburgh office move with building permissions, desk and equipment inventories, controlled files and a clear reopening plan.",
    "introduction": "An Edinburgh office relocation needs a practical plan for the building and the business. Record the workstations, meeting rooms and stored material, then identify the people responsible for access, equipment release and receiving the load.",
    "sections": [
      {
        "title": "Find the goods entrance rather than the public reception",
        "body": "For an office within the Old Town’s network of closes, identify the full service route and any steps between the street and suite. Provide photographs of archive-room doors and tight turns for cabinets. A reception postcode is useful for correspondence but may not describe the loading approach.",
        "source": {
          "label": "Edinburgh World Heritage: Old Town",
          "href": "https://ewh.org.uk/the-old-town/"
        }
      },
      {
        "title": "Align street permissions with the building slot",
        "body": "Use Edinburgh’s suspension and dispensation guidance where public-street loading is needed. Confirm the lift and loading-bay appointment with the building manager for the same period. If the organisation prefers an evening move, separately confirm security attendance and access; the booking time does not grant permission.",
        "source": {
          "label": "Edinburgh dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      },
      {
        "title": "Hand over workstations and files systematically",
        "body": "Label each screen, chair and cable box with a destination desk reference. Let your IT provider control backups, shutdown and reconnection. Assign an employee to sensitive records and separate equipment that belongs to a landlord or lease company so it is not loaded accidentally."
      }
    ],
    "faqs": [
      {
        "question": "Can we move an Edinburgh office in phases?",
        "answer": "Provide an inventory for each phase and a floor plan showing what must remain working. Access windows, equipment dependencies and receiving contacts need agreeing for every stage."
      },
      {
        "question": "Should staff leave paperwork inside desks?",
        "answer": "Agree this before the move. Loose papers and confidential files should be packed and controlled by your organisation; heavy or unsecured drawers affect handling."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "student-move",
    "title": "Student removals in Edinburgh",
    "description": "Plan Edinburgh student removals between halls, shared flats, home and separately arranged storage. Check access, key handover and your complete moving quote.",
    "introduction": "Moving out of Edinburgh halls, into a shared flat or home at the end of term? List your boxes, suitcases and furniture, then match the collection to your room handover and the destination's access window. A storage transfer or a move shared with a housemate needs its own addresses and inventory included in the enquiry.",
    "sections": [
      {
        "title": "Check the room address and the key collection point",
        "body": "The University of Edinburgh’s moving-in guidance includes arrival arrangements and key collection. Use the instructions for your allocated residence and tenancy, not a general university address. Share the agreed delivery window after the residence confirms when you can enter the building.",
        "source": {
          "label": "University of Edinburgh moving-in information",
          "href": "https://www.accom.ed.ac.uk/living-with-us/moving-in"
        }
      },
      {
        "title": "Keep Pollock unloading separate from parking",
        "body": "The university says parking at Pollock during arrival periods is for drop-off. Ask how your delivery should use the site and who will remain with the belongings while access is completed. Prepare labelled room-sized batches so the move does not depend on leaving a loaded vehicle waiting indefinitely.",
        "source": {
          "label": "University of Edinburgh transport to Pollock Halls",
          "href": "https://transport.ed.ac.uk/travelling-here/pollock"
        }
      },
      {
        "title": "Moving out: prepare for collection and room handover",
        "body": "Check your accommodation's departure instructions and key-return arrangements. Pack your own belongings separately from communal kitchen items and residence furniture. Allow time to clear and check the room after loading, keeping cleaning materials and the keys accessible until handover. For a private flat, confirm the process with the landlord or agent.",
        "source": {
          "label": "University of Edinburgh moving-out guidance",
          "href": "https://www.accom.ed.ac.uk/living-with-us/moving-out"
        }
      },
      {
        "title": "Student storage transfers between tenancies",
        "body": "If the next room is not ready, arrange the storage space separately and give its address, unit access and opening hours when requesting transport. Explain whether the load needs a later collection and list the belongings travelling on each date. A moving quote does not reserve a storage unit or include storage rent. Check what identification or access arrangements the facility requires for collection and delivery."
      },
      {
        "title": "What to include in your Edinburgh student removal quote",
        "body": "Count boxes and bags, measure bulky furniture and include both floors, stairs, lift access and the walk to the loading point. For a shared move, identify each person's load and every stop. Ask whether the price is fixed or hourly, what minimum applies and whether lifting help, travel, waiting and any packing materials are included. Confirm the total and available slot before arranging key collection around the move."
      }
    ],
    "faqs": [
      {
        "question": "Can my Edinburgh room be delivered to before I arrive?",
        "answer": "Only if an authorised recipient and the residence or landlord have agreed access. A key desk does not automatically provide storage or accept responsibility for boxes."
      },
      {
        "question": "What if I am moving from Edinburgh to a family home in England?",
        "answer": "That is within the Scotland-origin service scope. Provide the family address, receiving contact and any access limits alongside the student-room inventory."
      },
      {
        "question": "Do Edinburgh student removals include storage?",
        "answer": "Transport to or from a storage facility can be included in the enquiry. Arrange and pay for the storage space separately, and provide the facility's address, opening hours and access instructions. Confirm each collection and delivery date with the moving quote."
      },
      {
        "question": "Can housemates combine their student move?",
        "answer": "Provide a combined inventory, all collection and delivery addresses and each person's access window. Shared transport depends on the route, capacity and timings being suitable. The quote must confirm the complete job before either person books around it."
      }
    ]
  },
  {
    "areaSlug": "edinburgh",
    "serviceSlug": "packing-service",
    "title": "Packing help in Edinburgh",
    "description": "Plan Edinburgh packing support for fragile possessions, stair handling, room labels and the belongings you need during a move.",
    "introduction": "Packing for an Edinburgh move works best when the scope is specific. Identify whether you need help with the whole property, the kitchen or a few fragile items, and describe the space available for packing inside the home.",
    "sections": [
      {
        "title": "Size packed loads for the exit route",
        "body": "An Old Town close may involve a narrow passage before the team reaches your building. Keep book and crockery cartons manageable and flag fragile objects that need carrying separately. Measure large framed items before wrapping; packaging adds bulk to an already awkward stair or doorway.",
        "source": {
          "label": "Edinburgh World Heritage: Old Town",
          "href": "https://ewh.org.uk/the-old-town/"
        }
      },
      {
        "title": "Agree what happens before the packing visit",
        "body": "Sort out items you will keep, donate or move elsewhere so they are not mixed into sealed boxes. Empty and prepare appliances according to their instructions, and keep personal documents and medication apart. Discuss unusual artwork, collections or materials in advance rather than treating every cupboard as a standard load."
      },
      {
        "title": "Prepare separate plans for packing and collection",
        "body": "If the visits are on different days, arrange building entry for both. Where street access is needed, check Edinburgh Council’s requirements for the relevant activity and date. Label boxes with destination rooms and keep a final group accessible for bedding, chargers and essential kitchenware.",
        "source": {
          "label": "Edinburgh dispensations and suspensions",
          "href": "https://www.edinburgh.gov.uk/parking-spaces/dispensations-suspensions"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can packing help include only an Edinburgh kitchen?",
        "answer": "Yes, request a defined packing scope and list delicate or unusually heavy items. Confirm materials, access and timing when the service is agreed."
      },
      {
        "question": "Should fragile boxes be marked only on the lid?",
        "answer": "Mark more than one side and identify the destination room. Lids can become hidden in a stack; describe especially delicate contents directly when handing over the inventory."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "house-removal",
    "title": "House removals in Aberdeen",
    "description": "Plan an Aberdeen household move with room and outbuilding inventories, city-centre access checks and delivery arrangements across Britain.",
    "introduction": "A household move from Aberdeen should bring together the inventory and the actual road approach before the date is fixed. Include everything leaving the property, then record the key release and receiving arrangements if the move continues elsewhere in Britain.",
    "sections": [
      {
        "title": "Review the approach, not just the postcode",
        "body": "Aberdeen Council publishes bus gate navigation guidance. Give the team the exact entrance and any alternative loading side so it can plan an appropriate approach. A short route suggested for a car should not be treated as confirmation that the removal vehicle can follow it.",
        "source": {
          "label": "Aberdeen bus gate route guidance",
          "href": "https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/bus-lanes-and-bus-gates/information/bus-gates-frequently-asked-questions"
        }
      },
      {
        "title": "Account for different levels around the entrance",
        "body": "Near Union Street and the Green, Back Wynd’s connection includes steps. If your property uses a nearby pedestrian approach, show the real carrying route rather than a straight-line map distance. Note cellar steps, rear doors and any outside changes of level before the full household load is assessed.",
        "source": {
          "label": "Aberdeen museums: Back Wynd",
          "href": "https://emuseum.aberdeencity.gov.uk/sites/247/back-wynd"
        }
      },
      {
        "title": "Sequence the full-home handover",
        "body": "List garage, shed and loft contents with the rooms, and identify furniture needing dismantling. Keep a separate set of essentials for the journey. For a destination outside Aberdeen, appoint someone who can receive the load and explain whether keys, parking or a booked lift could affect unloading."
      }
    ],
    "faqs": [
      {
        "question": "Can I use a city-centre map pin as the collection details?",
        "answer": "Add the building number, usable entrance and photographs of the loading approach. In Aberdeen, the nearest point on a map can be separated from the property by a stepped route."
      },
      {
        "question": "Will the quote include garden and attic belongings?",
        "answer": "Only an accurate inventory can account for them. Record their quantity and access, including ladders, outside paths and any heavy items that need separate assessment."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Aberdeen",
    "description": "Prepare an Aberdeen flat move with stair and entrance measurements, separate road access checks and a clear inventory for both buildings.",
    "introduction": "For an Aberdeen flat removal, show the route that a large item must actually follow. The flat number and postcode do not describe entrance steps, shared landings or the carrying distance from the loading point.",
    "sections": [
      {
        "title": "Inspect changes of level outside the building",
        "body": "The council’s Back Wynd record describes steps between Union Street and the Green. This is a useful reminder to check external access as well as the flat stair when moving nearby. Photograph each turn and step on your own route; do not assume neighbouring streets connect at the same level.",
        "source": {
          "label": "Aberdeen museums: Back Wynd",
          "href": "https://emuseum.aberdeencity.gov.uk/sites/247/back-wynd"
        }
      },
      {
        "title": "Separate building access from LEZ compliance",
        "body": "Aberdeen’s city-centre LEZ operates throughout the day. Provide the precise address so the vehicle approach can be checked, while you confirm buzzer access, lift permission and any caretaker arrangements. A parking or building permit is not a substitute for reviewing the road route.",
        "source": {
          "label": "Scottish Government LEZ information",
          "href": "https://www.mygov.scot/low-emission-zones"
        }
      },
      {
        "title": "Make bulky pieces the first planning question",
        "body": "Measure the bed frame, sofa and largest cabinet against the narrowest part of both buildings. Identify detachable parts and agree any dismantling. Label boxes by destination room and keep common landings clear so other residents can continue to enter and leave during the move."
      }
    ],
    "faqs": [
      {
        "question": "Do exterior steps matter if my Aberdeen flat is on the ground floor?",
        "answer": "Yes. Include entrance steps, sloping paths and the distance from the van. Ground-floor accommodation is not necessarily a level carry."
      },
      {
        "question": "Can a lift replace the stair assessment?",
        "answer": "Only after its availability, door opening and cabin dimensions have been confirmed. Describe the stair too if an item cannot fit the lift or the building restricts its use."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Aberdeen",
    "description": "Plan Aberdeen sofa and furniture collections with confirmed dimensions, seller access, route checks and a clear delivery handover.",
    "introduction": "An Aberdeen furniture delivery begins with the object itself: its dimensions, weight information where available, and whether it separates. Confirm those details with the seller before arranging the journey to your room.",
    "sections": [
      {
        "title": "Avoid choosing access from walking directions",
        "body": "Around the Green, the Back Wynd steps provide pedestrian connectivity that does not describe a vehicle approach. For a nearby delivery, identify the loading point and measure the complete carry from there. Send the seller and recipient a consistent plan so the item is ready at the correct entrance.",
        "source": {
          "label": "Aberdeen museums: Back Wynd",
          "href": "https://emuseum.aberdeencity.gov.uk/sites/247/back-wynd"
        }
      },
      {
        "title": "Check each stop against the road arrangement",
        "body": "Aberdeen’s bus gate guidance helps distinguish possible approaches through the centre. Supply every collection stop, including a shop’s goods entrance if it differs from the showroom. Avoid adding an extra seller on the day without reviewing the route, total load and time needed for handling.",
        "source": {
          "label": "Aberdeen bus gate route guidance",
          "href": "https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/bus-lanes-and-bus-gates/information/bus-gates-frequently-asked-questions"
        }
      },
      {
        "title": "Make the item ready for secure handling",
        "body": "Empty drawers, identify loose shelves and keep fittings with the furniture. Explain whether the item needs dismantling or assembly and whether there are fragile inserts. Take condition photographs for a used purchase and agree who can approve its handover when it reaches the receiving room."
      }
    ],
    "faqs": [
      {
        "question": "Can you collect a sofa from an Aberdeen seller who is at work?",
        "answer": "Arrange an authorised person with access to release it during the agreed window. The seller’s availability and the item’s readiness must be confirmed before collection."
      },
      {
        "question": "Is an old furniture removal part of delivery?",
        "answer": "It is a separate requirement. Describe the old item and its intended destination so transport, handling and any disposal request can be considered explicitly."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "office-removal",
    "title": "Office removals in Aberdeen",
    "description": "Plan an Aberdeen business relocation with building access, equipment inventories, bus gate route checks and a controlled desk-by-desk handover.",
    "introduction": "An Aberdeen office relocation should identify what must remain operational until the last stage and who controls each building. Start with a floor plan and equipment list, then assign contacts for security, IT and the receiving team.",
    "sections": [
      {
        "title": "Confirm the service entrance and approach",
        "body": "Aberdeen Council’s bus gate guidance provides a starting point for planning access through the city. Give the team the actual service entrance, loading yard or goods lift address. A public reception on one street does not establish the vehicle route to a rear loading area.",
        "source": {
          "label": "Aberdeen bus gate route guidance",
          "href": "https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/bus-lanes-and-bus-gates/information/bus-gates-frequently-asked-questions"
        }
      },
      {
        "title": "Check late working against all access requirements",
        "body": "An evening move may suit staff schedules, but Aberdeen’s LEZ continues to operate. Confirm the vehicle approach separately from out-of-hours security and lift bookings. Ask the building manager about alarms, permitted handling areas and the contact who will attend if an access card fails.",
        "source": {
          "label": "Scottish Government LEZ information",
          "href": "https://www.mygov.scot/low-emission-zones"
        }
      },
      {
        "title": "Create an accountable equipment handover",
        "body": "Number workstations and label screens, docking stations and cable containers accordingly. Your IT provider should control backups and reconnection. Identify leased printers and sensitive records before loading, and agree where each cabinet belongs at the destination so it does not need repeated moves through the building."
      }
    ],
    "faqs": [
      {
        "question": "Can an Aberdeen office move take place after staff leave?",
        "answer": "Discuss the preferred period, then confirm building access, security attendance and loading arrangements. A late slot does not remove traffic restrictions or guarantee staff availability."
      },
      {
        "question": "Should we disconnect servers before the van arrives?",
        "answer": "Have your IT provider agree the shutdown sequence and timing. Equipment should be ready for the agreed handling method; transport does not itself include migration or network testing."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "student-move",
    "title": "Student moves in Aberdeen",
    "description": "Prepare an Aberdeen student move with residence-specific key collection, a personal inventory and access details for halls or a shared flat.",
    "introduction": "Moving a student room in Aberdeen is easier when the key desk, room address and transport destination are treated separately. Count only your own possessions and check which furniture belongs to the residence or landlord before packing.",
    "sections": [
      {
        "title": "Check whether keys are collected at Hillhead",
        "body": "The University of Aberdeen’s arrival instructions use Hillhead reception on Don Street as a collection point, including for some other residences. Follow the instructions issued for your own contract. Tell us where the belongings must be delivered after you have the keys rather than substituting the reception address.",
        "source": {
          "label": "University of Aberdeen before arrival",
          "href": "https://www.abdn.ac.uk/accommodation/resident-info/arrival/"
        }
      },
      {
        "title": "Include the route from vehicle to room",
        "body": "Record the residence block, flat and room alongside any entry instructions. If moving into a private flat around the centre, provide stair photos and the exact loading side so the Aberdeen bus gate guidance can be considered. Keep access cards with you throughout the move.",
        "source": {
          "label": "Aberdeen bus gate route guidance",
          "href": "https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/bus-lanes-and-bus-gates/information/bus-gates-frequently-asked-questions"
        }
      },
      {
        "title": "Separate term-time essentials from shared possessions",
        "body": "Label bags and boxes with your name and destination room, particularly when housemates leave together. Keep books in manageable cartons and describe bikes, musical instruments or screens individually. If collection and the new tenancy do not overlap, discuss the gap before assuming a delivery can wait."
      }
    ],
    "faqs": [
      {
        "question": "Should I put Hillhead reception down as my delivery address?",
        "answer": "Use it only if it is actually the agreed receiving point. Your university instructions may send you there for keys while the belongings belong at a different residence."
      },
      {
        "question": "Can my student belongings move from Aberdeen to Wales?",
        "answer": "Yes, moves can begin in Aberdeen and finish elsewhere in Britain. Give the complete receiving address and contact, plus any stairs or restricted arrival times."
      }
    ]
  },
  {
    "areaSlug": "aberdeen",
    "serviceSlug": "packing-service",
    "title": "Packing help in Aberdeen",
    "description": "Plan Aberdeen packing assistance for fragile items, household contents, stepped access and clearly separated moving-day essentials.",
    "introduction": "Packing help for an Aberdeen move should match the items and their route out of the property. Identify what you will prepare yourself, what needs careful wrapping and whether the packing visit happens before collection day.",
    "sections": [
      {
        "title": "Prepare fragile items for changes of level",
        "body": "Near the Green and Union Street, external access can include the Back Wynd steps. Where your own carrying route has steps, describe that before packing large glass or framed items. Manageable cartons and clear handling labels help the team plan each carry without leaving loose pieces on a landing.",
        "source": {
          "label": "Aberdeen museums: Back Wynd",
          "href": "https://emuseum.aberdeencity.gov.uk/sites/247/back-wynd"
        }
      },
      {
        "title": "Give collections and cupboards their own inventory",
        "body": "Photograph displays before separating them, group matching components and identify unusually delicate objects. Pack dense books in smaller boxes and keep screws with dismantled furniture. Tell us about items needing a specialist method before they are treated as ordinary household contents."
      },
      {
        "title": "Keep the packing visit accessible",
        "body": "If a packing team and removal vehicle visit on different dates, provide the entry and road approach for each. Aberdeen’s bus gate navigation guidance is relevant to both journeys. Reserve space inside for completed boxes and keep personal documents, keys and travel essentials outside the packing scope.",
        "source": {
          "label": "Aberdeen bus gate route guidance",
          "href": "https://www.aberdeencity.gov.uk/Council-Services/roads-parking-and-travel/bus-lanes-and-bus-gates/information/bus-gates-frequently-asked-questions"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can I ask for packing help with only fragile pieces in Aberdeen?",
        "answer": "Specify each piece, its dimensions and any special handling concern. Agree materials and scope before the visit; especially valuable or unusual items need individual discussion."
      },
      {
        "question": "Will packed boxes include a list of their contents?",
        "answer": "Agree the labelling approach in advance. A room name, box number and brief contents description make unloading clearer, especially if some belongings go to another address."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "house-removal",
    "title": "House removals in Inverness",
    "description": "Prepare an Inverness household move with full contents, usable road access, collection readiness and a delivery plan anywhere in Britain.",
    "introduction": "An Inverness house removal needs a reliable description of the approach as well as the contents. Include the full property inventory and explain how the vehicle reaches the entrance, particularly when a map suggests a short route across the river.",
    "sections": [
      {
        "title": "Use a vehicle route to the correct bank",
        "body": "Greig Street Bridge is a footbridge, so a pedestrian route across the Ness is not a van approach. Give the collection entrance and any driveway instructions rather than relying on walking directions. If the new home is across the river, describe its access independently of the collection side.",
        "source": {
          "label": "Highland Historic Environment Record: Greig Street bridge",
          "href": "https://her.highland.gov.uk/monument/MHG3867"
        }
      },
      {
        "title": "Check loading beside the property",
        "body": "Highland Council provides waiting and loading information through its parking enforcement pages. Check the actual street and proposed stopping place. Record driveway width, turning room and the carrying distance from the road; a nearby public car park does not automatically provide a suitable household loading point.",
        "source": {
          "label": "Highland waiting and loading information",
          "href": "https://www.highland.gov.uk/parking-fines-enforcement/decriminalised-parking-enforcement"
        }
      },
      {
        "title": "Prepare the whole household for one handover",
        "body": "Include garden equipment, shed contents and loft boxes, and identify anything requiring dismantling. For a longer move from Inverness, keep travel essentials out of the load and agree the receiving contact and key timing. Discuss any uncertainty about access before treating delivery as an immediate arrival-and-unload job."
      }
    ],
    "faqs": [
      {
        "question": "Can you move an Inverness household to southern England?",
        "answer": "Yes, the service can collect in Inverness and deliver elsewhere in Britain. The destination inventory placement, access and receiving arrangements need to be agreed with the journey."
      },
      {
        "question": "What approach information helps with a driveway collection?",
        "answer": "Provide its usable width, turning space and any gates, slopes or overhead obstructions. Explain where the vehicle can stand without blocking neighbouring access."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Inverness",
    "description": "Plan an Inverness flat move with stair details, the correct vehicle approach, lawful loading and a room-by-room inventory.",
    "introduction": "For an Inverness flat move, the distance between addresses can be less important than the route between each room and the van. Record shared doors, stairs, lifts and any outside carrying section before the handling is planned.",
    "sections": [
      {
        "title": "Check the building entrance against the loading street",
        "body": "If a flat is reached from a riverside path, identify which road serves its usable entrance. Greig Street is a footbridge connection, not a route for the removal vehicle. Show the final carrying section in photographs and mark any gates or steps between the road and building.",
        "source": {
          "label": "Highland Historic Environment Record: Greig Street bridge",
          "href": "https://her.highland.gov.uk/monument/MHG3867"
        }
      },
      {
        "title": "Do not substitute a car park for a loading plan",
        "body": "Rose Street is a multi-storey car park; its existence near a flat does not confirm van clearance or permission to load household goods. Check the actual loading street through Highland Council’s guidance, and ask the property manager about any designated goods entrance or booked lift.",
        "source": {
          "label": "Highland Council Rose Street car park",
          "href": "https://www.highland.gov.uk/parking-permits/rose-street-multi-storey-car-park"
        }
      },
      {
        "title": "Describe the awkward pieces first",
        "body": "Send dimensions for the largest sofa, mattress and cabinet alongside stair and lift measurements. Explain any mezzanine or internal stairs. Keep the common landing free of packed boxes and arrange reliable entry at both flats, including the buzzer or caretaker instructions needed during unloading."
      }
    ],
    "faqs": [
      {
        "question": "Will a ground-floor Inverness flat be treated as a level carry?",
        "answer": "Only if its actual access is level. Mention outside steps, raised entrances, slopes and distance from the loading point even when there are no internal stairs."
      },
      {
        "question": "Can the team use the nearest public car park?",
        "answer": "That needs checking for the specific vehicle and activity. A car-park listing alone does not establish sufficient clearance, space or permission for a removal."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Inverness",
    "description": "Arrange an Inverness furniture collection with dimensions, seller availability, suitable vehicle access and a clear receiving-room plan.",
    "introduction": "For furniture collected in Inverness, confirm exactly what is being moved before arranging access. A single bulky wardrobe can need more preparation than several small boxes, especially when the seller and recipient use different entrances.",
    "sections": [
      {
        "title": "Match furniture size to the carrying route",
        "body": "Ask for assembled measurements, photographs of removable sections and any available weight information. Include entrance steps and doorway turns at delivery. If either address is near the Ness, identify its vehicle-access street; Greig Street Bridge is a pedestrian connection and should not be used to describe the van route.",
        "source": {
          "label": "Highland Historic Environment Record: Greig Street bridge",
          "href": "https://her.highland.gov.uk/monument/MHG3867"
        }
      },
      {
        "title": "Agree a practical collection handover",
        "body": "Confirm that the seller will be available and the item can be released from the stated room. For a street collection, check the Highland waiting and loading information rather than assuming the closest space can be used. Keep loose fittings and shelves together before the agreed collection period.",
        "source": {
          "label": "Highland waiting and loading information",
          "href": "https://www.highland.gov.uk/parking-fines-enforcement/decriminalised-parking-enforcement"
        }
      },
      {
        "title": "State whether delivery includes more than transport",
        "body": "Specify the room and floor, any dismantling request and who will accept the furniture. Include a second item or an old piece to remove in the inventory before the job is agreed. Photograph used furniture at handover so its condition is clear to the seller and recipient."
      }
    ],
    "faqs": [
      {
        "question": "Can the seller leave my Inverness purchase outside for collection?",
        "answer": "Agree a supervised handover where possible. The item must be accessible and protected, with someone authorised to release it; unattended pavement collection should not be assumed."
      },
      {
        "question": "Do detachable wardrobe doors need their own listing?",
        "answer": "Record the complete piece and the separate panels, shelves and fittings travelling with it. This helps plan protection and confirms that all components reach the receiving address."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "office-removal",
    "title": "Office removals in Inverness",
    "description": "Plan an Inverness office relocation with loading access, furniture and equipment inventories, security contacts and staged delivery.",
    "introduction": "An Inverness office relocation needs a delivery route that works for equipment as well as people. Identify the goods entrance and building contact, then organise the desks, records and IT hardware by where they will be used after the move.",
    "sections": [
      {
        "title": "Confirm the working entrance",
        "body": "For riverside premises, distinguish the pedestrian entrance from the vehicle loading approach. The Greig Street crossing is a footbridge, so directions for staff walking between offices may not describe the equipment route. Provide the loading-side address and any gate or service-yard instructions to the moving team.",
        "source": {
          "label": "Highland Historic Environment Record: Greig Street bridge",
          "href": "https://her.highland.gov.uk/monument/MHG3867"
        }
      },
      {
        "title": "Coordinate the street and building window",
        "body": "Highland Council’s waiting and loading information should be checked where collection depends on the public road. Separately agree lift use, security attendance and who opens any rear doors. If multiple departments move at different times, allocate a contact and inventory for each stage.",
        "source": {
          "label": "Highland waiting and loading information",
          "href": "https://www.highland.gov.uk/parking-fines-enforcement/decriminalised-parking-enforcement"
        }
      },
      {
        "title": "Keep the business handover traceable",
        "body": "Label equipment by workstation and store its matching cables together. Have your IT team manage shutdown, backups and testing at the destination. Assign responsibility for confidential files and leased devices, and mark furniture that stays so the team can work through the premises without repeated decisions."
      }
    ],
    "faqs": [
      {
        "question": "Can the office move be split between two Inverness destinations?",
        "answer": "Provide a separate destination list and receiving contact for each. Label furniture and equipment before collection so the loading order reflects the agreed delivery sequence."
      },
      {
        "question": "Is a staff car-park pass enough for loading?",
        "answer": "Ask the building manager to confirm the goods-access arrangement. A pass may provide parking without authorising use of a service bay, lift or restricted entrance."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "student-move",
    "title": "Student moves in Inverness",
    "description": "Prepare an Inverness student move with campus residence details, a personal inventory, key arrangements and private-flat access.",
    "introduction": "A student move from Inverness can involve campus accommodation, a shared rental or a journey home elsewhere in Britain. Use the actual residence and room details when planning the move, and separate your property from shared furnishings.",
    "sections": [
      {
        "title": "Specify the residence on Inverness Campus",
        "body": "UHI Inverness describes student residences on Inverness Campus with shared kitchen and living areas. Confirm your block, room and arrival instructions with the accommodation team. Do not use a teaching-building address in place of the residence entrance or assume a general reception can store deliveries.",
        "source": {
          "label": "UHI Inverness accommodation",
          "href": "https://www.inverness.uhi.ac.uk/study/accommodation/"
        }
      },
      {
        "title": "Build an inventory for your room",
        "body": "Count sealed boxes and bags and list screens, bikes and musical instruments separately. Check the room’s supplied furniture before adding your own bed or desk. In shared kitchens, agree which items belong to you so a housemate’s utensils or a residence appliance do not join the load.",
        "source": {
          "label": "UHI Inverness accommodation",
          "href": "https://www.inverness.uhi.ac.uk/study/accommodation/"
        }
      },
      {
        "title": "Coordinate keys and the final carry",
        "body": "Ask when you can enter the room and how deliveries reach the building. For a move into a private Inverness flat, add the stair and loading details. If leaving Scotland for the next address, keep essential study equipment with you and give the team a reachable receiving contact."
      }
    ],
    "faqs": [
      {
        "question": "Can a UHI reception take delivery while I travel?",
        "answer": "Ask the accommodation team for explicit arrangements. A residence address does not mean reception staff can accept or keep your belongings."
      },
      {
        "question": "What if my new tenancy starts after I leave the old room?",
        "answer": "Tell us about the dates before booking transport. Storage or a separate delivery day needs agreement; it is not created automatically by a gap in your tenancies."
      }
    ]
  },
  {
    "areaSlug": "inverness",
    "serviceSlug": "packing-service",
    "title": "Packing help in Inverness",
    "description": "Arrange Inverness packing support around fragile items, manageable box sizes, property access and essentials for a longer move.",
    "introduction": "For an Inverness packing visit, decide which contents need help before estimating the work. A clear room list and a separate group of fragile objects let the packing plan reflect the property and the journey ahead.",
    "sections": [
      {
        "title": "Pack for the real route to the vehicle",
        "body": "If the property has riverside pedestrian access, identify its road entrance before choosing where completed boxes will wait. Greig Street Bridge is a footbridge, so a nearby map connection may not shorten the vehicle approach. Keep packed items indoors until the carrying route and loading point are ready.",
        "source": {
          "label": "Highland Historic Environment Record: Greig Street bridge",
          "href": "https://her.highland.gov.uk/monument/MHG3867"
        }
      },
      {
        "title": "Distinguish fragile from simply bulky",
        "body": "Describe mirrors, screens, glass-fronted cabinets and collections individually. Keep dense books in smaller cartons and fittings with their furniture. Agree any dismantling before wrapping large pieces, and avoid packing items you still need to clean or prepare the property for handover."
      },
      {
        "title": "Prepare separate access for each visit",
        "body": "If packing precedes collection, ensure someone can admit the team on both dates. Use Highland Council’s waiting and loading information where access depends on the street. For a long move from Inverness, keep documents, medication, chargers and an overnight bag with you rather than inside the main load.",
        "source": {
          "label": "Highland waiting and loading information",
          "href": "https://www.highland.gov.uk/parking-fines-enforcement/decriminalised-parking-enforcement"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can packing help cover an Inverness move in stages?",
        "answer": "Describe which rooms can be packed early and which must remain usable. Agree visit dates, access and the final collection inventory before work begins."
      },
      {
        "question": "Should I leave empty cupboards open after sorting?",
        "answer": "Make the agreed packing areas easy to identify and tell the team what stays. A room list and a separate marked area for retained belongings reduce accidental packing."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "house-removal",
    "title": "House removals in Dundee",
    "description": "Plan a Dundee household removal with complete contents, entrance details, LEZ route checks and a receiving plan across Britain.",
    "introduction": "A Dundee household move should be planned around the whole property rather than bedroom count alone. List indoor and outdoor contents, describe the real loading entrance and establish when the next home will be available.",
    "sections": [
      {
        "title": "Check whether the journey enters the centre",
        "body": "Dundee’s LEZ includes an area inside the A991 inner ring road. Provide the exact collection and delivery streets so the approach can be checked before the move. Do not infer a route is suitable simply because the nearest car park is excluded from the zone.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      },
      {
        "title": "Describe the building you are actually leaving",
        "body": "The council’s West End appraisal records different residential forms around Perth Road and Hawkhill, including tenements. State whether your inventory leaves a house entrance, shared stair or rear access. Include furniture from upper rooms and any garden or garage load, with photographs of the tightest point.",
        "source": {
          "label": "Dundee Council West End Suburbs appraisal",
          "href": "https://www.dundeecity.gov.uk/sites/default/files/publications/West%20End%20Suburbs%20CA%20Low%20Res.pdf"
        }
      },
      {
        "title": "Connect the inventory to the key handover",
        "body": "Mark items that need dismantling, pack a separate first-night group and nominate a person to receive the furniture. If moving from Dundee elsewhere in Britain, explain the key collection and access constraints at the far end before agreeing a delivery plan."
      }
    ],
    "faqs": [
      {
        "question": "Does a Dundee house move include a separate storage collection?",
        "answer": "List the storage address and contents as an additional stop. Opening times, unit access and total load need to be agreed with the household move."
      },
      {
        "question": "Can I leave out the garden furniture until moving day?",
        "answer": "Include it when describing the job. Outdoor tables, planters and tools take space and may require different preparation or handling from indoor boxes."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Dundee",
    "description": "Prepare a Dundee flat removal with shared-stair measurements, entry details, bulky-item access and city-centre route checks.",
    "introduction": "A Dundee flat removal needs an honest picture of both buildings. Give the floor, number of flights and any lift details, then describe how the team reaches the shared entrance from the vehicle.",
    "sections": [
      {
        "title": "Survey a West End stair as a complete route",
        "body": "Dundee Council’s appraisal identifies tenements around Hawkhill and Perth Road. For a move in one, photograph the street entrance, each landing turn and the flat doorway. Measure the largest furniture against that route; the room may have space for a cabinet that cannot leave in one piece.",
        "source": {
          "label": "Dundee Council West End Suburbs appraisal",
          "href": "https://www.dundeecity.gov.uk/sites/default/files/publications/West%20End%20Suburbs%20CA%20Low%20Res.pdf"
        }
      },
      {
        "title": "Check central streets precisely",
        "body": "The Dundee LEZ street list includes parts of Nethergate and Seagate, so a broad neighbourhood label is insufficient for planning the approach. Give the exact loading entrance and ensure the receiving flat’s street is checked separately. A lift booking does not resolve vehicle access outside the building.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      },
      {
        "title": "Plan a clear shared stair",
        "body": "Prepare boxes inside the flat, keep loose parts with their furniture and arrange someone to operate the entry system. Discuss dismantling before loading begins. Ask the receiving building about lift restrictions and ensure the person with the keys is available throughout the agreed arrival period."
      }
    ],
    "faqs": [
      {
        "question": "Should I count entrance steps separately from the flat floor?",
        "answer": "Yes. Include all flights, exterior steps and internal split levels. This gives a clearer handling picture than a floor number by itself."
      },
      {
        "question": "Can I assume a modern Dundee block has a usable lift?",
        "answer": "Confirm with the manager. The lift needs to be available for removals and large enough at the doorway and inside the cabin for the intended furniture."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Dundee",
    "description": "Arrange Dundee furniture transport with confirmed dimensions, seller handover, stair access and the correct city-centre approach.",
    "introduction": "For a Dundee furniture collection, start with the exact pieces and the seller’s access. Describe whether the furniture is assembled, upstairs or behind a shop, then check its route into your own property before collection.",
    "sections": [
      {
        "title": "Compare furniture with the receiving stair",
        "body": "For a tenement around Perth Road or Hawkhill, inspect the entrance and landing turns before buying a large piece. Dundee’s West End appraisal documents the local tenement setting, but the measurements must come from your own building. Include detachable feet, shelves or doors in the item description.",
        "source": {
          "label": "Dundee Council West End Suburbs appraisal",
          "href": "https://www.dundeecity.gov.uk/sites/default/files/publications/West%20End%20Suburbs%20CA%20Low%20Res.pdf"
        }
      },
      {
        "title": "Use the shop’s goods entrance",
        "body": "A Dundee retailer may give a public address while collections use another side of the building. Ask the seller to confirm the actual release point and available window. Where the route enters the centre, check the LEZ boundary against that entrance rather than the shop name.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      },
      {
        "title": "Agree delivery handling in advance",
        "body": "State the floor and destination room and explain any assembly or dismantling requested. Protect loose fittings in a labelled bag and identify fragile panels separately. If an old item needs taking away, give its dimensions and destination too so it can be included in the agreed load."
      }
    ],
    "faqs": [
      {
        "question": "Can I add chairs after booking a Dundee table collection?",
        "answer": "Update the inventory before collection and have the revised load confirmed. A dining set can take substantially more space than the table shown in an advert."
      },
      {
        "question": "What details help when a seller has no original packaging?",
        "answer": "Provide clear photographs, dimensions and the material or fragile sections. Explain what has been dismantled so suitable protection and handling can be discussed."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "office-removal",
    "title": "Office removals in Dundee",
    "description": "Plan a Dundee office relocation with service access, LEZ checks, equipment labelling and an agreed sequence for reopening.",
    "introduction": "A Dundee office move should be organised around equipment release and destination readiness. Identify the desks, storage, meeting-room furniture and IT hardware, then nominate staff who can approve handover at each building.",
    "sections": [
      {
        "title": "Check the service address inside the ring road",
        "body": "Dundee’s LEZ map defines the central area inside the A991 with specific exclusions. Identify the service entrance and vehicle approach precisely, even if staff usually park elsewhere. Confirm loading-bay use and goods-lift access directly with the facilities manager before finalising the relocation period.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      },
      {
        "title": "Coordinate an evening move rather than assuming access",
        "body": "The Dundee LEZ operates continuously, so moving after office hours does not remove that check. Arrange security attendance, lift availability and alarm procedures for the chosen period. Give the team a contact who can resolve an inaccessible door without relying on staff who have already left.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      },
      {
        "title": "Label for the destination layout",
        "body": "Number desks and put matching screens, docks and cables under the same reference. Let your IT provider control shutdown and restart. Separate confidential records from general supplies and mark equipment that belongs to the landlord, so the destination can be set out without guessing what goes where."
      }
    ],
    "faqs": [
      {
        "question": "Can our Dundee office move while some staff keep working?",
        "answer": "Discuss a staged inventory and agree which equipment remains live. Your organisation should decide the order and arrange access and receiving contacts for each stage."
      },
      {
        "question": "Does the move include disposal of old office furniture?",
        "answer": "Do not assume so. Identify unwanted items and request a separate arrangement; they should be clearly distinguished from furniture going to the new office."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "student-move",
    "title": "Student moves in Dundee",
    "description": "Plan a Dundee student room move with residence key instructions, a personal inventory and clear campus or private-flat access.",
    "introduction": "A Dundee student move may cover only a bedroom, but keys and entry arrangements still need careful timing. List the possessions you own, check the furniture already supplied and give the team your actual residence or tenancy address.",
    "sections": [
      {
        "title": "Follow the residence team’s key instructions",
        "body": "The University of Dundee says its residences team confirms when and where keys can be collected. Its guidance lists the Heathfield office on Old Hawkhill for both Heathfield and Belmont Flats. Use your own current instructions and distinguish that collection point from the room where belongings must go.",
        "source": {
          "label": "University of Dundee moving-in guide",
          "href": "https://www.dundee.ac.uk/guides/moving-student-accommodation"
        }
      },
      {
        "title": "Describe access when moving into a shared flat",
        "body": "If the next address is a West End tenement, record its stair and entry details rather than assuming the campus unloading arrangement will apply. Label boxes with your name and room so housemates’ possessions remain separate. Include bikes, instruments and screens as individual inventory items.",
        "source": {
          "label": "Dundee Council West End Suburbs appraisal",
          "href": "https://www.dundeecity.gov.uk/sites/default/files/publications/West%20End%20Suburbs%20CA%20Low%20Res.pdf"
        }
      },
      {
        "title": "Plan the handover around the tenancy",
        "body": "Confirm when the old room must be cleared and when the new key is usable. Keep study documents and essentials with you. If the dates leave a gap or the belongings are going from Dundee to a family address elsewhere in Britain, agree the receiving arrangements before collection."
      }
    ],
    "faqs": [
      {
        "question": "Is the Heathfield office always my delivery destination?",
        "answer": "No. It may be your key collection point. Use the residence and room address for the belongings, following the current instructions sent for your tenancy."
      },
      {
        "question": "Can several students share one Dundee collection?",
        "answer": "Provide the combined inventory, each address and a clear label for every person’s belongings. Additional stops and the receiving access must be included in the agreed job."
      }
    ]
  },
  {
    "areaSlug": "dundee",
    "serviceSlug": "packing-service",
    "title": "Packing help in Dundee",
    "description": "Arrange Dundee packing assistance for room contents, fragile items, tenement stairs and the belongings needed during your move.",
    "introduction": "Packing support for a Dundee move should be scoped before boxes are filled. Decide what you will prepare yourself and identify items needing special protection, then describe the space available to work inside the property.",
    "sections": [
      {
        "title": "Choose box sizes for the building route",
        "body": "In a West End tenement, the shared stair and landing turns need to be considered alongside the contents. Dundee Council documents this building pattern around Hawkhill and Perth Road. Keep heavy books and crockery in manageable cartons and measure large framed objects before wrapping makes them wider.",
        "source": {
          "label": "Dundee Council West End Suburbs appraisal",
          "href": "https://www.dundeecity.gov.uk/sites/default/files/publications/West%20End%20Suburbs%20CA%20Low%20Res.pdf"
        }
      },
      {
        "title": "Separate dismantling from packing",
        "body": "Tell us which beds, shelves and desks need taking apart and keep fittings identified by item. Empty furniture that will not safely travel full, and discuss delicate collections individually. Make a clearly marked group for items staying at the property so they do not become part of the sealed load."
      },
      {
        "title": "Coordinate both visits if packing is earlier",
        "body": "Provide building entry for the packing visit and collection day separately. For city-centre premises, Dundee’s LEZ remains relevant to each vehicle approach. Label completed boxes by destination room and keep keys, medication and essential chargers outside the packing scope until the move is finished.",
        "source": {
          "label": "Dundee LEZ boundary and vehicle guidance",
          "href": "https://www.dundeecity.gov.uk/service-area/city-development/sustainable-transport-and-roads/dundee-low-emission-zone-scheme-lez"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can packing be limited to fragile Dundee household items?",
        "answer": "Specify the objects and cupboard contents needing help and agree the materials and handling. The packing scope can then be reviewed against the actual inventory."
      },
      {
        "question": "Can packed boxes wait on a shared landing?",
        "answer": "Keep them inside the property while awaiting collection. Shared stairs and exits need to remain usable by other residents and should not become a storage area."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "house-removal",
    "title": "House removals in Perth",
    "description": "Plan a Perth household removal with loading permission checks, a full inventory, key handover and delivery access throughout Britain.",
    "introduction": "A Perth house move should distinguish a driveway collection from one depending on restricted street access. Provide the full contents and exact entrance, then connect the loading arrangements with the time the new property becomes available.",
    "sections": [
      {
        "title": "Review central access before setting the loading period",
        "body": "Perth and Kinross Council’s suspension and dispensation guidance covers the city’s pedestrianised zone. If the home is reached from that area, establish the permitted vehicle approach and any permission needed for the actual street. Do not assume a nearby shop delivery arrangement covers a household removal.",
        "source": {
          "label": "Perth bay suspensions and dispensations",
          "href": "https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations"
        }
      },
      {
        "title": "Check restrictions against the move date",
        "body": "The council publishes current and proposed road restrictions. Recheck the approach to both properties close to the move rather than relying on an older route description. Identify any alternative entrance and describe driveway gates, turning room or a long outside carry so access can be assessed alongside the inventory.",
        "source": {
          "label": "Perth and Kinross road restrictions",
          "href": "https://www.pkc.gov.uk/article/17270/Road-closures-and-restrictions-Current-and-proposed"
        }
      },
      {
        "title": "Account for the rooms you use less often",
        "body": "List loft, garage and garden items as well as the bedroom-based household contents. Mark furniture requiring dismantling and keep essential overnight items separate. If leaving Perth for another part of Britain, give the recipient’s contact and key timing so unloading does not depend on an unconfirmed handover."
      }
    ],
    "faqs": [
      {
        "question": "Can the move include a Perth house and a storage unit?",
        "answer": "Give both collection addresses and separate inventories, including the storage opening and access arrangements. The combined load and additional stop need to be agreed."
      },
      {
        "question": "Should I arrange street access before the completion date is certain?",
        "answer": "Check the council’s process early and explain any date uncertainty. Confirm the actual date and required arrangement before assuming permission or loading space is available."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Perth",
    "description": "Prepare a Perth flat move with the correct street entrance, loading access, stair measurements and a clear receiving-flat plan.",
    "introduction": "A Perth flat removal needs the route from the road to the room recorded in full. Include shared doors, outside steps and any passage behind the frontage, as well as the floor and largest furniture dimensions.",
    "sections": [
      {
        "title": "Identify the actual entrance within central streets",
        "body": "For a flat served from Perth’s pedestrianised area, the council’s access and dispensation guidance is the starting point for road planning. Give the exact stair entrance and usable loading side. A shop address below the flat may not explain where furniture can enter or leave the building.",
        "source": {
          "label": "Perth bay suspensions and dispensations",
          "href": "https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations"
        }
      },
      {
        "title": "Measure the stair before deciding what stays assembled",
        "body": "Photograph the entrance turn, landings and flat door with usable widths. Record whether the mattress, sofa and wardrobes were previously dismantled to enter. Ask the landlord or factor about shared-door access and keep boxes inside the flat until the team is ready to carry them out."
      },
      {
        "title": "Check both streets for changes",
        "body": "Perth and Kinross publishes temporary road restrictions separately from the building’s arrangements. Review them for collection and delivery close to the move date. Tell the receiving flat’s contact which room each item belongs in and verify lift availability rather than discovering an access issue during unloading.",
        "source": {
          "label": "Perth and Kinross road restrictions",
          "href": "https://www.pkc.gov.uk/article/17270/Road-closures-and-restrictions-Current-and-proposed"
        }
      }
    ],
    "faqs": [
      {
        "question": "My Perth flat is above a shop. What should I provide?",
        "answer": "Give the separate residential entrance, access code or key arrangements, all stair flights and the carrying distance from the proposed loading point."
      },
      {
        "question": "Can I list a sofa without knowing whether it dismantles?",
        "answer": "Ask the manufacturer or inspect its construction first. Provide dimensions and photographs; any dismantling or alternative handling needs to be discussed before the move."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Perth",
    "description": "Arrange Perth furniture collection with shop or seller access, pedestrian-zone checks, item dimensions and receiving-room details.",
    "introduction": "For a Perth furniture delivery, confirm the collection point with the seller before arranging transport. A public showroom address, a rear stockroom and an upstairs private collection can require quite different handling.",
    "sections": [
      {
        "title": "Ask the retailer for its goods collection instructions",
        "body": "Perth’s pedestrianised zone is covered in the council’s bay suspension and dispensation guidance. For a central shop, ask which entrance releases furniture, what vehicle access is permitted and who will hand it over. Do not substitute the shop’s normal opening hours for an agreed collection window.",
        "source": {
          "label": "Perth bay suspensions and dispensations",
          "href": "https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations"
        }
      },
      {
        "title": "Measure the item in the form it will travel",
        "body": "Clarify whether a dining table is assembled, how many chairs are included and which shelves or panels are loose. Compare the largest component with the recipient’s door and stair turns. Record glass and stone surfaces explicitly so suitable handling can be discussed."
      },
      {
        "title": "Make the receiving handover definite",
        "body": "Provide the recipient’s telephone contact, floor and room, and tell us about any narrow passage or outside steps. Check the council’s restriction notices for the delivery street as the date approaches. Add old furniture removal or assembly requests to the scope rather than assuming they come with transport.",
        "source": {
          "label": "Perth and Kinross road restrictions",
          "href": "https://www.pkc.gov.uk/article/17270/Road-closures-and-restrictions-Current-and-proposed"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can you collect a Perth shop purchase while I am elsewhere?",
        "answer": "Arrange an authorised release with the retailer and provide an available recipient at delivery. The collection reference, item list and both access plans need to be clear."
      },
      {
        "question": "What if a seller offers only a very short collection slot?",
        "answer": "Share that before confirming the job. Access, packing readiness and the route need to be assessed against the window; a short slot should not be assumed workable."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "office-removal",
    "title": "Office removals in Perth",
    "description": "Plan a Perth office move with service entrance checks, loading arrangements, equipment labels and a phased business handover.",
    "introduction": "A Perth office relocation should begin with who controls the building and who can release the equipment. Map the desks and storage to the destination layout, then agree a sequence that your staff and IT provider can support.",
    "sections": [
      {
        "title": "Distinguish reception from the loading approach",
        "body": "For premises in central Perth, check whether the service entrance is affected by the pedestrianised-zone arrangements described by the council. Confirm the bay or street access with the facilities contact. Record any goods lift, security procedure or internal corridor that large desks and cabinets must use.",
        "source": {
          "label": "Perth bay suspensions and dispensations",
          "href": "https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations"
        }
      },
      {
        "title": "Review the move against current traffic notices",
        "body": "The council’s road restriction page should be checked for the chosen date and approach. Building permission alone does not establish street access. If the move is phased, give each stage a defined inventory, responsible staff contact and receiving window rather than leaving the final collection order open-ended.",
        "source": {
          "label": "Perth and Kinross road restrictions",
          "href": "https://www.pkc.gov.uk/article/17270/Road-closures-and-restrictions-Current-and-proposed"
        }
      },
      {
        "title": "Prepare equipment for the new floor plan",
        "body": "Label workstations and cable containers consistently and identify leased printers or shared equipment. Your IT team should handle backups, shutdown and reconnection. Pack records under your organisation’s control and make clear which cabinets remain in place so unnecessary furniture is not transported."
      }
    ],
    "faqs": [
      {
        "question": "Can a Perth office move include an upstairs archive?",
        "answer": "List the archive separately with its approximate boxed contents, shelving and stair access. Dense paper loads need to be accounted for rather than described as a few cupboards."
      },
      {
        "question": "Do you guarantee the office can reopen the next morning?",
        "answer": "Reopening depends on the agreed move scope, access and your equipment setup. Plan IT reconnection and testing explicitly; transport alone cannot establish a reopening guarantee."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "student-move",
    "title": "Student moves in Perth",
    "description": "Prepare a Perth student move with campus residence details, supplied-furniture checks, personal belongings and confirmed key access.",
    "introduction": "For a Perth student move, the useful starting point is what you actually own and when you can enter the next room. Count your personal belongings separately from the furnished accommodation and any shared kitchen items.",
    "sections": [
      {
        "title": "Use the residence details for the Crieff Road campus",
        "body": "UHI Perth’s accommodation contacts identify its residences team and Crieff Road location. Confirm the particular flat or cottage and the arrival instructions directly with that team. The general campus address is not a substitute for a receiving entrance, room number or agreed key collection plan.",
        "source": {
          "label": "UHI Perth accommodation contact and campus address",
          "href": "https://www.perth.uhi.ac.uk/student-life/accommodation/contact-us/"
        }
      },
      {
        "title": "Check what is already supplied",
        "body": "UHI Perth describes furnished shared flats and cottages. Check the inventory for your accommodation before moving a desk, bed or extra appliance. List only the furniture and equipment you are bringing, and distinguish your kitchenware from communal or residence-owned items when leaving.",
        "source": {
          "label": "UHI Perth accommodation",
          "href": "https://www.perth.uhi.ac.uk/student-life/accommodation/"
        }
      },
      {
        "title": "Coordinate the tenancy dates and personal essentials",
        "body": "Give the move date, old-room deadline and new-key arrangements together. For a private Perth flat, include stairs and the actual loading street. Keep documents, study equipment needed immediately and medication with you; if the dates do not overlap, discuss a separate storage or delivery arrangement in advance."
      }
    ],
    "faqs": [
      {
        "question": "Should I bring a desk to UHI Perth accommodation?",
        "answer": "Check the supplied inventory and residence rules first. A furnished room may already contain one; avoid arranging transport for furniture that cannot be accommodated."
      },
      {
        "question": "Can my Perth student move finish at a family address elsewhere in Britain?",
        "answer": "Yes, collection may start in Perth and delivery can continue elsewhere in Britain. Provide the receiving contact, full address and any access limits."
      }
    ]
  },
  {
    "areaSlug": "perth",
    "serviceSlug": "packing-service",
    "title": "Packing help in Perth",
    "description": "Plan Perth packing support with a clear room scope, fragile-item preparation, central access checks and practical destination labels.",
    "introduction": "Packing help in Perth should be matched to the contents you want prepared, not just the size of the home. Set aside the things that stay and describe fragile items before agreeing the materials, working space and visit.",
    "sections": [
      {
        "title": "Keep packing time separate from a street loading window",
        "body": "For a property in Perth’s pedestrianised area, review the council’s access guidance before assuming a vehicle can remain while every cupboard is packed. Discuss whether an earlier packing visit would suit the property and the eventual collection arrangements. Completed boxes should wait inside, clear of shared entrances.",
        "source": {
          "label": "Perth bay suspensions and dispensations",
          "href": "https://www.pkc.gov.uk/article/22131/Bay-suspensions-and-dispensations"
        }
      },
      {
        "title": "Work through storage areas deliberately",
        "body": "Check loft cupboards, under-stair storage and outdoor buildings before finalising the packing scope. Identify glassware and ornaments that need individual attention, and use manageable cartons for books. Keep fittings labelled with their corresponding furniture and tell the team which items must remain assembled."
      },
      {
        "title": "Label for the receiving rooms",
        "body": "Use room names or numbers that the person receiving the move understands. Separate anything going to another address and identify essentials to keep with you. If access relies on public streets, review Perth and Kinross’s current restriction notices for the dates of packing and collection.",
        "source": {
          "label": "Perth and Kinross road restrictions",
          "href": "https://www.pkc.gov.uk/article/17270/Road-closures-and-restrictions-Current-and-proposed"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can I pack most things and request help with the Perth kitchen?",
        "answer": "Describe the exact cupboard contents and fragile pieces needing help. Agree which materials and work are included so your own packing and the assisted scope stay clear."
      },
      {
        "question": "Should I include garden or garage contents in a packing request?",
        "answer": "Yes, list them separately and explain their condition. Tools, liquids and bulky outdoor objects may need different preparation or an individual handling discussion."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "house-removal",
    "title": "House removals in Stirling",
    "description": "Plan a Stirling household move with Old Town access checks, driveway or loading details, a complete inventory and delivery across Britain.",
    "introduction": "A Stirling house removal needs a plan for the contents and the ground outside the door. Describe the entrance, any slope or steps and where the vehicle can stand before linking the loading schedule to the next home’s key handover.",
    "sections": [
      {
        "title": "Describe slopes at the property itself",
        "body": "Historic Environment Scotland describes the castle’s hilltop setting in Stirling’s Old Town and its sloping approach. For a home in that area, show the actual path between entrance and road rather than assuming a level carry. Identify places where large items must turn, and measure steps or gates at your own property.",
        "source": {
          "label": "Historic Environment Scotland: Stirling Castle approach",
          "href": "https://www.historicenvironment.scot/visit/all/stirling-castle/plan-your-visit/"
        }
      },
      {
        "title": "Distinguish pedestrian links from a van approach",
        "body": "Stirling Council identifies Kingstables Lane and the Upper and Sma’ Vennels as historic pedestrian routes. If a home is reached near these links, provide its usable vehicle-access street and the remaining carrying route. Do not rely on a walking map’s shortest line to describe the household loading job.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Prepare a complete inventory and handover",
        "body": "Add loft, shed and garden contents to the room list and identify furniture needing dismantling. Keep keys and travel essentials accessible. For a move from Stirling to another part of Britain, confirm who can receive the load, when the new keys are released and any access appointment at the destination."
      }
    ],
    "faqs": [
      {
        "question": "Does an Old Town address automatically mean a difficult Stirling move?",
        "answer": "No. The actual entrance and loading position matter. Share photographs and measurements so the plan reflects your property rather than assumptions about the neighbourhood."
      },
      {
        "question": "Can the house move include items at a relative’s property?",
        "answer": "List that collection address and its items separately. The extra stop, access and total load need to form part of the agreed household move."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Stirling",
    "description": "Prepare a Stirling flat removal with outside approaches, vennel access, shared stairs, bulky-item measurements and a confirmed receiving plan.",
    "introduction": "For a Stirling flat move, assess the outside approach and shared stair as one continuous route. A ground-floor description can still hide entrance steps or a carrying section from the road; a top-floor move needs the turns recorded too.",
    "sections": [
      {
        "title": "Locate the entrance beyond any pedestrian link",
        "body": "The Upper and Sma’ Vennels connect Baker Street and Spittal Street as pedestrian routes. If your flat is accessed nearby, show which street supplies the loading approach and where the carrying route begins. Give the actual stair entrance, not simply the nearest shop frontage or walking-map pin.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Measure furniture against every turn",
        "body": "Photograph the shared stair, landings and flat doorway, then compare the largest items with usable widths. Ask the factor about entry and any lift restrictions. If the property has an outside slope, describe it separately; the castle end of the Old Town has a hilltop setting, but each building needs its own assessment.",
        "source": {
          "label": "Historic Environment Scotland: Stirling Castle approach",
          "href": "https://www.historicenvironment.scot/visit/all/stirling-castle/plan-your-visit/"
        }
      },
      {
        "title": "Keep communal access working",
        "body": "Pack inside the flat and keep stairs and exit doors clear during loading. Put dismantled fittings with the correct furniture and label rooms for the destination. If public-street space needs reserving, check Stirling Council’s traffic restriction application process before assuming a bay will be available.",
        "source": {
          "label": "Stirling traffic restriction applications",
          "href": "https://www.stirling.gov.uk/roads-transport-and-parking/roads-and-pavements/apply-for-traffic-restrictions/"
        }
      }
    ],
    "faqs": [
      {
        "question": "What details help with a Stirling flat behind a vennel?",
        "answer": "Provide the building entrance, the vehicle-access street, carrying distance and any steps or tight turns. Photos from road to flat are more useful than the postcode alone."
      },
      {
        "question": "Can the team decide how to dismantle furniture on arrival?",
        "answer": "Discuss awkward pieces beforehand with dimensions and photographs. The required tools, time and suitability for dismantling should be established before the loading window starts."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Stirling",
    "description": "Arrange Stirling furniture collections with seller readiness, item measurements, pedestrian-route checks and a safe receiving-room plan.",
    "introduction": "A furniture delivery in Stirling needs the item’s travel dimensions and a usable entrance at each end. Confirm the seller’s release arrangements before choosing transport, especially if a large piece must pass through a shared stair or outside passage.",
    "sections": [
      {
        "title": "Check the carrying surface before collection",
        "body": "For a delivery near Stirling Castle, the hilltop Old Town setting is a reason to inspect your property’s actual approach. Tell us about slopes, steps and uneven sections that the furniture must cross. Do not infer the delivery is level just because the room itself is on the ground floor.",
        "source": {
          "label": "Historic Environment Scotland: Stirling Castle approach",
          "href": "https://www.historicenvironment.scot/visit/all/stirling-castle/plan-your-visit/"
        }
      },
      {
        "title": "Give a loading street as well as a destination pin",
        "body": "Kingstables Lane and the Upper and Sma’ Vennels are pedestrian routes identified by the council. A pin near one needs an explanation of how the van reaches a lawful unloading point. Measure the final carrying route and compare it with the furniture’s largest assembled component.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Agree the condition and complete set of pieces",
        "body": "Ask the seller whether shelves, legs and doors have been removed and photograph the item before handover. List every chair or matching part included in a purchase. State the receiving floor and room and raise any assembly or old-item removal request separately when discussing the delivery."
      }
    ],
    "faqs": [
      {
        "question": "Can a Stirling furniture delivery use a pedestrian shortcut?",
        "answer": "The vehicle needs a suitable road approach and the team needs an agreed carrying route. Provide entrance details and measurements rather than relying on a walking shortcut."
      },
      {
        "question": "What if the seller cannot give the furniture’s weight?",
        "answer": "Provide material, dimensions and clear photos, and flag unusually heavy construction. Some items need further assessment before their handling can be agreed."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "office-removal",
    "title": "Office removals in Stirling",
    "description": "Plan a Stirling office relocation with the correct service approach, traffic permissions, labelled equipment and a controlled business handover.",
    "introduction": "A Stirling office move needs an access plan that matches the building’s working arrangements. Identify who can release equipment and open service doors, then organise the desks, storage and IT hardware by destination rather than by whichever room is cleared first.",
    "sections": [
      {
        "title": "Verify the goods route for Old Town premises",
        "body": "Stirling’s historic vennels provide pedestrian links, including between Baker Street and Spittal Street. For an office nearby, ask the facilities contact which street and entrance serve deliveries. Document the route for cabinets and meeting tables separately from the route staff normally use on foot.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Apply for street arrangements where needed",
        "body": "Stirling Council handles applications for parking suspensions and other temporary traffic restrictions. Check whether an arrangement is needed for the actual service entrance, then coordinate it with lift use and security attendance. A building manager’s agreement to an evening move does not itself reserve public road space.",
        "source": {
          "label": "Stirling traffic restriction applications",
          "href": "https://www.stirling.gov.uk/roads-transport-and-parking/roads-and-pavements/apply-for-traffic-restrictions/"
        }
      },
      {
        "title": "Protect the reopening sequence",
        "body": "Create workstation labels, a destination floor plan and a list of equipment that stays. Have your IT provider control shutdown and testing, and assign an employee to confidential records. If moving in stages, give each stage a named recipient who can confirm the correct furniture has arrived."
      }
    ],
    "faqs": [
      {
        "question": "Can a Stirling office move be scheduled around client appointments?",
        "answer": "Discuss staged collections and identify equipment that must remain available. The schedule depends on the agreed inventory, access windows and staff responsible for handover."
      },
      {
        "question": "Are leased printers treated like ordinary office furniture?",
        "answer": "Identify them in advance and check the lease provider’s handling requirements. They may need preparation or approval before transport; do not leave that decision until loading."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "student-move",
    "title": "Student moves in Stirling",
    "description": "Prepare a Stirling student move with Accommodation Dashboard arrival details, residence keys, personal inventories and shared-flat access.",
    "introduction": "For a Stirling student move, connect transport to the time you can actually enter the accommodation. Count personal belongings, confirm what furniture is supplied and keep the residence’s key collection instructions with you during the move.",
    "sections": [
      {
        "title": "Use the arrival slot for your own residence",
        "body": "The University of Stirling’s moving-in guide directs students to complete induction and arrival selection through the Accommodation Dashboard. The resulting paperwork identifies the key collection point and slot. Share the confirmed residence delivery details after these are established rather than using a generic university address.",
        "source": {
          "label": "University of Stirling moving-in guide",
          "href": "https://www.stir.ac.uk/student-life/accommodation/accommodation-life/moving-in/"
        }
      },
      {
        "title": "Plan a private-flat move as a separate access job",
        "body": "When leaving halls for a Stirling flat, record the new building’s stair, buzzer and loading side. If the entrance is near the Old Town vennels, distinguish the pedestrian route from vehicle access. Label belongings by student and room so a combined housemate move can be unloaded without mixing possessions.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Keep the first day’s essentials separate",
        "body": "Pack books in manageable boxes and identify screens, bikes or instruments individually. Check communal kitchen items before loading them. Give the old tenancy’s exit deadline and new tenancy’s start together; any gap requiring storage or a second delivery must be discussed before transport is agreed."
      }
    ],
    "faqs": [
      {
        "question": "Can the van arrival be based on my Stirling course start date?",
        "answer": "Use the confirmed accommodation access and key slot instead. Course dates do not establish when your room or building can accept belongings."
      },
      {
        "question": "Can you take my belongings from Stirling to a home in Wales?",
        "answer": "Yes, a move can begin in Stirling and finish elsewhere in Britain. Include the destination contact and access details with the room inventory."
      }
    ]
  },
  {
    "areaSlug": "stirling",
    "serviceSlug": "packing-service",
    "title": "Packing help in Stirling",
    "description": "Arrange Stirling packing assistance around fragile possessions, stepped or sloping access, room labels and moving-day essentials.",
    "introduction": "Packing assistance in Stirling should reflect how possessions leave the property as well as what they are. Identify delicate and oversized items, decide what you will pack yourself and keep a clear indoor area for the agreed work.",
    "sections": [
      {
        "title": "Prepare cartons for the outside approach",
        "body": "The upper Old Town has a hilltop setting around the castle. If your own entrance involves sloping or stepped access, describe it before heavy contents are boxed. Smaller loads for books and crockery can make the carrying plan clearer; completed cartons should remain inside rather than be staged along a public route.",
        "source": {
          "label": "Historic Environment Scotland: Stirling Castle approach",
          "href": "https://www.historicenvironment.scot/visit/all/stirling-castle/plan-your-visit/"
        }
      },
      {
        "title": "Measure large wrapped objects against passages",
        "body": "For a property reached near the Upper or Sma’ Vennel, identify the usable carrying route before wrapping mirrors or furniture. These are pedestrian connections documented by the council; your entrance may involve further turns. Allow for the added size of protection and discuss dismantling before pieces are enclosed.",
        "source": {
          "label": "Stirling Council historic pedestrian routes",
          "href": "https://www.stirling.gov.uk/news/drop-in-event-arranged-for-project-to-transform-medieval-stirling-streets/"
        }
      },
      {
        "title": "Separate preparation from loading permission",
        "body": "If packing and collection take place on different dates, arrange building access for each. Check Stirling’s traffic restriction process where road space needs reserving. Mark retained possessions clearly and keep keys, medication and the first-night essentials outside the packing scope until the move is complete.",
        "source": {
          "label": "Stirling traffic restriction applications",
          "href": "https://www.stirling.gov.uk/roads-transport-and-parking/roads-and-pavements/apply-for-traffic-restrictions/"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can I request packing help only for large fragile items in Stirling?",
        "answer": "List each object with dimensions, material and photographs. Agree the appropriate protection and handling, including whether specialist preparation is needed."
      },
      {
        "question": "Should packing include dismantling my wardrobes?",
        "answer": "Raise dismantling separately when describing the scope. The furniture’s construction and exit route need assessing before assuming it can be taken apart and reassembled."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "house-removal",
    "title": "House removals in Dunfermline",
    "description": "Plan a Dunfermline household move with loading arrangements, a complete contents list, entrance checks and delivery anywhere in Britain.",
    "introduction": "A house removal from Dunfermline starts with the full inventory and the point where the vehicle can load. Include rooms, storage and outdoor contents, then explain the entrance and the receiving arrangements for your next home.",
    "sections": [
      {
        "title": "Plan street space through the correct process",
        "body": "Fife Council distinguishes task-specific dispensations and bay suspensions from ordinary parking. Where your Dunfermline collection depends on the public street, check which arrangement is appropriate before fixing the loading sequence. For a driveway, provide usable width, gate details and space to turn or leave safely.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "Inspect the carrying route beyond the map pin",
        "body": "Fife’s design guidance illustrates steps at Free School Lane in Dunfermline. It is a reminder that a city-centre pedestrian connection may include levels the vehicle cannot follow. For your own home, photograph outside steps, passages and the actual entrance, including the route used for garage or garden contents.",
        "source": {
          "label": "Fife Council: Making Fife’s Places",
          "href": "https://www.fife.gov.uk/__data/assets/file/0018/42057/Making-Fifes-Places-Supplementary-Guidance-August-2018.pdf"
        }
      },
      {
        "title": "Connect collection readiness with the new keys",
        "body": "Identify furniture needing dismantling and keep essentials separate from the main load. Agree who can receive the move and where large pieces should go. A move can start in Dunfermline and finish elsewhere in Britain, but key timing and access at the destination still need to be established."
      }
    ],
    "faqs": [
      {
        "question": "Can a Dunfermline house move include loft and shed contents?",
        "answer": "Yes, include them in the inventory with the access required. Heavy tools, ladders and outdoor items need to be described rather than assumed from the bedroom count."
      },
      {
        "question": "Does a resident parking permit reserve space for the removal van?",
        "answer": "Do not assume it does. Check the proposed loading arrangement with Fife Council and confirm whether a specific permission or suspension is required."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "flat-removals",
    "title": "Flat removals in Dunfermline",
    "description": "Prepare a Dunfermline flat removal with entrance and stair measurements, lawful loading, shared access and a receiving-room plan.",
    "introduction": "For a Dunfermline flat move, explain the route from the street to your room in both buildings. Floor level is only one part of the job: exterior steps, shared doors and the final carrying distance all need to be included.",
    "sections": [
      {
        "title": "Look for steps outside as well as inside",
        "body": "The council’s place-design guidance includes the stepped route at Free School Lane. If your flat uses a nearby pedestrian approach, inspect the actual route and record every level change. Measure awkward turns with the largest furniture in mind and provide the separate residential entrance if the flat sits above business premises.",
        "source": {
          "label": "Fife Council: Making Fife’s Places",
          "href": "https://www.fife.gov.uk/__data/assets/file/0018/42057/Making-Fifes-Places-Supplementary-Guidance-August-2018.pdf"
        }
      },
      {
        "title": "Establish the loading point before estimating stair trips",
        "body": "Fife Council’s permission process is specific to the loading task and location. Describe where the van could stand, how far items must travel and whether the entrance can remain staffed. A nearby parking space should not be treated as reserved simply because it is convenient for the flat.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "Coordinate the two buildings",
        "body": "Ask the factor or landlord about shared-door arrangements and any lift restrictions. Keep packed belongings off common landings and identify furniture that must be dismantled. Send the receiving flat’s access details separately; its narrower door or smaller lift can change how the load should be prepared."
      }
    ],
    "faqs": [
      {
        "question": "What should I send for a Dunfermline flat above a shop?",
        "answer": "Give the residential entrance, floor, stair photos and carrying route from the loading point. Include any access controlled by the shop or another occupier."
      },
      {
        "question": "Can a parking permission resolve a narrow stair?",
        "answer": "No. Road access and furniture fit need separate checks. Provide item dimensions and the narrowest doors and turns before the move is agreed."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "furniture-delivery",
    "title": "Furniture delivery in Dunfermline",
    "description": "Arrange Dunfermline furniture collections with item measurements, seller access, loading checks and a clearly agreed destination room.",
    "introduction": "Furniture delivery in Dunfermline needs a precise item list and a confirmed handover at both ends. Obtain dimensions and photographs from the seller before deciding that an assembled sofa, table or wardrobe will fit the receiving entrance.",
    "sections": [
      {
        "title": "Compare the item with the final carrying route",
        "body": "If delivery involves a central pedestrian passage, inspect it for steps and turns. Free School Lane’s steps appear in Fife Council’s design guidance, illustrating why a nearby map pin is not enough. Check your own building route, including the flat door or garden gate the furniture must pass through.",
        "source": {
          "label": "Fife Council: Making Fife’s Places",
          "href": "https://www.fife.gov.uk/__data/assets/file/0018/42057/Making-Fifes-Places-Supplementary-Guidance-August-2018.pdf"
        }
      },
      {
        "title": "Confirm loading rather than just seller availability",
        "body": "Ask where the furniture will be released and whether it is already dismantled or upstairs. Fife Council’s dispensation and suspension guidance should be consulted where public-street loading needs an arrangement. Share every seller address and time window before adding further collections to the job.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "Keep all components and requests visible",
        "body": "List loose shelves, glass panels, chairs and fittings as part of the purchase. Photograph condition at handover and nominate someone to accept delivery. Tell us the receiving floor and whether assembly, dismantling or removal of an old item is requested; those tasks need an explicit agreement."
      }
    ],
    "faqs": [
      {
        "question": "Can you collect several furniture purchases around Dunfermline?",
        "answer": "Provide all addresses, item dimensions and seller windows together. The route, combined volume and handling should be agreed before individual collections are promised."
      },
      {
        "question": "Does delivery mean the furniture will be assembled?",
        "answer": "Assembly is a separate requirement to discuss. Describe the item, its current condition and available instructions so the requested work is clear."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "office-removal",
    "title": "Office removals in Dunfermline",
    "description": "Plan a Dunfermline business move with service access, current road checks, workstation labels and a controlled equipment handover.",
    "introduction": "A Dunfermline office move needs a clear sequence for furniture, files and equipment. Nominate building contacts at both ends and map every workstation to its destination so the physical relocation supports your organisation’s reopening plan.",
    "sections": [
      {
        "title": "Confirm goods access and any street arrangement",
        "body": "Ask the facilities manager for the service entrance, loading area, lift dimensions and security procedure. If the move relies on a public street, review Fife Council’s task-specific dispensation or suspension process. Building access approval and a street loading arrangement should be established separately before the period is agreed.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      },
      {
        "title": "Check notices for the actual move date",
        "body": "Fife Council publishes temporary restrictions and closures with dates and alternative routes. Review the approach to both offices near the move, including any route to a rear service yard. An older delivery instruction from the building may need updating if road access has changed.",
        "source": {
          "label": "Fife temporary restrictions and closures",
          "href": "https://www.fife.gov.uk/roads-travel-parking/roads-and-pavements/legal-ordersnotices/temporary-restrictions-and-closures"
        }
      },
      {
        "title": "Hand over equipment by destination",
        "body": "Label desks, monitors and cable containers with matching references and identify leased equipment. Your IT provider should control backups, disconnection and reconnection. Assign an employee to confidential records, mark furniture that stays and agree receiving contacts for each stage if the office remains partly operational."
      }
    ],
    "faqs": [
      {
        "question": "Can a Dunfermline office relocation include a separate archive store?",
        "answer": "List the store address, boxed contents, shelving and access window. Dense archives and extra stops need to be included in the inventory and loading sequence."
      },
      {
        "question": "Can the move happen outside office hours?",
        "answer": "Discuss the period you need and confirm security, lift and loading access. Out-of-hours timing does not itself grant permission or establish crew availability."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "student-move",
    "title": "Student moves in Dunfermline",
    "description": "Prepare a Dunfermline student move with the correct rental address, personal belongings, key timing and campus-location checks.",
    "introduction": "A student move in Dunfermline may mean setting up a private room near college or leaving the city for the next stage of study. Plan transport using your actual home address and tenancy dates, then list only the belongings you own.",
    "sections": [
      {
        "title": "Distinguish the college campus from your accommodation",
        "body": "Fife College identifies its Dunfermline City campus at Calaiswood Crescent. That teaching location should not be used as a delivery address for a private tenancy. Obtain the full room or flat address, landlord’s key arrangements and a receiving contact before setting the move’s destination.",
        "source": {
          "label": "Fife College Dunfermline City campus",
          "href": "https://www.fife.ac.uk/campuses-facilities/new-dunfermline-city-campus/"
        }
      },
      {
        "title": "Build a personal inventory for the room",
        "body": "Count boxes and bags and describe screens, bikes and any desk or chair separately. Confirm supplied furniture with the landlord before moving another bed. In a shared house, label kitchenware and personal possessions so a housemate’s or landlord’s property is not accidentally included in the load."
      },
      {
        "title": "Prepare for the street and tenancy handover",
        "body": "Give the floor, stair and loading approach for both addresses. Use Fife Council’s guidance if a street arrangement is needed, and agree who will open the property. A gap between leaving one room and receiving new keys needs a separate plan; reception or temporary storage should not be assumed.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can I have belongings delivered to Fife College instead of my room?",
        "answer": "Use the actual accommodation address unless an authorised college contact has explicitly agreed another arrangement. The campus address does not establish a student storage or delivery service."
      },
      {
        "question": "Can the student move leave Dunfermline for another British city?",
        "answer": "Yes, the collection can begin in Dunfermline and delivery can be elsewhere in Britain. Include the new address, receiving contact and property access with your inventory."
      }
    ]
  },
  {
    "areaSlug": "dunfermline",
    "serviceSlug": "packing-service",
    "title": "Packing help in Dunfermline",
    "description": "Plan Dunfermline packing assistance with fragile-item details, manageable cartons, clear access and room labels for the next home.",
    "introduction": "Packing help for a Dunfermline move should begin with an agreed scope. Identify rooms, delicate possessions and furniture requiring preparation, then set aside belongings staying at the property or travelling with you.",
    "sections": [
      {
        "title": "Pack for the complete exit route",
        "body": "Outside steps can matter as much as the internal stair. Fife Council’s guidance shows the stepped connection at Free School Lane; inspect your own entrance and passage for comparable changes of level. Describe large mirrors and framed pieces before wrapping, and use manageable cartons for dense contents.",
        "source": {
          "label": "Fife Council: Making Fife’s Places",
          "href": "https://www.fife.gov.uk/__data/assets/file/0018/42057/Making-Fifes-Places-Supplementary-Guidance-August-2018.pdf"
        }
      },
      {
        "title": "Separate fragile work from general boxing",
        "body": "List crockery, glass, screens and collections that need individual attention. Keep furniture fittings together and identify pieces that must be dismantled before protection is applied. Mark boxes by destination room and briefly describe contents so the receiving person can find essentials without opening every carton."
      },
      {
        "title": "Allow for a packing visit and collection separately",
        "body": "If work is split across dates, confirm entry and working space for each visit. Fife’s parking permission guidance concerns a specific task, so check the dates and activity rather than assuming one arrangement covers everything. Keep completed cartons inside and away from shared escape routes while waiting for collection.",
        "source": {
          "label": "Fife parking dispensations and suspensions",
          "href": "https://www.fife.gov.uk/roads-travel-parking/parking-and-car-parks/parking-dispensations-and-parking-suspensions"
        }
      }
    ],
    "faqs": [
      {
        "question": "Can packing help cover only part of a Dunfermline house?",
        "answer": "List the rooms and contents that need assistance and what you will pack yourself. Materials, dismantling and unusually delicate items should be discussed as part of that scope."
      },
      {
        "question": "What should stay out of the packed load?",
        "answer": "Keep keys, identification, medication and immediate travel essentials with you. Clearly mark belongings that remain at the old property so they are not packed by mistake."
      }
    ]
  }
];
