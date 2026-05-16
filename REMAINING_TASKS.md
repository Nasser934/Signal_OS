# Signal OS — Remaining Tasks, Activities, and Features

This document translates the BRD into an execution checklist and clearly shows what remains.

## Current Repository State (as of 2026-05-16)

- Product requirements are documented (`BRD.md`).
- High-level product overview is documented (`README.md`).
- Target app architecture is documented (`web/ARCHITECTURE.md`).
- Database schema starter exists (`db/schema.sql`).
- No runnable MVP application code is present yet (no `package.json`, `app/`, API routes, or scoring service code).

---

## Delivery Status by MVP Feature

### 1) Draft Score
- [ ] FR-001 User can paste a draft post
- [ ] FR-002 Generate attention score
- [ ] FR-003 Explain score
- [ ] FR-004 Identify strongest weakness
- [ ] FR-005 Provide 3 rewrite options
- [ ] FR-006 Save draft versions (P1)
- [ ] FR-007 Generate shareable scorecard
- [ ] FR-008 Store prediction metadata

### 2) Account Import
- [ ] FR-009 Connect X account via API
- [ ] FR-010 BYO API key
- [ ] FR-011 Manual post data import
- [ ] FR-012 Build account baseline
- [ ] FR-013 Identify best historical posts
- [ ] FR-014 Identify weak historical posts (P1)
- [ ] FR-015 Recommend account-specific posting windows (P1)

### 3) Publish Tracking
- [ ] FR-016 Mark draft as published
- [ ] FR-017 Add published post URL
- [ ] FR-018 Track first-hour metrics (API mode)
- [ ] FR-019 Manually enter metrics
- [ ] FR-020 Compare predicted vs actual
- [ ] FR-021 Generate post autopsy

### 4) Reply Assistant
- [ ] FR-022 Rank replies by response value
- [ ] FR-023 Suggest response drafts
- [ ] FR-024 Require human approval for every reply
- [ ] FR-025 Flag potential negative threads (P1)
- [ ] FR-026 Recommend response timing (P1)

### 5) Weekly Report
- [ ] FR-027 Generate weekly report
- [ ] FR-028 Include best/worst posts
- [ ] FR-029 Include topic-level insights
- [ ] FR-030 Include prediction accuracy
- [ ] FR-031 Recommend next-week actions

---

## What Remains (Execution Activities)

## Phase 1 — Foundation (Critical)
- [ ] Scaffold Next.js app in `web/` with route groups from architecture doc.
- [ ] Set up Supabase project wiring (Auth + Postgres + RLS policies).
- [ ] Implement base tables and migrations from `db/schema.sql`.
- [ ] Add environment management (`.env.example`, runtime validation).
- [ ] Add logging, error handling, and audit log plumbing.

## Phase 2 — Draft Score MVP (Core loop start)
- [ ] Build `/draft` UI (input + score breakdown + diagnosis + rewrites).
- [ ] Implement scoring service contract and mocked rules engine.
- [ ] Persist drafts, scores, rewrites, and scoring metadata.
- [ ] Add shareable scorecard generation (URL/tokenized read view).

## Phase 3 — Publish + Track
- [ ] Add publish workflow (mark published + post URL capture).
- [ ] Build first-hour tracking checkpoints (10m/30m/60m + 24h/7d).
- [ ] Implement API fallback modes (Full API / BYO Key / Manual).
- [ ] Build command center UI with momentum/velocity/status components.

## Phase 4 — Reply Assistant + Safety
- [ ] Build reply queue ranking and suggested responses.
- [ ] Enforce explicit human approval on all outbound reply actions.
- [ ] Add risk alerting for negative-thread detection.

## Phase 5 — Learning Loop
- [ ] Build post autopsy screen and prediction-vs-actual analysis.
- [ ] Build weekly report job + delivery UI.
- [ ] Add repeat/stop/test recommendations.

## Phase 6 — Commercial + Ops
- [ ] Stripe plans and entitlements (free prediction vs paid action).
- [ ] Usage metering and limits by tier.
- [ ] Monitoring/alerting + reliability dashboards.
- [ ] Security hardening (credential encryption, deletion flows, admin controls).

---

## Recommended Next 10 Build Tasks (in order)

1. Create Next.js app scaffold in `web/`.
2. Add Supabase client and auth guards.
3. Turn `db/schema.sql` into migrations and apply locally.
4. Implement `/draft` page with saved draft persistence.
5. Add rules-based scoring endpoint and explanation payload.
6. Render score breakdown + top weakness + 3 rewrites.
7. Add "mark as published" workflow and post URL capture.
8. Add manual metrics entry and first-hour timeline UI.
9. Implement prediction-vs-actual storage and autopsy skeleton.
10. Add weekly report generation stub and UI placeholder.

---

## Definition of "MVP Complete"

MVP is complete when:
- [ ] All P0 requirements FR-001 through FR-031 are functionally delivered.
- [ ] Core loop works end-to-end: Score → Improve → Publish → Track → Learn.
- [ ] Fallback modes are usable (Full API / BYO / Manual).
- [ ] Paid-only action surfaces are gated behind subscription.
- [ ] Reply actions require human approval.

