# Codex Workflows for Signal OS

## Feature Prompt

```markdown
Use the new-feature skill.

Implement <feature>.

Outcome:
- <specific Signal OS behavior>

Context:
- Relevant files: <paths>
- Product rule: free users get prediction; paid users get action.

Constraints:
- Keep the change focused.
- Do not edit existing Supabase migrations.
- Do not change billing, auth, or plan gating without explaining the impact first.
- Reply Assistant must never auto-send.

Verification:
- Run the smallest relevant tests first.
- Then run npm test, npm run typecheck, lint, or build from web/ as appropriate.
```

## Bug Prompt

```markdown
Use the investigate skill.

Investigate <bug>.

Observed:
- <what happened>

Expected:
- <what should happen>

Evidence:
- <logs, screenshots, stack traces, request ids>

Do not fix yet. Return reproduction status, root cause hypothesis, evidence, minimal fix plan, and verification plan.
```

## Refactor Prompt

```markdown
Refactor <area> to <target design>.

Rules:
- List all affected locations first.
- Produce a migration plan and wait for approval.
- Preserve public behavior.
- Existing tests must pass unmodified.
- Do not mix product changes into the refactor.
```

## Cloud Fan-Out Candidates

Use independent tasks only:

```csv
title,prompt
"Draft scorer test gap","Inspect Draft Score tests and propose the highest-value missing tests. Do not modify code."
"Plan gating audit","Review paid/free feature gating against BRD.md. Report mismatches with file paths."
"Supabase RLS review","Inspect migrations and schema for RLS risks. Report findings only; do not edit migrations."
```
