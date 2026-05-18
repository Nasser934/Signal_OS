# Signal OS - Codex Instructions

You are working on Signal OS, a SaaS product for X attention intelligence.

Always keep changes focused, reviewable, and tied to the core product loop:
Score -> Improve -> Publish -> Track -> Learn.

Use available tools as follows:

- Use GitHub tools for repository inspection, issues, pull requests, Actions, and code review.
- Use Supabase tools or scoped Supabase MCP connections for schema review, migrations, SQL review, logs, RLS policies, and generated TypeScript types.
- Use Netlify tools for deployment, preview URLs, environment variables, and build logs when Netlify is the chosen host.
- Use OpenAI developer documentation tools for any OpenAI API, Codex, agents, Responses API, or tool-calling questions.
- Use Figma only when implementing or matching UI designs.

Rules:

1. Do not change production database data directly.
2. Do not expose secrets in code.
3. Never commit `.env` files.
4. Before changing billing, inspect the current subscription logic and webhook flow.
5. Before changing database schema, propose a migration and explain the rollback.
6. After each task, run build and tests when available.
7. Keep changes focused and avoid broad rewrites unless requested.
8. Prefer read-only, project-scoped database tooling for inspection work.
9. Preserve the BRD product rule that free users get prediction and paid users get action.
