# Business Requirements Document

## Signal OS — Attention Intelligence Platform for X

- **Version:** 1.0  
- **Document Type:** Investor-Grade Business Requirements Document  
- **Product Category:** Attention Intelligence Platform  
- **Core Loop:** Score → Improve → Publish → Track → Learn  
- **Primary Audience:** AI founders, SaaS builders, creators, agencies, and brand teams  
- **MVP Principle:** If a feature does not support the core loop, it is out of scope.

---

## 1.0 Executive Summary

### 1.1 Product Vision

Signal OS is an attention intelligence platform for X.

It helps creators, founders, and agencies predict which posts are likely to work before publishing, improve weak drafts, manage the first 60 minutes after posting, and learn from real outcomes.

Signal OS is not a social scheduler.  
It is not an AI writer.  
It is not a growth-hack tool.

It is a performance intelligence layer for X.

The product starts with a lean scoring and tracking MVP, then compounds into a proprietary prediction engine using prediction-vs-actual outcome data.

### 1.2 Strategic Positioning

Most X tools focus on content creation.

Signal OS focuses on attention performance.

| Existing Tools | Signal OS |
|---|---|
| Help users write posts | Helps users predict post performance |
| Schedule content | Guides post-publish action |
| Show analytics later | Gives action while the post is still active |
| Generic AI generation | Account-specific performance learning |
| Feature-based SaaS | Data-compounding intelligence platform |

**Positioning statement:**  
Signal OS helps you know what will work before you post, and what to do after you post.

### 1.3 Target Audience

**Initial Niche:** AI Founders and SaaS Builders on X

Reasons:
- Post frequently.
- Care about distribution.
- Understand SaaS tools.
- Pay for productivity and growth products.
- Share tool screenshots.
- Provide structured feedback.
- Follow each other, creating natural network spread.

**Secondary Audiences**

| Segment | Priority | Reason |
|---|---|---|
| AI founders | P0 | Best early adopters |
| SaaS builders | P0 | High willingness to pay |
| Independent creators | P1 | Strong usage volume |
| Social media agencies | P1 | High revenue potential |
| B2B growth teams | P2 | More complex sales |
| Enterprise comms teams | P3 | Later-stage opportunity |

### 1.4 Core Value Proposition

Signal OS delivers two core promises:

**Before Posting**
- Attention score
- Weakness diagnosis
- Rewrite suggestions
- Audience-fit guidance
- Risk signals
- Expected performance range

**After Posting**
- Momentum tracking
- Reply prioritization
- Suggested responses
- Engagement timing guidance
- Post-decay warning
- Post autopsy after results mature

### 1.5 Strategic Product Rule

**Free users get prediction. Paid users get action.**

| User Type | Receives |
|---|---|
| Free | Score, basic diagnosis, limited rewrites |
| Paid | First-60-Minutes Command Center, reply guidance, advanced tracking, post autopsy |

---

## 2.0 Market Problem

### 2.1 User Pain

Creators and agencies do not know:
- Which draft is strongest.
- Why a post underperforms.
- What to fix before publishing.
- What to do after publishing.
- Which replies deserve attention.
- When a post is gaining or losing momentum.
- Which content patterns work for their specific audience.

Most tools solve writing. Signal OS solves performance decisions.

### 2.2 Platform Dependency Problem

X API access is usage-based and policy-governed, so cost and compliance are first-order requirements.

Signal OS must avoid scraping/browser automation and support resilient data access via:
- Official API access
- User-provided API credentials (BYO key)
- Manual fallback workflows

API resilience is non-negotiable.

---

## 3.0 Product Strategy

### 3.1 Product Category

Signal OS owns the category: **Attention Intelligence Platform**.

### 3.2 Core Operating Loop

Every feature must support:

**Score → Improve → Publish → Track → Learn**

| Loop Stage | Product Function |
|---|---|
| Score | Draft Score |
| Improve | Rewrite Engine |
| Publish | Manual or API-assisted publish workflow |
| Track | First-hour tracking and metric capture |
| Learn | Post autopsy and account-specific insights |

### 3.3 Product Wedge

**First-60-Minutes Command Center** is the paid wedge due to urgency and time-sensitive value.

### 3.4 Growth Engine

