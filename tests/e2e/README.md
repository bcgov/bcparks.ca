# bcparks.ca end-to-end tests

Playwright tests for the public bcparks.ca site. This is a standalone npm
package; run all commands from this directory.

## Setup
Requires Node 22 (see `.nvmrc`).

```sh
nvm use
npm install
npx playwright install
```

Create the env files for the sites you want to test from the committed
examples (the real files are gitignored):

```sh
for f in env/.env.*.example; do cp -n "$f" "${f%.example}"; done
```

## Running tests
```sh
npm test                 # all projects against prod
npm run test:smoke       # @smoke tests only
ENV=dev npm test         # use env/.env.dev
npx playwright show-report
```

`ENV` selects `env/.env.<ENV>`: `prod` (default), `dev`, `test`, `alpha-dev`,
`alpha-test` or `local`. Tests must use paths relative to `BASE_URL`
(`page.goto('/contact/')`, `toHaveURL('/find-a-park/')`), never a full site URL.
Only links to separate systems, such as camping.bcparks.ca, stay absolute.
Check those links with `toHaveAttribute('href', ...)` and don't open them:
GitHub Actions runners can't reach some external sites, such as
www2.gov.bc.ca. These tests aren't a broken link checker.
The non-prod sites may only be reachable from the BC Gov network or VPN.

## Strapi and Gatsby content comparison
`strapi-gatsby-comparison.spec.js` checks published park pages against the
Strapi API, to detect Gatsby local database corruption after a build. It runs
only in its own project (the full-* projects skip it):

```sh
npm run test:content-check
```

It needs `CMS_URL` in `env/.env.<ENV>` (see the `.example` files). For each
park in `PARK_ORCS`, it fetches the park from `CMS_URL`, opens `/<slug>/` on
`BASE_URL`, and looks for one shown item from each child relation:
- `RELATION_CHECKS`: how to tell whether an item is shown, and what text to look
  for. These mirror the rules in `src/gatsby/src/templates/park.js`.
- `SKIPPED_RELATIONS`: relations that aren't checked, and why. For example, some
  are loaded by the browser at runtime rather than from the Gatsby database.
- A relation in neither map is reported as an `unmapped relation` annotation in
  the HTML report. Add it to one of the maps.

## Layout
- `*.spec.js`: tests (`seed.spec.js` is the seed used by the AI agents)
- `fixtures.js`: the `test` and `expect` that specs import, instead of
  `@playwright/test`. It blocks Snowplow analytics requests.
- `pages/`: page objects
- `specs/`: test plans for the AI agents
- `scripts/update-agents.js`: regenerates the root agent/MCP config (`npm run agents:update`)

## AI agents / MCP
`.mcp.json` at the repo root starts the Playwright test MCP server from this
package. Claude Code launches it with whatever `node` is on your PATH, so if
your nvm default is older than 22, run `nvm alias default 22` and restart your
editor.
