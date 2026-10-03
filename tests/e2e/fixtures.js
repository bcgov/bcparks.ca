import { test as base, expect } from '@playwright/test';
import { isNetworkError, isSiteUrl, MAX_PAUSE_MS, pauseTests, waitWhilePaused } from './networkBreaker.js';

// Snowplow analytics: the tracker script on www2.gov.bc.ca and the collector.
// GitHub Actions runners can't always reach www2.gov.bc.ca, and a hanging
// script request delays the page load event. Blocking it also keeps test runs
// out of the BC Parks analytics. The site checks that window.snowplow exists
// before tracking, so pages work the same without it.
const SNOWPLOW = /www2\.gov\.bc\.ca\/StaticWebResources\/static\/sp\/|spt\.apps\.gov\.bc\.ca/;

// A site request still pending this long when a test fails counts as the site
// not responding
const STALLED_REQUEST_MS = 10000;

/**
 * Tracks a browser context's network requests, so a failed test can report
 * the requests that never finished or that failed. Snowplow requests, which
 * are aborted on purpose, are ignored. A network error from the site under
 * test pauses the whole test run (see networkBreaker.js).
 * @param {import('@playwright/test').BrowserContext} context browser context to watch
 * @returns {{report: () => string[], stalledSiteRequest: () => string|undefined}} report
 * returns lines for the requests that are still pending or failed; stalledSiteRequest
 * returns the URL of a site request pending for STALLED_REQUEST_MS or more
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
            const errorText = request.failure()?.errorText;
            failed.push(`failed: ${errorText} ${request.url()}`);
            if (isSiteUrl(request.url()) && isNetworkError(errorText)) {
                pauseTests(`${errorText} ${request.url()}`);
            }
        }
    });

    return {
        report: () => [
            ...[...pending].map(
                ([request, start]) =>
                    `pending ${Math.round((Date.now() - start) / 1000)}s: ${request.resourceType()} ${request.url()}`,
            ),
            ...failed,
        ],
        stalledSiteRequest: () =>
            [...pending].find(
                ([request, start]) => isSiteUrl(request.url()) && Date.now() - start >= STALLED_REQUEST_MS,
            )?.[0].url(),
    };
}

/**
 * Playwright test with Snowplow requests blocked in every browser context.
 * When a test fails, the requests that were still pending or that failed are
 * printed, to show what slowed or broke the page.
 * Before each test, it waits while the run is paused for network errors (see
 * networkBreaker.js).
 * Specs should import test and expect from this file, not '@playwright/test'.
 */
export const test = base.extend({
    // Runs for every test. Its own timeout keeps the waiting out of the test timeout.
    waitWhileNetworkPaused: [
        async ({}, use) => {
            await waitWhilePaused();
            await use();
        },
        { auto: true, timeout: MAX_PAUSE_MS + 60000 },
    ],

    context: async ({ context }, use, testInfo) => {
        await context.route(SNOWPLOW, (route) => route.abort());
        const requests = trackRequests(context);

        await use(context);

        if (testInfo.status !== testInfo.expectedStatus) {
            const stalledUrl = requests.stalledSiteRequest();
            if (stalledUrl) {
                pauseTests(`no response from ${stalledUrl}`);
            }
            const lines = requests.report();
            if (lines.length > 0) {
                console.log(
                    `Network requests for "${testInfo.title}" (${testInfo.project.name}):\n  ${lines.join('\n  ')}`,
                );
            }
        }
    },
});

export { expect };
