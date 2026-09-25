import type { BookingState, PriceLineItem } from "./booking-store";
import type { PricingResult } from "@/components/booking/quote-response";

/** A quote belongs to the whole move, including inventory changes at the same address. */
export function getBookingPricingRequest(state: BookingState) {
  return {
    serviceType: state.entryServiceSlug || state.serviceSlug,
    serviceVariant: state.serviceVariant || undefined,
    distanceMiles: state.distanceMiles,
    pickupFloor: state.pickupFloor,
    pickupHasLift: state.pickupHasLift,
    dropoffFloor: state.dropoffFloor,
    dropoffHasLift: state.dropoffHasLift,
    helpersCount: state.helpersCount,
    needsPacking: state.needsPacking,
    needsAssembly: state.needsAssembly,
    pickupLat: state.pickup?.lat,
    pickupLng: state.pickup?.lng,
    selectedItems: state.items,
  };
}

export function getBookingPricingKey(state: BookingState): string {
  return JSON.stringify({
    request: getBookingPricingRequest(state),
    pickup: state.pickup,
    dropoff: state.dropoff,
    pickupPropertyType: state.pickupPropertyType,
    dropoffPropertyType: state.dropoffPropertyType,
    bedroomCount: state.bedroomCount,
    exactBedroomCount: state.exactBedroomCount,
  });
}

export function canRequestBookingQuote(state: BookingState): boolean {
  return Boolean(state.serviceSlug && state.pickup && state.dropoff &&
    Number.isFinite(state.distanceMiles) && state.distanceMiles > 0 &&
    state.items.length > 0 && state.items.every((item) => Number.isInteger(item.quantity) && item.quantity > 0));
}

export function getQuoteSelection(pricing: PricingResult, date: string, slot: string): {
  clientTotal: number;
  priceBreakdown: PriceLineItem[];
  quoteStatus: BookingState["quoteStatus"];
  quoteError: string;
} {
  const selected = pricing.days.find((day) => day.date === date)?.slots.find((entry) => entry.slot === slot);
  if (!selected) return {
    clientTotal: 0,
    priceBreakdown: pricing.staticLineItems,
    quoteStatus: date && slot ? "stale" : "incomplete",
    quoteError: date && slot ? "Your previous appointment is no longer available. Please choose another slot." : "",
  };
  const adjustment = Math.round((selected.price - pricing.staticSubtotal) * 100) / 100;
  return {
    clientTotal: selected.price,
    priceBreakdown: [...pricing.staticLineItems, ...(Math.abs(adjustment) >= 0.01 ? [{
      label: adjustment > 0 ? "Date and time adjustment" : "Date and time saving",
      amount: adjustment,
      type: adjustment > 0 ? "surcharge" : "discount",
    }] : [])],
    quoteStatus: "valid",
    quoteError: "",
  };
}
