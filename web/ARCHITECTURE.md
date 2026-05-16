# Signal OS Next.js MVP Architecture

```text
app/
├─ (marketing)/
│  └─ page.tsx
├─ (app)/
│  ├─ layout.tsx
│  ├─ draft/
│  │  ├─ page.tsx                      # Draft Score UI entry
│  │  ├─ _components/
│  │  │  ├─ DraftInput.tsx
│  │  │  ├─ ScoreBreakdown.tsx
│  │  │  ├─ WeaknessDiagnosis.tsx
│  │  │  ├─ RewriteRecommendations.tsx
│  │  │  └─ ShareScorecardButton.tsx
│  ├─ command-center/
│  │  ├─ [postId]/page.tsx             # First-60-Minutes Command Center
│  │  └─ _components/
│  │     ├─ MomentumStatus.tsx
│  │     ├─ VelocityComparison.tsx
│  │     ├─ ReplyQueue.tsx
│  │     ├─ SuggestedResponses.tsx
│  │     ├─ RiskAlerts.tsx
│  │     └─ NextBestAction.tsx
│  ├─ autopsy/
│  │  ├─ [postId]/page.tsx             # Post Autopsy UI
│  │  └─ _components/
│  │     ├─ PredictionVsActual.tsx
│  │     ├─ DriverAnalysis.tsx
│  │     └─ RepeatStopChangePlan.tsx
│  └─ settings/
│     └─ api-mode/page.tsx             # Full API / BYO / Manual mode selector
├─ components/
│  ├─ ui/
│  ├─ forms/
│  └─ charts/
├─ lib/
│  ├─ apiFallbackService.ts
│  ├─ supabaseClient.ts
│  └─ scoringClient.ts
├─ server/
│  ├─ actions/
│  └─ repositories/
└─ types/
```

## Architectural Summary

- Keep the **Draft Score UI** isolated and fast: one page-level server action to persist draft + call FastAPI scoring service.
- Treat **Command Center** as a polling-based module (10m/30m/60m checkpoints) with hard fallback messaging if API calls fail.
- Keep **Post Autopsy** read-optimized from `published_posts + post_metrics + scores` for explainability.
- Enforce approval-first interaction model in all post-publish suggestion components (reply suggestions can be generated, never auto-sent).
