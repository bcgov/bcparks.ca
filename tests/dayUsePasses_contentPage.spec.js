//@ts-check

// Import the test and expect functions from Playwright
import { test, expect } from '@playwright/test';

//base URL for the tests
const baseURL = 'https://bcparks.ca/';

//wait for the page to load before running the tests
test.beforeEach(async ({page})=>{
    await page.goto(baseURL);
});

// Test navigation to the Day-use passes page via the mega menu
test('Verify the navigation to the Day-use passes page', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.getByRole('menuitem', { name: 'Reservations' }).click();
    await page.getByRole('menuitem', { name: 'Day-use passes' }).click();
    await expect(page).toHaveURL(baseURL + 'reservations/day-use-passes/');
    await expect(page).toHaveTitle('Day-use passes - Province of British Columbia | BC Parks');
  
  });


test('Verify the page content', async ({ page }) => {
    await page.goto(baseURL + 'reservations/day-use-passes/');
    test.setTimeout(60000);
    await expect(page.getByText('Home›Reservations›Day-use')).toBeVisible();
    await expect(page.getByLabel('breadcrumb').locator('div')).toContainText('Day-use passes');
    await expect(page.getByRole('heading', { name: 'Day-use passes', exact: true })).toBeVisible();
    await expect(page.locator('h1')).toContainText('Day-use passes');
    await expect(page.getByRole('img', { name: 'Day-use passes' })).toBeVisible();
    await expect(page.getByText('Joffre LakesGaribaldiGolden EarsMount SeymourWhy day-use passes?', { exact: true })).toBeVisible();
    await expect(page.locator('#section-navbar').getByRole('link', { name: 'Joffre Lakes' })).toBeVisible();
    await expect(page.locator('#section-navbar')).toContainText('Joffre Lakes');
    await expect(page.locator('#section-navbar').getByRole('link', { name: 'Garibaldi' })).toBeVisible();
    await expect(page.locator('#section-navbar')).toContainText('Garibaldi');
    await expect(page.locator('#section-navbar').getByRole('link', { name: 'Golden Ears' })).toBeVisible();
    await expect(page.locator('#section-navbar')).toContainText('Golden Ears');
    await expect(page.locator('#section-navbar').getByRole('link', { name: 'Mount Seymour' })).toBeVisible();
    await expect(page.locator('#section-navbar')).toContainText('Mount Seymour');
    await expect(page.getByRole('link', { name: 'Why day-use passes?', exact: true })).toBeVisible();
    await expect(page.locator('#section-navbar')).toContainText('Why day-use passes?');
    await expect(page.locator('.page-content')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book a pass' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book a pass' }).first()).toHaveAttribute('href', 'https://reserve.bcparks.ca/dayuse/');
    await expect(page.locator('#gatsby-focus-wrapper')).toContainText('Day-use passes are required to visit some of the most popular BC Parks during their busiest times. Passes are free, and you can get them online. This page has everything you need to know about getting a pass, and it explains why these passes are important.');
    await expect(page.locator('#home-footer')).toBeVisible();
  });