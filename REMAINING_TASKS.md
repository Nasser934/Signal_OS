# Signal OS — Remaining Tasks, Activities, and Features

This document turns the BRD into an implementation tracker, including what is complete, what remains, and the recommended build order.

## Status Legend

- `⬜ Not started`
- `🟨 In progress`
- `✅ Done`
- Priority tags: `P0` (MVP critical), `P1` (important but not blocking MVP completion)

## Current Repository State (as of 2026-05-16)

- Product requirements exist in `BRD.md`.
- Product summary exists in `README.md`.
- Target UI/system layout exists in `web/ARCHITECTURE.md`.
- A starter schema exists in `db/schema.sql`.
- The repository currently appears documentation-first and does not yet include a complete runnable MVP application stack.

---

## Functional Requirements Tracker (FR-001 to FR-031)

### 1) Draft Score
- [x] ✅ `FR-001` (P0): User can paste a draft post.
- [x] ✅ `FR-002` (P0): System generates an attention score.
- [x] ✅ `FR-003` (P0): System explains the score.
- [ ] ⬜ `FR-004` (P0): System identifies strongest weakness.
- [x] ✅ `FR-005` (P0): System provides 3 rewrite options.
- [x] ✅ `FR-006` (P1): User can save draft versions.
- [x] ✅ `FR-007` (P0): User can generate a shareable scorecard.
- [ ] ⬜ `FR-008` (P0): System stores prediction metadata.

### 2) Account Import
- [ ] ⬜ `FR-009` (P0): Connect X account via API.
- [ ] ⬜ `FR-010` (P0): Support BYO API key.
- [ ] ⬜ `FR-011` (P0): Support manual post data import.
- [ ] ⬜ `FR-012` (P0): System creates account baseline.
- [ ] ⬜ `FR-013` (P0): System identifies best historical posts.
- [ ] ⬜ `FR-014` (P1): System identifies weak historical posts.
- [ ] ⬜ `FR-015` (P1): Recommend account-specific posting windows.

### 3) Publish Tracking
- [x] ✅ `FR-016` (P0): Mark draft as published.
- [x] ✅ `FR-017` (P0): Add published post URL.
- [x] ✅ `FR-018` (P0): Track first-hour metrics where API access exists.
- [x] ✅ `FR-019` (P0): Allow manual metrics entry.
- [x] ✅ `FR-020` (P0): Compare predicted vs actual outcomes.
- [x] ✅ `FR-021` (P0): Generate post autopsy.

### 4) Reply Assistant
- [x] ✅ `FR-022` (P0): Rank replies by response value.
- [x] ✅ `FR-023` (P0): Suggest response drafts.
- [x] ✅ `FR-024` (P0): Require human approval for every suggested reply.
- [x] ✅ `FR-025` (P1): Flag potential negative threads.
- [x] ✅ `FR-026` (P1): Recommend response timing.

### 5) Weekly Report
- [x] ✅ `FR-027` (P0): Generate weekly report.
- [x] ✅ `FR-028` (P0): Include best/worst posts.
- [x] ✅ `FR-029` (P0): Include topic-level insights.
- [x] ✅ `FR-030` (P0): Include prediction accuracy.
- [x] ✅ `FR-031` (P0): Recommend next-week actions.

---

## Remaining Implementation Activities

### Phase 1 — Foundation (Critical)
- [x] ✅ Scaffold Next.js application in `web/` using architecture route groups.
- [ ] Configure Supabase Auth + Postgres + baseline RLS policies.
- [x] ✅ Convert `db/schema.sql` into migration-managed schema.
- [x] ✅ Add `.env.example` and runtime configuration validation.
- [x] ✅ Add structured logging, error taxonomy, and audit logging hooks.

### Phase 2 — Draft Score MVP (Core Loop Entry)
- [x] ✅ Build `/draft` experience (input, score, diagnosis, rewrites).
- [x] ✅ Implement scoring service interface (initial rules engine).
- [x] ✅ Persist draft, score, rewrite, and prediction metadata records.
- [x] ✅ Build shareable scorecard generation and read-only view.

### Phase 3 — Publish + Track
- [x] ✅ Implement publish workflow (mark published + URL capture).
- [x] ✅ Add 10m/30m/60m/24h/7d metrics checkpoint tracking.
- [x] ✅ Implement mode switching: Full API / BYO Key / Manual.
- [x] ✅ Build command-center UI modules for momentum and next actions.

### Phase 4 — Reply Assistant + Safety
- [x] ✅ Implement reply queue scoring/ranking.
- [x] ✅ Generate suggested responses with explicit approval gates.
- [x] ✅ Add negative-thread risk alerts and timing recommendations.

### Phase 5 — Learning Loop
- [x] ✅ Build post autopsy with prediction-vs-actual delta analysis.
- [x] ✅ Build weekly report generation workflow + UI delivery.
- [x] ✅ Add repeat/stop/test recommendation output.

### Phase 6 — Commercial + Operations
- [x] ✅ Integrate Stripe plans and entitlement gates.
- [x] ✅ Add usage metering and tier-aware rate/feature limits.
- [x] ✅ Add monitoring, alerting, and reliability SLO dashboards.
- [ ] Complete security hardening (encryption, deletion flows, admin constraints).

---

## Recommended Next 10 Build Tasks (Ordered)

1. Scaffold the Next.js app in `web/`.
2. Wire Supabase client, auth, and session guards.
3. Implement migrations from `db/schema.sql`.
4. Build `/draft` page with draft persistence.
5. Add scoring endpoint contract + explainability payload.
6. Render score breakdown + top weakness + 3 rewrites.
7. Implement “mark published” + post URL capture.
8. Add manual metrics input + first-hour timeline.
9. Persist prediction-vs-actual and add autopsy skeleton UI.
10. Add weekly report job stub and report page shell.

---

## Definition of MVP Complete

MVP is complete when all conditions below are true:

- [ ] All P0 FRs are delivered and testable end-to-end.
- [ ] Core loop works in product flow: **Score → Improve → Publish → Track → Learn**.
- [ ] Fallback modes are usable: Full API, BYO API key, and Manual mode.
- [ ] “Paid gets action” gating is enforced for action surfaces.
- [ ] Every reply action requires explicit human approval.

## Suggested Review Cadence

- Weekly: update FR status checkboxes and phase activity status.
- End of sprint: re-prioritize “Next 10 Build Tasks” based on blockers and learning.
- Monthly: confirm scope alignment against BRD product rules to prevent feature creep.
