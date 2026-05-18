# Signal OS - Remaining Tasks, Activities, and Features

This tracker reflects the repo as of 2026-05-18 after Supabase integration and the first major UX pass.

## Status Legend

- `[ ]` Not done
- `[~]` Partial
- `[x]` Done
- Priorities use `P0` for MVP-critical work and `P1` for important follow-up work.

## Current State

- The app now has a runnable Next.js frontend, Supabase auth, hosted persistence for core draft/publish/report flows, a scoring service, and a stronger product shell.
- The product is not commercially complete yet. The largest gaps are account import/baseline, real prediction metadata, complete data-mode behavior, billing completion, and deeper learning surfaces.

## Functional Requirements

### Draft Score

- [x] `FR-001` P0: User can paste a draft post.
- [x] `FR-002` P0: System generates an attention score.
- [x] `FR-003` P0: System explains the score.
- [x] `FR-004` P0: System identifies strongest weakness.
- [x] `FR-005` P0: System provides rewrite options.
- [x] `FR-006` P1: User can save draft versions.
- [x] `FR-007` P0: User can generate a shareable scorecard.
- [ ] `FR-008` P0: System stores full prediction metadata.

### Account Import

- [ ] `FR-009` P0: Connect X account via API.
- [ ] `FR-010` P0: Support BYO API key end to end.
- [ ] `FR-011` P0: Support manual post-data import.
- [ ] `FR-012` P0: Create account baseline.
- [ ] `FR-013` P0: Identify best historical posts.
- [ ] `FR-014` P1: Identify weak historical posts.
- [ ] `FR-015` P1: Recommend account-specific posting windows.

### Publish Tracking

- [x] `FR-016` P0: Mark a draft as published.
- [x] `FR-017` P0: Add published post URL.
- [~] `FR-018` P0: Track first-hour metrics where API access exists.
- [~] `FR-019` P0: Allow manual metrics entry.
- [ ] `FR-020` P0: Compare predicted vs actual outcomes.
- [ ] `FR-021` P0: Generate a real post autopsy.

### Reply Assistant

- [x] `FR-022` P0: Rank replies by response value.
- [x] `FR-023` P0: Suggest response drafts.
- [x] `FR-024` P0: Require human approval for every suggested reply.
- [x] `FR-025` P1: Flag potential negative threads.
- [x] `FR-026` P1: Recommend response timing.

### Weekly Report

- [x] `FR-027` P0: Generate weekly report.
- [x] `FR-028` P0: Include best and worst posts.
- [x] `FR-029` P0: Include topic-level insights.
- [ ] `FR-030` P0: Include real prediction accuracy.
- [x] `FR-031` P0: Recommend next-week actions.

## Remaining Build Work

### Foundation

- [x] Configure Supabase Auth, Postgres, and baseline RLS.
- [x] Move core app data from local storage into Supabase-backed routes.
- [ ] Complete sensitive-data hardening: credential encryption, disconnect, deletion, admin constraints.

### Core Product

- [ ] Build account import and baseline generation.
- [ ] Persist prediction ranges, confidence, and prediction context on scores.
- [ ] Finish manual metric entry and true 10m / 30m / 60m / 24h / 7d checkpoint behavior.
- [ ] Complete Full API / BYO API / Manual mode behavior end to end.
- [ ] Build prediction-vs-actual comparison and a real post autopsy.
- [ ] Improve weekly learning with account-specific insights.

### Commercialization

- [~] Integrate Stripe plans and entitlement gates.
- [ ] Add checkout completion, webhooks, subscription state sync, and upgrade/downgrade handling.
- [ ] Add onboarding that gets a new user to first value quickly.

### Quality

- [ ] Add end-to-end tests for sign-in, scoring, publish, tracking, reply approval, and reports.
- [ ] Add richer empty states, loading states, and error recovery across the product.
- [ ] Add product analytics for activation, retention, and paywall conversion.

## Next 10 Tasks

1. Build account import and baseline generation.
2. Persist full prediction metadata and confidence fields.
3. Implement true metric checkpoint capture and manual entry.
4. Build prediction-vs-actual comparison.
5. Turn post autopsy into a real learning surface.
6. Finish Full API / BYO API / Manual behavior.
7. Complete Stripe subscription lifecycle.
8. Add onboarding and activation flow.
9. Add security deletion and credential-management flows.
10. Add end-to-end coverage for the full core loop.

## MVP Complete When

- [ ] Every P0 requirement is testable end to end.
- [ ] The full loop works: Score -> Improve -> Publish -> Track -> Learn.
- [ ] Full API, BYO API, and Manual modes are all usable.
- [ ] Paid action surfaces are entitlement-gated.
- [ ] Every suggested reply still requires explicit human approval.
