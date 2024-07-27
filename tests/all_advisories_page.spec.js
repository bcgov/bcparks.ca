import { test, expect } from '@playwright/test';
/* 
test.describe('All advisories page tests', ()=>{

    const baseURL = 'https://bcparks.ca/';
    const activeAdvisoriesURL = 'https://bcparks.ca/active-advisories/';
    // const { chromium } = require('@playwright/test');
    const customTimeout = {timeout: 60000};


    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
    });

    test('Navigate to active advisories page', async ({page})=>{
        await page.getByText('See all advisories').click();
        await expect(page).toHaveURL(baseURL + 'active-advisories/');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('Verify the breadcrumbs are visible and working', async ({page})=>{
        await page.goto(activeAdvisoriesURL);
        await expect(page.getByRole('link', { name: 'Home'})).toBeVisible();
        await page.getByRole('link', {name: 'Home'}).click();
        await expect(page).toHaveURL(baseURL);
    });

    test('Verify the h1 is visible', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await expect(page.locator('h1', {name : 'Active advisories'})).toBeVisible();
    });
/*
    test('Verify the Event search is working', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.getByLabel('Select an event').fill('Avalanche');
        await page.waitForLoadState();
        await expect(page.getByLabel('menu-options'), customTimeout).toBeVisible();
        await page.getByLabel('Avalanche', { exact: true }).click();
        await page.getByRole('button', {name :  'Search'}).click();
        await expect(page.locator('h1', {name : 'Active advisories | Avalanche'}), customTimeout).toBeVisible();
        await page.getByLabel('Clear').click();
        await expect(page.getByLabel('Select an event')).toBeEmpty();
        await page.getByLabel('Select an event').fill('Fire');
        await page.getByLabel('Wildfire', { exact: true }).click();
        await page.getByRole('button', {name :  'Search'}).click();
        await expect(page.locator('h1', {name : 'Active advisories | Fire'}), customTimeout).toBeVisible();
    });

 

    test('Verify the search filters are working', async ({page})=>{
        await page.goto(activeAdvisoriesURL)
        await page.getByRole('checkbox').nth(1).check();
        await page.getByRole('textbox', {name : 'Search'}).fill('Babine');
        await page.getByRole('button', {name : 'Search'}).click();
    });

    test('Verify the park safety advisories legend is visible', async ({page}) =>{
        await page.goto(activeAdvisoriesURL)
        const highAdvisoryLegendItem = page.locator('.advisory-legend-item').first();
        const mediumAdvisoryLegendItem = page.locator('.advisory-legend-item').nth(1);
        const lowAdvisoryLegendItem = page.locator('.advisory-legend-item').nth(2);

        await page.goto(activeAdvisoriesURL);
        await expect(highAdvisoryLegendItem).toBeVisible();
        await expect(highAdvisoryLegendItem).toHaveText('HighImmediate danger and closures');
        await expect(highAdvisoryLegendItem.locator('.legend-icon').first()).toBeVisible();
        await expect(highAdvisoryLegendItem.locator('.legend-icon').first()).toHaveCSS('background-color', 'rgb(216, 41, 47)');
        await expect(mediumAdvisoryLegendItem).toBeVisible();
        await expect(mediumAdvisoryLegendItem).toHaveText('MediumSafety and health related');
        await expect(mediumAdvisoryLegendItem.locator('.legend-icon').first()).toBeVisible();
        await expect(mediumAdvisoryLegendItem.locator('.legend-icon').first()).toHaveCSS('background-color', 'rgb(252, 186, 25)');
        await expect(lowAdvisoryLegendItem).toBeVisible();
        await expect(lowAdvisoryLegendItem).toHaveText('LowDiscretion and warnings');
        await expect(lowAdvisoryLegendItem.locator('.legend-icon').first()).toBeVisible();
        await expect(lowAdvisoryLegendItem.locator('.legend-icon').first()).toHaveCSS('background-color', 'rgb(36, 100, 164)');
    });

    test('Check that all links redirect to the correct pages', async ({page}) =>{
        await page.goto(activeAdvisoriesURL);
        await page.getByText('BC Wildfire Service').click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/safety/wildfire-status');
        await page.goBack();
        await page.getByText('BC River Forecast Centre').click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/environment/air-land-water/water/drought-flooding-dikes-dams/river-forecast-centre');
        await page.goBack();
        await page.getByText('Drive BC').click();
        await expect(page).toHaveURL('https://drivebc.ca/');
    });
});
   */