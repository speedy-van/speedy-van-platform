export type BookingFlowStep = 1 | 2 | 3 | 4 | 5;

export interface BookingProgressStep {
  step: Exclude<BookingFlowStep, 1>;
  number: 1 | 2 | 3 | 4;
  label: string;
  isPay: boolean;
}

export interface BookingStepInfo {
  number: 0 | 1 | 2 | 3 | 4;
  total: 4;
  label: string;
  isPay: boolean;
}

export const STEP_PRIMARY_CTA_ID = "step-primary-cta";
export const LEGACY_PRIMARY_CTA_ID = "booking-primary-action";

export const BOOKING_STEPS: readonly BookingProgressStep[] = [
  { step: 2, number: 1, label: "Journey", isPay: false },
  { step: 3, number: 2, label: "Items", isPay: false },
  { step: 4, number: 3, label: "Date", isPay: false },
  { step: 5, number: 4, label: "Pay", isPay: true },
] as const;

export function stepInfo(step: BookingFlowStep): BookingStepInfo {
  const current = BOOKING_STEPS.find((item) => item.step === step);
  if (!current) return { number: 0, total: 4, label: "Service", isPay: false };
  return {
    number: current.number,
    total: 4,
    label: current.label,
    isPay: current.isPay,
  };
}
