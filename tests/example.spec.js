// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('https://bcparks.ca/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Home | BC Parks");
});
