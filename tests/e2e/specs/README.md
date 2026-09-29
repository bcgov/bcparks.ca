# Specs

Test plans (`*.plan.md`) written by the Playwright planner agent. The generator
agent turns them into spec files in `tests/e2e/`.

### AI test agents
The team uses both Claude Code and GitHub Copilot, so Playwright's test
agents exist in two formats: `.claude/agents/` and `.github/agents/` (at the
repo root). Both are generated. Don't edit them directly. After upgrading
`@playwright/test`, run `npm run agents:update` from `tests/e2e` and commit the
result.
