import { test, expect } from '@playwright/test';

/*
test.describe('Park Operating Date tests', ()=>{

    const baseURL = 'https://bcparks.ca/';
    const parkOperatingDateURL = 'https://bcparks.ca/plan-your-trip/park-operating-dates/';

    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
    });

test('Navigate to the Park Operating page via mega menu', async ({page})=>{
   await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
   await page.getByRole('menuitem', { name: 'Park operating dates'}).click();
   await expect(page).toHaveURL(baseURL + 'plan-your-trip/park-operating-dates/');
   await expect(page).toHaveTitle('Park operating dates | BC Parks');
});

test('Check the breadcrumbs displayed', async ({page})=>{
    await page.goto(parkOperatingDateURL);
    await expect (page.locator('#main-content')).toBeVisible();
    await page.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(baseURL);
    await page.goBack();
    await page.getByRole('link', { name: 'Plan your trip' }).click();
    await expect(page).toHaveURL(baseURL + 'plan-your-trip/');
    await page.goBack();
    await expect(page.getByLabel('breadcrumb').getByText('Park operating dates')).toBeVisible();
});

test('Check the filter menu is present and in default setting', async ({page})=>{
    await page.goto(parkOperatingDateURL);
    await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();

    // Check if 'All' button is visible and selected
    const allButton = page.getByRole('button', { name: 'All'});
    await expect(allButton).toBeVisible();
    await expect(allButton).toHaveClass('btn btn-selected--true');

    // Letters to check in the filter menu
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
     
     // Loop through each letter and verify if the button is visible and not selected
     for (const letter of letters) {
         const button = page.getByLabel(letter, { exact: true });
         await expect(button).toBeVisible();
         await expect(button).toHaveClass('btn btn-selected--false');
     }
});

test('Verify that the park names redirect to the correct park page', async ({page})=>{
    await page.goto(parkOperatingDateURL);
    await page.getByRole('link', { name: 'Adams Lake Park – Bush Creek' }).click();
    await expect(page).toHaveURL('https://bcparks.ca/adams-lake-park-bush-creek-site/');
    await expect(page).toHaveTitle('Adams Lake Park – Bush Creek Site | BC Parks');
    await expect(page.getByRole('heading', { name: 'Adams Lake Park – Bush Creek' })).toHaveText('Adams Lake Park – Bush Creek Site');
    await page.goBack();
    await page.getByRole('link', { name: 'Akamina-Kishinena Park' }).click();
    await expect(page).toHaveURL('https://bcparks.ca/akamina-kishinena-park/');
    await expect(page).toHaveTitle('Akamina-Kishinena Park | BC Parks');
    await expect(page.getByRole('heading', { name: 'Akamina-Kishinena Park' })).toHaveText('Akamina-Kishinena Park');
})

test('Check the park information is displayed', async ({page})=>{
    await page.goto(parkOperatingDateURL);
    await page.getByLabel('V', { exact: true}).click();
    await expect(page.getByRole('link', { name: 'Vaseux Lake Park'})).toBeVisible();
    await expect(page.getByText('Vaseux Lake ParkOpen.The park')).toBeVisible();
    await expect(page.getByText('Open.The park is open year-round.')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Vaseux Lake Campground' })).toBeVisible();
});

test('Verify the hyperlinks on the page are working', async ({page})=>{
    await page.goto(parkOperatingDateURL);
    await page.getByText('active advisories').click();
    await expect(page).toHaveURL(baseURL + 'active-advisories/');
    await page.goBack();
});


test('Check the park links are working and redirect to the correct site', async({page})=>{
    await page.goto(parkOperatingDateURL);
    // Select all links on the page
    const links = await page.$$(`a`);
    // Loop through each link
    for (const link of links) { 
    const text = await link.textContent(); // Get the text content of the link
    // Check if the text includes 'Check the park'
        if (text.includes('Check the park')) {
            await link.click();
            await expect(page).toHaveURL(baseURL + 'find-a-park/'); 
            await page.goBack();
        }
    };
});

});

*/