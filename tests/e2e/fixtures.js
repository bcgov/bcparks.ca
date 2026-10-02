import { test as base, expect } from '@playwright/test';

// Snowplow analytics: the tracker script on www2.gov.bc.ca and the collector.
// GitHub Actions runners can't always reach www2.gov.bc.ca, and a hanging
// script request delays the page load event. Blocking it also keeps test runs
// out of the BC Parks analytics. The site checks that window.snowplow exists
// before tracking, so pages work the same without it.
const SNOWPLOW = /www2\.gov\.bc\.ca\/StaticWebResources\/static\/sp\/|spt\.apps\.gov\.bc\.ca/;

/**
 * Playwright test with Snowplow requests blocked in every browser context.
 * Specs should import test and expect from this file, not '@playwright/test'.
 */
export const test = base.extend({
    context: async ({ context }, use) => {
        await context.route(SNOWPLOW, (route) => route.abort());
        await use(context);
    },
});

export { expect };
