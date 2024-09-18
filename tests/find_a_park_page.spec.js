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
    
    test("Check the suggestion box is displayed when search by park has been selected", async ({page})=>{
        const dropdownOption = page.getByRole('option', { name: 'Type to search...' });
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByLabel('By park name').click();
        await expect(page.getByLabel('menu-options')).toBeVisible();
        await expect(dropdownOption).toBeVisible
    })

    test("Check the suggestion box is displayed when search by city has been selected", async ({page})=>{
        const dropdownOption = page.getByRole('option', { name: 'Current location' });
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByLabel('Near a city').click();
        await expect(page.getByLabel('menu-options')).toBeVisible();
        await expect(dropdownOption).toBeVisible();
    })

    test('Check the suggestion box in search is displayed for park search', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByLabel('By park name').fill("J")
        await expect(page.getByLabel('menu-options')).toBeVisible();
        await expect(page.getByLabel('menu-options')).toContainText("Jackman Flats Park");
        await expect(page.getByLabel('menu-options')).toContainText("Jackson Narrows Marine Park");
        await expect(page.getByLabel('menu-options')).toContainText("James Chabot Park");
        await expect(page.getByLabel('menu-options')).toContainText("Jedediah Island Marine Park");
        await expect(page.getByLabel('menu-options')).toContainText("Jewel Lake Park");
        await expect(page.getByLabel('menu-options')).toContainText("Jimsmith Lake Park");
        await expect(page.getByLabel('menu-options')).toContainText("Joffre Lakes Park");
    })


    test('Check the suggestion box in search is displayed for city search', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByLabel('Near a city').fill("K");
        await expect(page.getByLabel('menu-options')).toBeVisible();
        await expect(page.getByLabel('menu-options')).toContainText("Kamloops");
        await expect(page.getByLabel('menu-options')).toContainText("Kelowna");
        await expect(page.getByLabel('menu-options')).toContainText("Kaleden");
        await expect(page.getByLabel('menu-options')).toContainText("Kaslo");
        await expect(page.getByLabel('menu-options')).toContainText("Kent");
        await expect(page.getByLabel('menu-options')).toContainText("Keremeos");
        await expect(page.getByLabel('menu-options')).toContainText("Kimberley");
        await expect(page.getByLabel('menu-options')).toContainText("Current location");
    });


});

