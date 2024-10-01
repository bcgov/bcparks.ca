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
    
    test('Check that filters selected are applied and removed', async ({page})=>{
        // Apply Backcountry camping filter and is visible
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByLabel('Backcountry camping (267)').click();
        await expect(page.getByLabel('Backcountry camping (267)')).toBeVisible();
        await expect(page.getByText('267', { exact: true })).toBeVisible();
        // Apply Lower Mainland filter and is visible
        await page.getByLabel('Lower Mainland (7)').click();
        await expect(page.getByLabel('Lower Mainland (7)')).toBeVisible();
        await expect(page.getByText('267', { exact: true })).toBeHidden();
        await expect(page.getByText('7', { exact: true })).toBeVisible();
        // Remove the Backcountry camping filter and is hidden
        await page.getByRole('button', { name: 'Backcountry' }).click();
        await expect(page.getByLabel('Backcountry camping (267)')).toBeHidden();
        // Apply Canoeing filter and is visible
        await page.getByLabel('Canoeing (14)').click();
        await expect(page.getByRole('button', { name: 'Canoeing' })).toBeVisible();
        await expect(page.getByText('14', { exact: true })).toBeVisible();
        // Clear all filters should be working
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await page.waitForLoadState('networkidle');
        await page.getByRole('group', { name: 'Area' }).getByRole('button').click();
        await page.getByRole('button', { name: 'Show all 19' }).click();
        await page.getByRole('group', { name: 'Facilities' }).getByRole('button').click();
        // Check that all filters are unchecked
        await expect(page.getByLabel('Backcountry camping (267)')).not.toBeChecked();
        await expect(page.getByLabel('Cycling (275)')).not.toBeChecked();
        await expect(page.getByLabel('Hiking (450)')).not.toBeChecked();
        await expect(page.getByLabel('Pets on leash (519)')).not.toBeChecked();
        await expect(page.getByLabel('Picnic areas (263)')).not.toBeChecked();
        await expect(page.getByLabel('Swimming (349)')).not.toBeChecked();
        await expect(page.getByLabel('Frontcountry camping (191)')).not.toBeChecked();
        await expect(page.getByLabel('Lower Mainland (44)')).not.toBeChecked();
        await expect(page.getByLabel('South Island (96)')).not.toBeChecked();
        await expect(page.getByLabel('Okanagan (83)')).not.toBeChecked();
        await expect(page.getByLabel('Sea to Sky (61)')).not.toBeChecked();
        await expect(page.getByLabel('Kootenay (70)')).not.toBeChecked();
        await expect(page.getByLabel('Thompson (94)')).not.toBeChecked();
        await expect(page.getByLabel('Cariboo (113)')).not.toBeChecked();
        await expect(page.getByLabel('Haida Gwaii (18)')).not.toBeChecked();
        await expect(page.getByLabel('North Island (83)')).not.toBeChecked();
        await expect(page.getByLabel('Omineca (80)')).not.toBeChecked();
        await expect(page.getByLabel('Peace (77)')).not.toBeChecked();
        await expect(page.getByLabel('Skeena East (91)')).not.toBeChecked();
        await expect(page.getByLabel('Skeena West (100)')).not.toBeChecked();
        await expect(page.getByLabel('South Central Coast (32)')).not.toBeChecked();
        await expect(page.getByLabel('Canoeing (444)')).not.toBeChecked();
        await expect(page.getByLabel('Caving (14)')).not.toBeChecked();
        await expect(page.getByLabel('Climbing (40)')).not.toBeChecked();
        await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Cycling')).not.toBeChecked();
        await expect(page.getByLabel('Disc golf (1)')).not.toBeChecked();
        await expect(page.getByLabel('E-Biking (58)')).not.toBeChecked();
        await expect(page.getByLabel('Fishing (559)')).not.toBeChecked();
        await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Hiking')).not.toBeChecked();
        await expect(page.getByLabel('Horseback riding (131)')).not.toBeChecked();
        await expect(page.getByLabel('Hunting (336)')).not.toBeChecked();
        await expect(page.getByLabel('Interpretive programs (46)')).not.toBeChecked();
        await expect(page.getByLabel('Kayaking (214)')).not.toBeChecked();
        await expect(page.locator('div:nth-child(13) > [id="Pets\\ on\\ leash"]')).not.toBeChecked();
        await expect(page.getByLabel('Scuba diving (86)')).not.toBeChecked();
        await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Swimming')).not.toBeChecked();
        await expect(page.getByLabel('Waterskiing (68)')).not.toBeChecked();
        await expect(page.getByLabel('Wildlife viewing (295)')).not.toBeChecked();
        await expect(page.getByLabel('Windsurfing (70)')).not.toBeChecked();
        await expect(page.getByLabel('Winter recreation (168)')).not.toBeChecked();
        await expect(page.getByLabel('Accessibility information (')).not.toBeChecked();
        await expect(page.getByLabel('Bike park (11)')).not.toBeChecked();
        await expect(page.getByLabel('Boat launch (150)')).not.toBeChecked();
        await expect(page.getByLabel('Campfires (411)')).not.toBeChecked();
        await expect(page.getByLabel('Drinking water (174)')).not.toBeChecked();
    });

    test('Check the A-Z park list redirects to the correct page', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await page.getByRole('link', { name: 'A–Z park list' }).click();
        await expect(page).toHaveURL('https://bcparks.ca/find-a-park/a-z-list/');
    });


    test('Check each park card', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("https://bcparks.ca/find-a-park/");
        await expect(page.getByLabel('Load more results')).toBeVisible();
        await page.getByRole('button', { name: 'Load more results' }).click();
        await expect(page.getByText('Anarchist Protected AreaOkanaganOpen').first()).toBeVisible();
        await page.getByRole('button', { name: 'Load more results' }).click();
        await expect(page.getByText('Arctic Pacific Lakes ParkOminecasee allOpen').first()).toBeVisible();
    });

    // adrianne testing push
    // adrianne testing push at 3:33PM PST
});