**Shareable Scorecards** drive low-cost acquisition via social proof and organic sharing.

---

## 4.0 MVP Scope

### 4.1 MVP Objective

Prove:
1. Users care about pre-publish scoring.
2. Users trust explainable recommendations.
3. Users will track outcomes.
4. Users will pay for first-hour action guidance.

### 4.2 MVP Features

1. **Draft Score** (explainable scoring + weaknesses + fixes)
2. **Account Import** (API, BYO key, manual)
3. **Publish Tracking** (10m/30m/60m/24h/7d)
4. **Reply Assistant** (human approval required)
5. **Weekly Report** (repeat/stop/test guidance)

---

## 5.0 Explicitly Out-of-Scope for MVP

Out-of-scope examples:
- Creator Graph
- Global Attention Model
- Marketplace
- White-label Agency Portal
- Multi-platform support
- Deep learning simulation
- Auto-engagement / auto-follow / auto-like
- Browser automation
- Scraping workflows

MVP must stay focused on the core loop.

---

## 6.0 Functional Requirements (MVP)

### 6.1 Draft Score

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-001 | User can paste a draft post | P0 |
| FR-002 | System generates an attention score | P0 |
| FR-003 | System explains the score | P0 |
| FR-004 | System identifies strongest weakness | P0 |
| FR-005 | System provides 3 rewrite options | P0 |
| FR-006 | User can save draft versions | P1 |
| FR-007 | User can generate a shareable scorecard | P0 |
| FR-008 | System stores prediction metadata | P0 |

### 6.2 Account Import

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-009 | Connect X account via API where available | P0 |
| FR-010 | Use BYO API key | P0 |
| FR-011 | Manually import post data | P0 |
| FR-012 | System creates account baseline | P0 |
| FR-013 | System identifies best historical posts | P0 |
| FR-014 | System identifies weak historical posts | P1 |
| FR-015 | Recommends account-specific posting windows | P1 |

### 6.3 Publish Tracking

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-016 | Mark a draft as published | P0 |
| FR-017 | Add published post URL | P0 |
| FR-018 | Track first-hour metrics where API access exists | P0 |
| FR-019 | Manually enter metrics | P0 |
| FR-020 | Compare predicted vs actual results | P0 |
| FR-021 | Generate post autopsy | P0 |

### 6.4 Reply Assistant

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-022 | Rank replies by response value | P0 |
| FR-023 | Suggest response drafts | P0 |
| FR-024 | User must approve every suggested reply | P0 |
| FR-025 | Flag potential negative threads | P1 |
| FR-026 | Recommend response timing | P1 |

### 6.5 Weekly Report

| Requirement ID | Requirement | Priority |
|---|---|---|
| FR-027 | Generate weekly report | P0 |
| FR-028 | Include best/worst posts | P0 |
| FR-029 | Include topic-level insights | P0 |
| FR-030 | Include prediction accuracy | P0 |
| FR-031 | Recommend next-week actions | P0 |

---

## 7.0 Non-Functional Requirements

### 7.1 Cost Efficiency
- Rules/lightweight models first
- Serverless-first architecture
- Caching + batching
- Plan-based API limits
- Manual mode + BYO key for cost control

### 7.2 Scalability Stages

| Stage | Scale | Architecture |
|---|---|---|
| MVP | 0–1,000 users | Serverless app + Postgres + Python scoring |
| Early SaaS | 1,000–10,000 | Queue jobs + caching + usage metering |
| Growth | 10,000–100,000 | Dedicated scoring + analytics warehouse |
| Scale | 100,000+ | Feature store + model pipelines |

### 7.3 Compliance
- Official API where available
- No scraping, no browser automation
- User authorization and control
- Human approval for post-publish actions
- Secure data storage + deletion support

### 7.4 Reliability
Graceful degradation if API fails:
- Draft Score remains available
- Manual mode remains available
- Weekly reporting works with manual data
- Clear fallback guidance to users

---

## 8.0 System Architecture

### 8.1 V1 Stack
- Frontend: React / Next.js
- Auth: Supabase Auth
- Database: Supabase Postgres
- Backend API: Next.js API routes or Node service
- Scoring service: Python FastAPI
- Jobs: Supabase scheduled functions / lightweight queue
- Payments: Stripe
- LLM layer: Provider-agnostic wrapper
- Analytics: Postgres first, warehouse later
- Hosting: Vercel / Fly.io / Render
- Storage: Supabase Storage

