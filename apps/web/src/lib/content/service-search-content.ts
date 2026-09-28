export interface ServiceSearchContent {
  metadataTitle: string;
  metadataDescription: string;
  headline: string;
  introduction: string;
}

export const SERVICE_SEARCH_CONTENT: Partial<Record<string, ServiceSearchContent>> = {
  "man-and-van": {
    metadataTitle: "Man and Van Scotland | Quotes for Your Move",
    metadataDescription:
      "Need a man with a van in Scotland? Get a quote for small moves, furniture collections and loading help. Share your items, addresses and date to check options.",
    headline: "Man and van for your next move in Scotland",
    introduction:
      "Need a man with a van for a few items, a flat load or furniture collection? Get a quote for transport and loading help across Scotland. Whether you call it man and van or van and man, we plan around the items, both addresses and the crew you need. Keep costs in view by listing boxes, stairs, parking and any extra stops before you book. Short-notice moves depend on available capacity.",
  },
  "house-removal": {
    metadataTitle: "House Removals Scotland | Get a Moving Quote",
    metadataDescription:
      "Plan your house removal in Scotland with a quote for your full inventory, van and crew. Include access, keys and packing needs before confirming your move.",
    headline: "House removals across Scotland, planned around your home",
    introduction:
      "Moving your whole home starts with a clear plan and a quote for everything you are taking. Our house removals cover smaller homes and full-house moves across Scotland, with the van and crew matched to your furniture, boxes and access. Include the loft, garage and garden items as well as the main rooms. Tell us about key collection, fragile pieces and any packing or dismantling help you need. Request your moving quote and agree the scope before you book.",
  },
  "furniture-delivery": {
    metadataTitle: "Furniture Movers Scotland | Collection & Delivery",
    metadataDescription:
      "Furniture movers for sofas, beds, tables and wardrobes across Scotland. Get a collection and delivery quote for homes, shops, private sellers or storage.",
    headline: "Furniture movers for collection and delivery across Scotland",
    introduction:
      "Bought a sofa, moving a bed or arranging a furniture collection? Request a quote to move sofas, tables, chairs, beds and wardrobes between homes, shops, private sellers and storage across Scotland. Our furniture movers plan the van and lifting help around your items and the access at both addresses. Delivery to your chosen room depends on safe access and the furniture fitting the route. Send dimensions, floor numbers and the collection window so your quote covers the work you need.",
  },
  "office-removal": {
    metadataTitle: "Office Removals Scotland | Workplace Moving Quotes",
    metadataDescription:
      "Get an office removal quote in Scotland for desks, chairs, files and boxed office equipment. Plan workplace access and team handover before moving.",
    headline: "Office removals across Scotland",
    introduction:
      "Move your workplace with a quote based on office furniture, boxed equipment, building access and staff handover. Our office removals cover desks, chairs, filing cabinets and boxed office equipment across Scotland. Share the inventory, destination layout, loading bay and lift arrangements so the crew can plan collection and unloading. Evening and weekend options depend on availability; arrange IT disconnection and reconnection separately with your own team. For shops, studios and wider commercial moves, use business removals instead.",
  },
  "business-removals": {
    metadataTitle: "Business Removals Scotland | Commercial Moving Quotes",
    metadataDescription:
      "Business removals and commercial relocation in Scotland for shops, studios, commercial furniture and suitable business equipment. Get a quote by route and inventory.",
    headline: "Business removals and commercial relocation across Scotland",
    introduction:
      "Move a shop, studio, commercial furniture load or suitable business equipment with a quote based on the real inventory, access and route. Business removals are kept separate from office-only moves so stock, displays, shelving, business equipment and service entrances can be assessed properly. Share the release contact, loading bay, access window, destination layout and any fragile or heavy items before booking. Specialist machinery, hazardous goods and installation work are not assumed.",
  },
  "storage-transport": {
    metadataTitle: "Storage Transport Scotland | Storage Collection & Delivery",
    metadataDescription:
      "Storage transport in Scotland for furniture, boxes and student belongings going to or from a booked storage unit. Transport only, not storage rental.",
    headline: "Storage transport to and from your unit",
    introduction:
      "Move furniture, boxes, student belongings or a small load into or out of a booked storage unit. Storage transport covers the van, route and lifting plan; it does not sell storage space. Provide the home address, facility address, unit floor, opening hours, lift or trolley access and the item list before booking. If the move includes a later delivery or another stop, include it in the original quote request.",
  },
  "long-distance-removals": {
    metadataTitle: "Long Distance Removals from Scotland Across Britain",
    metadataDescription:
      "Move within Scotland or from Scotland to England and Wales. Request a long distance man and van or removals quote for your furniture, flat or full home.",
    headline: "Long distance removals from Scotland across Britain",
    introduction:
      "Move furniture, a flat or a whole home within Scotland, or from a Scottish city, town or village to anywhere in Britain. We accept onward moves to England and Wales as well as Scottish intercity journeys. Request a long distance man and van or removals quote using your full load and both addresses. Distance in miles, van space, crew time and access shape the price. Include storage stops, key handovers and any ferry requirement so collection and delivery are planned together.",
  },
  "same-day-delivery": {
    metadataTitle: "Urgent Man and Van Delivery Scotland | Get a Quote",
    metadataDescription:
      "Need urgent furniture or item delivery in Scotland? Request a same-day man and van quote. Collection depends on driver, vehicle and route availability.",
    headline: "Urgent man and van delivery across Scotland",
    introduction:
      "Need furniture, business items, parcels or replacement parts moved at short notice? Ask about urgent man and van delivery with direct collection and delivery across Scotland. Send the item dimensions, both addresses, access details and the time the delivery is needed. Same-day work depends on a suitable driver, vehicle and route being available, so wait for confirmation before committing to collection arrangements. For an urgent house or flat move, use the relevant removals service so the full inventory and crew requirements can be assessed.",
  },
};
