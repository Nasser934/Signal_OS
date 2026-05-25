---
name: open-pr
description: Signal OS pull request workflow. Use when the user asks to open a PR, finish a branch, push changes, prepare work for review, publish local commits, or turn Signal OS changes into a structured pull request.
---

# Open PR

Follow this workflow:

1. Inspect state with `git status --short`, `git branch --show-current`, and the relevant diff.
2. Confirm the branch is not `main`, `master`, or a release branch. If it is, ask before continuing.
3. Separate user changes from your changes. Stage only files related to the task.
4. Run relevant verification:
   - Web: `npm test`, `npm run typecheck`, `npm run lint`, and/or `npm run build` from `web/`
   - Scoring: targeted FastAPI or Python checks for `services/scoring/`
   - Database: inspect generated SQL and explain migration rollback
5. Ensure there is at least one intentional commit on the branch.
6. Match recent commit style unless the repo has a stricter convention.
7. Push the branch to origin.
8. Open a PR with:
   - Product summary tied to Score -> Improve -> Publish -> Track -> Learn
   - Implementation notes
   - Verification performed
   - Database, billing, auth, or plan-gating risks
   - Manual testing still needed
9. Mark the PR as draft if credentials, external services, Supabase, Stripe, X API, or product review are required.

Do not merge, close, force-push, delete branches, or edit production data unless the user explicitly asks.
