# Speedy Van — Removal Platform

Professional furniture removal platform serving Glasgow, Edinburgh, Dundee and 27+ areas across Scotland.

## Architecture

```
speedy-van/
├── apps/
│   ├── web/          → Next.js 14 (customers, admin, driver portal)
│   └── api/          → Hono.js REST API (60+ endpoints)
├── packages/
│   ├── db/           → Prisma + Neon PostgreSQL
│   ├── shared/       → Types, validations, utils
│   ├── config/       → Brand, services, areas
│   └── email/        → Resend email templates
└── scripts/          → Dev tooling
```

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, Tailwind CSS, Framer Motion |
| API | Hono.js on Node / Vercel |
| Database | Neon PostgreSQL + Prisma ORM |
| Payments | Stripe |
| Maps | Mapbox GL |
| Email | Resend |
| iOS App | Expo / React Native (separate repo) |

## Features

- 4-step booking flow with 600+ item images
- Airline-style pricing calendar (14 days × 3 time slots)
- Weather-aware dynamic pricing
- Public driver job board
- Driver portal with GPS tracking, earnings, performance stats
- Admin dashboard (bookings, pricing, drivers, analytics, visitor tracking)
- Real-time order tracking with live map
- 3-way chat (customer ↔ driver ↔ admin)
- Invoice PDF generation (PDFKit)
- Cookie consent + GA4 / Facebook / TikTok pixels
- 27 area pages + 10 service pages (SEO-optimised)
- iOS driver app API compatibility (all endpoints documented)

## Quick Start

```bash
git clone [repo]
npm install
cp .env.example .env.local
# Fill in env vars (see .env.example)
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
# Web:  http://localhost:3000
# API:  http://localhost:4000
```

## Dev Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@speedyvan.com | Admin123! |
| Driver | driver@speedyvan.co.uk | driver123 |

## Environment Variables

See `.env.example` at the root for all required variables.

Key variables:

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | root `.env.local` | Neon Postgres connection string |
| `JWT_SECRET` | root `.env.local` | JWT signing secret |
| `STRIPE_SECRET_KEY` | root `.env.local` | Stripe secret key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | root `.env.local` | Mapbox GL token |
| `RESEND_API_KEY` | root `.env.local` | Resend email key |
| `NEXT_PUBLIC_API_URL` | root `.env.local` | API base URL (http://localhost:4000 in dev) |

## Deploy

### Web (Vercel — main project, speedy-van.co.uk)

```bash
vercel --prod
```

Uses `vercel.json` at root. Add all env vars in Vercel dashboard.

### API (Vercel — separate project, api.speedy-van.co.uk)

```bash
cd apps/api && vercel --prod
```

Uses `apps/api/vercel.json`. Set `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web (:3000) + API (:4000) concurrently |
| `npm run build` | Build all workspaces |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to Neon DB |
| `npm run db:seed` | Seed demo data |
| `npm run typecheck` | TypeScript check all workspaces |

## Phase History

- ✅ **Phase 1** — Foundation: monorepo, schema, Next.js, 37 SEO pages
- ✅ **Phase 2** — Booking flow: 4-step wizard, Stripe, quote engine
- ✅ **Phase 3** — Pricing engine: calendar, weather, dynamic pricing
- ✅ **Phase 4** — Items catalog: 600+ items with images
- ✅ **Phase 5** — Admin dashboard: 9 pages, analytics, visitor tracking
- ✅ **Phase 6** — Driver portal: job board, GPS, pay management
- ✅ **Phase 7** — Tracking & chat: live map, 3-way messaging, pixels
- ✅ **Phase 8** — iOS compatibility, invoice PDF, deployment, SEO, production checklist
