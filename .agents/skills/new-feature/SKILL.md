---
name: new-feature
description: Signal OS feature implementation workflow. Use when the user asks to add a product feature, implement part of the BRD, build a Next.js UI flow, add an API route, extend scoring, add Supabase-backed behavior, or create tested production code.
---

# New Feature

Use this sequence:

1. Read `AGENTS.md`, `BRD.md`, and files directly related to the requested feature.
2. Preserve the product rule: free users get prediction; paid users get action.
3. Identify existing components, server helpers, API routes, Supabase wrappers, tests, and naming patterns to reuse.
4. Produce a short plan before editing unless the user explicitly requested full autonomy.
5. Ask before changing billing, auth, database schema, public API behavior, or the scoring philosophy.
6. Implement the smallest coherent change that satisfies the requested outcome.
7. Add focused tests when a test surface exists:
   - Vitest for web logic
   - Route/helper tests where feasible
   - Targeted scoring checks for rules changes
8. For UI changes, verify the rendered flow in a browser when feasible.
9. Run relevant verification from `AGENTS.md`.

Failure behavior:

- Do not weaken tests to make them pass.
- Do not hide errors with broad try/catch.
- If verification fails, diagnose and report the failing command, likely cause, and next fix.

Keep unrelated refactors out of the feature branch. Use the `open-pr` skill when the user wants the change published.
