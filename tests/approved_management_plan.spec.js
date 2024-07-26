import { test, expect } from '@playwright/test';

/*
test.describe('Approved management plan tests', ()=>{

    const baseURL = 'https://bcparks.ca/';
    const approvedManagementPlanURL = 'https://bcparks.ca/about/management-plans/approved/';
    
    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
    });
    

    test('Check that we can get to the page from homepage', async ({page})=>{
        await page.getByRole('menuitem', { name: 'About' }).click();
        await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackAboutOur' }).nth(4)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'About', exact: true })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Management plans' }).click();
        await expect(page.getByRole('menuitem', { name: 'Management plans', exact: true })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Approved management plans' }).click();
        await expect(page).toHaveURL(baseURL + 'about/management-plans/approved/');
        await expect(page).toHaveTitle('Approved management plans | BC Parks');
        await expect(page.locator('h1', { name: 'Approved management plans'})).toBeVisible();
    });

    test('Check the breadcrumbs displayed', async ({page})=>{
        await expect (page.locator('#main-content')).toBeVisible();
        await page.goto(approvedManagementPlanURL);
        await page.getByRole('link', { name: 'Home' }).click();
        await expect(page).toHaveURL(baseURL);
        await page.goBack();
        await page.getByRole('link', { name: 'About' }).click();
        await expect(page).toHaveURL(baseURL + 'about/');
        await page.goBack();
        await page.getByRole('link', { name: 'Management plans', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'about/management-plans/');
        await page.goBack();
        await expect(page.getByLabel('breadcrumb').getByText('Approved management plans')).toBeVisible();
    });

    test('Check the filter menu is present and in default setting', async ({page})=>{
        await page.goto(approvedManagementPlanURL);
        await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();

        const allButton = page.getByRole('button', { name: 'All'});
        await expect(allButton).toBeVisible();
        await expect(allButton).toHaveClass('btn btn-selected--true');

        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V', 'W', 'X', 'Y', 'Z']

        for(const letter of letters){
            const button = page.getByLabel(letter, { exact: true});
            await expect(button).toBeVisible();
            await expect(button).toHaveClass('btn btn-selected--false');
        };

        // Check the letter headings are visible
        for (const letter of letters){
            const heading = page.getByRole('heading', { name: letter, exact: true});
            await expect(heading).toBeVisible();
        };
    });

    test('Check the filters work and list updates', async ({page})=>{
        await page.goto(approvedManagementPlanURL);
        // Check the default state
        const allButton = page.getByRole('button', { name: 'All'});
        await expect(allButton).toBeVisible();
        await expect(allButton).toHaveClass('btn btn-selected--true');

        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U','V', 'W', 'X', 'Y', 'Z']
        
        // For every letter click on the filter, state of the filter should change
        for(const letter of letters){
            const button = page.getByLabel(letter, { exact: true});
            const heading = page.getByRole('heading', { name: letter, exact: true});
            await button.click();
            await expect(heading).toBeVisible();
            await expect(allButton).toHaveClass('btn btn-selected--false');
            await expect(button).toHaveClass('btn btn-selected--true');

    // Check that if the letter is not selected, then the headings should not be displayed
            for (const otherLetter of letters){
                if(otherLetter !== letter){
                    const otherHeading = page.getByRole('heading', { name: otherLetter, exact: true });
                    await expect(otherHeading).not.toBeVisible();
                }
            }
        }
    });
});
*/