# Backend Architecture

## Overview

Signal OS uses Next.js App Router route handlers as the backend facade for the designed static frontend in `web/public/signal-os`. The frontend remains visually unchanged and calls `/api/signal-os/*` endpoints for data and actions.

## API Routes

- `GET /api/signal-os/overview?page=dashboard|timeline|creators|hashtags|topics|sentiment|forecast|insights|reports|settings`
- `POST /api/signal-os/analyze`
- `GET /api/signal-os/reports`
- `POST /api/signal-os/reports`
- `GET /api/signal-os/settings`
- `POST /api/signal-os/settings`
- `POST /api/signal-os/auth`

Existing MVP APIs remain in place for draft scoring, account import, publishing, metrics, replies, weekly reports, billing checkout, scorecards, and health.

## Database Tables

New migration: `supabase/migrations/202605250001_trend_intelligence_backend.sql`.

Key tables:
- `workspaces`
- `workspace_members`
- `signal_creators`
- `signal_topics`
- `signal_hashtags`
- `signal_posts`
- `signal_post_hashtags`
- `news_correlations`
- `signal_forecasts`
- `ai_insights`
- `signal_reports`
- `signal_imports`
- `user_settings`
- `signal_audit_logs`
- `signal_usage_events`

## Auth And Session Flow

In demo mode, backend APIs return safe demo data. In production, APIs call `getRequestUser`, then read workspace-scoped data through Supabase. Static login/signup currently call an auth intent endpoint; production Supabase Auth wiring is still required.

## Workspace/Tenant Model

Trend intelligence records are scoped by `workspace_id`. Access is controlled through `workspace_members`. RLS policies use `is_signal_workspace_member(workspace_id)`.

## RLS Policies

RLS is enabled on all new public tables. Workspace-scoped tables require workspace membership. `user_settings` is scoped to the owning user. Audit/usage logs are currently read-only to workspace members through RLS.

## Data Flow

1. Static frontend loads and renders its designed HTML.
2. `signal-os.js` calls `/api/signal-os/overview`.
3. The backend returns demo or database-backed typed data.
4. Existing DOM tables/cards are hydrated without design/layout changes.
5. Actions like analysis, export, settings save, and auth intent call backend endpoints.

## External Integration Placeholders

- X/Twitter ingestion: not implemented.
- AI insight provider: not implemented; current endpoint returns heuristic/stub result.
- News correlation provider: not implemented; database structure exists.
- Report PDF/CSV generation: job/status path exists; file generation not implemented.

## Security Notes

- No service role key is used in frontend code.
- APIs validate input with Zod.
- New tables have RLS and indexes.
- Production middleware still needs verified Supabase session checks.
