# Signal OS

Signal OS is an **attention intelligence platform for X**. It helps founders, creators, and agencies evaluate post quality **before publishing** and take better actions in the critical **first 60 minutes after posting**.

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

- **Frontend:** React / Next.js
- **Auth + DB:** Supabase Auth + Postgres
- **Backend:** Next.js API routes or lightweight Node service
- **Scoring:** Python FastAPI service
- **Payments:** Stripe
- **Hosting:** Vercel / Fly.io / Render

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

1. Copy `.env.example` to `web/.env.local`.
2. Start the scoring service:
   - `python -m uvicorn main:app --host 127.0.0.1 --port 8000` from `services/scoring/`
3. Start the web app:
   - `npm install`
   - `npm run dev` from `web/`

`APP_MODE=demo` keeps the whole app available locally without authentication so the product can be shown end to end.

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
