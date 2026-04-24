export const SITE = {
  name: "Speedy Van",
  shortName: "SpeedyVan",
  domain: "speedy-van.co.uk",
  url: "https://www.speedy-van.co.uk",
  email: "hello@speedy-van.co.uk",
  supportEmail: "support@speedy-van.co.uk",
  phone: "+44 800 000 0000",
  address: "London, United Kingdom",
  social: {
    twitter: "@speedyvanuk",
    facebook: "speedyvanuk",
    instagram: "speedyvanuk",
  },
} as const;

export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://www.speedy-van.co.uk",
  "https://speedy-van.co.uk",
] as const;
