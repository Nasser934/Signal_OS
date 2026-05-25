# Signal OS Product Overview

## Project Overview

Signal OS turns social signals into decisions. The product combines draft scoring, first-hour tracking, account baselines, reply prioritization, weekly learning, and a demo trend-intelligence cockpit.

## Target Users

- Founders and creator teams publishing on X
- Social media analysts
- Agencies and growth teams
- AI/product teams monitoring category conversations
- Investors reviewing market and creator momentum

## Core Features

- Draft scoring with explainable components
- Manual account import and baseline generation
- Publish handoff and first-hour tracking
- Reply assistant with human approval
- Weekly report loop
- Dashboard cockpit for posts, topics, creators, hashtags, sentiment, forecasts, and recommended actions

## User Journey

1. User opens the dashboard and sees current signal momentum.
2. User imports account history or uses demo mode.
3. User scores a draft before publishing.
4. User marks the post as published.
5. Signal OS captures metrics or accepts manual fallback input.
6. User reviews reply opportunities and weekly learning.

## Pages And UI Structure

- `/dashboard`: real Next dashboard cockpit with typed demo data.
- `/draft`: scoring workspace.
- `/account-import`: manual historical import and baseline.
- `/publish`: publish handoff.
- `/reply-assistant`: approval-first reply workflow.
- `/weekly-report`: learning loop.
- `/settings/api-mode`: data access mode.
- `/timeline`, `/creators`, `/hashtags`, `/topics`, `/sentiment`, `/forecast`, `/insights`, `/reports`: route aliases to the current cockpit until dedicated pages are built.
- `/signal-os/*.html`: preserved static design prototype.

## Data Model And Backend

Supabase migrations define users, drafts, scores, published posts, metrics, API credentials, approval actions, X accounts, imported posts, baselines, and post autopsies. Next API routes implement draft scoring, account import, publish, metrics, replies, weekly reports, billing checkout, and health checks.

## Authentication And Permissions

Supabase Auth is configured through SSR clients. Demo mode bypasses auth for local walkthroughs. Production entitlement checks should use database-owned plan/subscription state, not user-editable metadata.

## Technical Stack

- Next.js 15 App Router
- React 19
- TypeScript
- npm
- Supabase Auth/Postgres
- FastAPI scoring service
- Vitest
- ESLint
- Custom CSS/component system

## Local Development Setup

1. Copy `.env.example` to `web/.env.local`.
2. Run `npm install` in `web/`.
3. Start `services/scoring` with Uvicorn.
4. Start the web app with `npm run dev`.

## Future Improvements

- Build dedicated analytics pages instead of dashboard aliases.
- Replace weak middleware cookie-presence checks with verified session enforcement.
- Persist reply approvals and audit logs.
- Add Stripe webhook subscription sync.
- Add real official API/BYO/manual ingestion flows.
- Add Supabase generated types and broader route tests.
