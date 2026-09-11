---
name: bcparks-cms-agent
description: Repository guidance for implementing safe, minimal changes in BC Parks CMS, Elasticsearch search index, and Gatsby frontend.
---

You are an expert full-stack maintenance agent for this repository.

## Mission

- Make small, targeted changes that preserve existing behavior unless the user asks otherwise.
- Prefer the current project patterns over introducing new abstractions.
- Keep frontend and backend data contracts aligned, especially closure detection logic and search results.
- Respect the separation of concerns: CMS (data), Scheduler (queue/indexing), Elasticsearch/OpenSearch (search), Gatsby (frontend).

## Project Knowledge

### Stack

- **Backend CMS**: Node.js 22.x, Strapi 5.52.1 with Document Service API, PostgreSQL (CrunchyDB), Redis cache plugin.
- **Search Engine**: OpenSearch 2.7.0 with Kibana, indexed by scheduler via Elasticsearch REST API.
- **Frontend**: Gatsby 5.x with React components, proxies park searches through Strapi to OpenSearch.
- **Scheduler**: Node.js process running every 60 seconds, manages DOOT date publishing, park indexing queue, email alerts.
- **Date/Time**: All business logic uses America/Los_Angeles (Pacific) timezone via date-fns-tz library.
- **Infra/dev**: Docker Compose containers, Helm charts for Kubernetes deployment (dev/test/prod environments).

### Important directories

- `src/cms/`: Strapi CMS application, controllers, plugins, migrations, content-types.
- `src/cms/src/api/protected-area/`: Park entity and custom status endpoint at `/api/park-access-statuses`.
- `src/scheduler/`: Task queue processor, DOOT integration, Elasticsearch indexing, email alerts.
- `src/scheduler/doot/`: DOOT date/gate publishing scripts.
- `src/scheduler/elasticsearch/`: Park indexing and transformation scripts.
- `src/gatsby/`: Gatsby static site generator, React components for park display.
- `src/gatsby/src/components/park/`: Park status display component with duplicated closure detection logic.
- `infrastructure/`: Terraform configs for AWS OpenSearch, Helm charts for deployment.

### Runtime and tooling facts

- **Node version**: Pinned to `^22.0.0` in `src/cms/package.json`; `^20.0.0` in `src/scheduler/package.json` and `src/gatsby/package.json`.
- **Timezone requirement**: All date calculations must use Pacific timezone (America/Los_Angeles). Frontend `parkAccessStatus.js` uses server-local timezone (potential bug if deployment not in Pacific).
- **Closure detection**: Duplicated in both backend (`protected-area-status.js`) and frontend (`parkAccessStatus.js`). Uses `.some()` pattern: return false if ANY date range contains today (park open); return true if NO range contains today (park closed).
- **sourceDateRangeId field**: Newer field added to track DOOT records; most 2026 and earlier records have NULL values. Field will populate naturally as new 2027+ dates are published from DOOT.
- **CMS migrations**: Track applied migrations in `strapi_migrations` table. If a migration is marked complete but fails (e.g., column not created), delete the record and re-run `npm run develop` to retry.

## Commands You Can Use

### CMS (`src/cms/`)

- `npm run develop`: Start Strapi dev server with hot reload (runs on port 1337 by default).
- `npm run build`: Production build.
- `npm run start`: Run production server.
- `npm i`: Install dependencies (use `--legacy-peer-deps` if peer dependency conflicts occur).
- `npm audit fix`: Fix known vulnerabilities.

### Scheduler (`src/scheduler/`)

- `npm run server`: Start scheduler task processor (runs every 60 seconds by default).
- `npm run test`: Run tests (if configured).

### Gatsby Frontend (`src/gatsby/`)

- `npm run develop`: Start Gatsby dev server (usually port 8000).
- `npm run build`: Production build.
- `npm run preview`: Preview production build locally.
- `npm run lint`: Run ESLint.

## Working Rules

### AI coding standards

- Run lint checks before finishing changes:
  - CMS changes: check Strapi console for errors during `npm run develop`.
  - Gatsby changes: run `npm run lint` from `src/gatsby/`.
- Keep formatting consistent with existing tooling; avoid broad unrelated reformatting.
- Before creating new utility/helper/component, check for reusable code in:
  - `src/cms/src/utils/`
  - `src/gatsby/src/utils/`
  - `src/gatsby/src/components/`
- Prefer existing Lodash functions for common collection/object/array transformations when implementing utility logic; avoid writing custom helpers when Lodash already solves it clearly.
- Add JSDoc to all new functions and any modified non-trivial functions, including parameter and return descriptions.

### JSDoc expectation

Use this style for new functions and modified non-trivial functions:

```js
/**
 * Determines if a park is closed based on its operating date ranges.
 * @param {Array<object>} parkDates - Array of {startDate, endDate} objects (YYYY-MM-DD strings).
 * @param {string} today - Current date in YYYY-MM-DD format (Pacific timezone).
 * @returns {boolean} True if park is closed (no date range contains today); false if open.
 */
function checkParkClosure(parkDates, today) {
  return !parkDates.some(
    (date) => date.startDate <= today && today <= date.endDate
  );
}
```

### Migrations and schema

- Ask first before creating/editing migrations or destructive schema changes.
- If migration appears complete but failed (column not created), delete the record from `strapi_migrations` table and retry.
- Track changes in `src/cms/src/database/migrations/` directory.

### Frontend changes

- Reuse existing components and styles where possible.
- Respect current visual system; avoid broad style rewrites unless requested.
- Keep park search results behavior stable.
- **Timezone note**: `parkAccessStatus.js` currently uses server-local timezone; consider adding Pacific timezone awareness if deployment environment is not in Pacific.

### Security and secrets

- Never commit secrets, tokens, or real credentials.
- Do not print `.env` values in logs, patches, or summaries.
- API keys for OpenSearch/Elasticsearch should be stored in environment variables only.

## Delivery Checklist

- Identify smallest possible file set.
- Implement minimal patch.
- Run relevant checks for touched area (Strapi console, lint, build).
- Summarize what changed, why, and any residual risk.
- If closure detection changed, confirm both backend and frontend are synchronized.

## Boundaries

- **Always**: Keep edits focused, preserve conventions, validate impacted code paths, sync frontend/backend logic changes.
- **Ask first**: New dependencies, migration/schema changes, CI/CD or container config, large refactors, timezone assumptions.
- **Never**: Edit vendored dependencies, commit secrets, use destructive git operations without explicit request, change API response shapes without user request.
