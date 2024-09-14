import { test, expect } from '@playwright/test';

test.describe('Find a park page tests', async ()=>{
    const baseURL = 'https://bcparks.ca/';
    const customTimeout = { timeout: 90000 };

    test.beforeEach(async ({page})=>{
        page.goto(baseURL);
    });

    test('Go to the find a park page', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.getByRole('menuitem', { name: 'Find a park' }, customTimeout).click();
        await expect(page).toHaveURL(baseURL + 'find-a-park/');
        await expect(page).toHaveTitle('Find a park | BC Parks');
    });

    test('Search for a park and redirect to the park page', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.getByLabel('By park name').click();
        await page.getByLabel('By park name').fill('joffres');
        await page.getByLabel('Search').click();
        await page.getByRole('link', { name: 'Joffre Lakes Park' }, customTimeout).click();
        await expect(page).toHaveURL(baseURL + 'joffre-lakes-park/');
        await expect(page).toHaveTitle('Joffre Lakes Park | BC Parks');
    });

    test('Check the filter headings are present', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();
        await expect(page.getByText('Popular')).toBeVisible();
        await expect(page.getByText('Area', { exact: true })).toBeVisible();
        await expect(page.getByRole('group', { name: 'Camping' }).locator('legend')).toBeVisible();
        await expect(page.getByRole('group', { name: 'Things to do' }).locator('legend')).toBeVisible();
        await expect(page.getByText('Facilities')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'More ways to find a park' })).toBeVisible();
    });
});

