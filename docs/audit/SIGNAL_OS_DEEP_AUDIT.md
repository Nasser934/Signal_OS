# Signal OS Backend-First Deep Audit

## Executive Summary

Signal OS has a polished static frontend and a partial Next/Supabase backend. The frontend promises a trend intelligence cockpit across dashboard, timeline, creators, hashtags, topics, sentiment, forecast, AI insights, reports, and settings. Before this backend pass, most of those visible features were static HTML only. The backend had useful MVP pieces for draft scoring, account import, publish tracking, replies, and weekly reports, but it did not support the visible trend-intelligence frontend.

This pass keeps the frontend design intact and adds backend structures, API boundaries, validation, RLS-ready tables, and minimal frontend wiring through the existing JavaScript file only.

## Context Discovery

- Framework: Next.js 15 App Router, React 19, TypeScript.
- Package manager: npm with `package-lock.json`.
- Backend: Next route handlers in `web/app/api`, server helpers in `web/lib/server`.
- Database/Auth: Supabase Auth/Postgres with migrations in `supabase/migrations`.
- Frontend source of truth: static designed screens in `web/public/signal-os`.
- Styling: custom CSS. Tailwind/shadcn/Recharts/TanStack Table are not installed.
- Relevant instructions: `AGENTS.md`, `README.md`, `BRD.md`, local `.agents/skills/new-feature`, `.agents/skills/supabase`, `.agents/skills/supabase-postgres-best-practices`.
- Commands: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

## Current Score Before Backend Pass

- Product clarity: 6/10
- Visual design: 8/10 for static frontend
- UX flow: 6/10
- Dashboard usefulness: 7/10 visually, 2/10 backend-backed
- Backend architecture: 5/10
- Database model: 5/10
- Auth/security: 4/10
- Supabase/RLS readiness: 5/10
- API/data flow: 4/10
- Performance: 6/10
- Testing readiness: 3/10
- Production readiness: 3/10
- Overall SaaS quality: 4/10

## Critical Issues

1. Static frontend showed product features without matching backend data paths.
2. Trend intelligence tables did not exist.
3. Dashboard/timeline/creator/hashtag/topic/sentiment/forecast/report/settings APIs did not exist.
4. Production auth/session enforcement still needs stronger verified-session middleware.
5. Live X/Twitter, AI provider, and news integrations are not implemented and must not be claimed as live.

## Frontend-To-Backend Feature Matrix

| Frontend feature | Location | Backend support before | Backend support now | Remaining gap | Priority |
|---|---|---:|---:|---|---|
| Dashboard KPIs | `dashboard.html` | Static | `/api/signal-os/overview` | Live ingestion | P0 |
| Trend timeline | `timeline.html` | Static | `/api/signal-os/overview?page=timeline` | Dedicated DB joins/charts | P0 |
| Creator table/cohorts | `creators.html` | Static | creators read model + schema | Save cohort persistence | P1 |
| Hashtag performance | `hashtags.html` | Static | hashtags read model + schema | Live hashtag ingestion | P0 |
| Topic analysis | `topics.html` | Static | topics read model + schema | Classifier pipeline | P0 |
| Sentiment drivers | `sentiment.html` | Static | sentiment read model + schema field | Real classifier/provider | P0 |
| Forecast scenarios | `forecast.html` | Static | forecasts table/read model | Forecast job scheduling | P1 |
| AI insights | `insights.html` | Fake timeout | `/api/signal-os/analyze` heuristic/stub | Real AI provider key | P1 |
| Reports/exports | `reports.html` | Static | `/api/signal-os/reports` GET/POST + reports table | File generation/storage | P0 |
| Settings | `settings.html` | Static | `/api/signal-os/settings` GET/POST + settings/workspace tables | Full roles/source management | P1 |
| Login/signup | `login.html`, `signup.html` | Static redirect | `/api/signal-os/auth` demo intent | Production Supabase Auth wiring | P0 |
| Export view button | topbar JS | No-op | queues export via reports API | Actual PDF/CSV generation | P1 |
| Copy insight | several pages | Client-only | still client-only | Clipboard API optional | P3 |
| Date range filter | topbar JS | No-op | documented gap | Query parameter wiring | P2 |
| Search | topbar JS | No-op | documented gap | Search API/index | P2 |

## Mock/Static Data Still Present

- The frontend still renders initial static HTML for fast visual loading.
- `/api/signal-os/overview` returns demo data in `APP_MODE=demo`.
- In production, the API attempts database reads and falls back to documented demo shape only when no workspace data exists.
- No live X/Twitter API, AI provider, or news API is implemented.

## Dead Or Partial Actions

- Date range filter and search are still visual-only.
- Save cohort/create partner list/add source are not persisted yet.
- Report export creates a backend job but does not generate a file.
- AI analysis creates a safe heuristic/stub insight, not live AI.

## Technical Architecture Problems

- Static frontend and Next backend are still separate surfaces.
- Backend now has a trend-intelligence read model, but production data ingestion is not implemented.
- Supabase types are not generated, so route code still uses runtime-safe mapping instead of generated DB types.

## Security/Auth/Supabase Problems

- New migration enables RLS for trend-intelligence tables and scopes data through workspace membership.
- Existing middleware still checks cookie presence in production and should be upgraded to verified Supabase user checks.
- Service role key is not exposed.
- Production static login/signup still require real Supabase Auth wiring.

## Recommended Backend Architecture

1. Keep static frontend as the visual source of truth until migrated carefully.
2. Use `/api/signal-os/*` as the backend facade for the designed frontend.
3. Store all trend intelligence under workspaces with RLS.
4. Add ingestion jobs later for official API/BYO/manual imports.
5. Add provider abstractions for AI and news, disabled unless keys/config exist.
6. Generate exports asynchronously, store artifacts in Supabase Storage, and expose status through `signal_reports`.

## What Was Fixed Now

- Added trend-intelligence Supabase migration with workspace tables, signal posts, creators, topics, hashtags, correlations, forecasts, insights, reports, imports, settings, audit logs, usage events, indexes, and RLS.
- Added typed backend service `signalIntelligence.ts`.
- Added APIs for overview, analysis, reports/exports, settings, and auth intent.
- Connected existing static frontend actions through `signal-os.js` without changing visual design.

## What Should Be Fixed Later

1. Verified production session middleware.
2. Real Supabase Auth wiring for static login/signup.
3. Manual/CSV import endpoint for trend datasets.
4. Search and date range query support.
5. Persist creator cohorts, partner lists, and sources.
6. Real report file generation and Supabase Storage paths.
7. AI/news provider integrations behind explicit configuration.
8. Separate dependency upgrade pass for remaining moderate npm audit advisories that require major changes or unsafe downgrade paths.
