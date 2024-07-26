import { test, expect } from '@playwright/test';

const baseURL = 'https://bcparks.ca/';

test.describe('Find a park page tests', async ()=>{

    const baseURL = 'https://bcparks.ca/';

    test.beforeEach(async ({page})=>{
        page.goto(baseURL);
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


    //Adding a line to trigger a job
});