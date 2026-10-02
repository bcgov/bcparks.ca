import { test as base, expect } from '@playwright/test';

// Snowplow analytics: the tracker script on www2.gov.bc.ca and the collector.
// GitHub Actions runners can't always reach www2.gov.bc.ca, and a hanging
// script request delays the page load event. Blocking it also keeps test runs
// out of the BC Parks analytics. The site checks that window.snowplow exists
// before tracking, so pages work the same without it.
const SNOWPLOW = /www2\.gov\.bc\.ca\/StaticWebResources\/static\/sp\/|spt\.apps\.gov\.bc\.ca/;

/**
 * Tracks a browser context's network requests, so a failed test can report
 * the requests that never finished or that failed. Snowplow requests, which
 * are aborted on purpose, are ignored.
 * @param {import('@playwright/test').BrowserContext} context browser context to watch
 * @returns {() => string[]} returns report lines for the requests that are still pending or failed
 */
function trackRequests(context) {
    const pending = new Map();
    const failed = [];
    context.on('request', (request) => {
        if (!SNOWPLOW.test(request.url())) {
            pending.set(request, Date.now());
        }
    });
    context.on('requestfinished', (request) => pending.delete(request));
    context.on('requestfailed', (request) => {
        if (pending.delete(request)) {
            failed.push(`failed: ${request.failure()?.errorText} ${request.url()}`);
        }
    });

    return () => [
        ...[...pending].map(
            ([request, start]) =>
                `pending ${Math.round((Date.now() - start) / 1000)}s: ${request.resourceType()} ${request.url()}`,
        ),
        ...failed,
    ];
}

/**
 * Playwright test with Snowplow requests blocked in every browser context.
 * When a test fails, the requests that were still pending or that failed are
 * printed, to show what slowed or broke the page.
 * Specs should import test and expect from this file, not '@playwright/test'.
 */
export const test = base.extend({
    context: async ({ context }, use, testInfo) => {
        await context.route(SNOWPLOW, (route) => route.abort());
        const getRequestReport = trackRequests(context);

        await use(context);

        if (testInfo.status !== testInfo.expectedStatus) {
            const lines = getRequestReport();
            if (lines.length > 0) {
                console.log(
                    `Network requests for "${testInfo.title}" (${testInfo.project.name}):\n  ${lines.join('\n  ')}`,
                );
            }
        }
    },
});

export { expect };
