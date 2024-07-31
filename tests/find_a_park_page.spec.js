import { test, expect } from '@playwright/test';

test.describe('Find a park page tests', async ()=>{
    const baseURL = 'https://bcparks.ca/';
    const findParkURL = 'https://bcparks.ca/find-a-park/';

    test.beforeEach(async ({page})=>{
        page.goto(baseURL);
        await page.waitForLoadState('domcontentloaded');
    });

    test('Go to the find a park page', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await expect(page).toHaveURL(baseURL + 'find-a-park/');
        await expect(page).toHaveTitle('Find a park | BC Parks');
    });

    test('Search for a park and redirect to the park page', async ({page})=>{
        await page.getByLabel('By park name').click();
        await page.getByLabel('By park name').fill('joffres');
        await page.getByLabel('Search').click();
        await page.getByRole('link', { name: 'Joffre Lakes Park' }).click();
        await expect(page).toHaveURL(baseURL + 'joffre-lakes-park/');
        await expect(page).toHaveTitle('Joffre Lakes Park | BC Parks');
    });

    test('Check the filter headings are present', async ({page})=>{
        await page.goto(findParkURL);
        await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();
        await expect(page.getByText('Popular')).toBeVisible();
        await expect(page.getByText('Area', { exact: true })).toBeVisible();
        await expect(page.getByRole('group', { name: 'Camping' }).locator('legend')).toBeVisible();
        await expect(page.getByText('Activities')).toBeVisible();
        await expect(page.getByText('Facilities')).toBeVisible();
        await expect(page.getByText('More ways to find a park')).toBeVisible();
    });
});