### 8.2 Principles
1. Rules before ML.
2. Manual mode before expensive automation.
3. Structured data before dashboards.
4. Explainability before complexity.
5. Usage metering before scale.
6. Human approval before action.
7. API fallback before API dependency.

---

## 9.0 Staged Intelligence Architecture

1. **Stage 1 (MVP):** Explainable rules engine  
2. **Stage 2 (10k+ tracked posts):** Lightweight prediction models  
3. **Stage 3:** Account-specific models  
4. **Stage 4:** Global attention model  
5. **Stage 5:** Creator graph (late-stage only)

Rule: No deep learning until simpler models fail.

---

## 10.0 Data Moat Strategy

- Product moat is **proprietary prediction-vs-actual data**, not visible algorithms.
- Capture structured data at every loop stage.
- Track source quality and confidence metadata for future model training.

---

## 11.0 API Fallback Plan

Signal OS must support three modes:
1. Full API Mode
2. BYO API Key Mode
3. Manual Mode

This ensures business continuity through API pricing, rate-limit, policy, or outage changes.

---

## 12.0 Commercialization

### Pricing Tiers
- Free: $0
- Creator: $19/month
- Pro: $49/month
- Agency: $299/month
- Agency Pro: $799/month
- Enterprise: Custom

### Upgrade Gate
**Free gets prediction. Paid gets action.**

---

## 13.0 User Experience Requirements

### Primary Flow
Sign up → Paste draft → Get score → Improve → Publish → Track first hour → Act → Autopsy → Weekly learning

### Required UX Surfaces
- Draft Score screen
- First-Hour Command Center
- Post Autopsy

---

## 14.0 Data Model

Core entities:
- users, teams, team_members, x_accounts
- drafts, scores, rewrites, recommendations
- published_posts, post_metrics, first_hour_events
- prediction_errors, weekly_reports, scorecards
- subscriptions, usage_events, api_credentials, audit_logs

---

## 15.0 Security and Compliance

- Encrypt API credentials
- Use row-level security where possible
- Separate user/team data
- Log sensitive actions
- Support disconnect and deletion
- Restrict internal admin access

Language policy: avoid manipulative “growth hack” claims; use transparent “performance estimate” language.

---

## 16.0 Success Metrics

MVP targets include:
- 20%+ waitlist conversion
- 5–10% free-to-paid conversion
- 40%+ weekly active users
- 5+ posts scored/user/week
- 2+ posts tracked/user/week
- 15%+ scorecard share rate

---

## 17.0 Phased Rollout

- **Phase 0 (2 weeks):** Validation
- **Phase 1 (4–6 weeks):** MVP
- **Phase 2 (4–6 weeks):** Paid beta
- **Phase 3 (8–12 weeks):** Agency beta
- **Phase 4 (10k+ tracked posts):** Intelligence scaling
- **Phase 5 (100k+ tracked posts):** Advanced data moat

---

## 18.0 Risks and Mitigation

Top risks include API cost/access changes, trust in scoring, scope creep, compliance risk, and retention risk.

Core mitigations: BYO key, manual fallback, explainability, strict MVP scope, human approval, and weekly learning loops.

---

## 19.0 Critical Product Rules

1. If it does not support Score → Improve → Publish → Track → Learn, it is out of scope.
2. Free gets prediction. Paid gets action.
3. Rules engine before ML.
4. Manual mode must always exist.
5. BYO API key support for high-volume users.
6. Human approval for all post-publish actions.
7. No scraping or browser automation.
8. No fake engagement features.
9. Every score must be explainable.
10. Every tracked post should improve the data moat.

---

## 20.0 Investor-Grade Summary

Signal OS is designed to become the **performance intelligence layer for X**.

- Narrow MVP validates the core loop.
- Monetization wedge is the First-60-Minutes Command Center.
- Growth engine is shareable scorecards.
- Long-term moat is proprietary prediction-vs-actual data.
- Resilience comes from Full API + BYO API + Manual fallback modes.

Strategic thesis: do not compete as another content tool; own the attention performance layer.
