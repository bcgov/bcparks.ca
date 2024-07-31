import { test, expect } from '@playwright/test';
/*
test.describe('Footer tests', ()=>{

    const baseURL = 'https://bcparks.ca/';

    test.beforeEach(async ({page})=>{
        await page.goto(baseURL);
        await page.waitForLoadState('domcontentloaded');        
    });

    test('Check that the footer blocker is present', async ({page})=>{
        await expect(page.locator('#footer')).toBeVisible();
    });

    test('Check the BC Logo and link is working', async ({page}) =>{
        await page.getByRole('menuitem', { name: 'Contact' }).click();
        await expect(page.getByRole('link', { name: 'BC Parks Wordmark' })).toBeVisible();
        await page.getByRole('link', { name: 'BC Parks Wordmark' }).click();
        await expect(page).toHaveURL(baseURL);
    })

    test('Check the heading on the footer is visible', async ({page}) =>{
        await expect(page.locator('#home-footer').getByText('Get a permit')).toBeVisible();
        await expect(page.locator('#home-footer').getByText('Get involved')).toBeVisible(); 
        await expect(page.locator('#home-footer').getByText('Stay connected')).toBeVisible();
    });

    test('Check the links on the footer are visible and are working', async ({page}) =>{
        await page.locator('#home-footer').getByText('Park-use permits').click();
        await expect(page).toHaveURL(baseURL + 'park-use-permits/');
        await page.goBack();
        await expect(page).toHaveURL(baseURL);
        await page.locator('#home-footer').getByText('Filming in parks').click();
        await expect(page).toHaveURL(baseURL + 'park-use-permits/filming-in-parks/');
        await page.goBack();
        await page.locator('#home-footer').getByText('Travel trade').click();
        await expect(page).toHaveURL(baseURL + 'park-use-permits/travel-trade/');
        await page.goBack();
        await page.locator('#home-footer').getByText('Donate').click();
        await expect(page).toHaveURL(baseURL + 'get-involved/donate/');
        await page.goBack();
        await page.locator('#home-footer').getByText('Buy a licence plate').click();
        await expect(page).toHaveURL(baseURL + 'get-involved/buy-licence-plate/');
        await page.goBack();
        await page.locator('#home-footer').getByText('Volunteer').click();
        await expect(page).toHaveURL(baseURL + 'get-involved/volunteer/');
        await page.goBack();
        await page.locator('#home-footer').getByText('Contact us').click();
        await expect(page).toHaveURL(baseURL + 'contact/');
        await page.goBack();  
        await page.locator('#home-footer').getByText('BC Parks blog').click();
        await expect(page).toHaveURL('https://engage.gov.bc.ca/bcparksblog/');
        await page.goBack();
        await page.getByRole('link', { name: 'Site map' }).click();
        await expect(page).toHaveURL(baseURL + 'site-map/');
        await page.goBack();
        await page.getByRole('link', { name: 'Disclaimer' }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/disclaimer');
        await page.goBack();
        await page.getByRole('link', { name: 'Privacy' }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/privacy');
        await page.goBack();
        await page.getByRole('link', { name: 'Accessibility', exact: true }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/accessible-government');
        await page.goBack();
        await page.getByRole('link', { name: 'Copyright' }).click();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/copyright');
        await page.goBack();

    });

    test('Verify social media links are visible and redirect to the correct page', async ({page}) =>{
     //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.getByRole('link', { name: 'Facebook' }).click();
        await expect(page).toHaveURL('https://www.facebook.com/YourBCParks/');
        await page.goBack();
        await page.getByRole('link', { name: 'Instagram' }).click();
        await expect(page).toHaveURL('https://www.instagram.com/yourbcparks/');
    });
/*
    test('Verify social media links are visible and redirect to the correct page', async ({ browser }) => {
        // Set a custom user-agent to mimic a real browser
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        const page = await context.newPage();

        await page.goto(baseURL);

        await page.getByRole('link', { name: 'Facebook' }).click();
        await expect(page).toHaveURL('https://www.facebook.com/YourBCParks/');
        await page.goBack();

        await page.getByRole('link', { name: 'Instagram' }).click();
        const instagramURL = page.url();
        console.log(`Current URL after clicking Instagram: ${instagramURL}`);
        if (instagramURL.includes('login')) {
            console.warn('Redirected to Instagram login page.');
        } else {
            await expect(page).toHaveURL('https://www.instagram.com/yourbcparks/');
        }
    });

});

*/