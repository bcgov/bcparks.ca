import { test, expect } from '@playwright/test';

test.describe('Find a park page tests', ()=>{
    const customTimeout = { timeout: 90000 };

    test.beforeEach(async ({page})=>{
        await page.goto('/');
    });

    test('Go to the find a park page', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.getByRole('menuitem', { name: 'Find a park' }, customTimeout).click();
        await expect(page).toHaveURL('/' + 'find-a-park/');
        await expect(page).toHaveTitle('Find a park | BC Parks');
    });

    test('Search for a park and redirect to the park page', async ({page})=>{
        await page.waitForLoadState('networkidle');
        await page.getByLabel('By park name').click();
        await page.getByLabel('By park name').fill('joffres');
        await page.getByLabel('Search').click();
        await page.getByRole('link', { name: 'Joffre Lakes Park' }, customTimeout).click();
        await expect(page).toHaveURL('/' + 'joffre-lakes-park/');
        await expect(page).toHaveTitle('Joffre Lakes Park | BC Parks');
    });

    test('Check the filter headings are present', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('b').filter({ hasText: 'Filter' })).toBeVisible();
        await expect(page.getByText('Popular')).toBeVisible();
        await expect(page.getByText('Area', { exact: true })).toBeVisible();
        await expect(page.getByRole('group', { name: 'Camping' }).locator('legend')).toBeVisible();
        await expect(page.getByRole('group', { name: 'Things to do' }).locator('legend')).toBeVisible();
        await expect(page.getByText('Facilities')).toBeVisible();
        await expect(page.locator('b').filter({ hasText: 'More ways to find a park' })).toBeVisible();
    });

    test("Check the suggestion box is displayed when search by city has been selected", async ({page})=>{
        const dropdownOption = page.getByRole('option', { name: 'Current location' });
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("/find-a-park/");
        await page.getByLabel('Near a city').click();
        await expect(page.getByLabel('menu-options')).toBeVisible();
        await expect(dropdownOption).toBeVisible();
    })

    test('Check the suggestion box in search is displayed for park search', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("/find-a-park/");
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
        await expect(page).toHaveURL("/find-a-park/");
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
    
    // test('Check that filters selected are applied and removed', async ({page})=>{
    //     // Apply Backcountry camping filter and is visible
    //     await page.getByRole('menuitem', { name: 'Find a park' }).click();
    //     await page.waitForLoadState('networkidle');
    //     await expect(page).toHaveURL("/find-a-park/");
    //     await page.getByLabel('Backcountry camping (259)').click();
    //     await expect(page.getByLabel('Backcountry camping (259)')).toBeVisible();
    //     await expect(page.getByText('259', { exact: true })).toBeVisible();
    //     // Apply Lower Mainland filter and is visible
    //     await page.getByLabel('Lower Mainland (7)').click();
    //     await expect(page.getByLabel('Lower Mainland (7)')).toBeVisible();
    //     await expect(page.getByText('267', { exact: true })).toBeHidden();
    //     await expect(page.getByText('7', { exact: true })).toBeVisible();
    //     // Remove the Backcountry camping filter and is hidden
    //     await page.getByRole('button', { name: 'Backcountry' }).click();
    //     await expect(page.getByLabel('Backcountry camping (259)')).toBeHidden();
    //     // Apply Canoeing filter and is visible
    //     await page.getByLabel('Canoeing (15)').click();
    //     await expect(page.getByRole('button', { name: 'Canoeing' })).toBeVisible();
    //     await expect(page.getByText('15', { exact: true })).toBeVisible();
    //     // Clear all filters should be working
    //     await page.getByRole('button', { name: 'Clear filters' }).click();
    //     await page.waitForLoadState('networkidle');
    //     await page.getByRole('group', { name: 'Area' }).getByRole('button').click();
    //     await page.getByRole('button', { name: 'Show all 19' }).click();
    //     await page.getByRole('group', { name: 'Facilities' }).getByRole('button').click();
    //     // Check that all filters are unchecked
    //     await expect(page.getByLabel('Backcountry camping (259)')).not.toBeChecked();
    //     await expect(page.getByLabel('Cycling (274)')).not.toBeChecked();
    //     await expect(page.getByLabel('Hiking (442)')).not.toBeChecked();
    //     await expect(page.getByLabel('Pets on leash (512)')).not.toBeChecked();
    //     await expect(page.getByLabel('Picnic areas (258)')).not.toBeChecked();
    //     await expect(page.getByLabel('Swimming (343)')).not.toBeChecked();
    //     await expect(page.getByLabel('Frontcountry camping (188)')).not.toBeChecked();
    //     await expect(page.getByLabel('Lower Mainland (44)')).not.toBeChecked();
    //     await expect(page.getByLabel('South Island (96)')).not.toBeChecked();
    //     await expect(page.getByLabel('Okanagan (83)')).not.toBeChecked();
    //     await expect(page.getByLabel('Sea to Sky (61)')).not.toBeChecked();
    //     await expect(page.getByLabel('Kootenay (70)')).not.toBeChecked();
    //     await expect(page.getByLabel('Thompson (94)')).not.toBeChecked();
    //     await expect(page.getByLabel('Cariboo (113)')).not.toBeChecked();
    //     await expect(page.getByLabel('Haida Gwaii (18)')).not.toBeChecked();
    //     await expect(page.getByLabel('North Island (83)')).not.toBeChecked();
    //     await expect(page.getByLabel('Omineca (80)')).not.toBeChecked();
    //     await expect(page.getByLabel('Peace (77)')).not.toBeChecked();
    //     await expect(page.getByLabel('Skeena East (91)')).not.toBeChecked();
    //     await expect(page.getByLabel('Skeena West (100)')).not.toBeChecked();
    //     await expect(page.getByLabel('South Central Coast (32)')).not.toBeChecked();
    //     await expect(page.getByLabel('Canoeing (418)')).not.toBeChecked();
    //     await expect(page.getByLabel('Caving (14)')).not.toBeChecked();
    //     await expect(page.getByLabel('Climbing (39)')).not.toBeChecked();
    //     await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Cycling')).not.toBeChecked();
    //     await expect(page.getByLabel('Disc golf (1)')).not.toBeChecked();
    //     await expect(page.getByLabel('E-Biking (59)')).not.toBeChecked();
    //     await expect(page.getByLabel('Fishing (552)')).not.toBeChecked();
    //     await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Hiking')).not.toBeChecked();
    //     await expect(page.getByLabel('Horseback riding (124)')).not.toBeChecked();
    //     await expect(page.getByLabel('Hunting (448)')).not.toBeChecked();
    //     await expect(page.getByLabel('Interpretive programs (44)')).not.toBeChecked();
    //     await expect(page.getByLabel('Kayaking (208)')).not.toBeChecked();
    //     await expect(page.locator('div:nth-child(13) > [id="Pets\\ on\\ leash"]')).not.toBeChecked();
    //     await expect(page.getByLabel('Scuba diving (83)')).not.toBeChecked();
    //     await expect(page.getByRole('group', { name: 'Things to do' }).locator('#Swimming')).not.toBeChecked();
    //     await expect(page.getByLabel('Waterskiing (67)')).not.toBeChecked();
    //     await expect(page.getByLabel('Wildlife viewing (293)')).not.toBeChecked();
    //     await expect(page.getByLabel('Windsurfing (69)')).not.toBeChecked();
    //     await expect(page.getByLabel('Winter recreation (165)')).not.toBeChecked();
    //     await expect(page.getByLabel('Accessibility information (206)')).not.toBeChecked();
    //     await expect(page.getByLabel('Bike park (12)')).not.toBeChecked();
    //     await expect(page.getByLabel('Boat launch (146)')).not.toBeChecked();
    //     await expect(page.getByLabel('Campfires (405)')).not.toBeChecked();
    //     await expect(page.getByLabel('Drinking water (171)')).not.toBeChecked();
    // });

    test('Check the A-Z park list redirects to the correct page', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("/find-a-park/");
        await page.getByRole('link', { name: 'A–Z park list' }).click();
        await expect(page).toHaveURL('/find-a-park/a-z-list/');
    });


    test('Check each park card', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL("/find-a-park/");
        await expect(page.getByLabel('Load more results')).toBeVisible();
        await page.getByRole('button', { name: 'Load more results' }).click();
        await expect(page.getByText('Anarchist Protected AreaOkanaganOpen').first()).toBeVisible();
        await page.getByRole('button', { name: 'Load more results' }).click();
        await expect(page.getByText('Arctic Pacific Lakes ParkOminecasee allOpen').first()).toBeVisible();
    });

    test('Check the land acknowledgment message is visible', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Find a park' }, customTimeout).click();
        await page.waitForLoadState('networkidle');
        await page.evaluate(() =>{
            window.scrollBy(0, 5000);
        });
        await expect(page.locator('div').filter({ hasText: 'We acknowledge all First' }).nth(3)).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'We acknowledge all First' }).nth(3)).toContainText('We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.')
        await expect(page.getByText('We acknowledge all First')).toBeVisible();
    });

    test('Check the back to top button is working', async ({ page }) => {
        await page.waitForLoadState('networkidle');
        await page.getByRole('menuitem', { name: 'Find a park' }, customTimeout).click();
        await page.waitForTimeout(5000);
        await page.evaluate(() => {
            window.scrollBy(0, 3000);
        });
        await expect(page.getByLabel('scroll to top')).toBeVisible();
        await page.getByLabel('scroll to top').click();
        await page.waitForTimeout(5000)
        const updatedScrollPosition = await page.evaluate(() => window.scrollY);
        expect(updatedScrollPosition).toBe(0);
        await expect(page.getByLabel('scroll to top')).toBeHidden();
      });
});
