---
name: investigate
description: Signal OS diagnose-before-fixing workflow. Use when the user reports a bug, failing test, broken UI flow, production incident, regression, stack trace, performance issue, auth/Supabase problem, scoring mismatch, or asks for root cause analysis.
---

# Investigate

Diagnose before changing code:

1. Capture observed behavior, expected behavior, environment, inputs, logs, screenshots, request ids, and reproduction steps.
2. Read `AGENTS.md`, relevant tests, and the smallest code path that could explain the behavior.
3. Reproduce the issue when possible using existing commands or a minimal local scenario.
4. Trace the flow through the relevant layer:
   - UI in `web/app/` or `web/components/`
   - API routes in `web/app/api/`
   - server logic in `web/lib/server/`
   - Supabase clients in `web/lib/supabase/`
   - scoring in `services/scoring/main.py`
   - migrations in `supabase/migrations/`
5. Form a hypothesis in this shape: "I believe X happens because Y in Z."
6. Validate or falsify the hypothesis with code reading, tests, logs, SQL inspection, or targeted commands.
7. Stop before implementing a fix unless the user asked for investigate-and-fix.

Output:

- Reproduction status
- Relevant files and functions
- Root cause hypothesis
- Evidence supporting or weakening the hypothesis
- Minimal fix plan
- Verification plan

Do not rewrite production code during investigation unless the user explicitly asks.
