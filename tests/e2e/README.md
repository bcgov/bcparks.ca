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
npm run test:chromium    # all tests, Chromium only (what PRs run)
npm run test:firefox     # all tests, Firefox only
npm run test:webkit      # all tests, WebKit only
npm run test:smoke       # @smoke tests only
ENV=dev npm test         # use env/.env.dev
npx playwright show-report
```

`ENV` selects `env/.env.<ENV>`: `prod` (default), `dev`, `test`, `alpha-dev`,
`alpha-test` or `local`. Tests must use paths relative to `BASE_URL`
(`page.goto('/contact/')`, `toHaveURL('/find-a-park/')`), never a full site URL.
Only links to separate systems, such as camping.bcparks.ca, stay absolute.
The non-prod sites may only be reachable from the BC Gov network or VPN.

## Strapi and Gatsby content comparison
`strapi-gatsby-comparison.spec.js` checks published park pages against the
Strapi API, to detect Gatsby local database corruption after a build. It runs
only in its own project (the full-* projects skip it):

```sh
npm run test:content-check
```

It needs `CMS_URL` in `env/.env.<ENV>` (see the `.example` files). For each
park in `PARKS`, it fetches the park from `CMS_URL`, opens `/<slug>/` on
`BASE_URL`, and looks for one shown item from each child relation:
- `RELATION_CHECKS`: how to tell whether an item is shown, and what text to look
  for. These mirror the rules in `src/gatsby/src/templates/park.js`.
- `SKIPPED_RELATIONS`: relations that aren't checked, and why. For example, some
  are loaded by the browser at runtime rather than from the Gatsby database.
- A relation in neither map is reported as an `unmapped relation` annotation in
  the HTML report. Add it to one of the maps.

## Network pause (temporary)
The BC Government network rate limits GitHub Actions runners, which share IP
addresses with every other GitHub user. After about a minute of test traffic,
bcparks.ca refuses connections and cms.bcparks.ca stops responding for about
two minutes, and this repeats for the rest of the run. Runs from our own
network, at much higher rates, are never blocked.

`utils/networkPause.js` works around this for the content check. When the
Strapi API or a park page can't be reached, the whole run pauses, one request
every 30 seconds checks the server, and tests resume once it responds. The
park is retried after the pause, and only skipped if it still can't be
reached, since a network problem isn't Gatsby corruption. If one outage lasts
more than 15 minutes, the run stops pausing so it can finish in time. The log
shows "Pausing all tests" and "Resuming tests" when this happens.

This is temporary until the network issue is fixed. A larger GitHub runner
with a static IP range has been requested, so its traffic isn't throttled.
Once runs no longer pause, delete `utils/networkPause.js`, import `test` and
`expect` from `@playwright/test` in the content check, and remove its
retry and skip handling for unreachable servers.

## Layout
- `*.spec.js`: tests (`seed.spec.js` is the seed used by the AI agents)
- `utils/networkPause.js`: pauses the run while the site is unreachable; see
  [Network pause (temporary)](#network-pause-temporary)
- `pages/`: page objects
- `specs/`: test plans for the AI agents
- `scripts/update-agents.js`: regenerates the root agent/MCP config (`npm run agents:update`)

## AI agents / MCP
`.mcp.json` at the repo root starts the Playwright test MCP server from this
package. Claude Code launches it with whatever `node` is on your PATH, so if
your nvm default is older than 22, run `nvm alias default 22` and restart your
editor.
