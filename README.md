# Signal OS

Signal OS is an **AI-powered attention intelligence and decision cockpit for X/social signals**. It helps founders, creators, agencies, and growth teams evaluate post quality before publishing, track first-hour performance, inspect trend signals, and turn observed engagement into better decisions.

## Product Thesis

Signal OS is not a scheduler, not a generic AI writer, and not a growth-hack bot.  
It is a performance intelligence layer built around this core loop:

**Score → Improve → Publish → Track → Learn**

## Core Value

### Before Posting
- Attention score with explainable breakdown
- Weakness diagnosis
- Rewrite suggestions
- Audience-fit and risk signals
- Expected performance range

### After Posting
- First-hour momentum tracking
- Reply prioritization and response suggestions
- Engagement timing guidance
- Post-decay warnings
- Post autopsy and weekly learning reports

### Trend Intelligence Cockpit
- Dashboard-level signal score, trend velocity, sentiment, creator, hashtag, topic, and forecast views
- Realistic demo data for investor/product walkthroughs
- Clear labeling when a surface is demo/mock rather than live X API data

## Strategic Rule

**Free users get prediction. Paid users get action.**

- **Free:** score, basic diagnosis, limited rewrites, shareable scorecards
- **Paid:** First-60-Minutes Command Center, Reply Assistant, advanced tracking, post autopsy, deeper weekly reports

## MVP Scope

The MVP is intentionally narrow and validates:
1. Demand for pre-publish scoring
2. Trust in explainable recommendations
3. Habit of outcome tracking
4. Willingness to pay for first-hour guidance

### MVP Features
- Draft Score
- Account Import (API / BYO API key / Manual)
- Publish Tracking (10m, 30m, 60m, 24h, 7d)
- Reply Assistant (human approval required)
- Weekly Report

## Architecture (V1)

- **Frontend:** Next.js App Router, React, TypeScript, custom reusable CSS/component system
- **Auth + DB:** Supabase Auth + Postgres
- **Backend:** Next.js API routes or lightweight Node service
- **Scoring:** Python FastAPI service
- **Payments:** Stripe
- **Hosting:** Vercel / Fly.io / Render

This repository does not currently install Tailwind CSS, shadcn/ui, Recharts, or TanStack Table. The current app uses custom CSS and code-native tables/charts to avoid a risky dependency migration before the product architecture is stable.

## Compliance & Reliability Principles

- Official API usage where available
- No scraping or browser automation
- No auto-engagement without human approval
- Graceful fallback modes:
  1. Full API Mode
  2. BYO API Key Mode
  3. Manual Mode

## Business Goal

Signal OS compounds into a data moat by capturing **prediction vs actual** outcomes over time.  
The long-term defensibility is not the visible scoring UI—it is the proprietary performance dataset and account-specific learning.

## Reference Document

For the complete investor-grade requirements, see [`BRD.md`](./BRD.md).

## Local Development

1. Copy `.env.example` to `web/.env.local` and replace public Supabase values for your own project when needed.
2. Install web dependencies from `web/`:
   - `npm install`
3. Start the scoring service:
   - `python -m uvicorn main:app --host 127.0.0.1 --port 8000` from `services/scoring/`
4. Start the web app:
   - `npm run dev` from `web/`

`APP_MODE=demo` keeps the whole app available locally without authentication so the product can be shown end to end.

## Environment Variables

- `SCORING_SERVICE_URL`: URL for the FastAPI scoring service.
- `NEXT_PUBLIC_APP_URL`: public app URL for redirects and Stripe return URLs.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL. Public by design.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase browser/server publishable key. Do not use a service-role key here.
- `APP_MODE`: `demo` or `production`.
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_CREATOR`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCY`: needed only for checkout.

## Development Commands

Run these from `web/`:

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Backend API For Designed Frontend

The static frontend in `web/public/signal-os` is the visual source of truth. It is backed by these Next.js API routes:

- `GET /api/signal-os/overview`
- `POST /api/signal-os/analyze`
- `GET /api/signal-os/reports`
- `POST /api/signal-os/reports`
- `GET /api/signal-os/settings`
- `POST /api/signal-os/settings`
- `POST /api/signal-os/auth`

In `APP_MODE=demo`, these routes return safe demo data. In production, they are intended to use Supabase workspace-scoped tables and RLS.

## Production Readiness

Before public launch, configure:

- Supabase project, auth, and migration deployment
- `APP_MODE=production`
- Supabase Auth callback URL: `/auth/callback`
- Stripe secret key and price IDs
- X API credentials or a documented BYO/manual fallback workflow
- Hosting, domain, monitoring, backups, and support/legal pages

In production, paid surfaces are intended to be gated by plan:

- `creator`: command center, reply assistant, weekly report
- `pro`: advanced tracking
- `agency`: higher-volume team usage
