# Signal OS Codex Checklist

## Repository Setup

- Keep `AGENTS.md` current with stack, commands, forbidden zones, and product rules.
- Keep shared skills in `.agents/skills/`.
- Keep reviewer agents in `.codex/agents/`.
- Run `codex trust .` before using project-local config.
- Copy `.codex/config.template.toml` to `.codex/config.toml` only after review.

## Daily Use

- Use one task per prompt.
- Use `investigate` before fixing bugs.
- Use `new-feature` for bounded implementation work.
- Use `open-pr` when preparing work for review.
- Use browser verification for UI changes.
- Use fresh review for meaningful diffs before merging.

## Signal OS Product Guards

- Free users get prediction.
- Paid users get action.
- No scraping or browser automation for X.
- No auto-engagement.
- Do not edit production data directly.
- Add new migrations instead of editing existing migrations.
- Ask before changing billing, auth, or schema.
