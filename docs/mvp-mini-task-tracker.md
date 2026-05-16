# Signal OS MVP Mini-Task Tracker

Core loop order: **Score → Improve → Publish → Track → Learn**

## Epic 0 — Foundation & Platform Baseline
- [Done] E0-T1 Create MVP Postgres schema (users, drafts, scores, published_posts, post_metrics, credentials, approval_actions). Dependency: none.
- [Done] E0-T2 Add Supabase RLS policies for tenant isolation. Dependency: E0-T1.
- [Done] E0-T3 Scaffold FastAPI Stage-1 rules scoring service. Dependency: E0-T1.
- [Done] E0-T4 Implement API fallback service (full API → BYO key → manual). Dependency: E0-T1.
- [Done] E0-T5 Define Next.js app/component architecture for Draft/Command-Center/Autopsy flows. Dependency: E0-T3, E0-T4.

## Epic 1 — Score (Draft Scoring UX + persistence)
- [To Do] E1-T1 Build typed frontend scoring client for FastAPI `/v1/score` with robust error mapping. Dependency: E0-T3.
- [To Do] E1-T2 Build Draft Score API route/server action to create draft + score records atomically. Dependency: E1-T1, E0-T1.
- [To Do] E1-T3 Build Draft input form UI (text/topic/audience/tone + validation). Dependency: E1-T2.
- [To Do] E1-T4 Build Score breakdown UI component from component-level scoring. Dependency: E1-T2.
- [To Do] E1-T5 Build Weakness diagnosis UI component (largest weakness callout). Dependency: E1-T2.
- [To Do] E1-T6 Build Rewrite recommendations UI (3 options). Dependency: E1-T2.
- [To Do] E1-T7 Build Shareable Scorecard API + UI button. Dependency: E1-T4, E1-T5, E1-T6.
- [To Do] E1-T8 Add draft version save flow (P1). Dependency: E1-T2.

## Epic 2 — Improve (guided rewriting)
- [To Do] E2-T1 Implement rewrite generator contract (3 constrained rewrites). Dependency: E1-T2.
- [To Do] E2-T2 Add rewrite acceptance event tracking (selected / edited / discarded). Dependency: E2-T1.
- [To Do] E2-T3 Add audience-fit/risk hint panel in score response model. Dependency: E1-T1.

## Epic 3 — Publish (manual/API-assisted publish handoff)
- [To Do] E3-T1 Build “Mark as published” action + status transition. Dependency: E1-T2.
- [To Do] E3-T2 Build published post URL capture + validation. Dependency: E3-T1.
- [To Do] E3-T3 Persist published_posts row with source_mode and final_text snapshot. Dependency: E3-T1, E3-T2.
- [To Do] E3-T4 Build API mode selection settings page (full API/BYO/manual). Dependency: E0-T4.
- [To Do] E3-T5 Build BYO API credential create/validate endpoint (encrypted storage). Dependency: E3-T4.
- [To Do] E3-T6 Build manual import route for historical posts. Dependency: E0-T1.

## Epic 4 — Track (first-hour command center)
- [To Do] E4-T1 Build metrics ingestion endpoint for 10m/30m/60m/24h/7d snapshots. Dependency: E3-T3.
- [To Do] E4-T2 Build polling scheduler/service for checkpoint captures with fallback integration. Dependency: E4-T1, E0-T4.
- [To Do] E4-T3 Build manual metrics entry form for fallback mode. Dependency: E4-T1.
- [To Do] E4-T4 Build command center momentum status widget. Dependency: E4-T1.
- [To Do] E4-T5 Build velocity comparison widget (predicted vs actual). Dependency: E4-T1.
- [To Do] E4-T6 Build post-decay/risk alert rules + UI. Dependency: E4-T4.

## Epic 5 — Learn (autopsy + weekly report)
- [To Do] E5-T1 Build prediction-vs-actual computation module. Dependency: E4-T1, E1-T2.
- [To Do] E5-T2 Build post autopsy API endpoint and read model. Dependency: E5-T1.
- [To Do] E5-T3 Build autopsy UI (prediction vs actual, drivers, repeat/stop/change). Dependency: E5-T2.
- [To Do] E5-T4 Build weekly report generator job. Dependency: E5-T1.
- [To Do] E5-T5 Build weekly report UI (best/worst/topic/accuracy/actions). Dependency: E5-T4.

## Epic 6 — Reply Assistant (approval-first)
- [To Do] E6-T1 Build reply ranking algorithm/service contract. Dependency: E4-T1.
- [To Do] E6-T2 Build suggested response generation endpoint. Dependency: E6-T1.
- [To Do] E6-T3 Build approval queue API (approve/reject required before any action). Dependency: E6-T2, E0-T1.
- [To Do] E6-T4 Build Reply queue UI list in command center. Dependency: E6-T1.
- [To Do] E6-T5 Build Suggested responses UI with mandatory human approval controls. Dependency: E6-T3.

## Epic 7 — Account Import & Baseline Intelligence
- [To Do] E7-T1 Build account import orchestration endpoint (API/BYO/manual). Dependency: E3-T4, E3-T6.
- [To Do] E7-T2 Build baseline computation (median impressions, engagement benchmarks). Dependency: E7-T1.
- [To Do] E7-T3 Build best historical post identification. Dependency: E7-T2.
- [To Do] E7-T4 Build weak historical post identification (P1). Dependency: E7-T2.
- [To Do] E7-T5 Build account-specific posting window recommendation (P1). Dependency: E7-T2.
