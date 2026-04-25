// Static lists for the European removals enquiry flow.
// Kept on the web side so the form can render without an API call.

export interface EuropeanCountry {
  name: string;
  flag: string;
}

export const EUROPEAN_COUNTRIES: EuropeanCountry[] = [
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Croatia", flag: "🇭🇷" },
];

export const PROPERTY_TYPES = [
  "Studio",
  "Flat",
  "House",
  "Office",
  "Storage Unit",
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const NO_BEDROOMS_TYPES: PropertyType[] = ["Office", "Storage Unit"];

export interface IndicativePrice {
  destination: string;
  fromPrice: number;
}

export const INDICATIVE_PRICES: IndicativePrice[] = [
  { destination: "Scotland → Ireland", fromPrice: 800 },
  { destination: "Scotland → France", fromPrice: 1200 },
  { destination: "Scotland → Netherlands", fromPrice: 1400 },
  { destination: "Scotland → Germany", fromPrice: 1500 },
  { destination: "Scotland → Spain", fromPrice: 2000 },
  { destination: "Scotland → Italy", fromPrice: 2200 },
  { destination: "Scotland → Scandinavia", fromPrice: 2500 },
  { destination: "Scotland → Eastern EU", fromPrice: 2000 },
];

export const FLEX_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
