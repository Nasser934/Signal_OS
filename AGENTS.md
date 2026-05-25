# Signal OS - Codex Instructions

You are working on Signal OS, a SaaS product for X attention intelligence.

Always keep changes focused, reviewable, and tied to the core product loop:
Score -> Improve -> Publish -> Track -> Learn.

## Stack

- Web: Next.js 15 App Router, React 19, TypeScript, Vitest, ESLint.
- Data/auth: Supabase Auth + Postgres, migrations in `supabase/migrations/`.
- Scoring: Python FastAPI service in `services/scoring/`.
- Product source of truth: `BRD.md`, especially "free users get prediction and paid users get action."

## Commands

- Web install: `npm install` from `web/`
- Web dev: `npm run dev` from `web/`
- Web build: `npm run build` from `web/`
- Web lint: `npm run lint` from `web/`
- Web typecheck: `npm run typecheck` from `web/`
- Web tests: `npm test` from `web/`
- Scoring service dev: `python -m uvicorn main:app --host 127.0.0.1 --port 8000` from `services/scoring/`

## Structure

- `web/app/(marketing)/` contains public marketing surfaces.
- `web/app/(app)/` contains authenticated product surfaces.
- `web/app/api/` contains route handlers.
- `web/lib/server/` contains server-only business logic.
- `web/lib/supabase/` contains Supabase clients and middleware helpers.
- `web/tests/` contains Vitest tests.
- `services/scoring/main.py` contains the rules-based scoring API.
- `db/schema.sql` and `supabase/migrations/` describe database structure.

Use available tools as follows:

- Use GitHub tools for repository inspection, issues, pull requests, Actions, and code review.
- Use Supabase tools or scoped Supabase MCP connections for schema review, migrations, SQL review, logs, RLS policies, and generated TypeScript types.
- Use Netlify tools for deployment, preview URLs, environment variables, and build logs when Netlify is the chosen host.
- Use OpenAI developer documentation tools for any OpenAI API, Codex, agents, Responses API, or tool-calling questions.
- Use Figma only when implementing or matching UI designs.

Rules:

1. Do not change production database data directly.
2. Do not expose secrets in code.
3. Never commit `.env` files.
4. Before changing billing, inspect the current subscription logic and webhook flow.
5. Before changing database schema, propose a migration and explain the rollback.
6. After each task, run build and tests when available.
7. Keep changes focused and avoid broad rewrites unless requested.
8. Prefer read-only, project-scoped database tooling for inspection work.
9. Preserve the BRD product rule that free users get prediction and paid users get action.
10. No scraping or browser automation for X. Use official API, BYO API key, or manual fallback modes.
11. Reply Assistant may suggest responses but must never auto-send or auto-engage.
12. Do not edit existing Supabase migrations. Add a new migration for schema changes.
13. Keep direct Supabase access out of UI components; prefer server routes, server helpers, or dedicated lib wrappers.
14. Keep scoring explainable. Do not replace rules with opaque model calls unless explicitly requested.

## Codex Workflow

- Use the `investigate` skill for bugs, failing tests, regressions, stack traces, and unclear behavior.
- Use the `new-feature` skill for bounded feature work.
- Use the `open-pr` skill when preparing a branch for review.
- For non-trivial work, produce a plan first and wait for approval unless the user explicitly asks for full autonomy.
- For UI changes, run the app and verify behavior in a browser when feasible.
- After code changes, run the smallest relevant verification first, then broader build/type/test checks when risk justifies it.
