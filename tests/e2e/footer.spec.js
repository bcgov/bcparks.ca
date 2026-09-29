import { test, expect } from '@playwright/test';
import { Footer } from './pages/Footer.js';

test.describe('Footer tests', () => {

    let footer;

    test.beforeEach(async ({page})=>{
        footer = new Footer(page);
        await footer.goto();
        await page.waitForLoadState('domcontentloaded');        
    });

    test('Check that the footer blocker is present', { tag: '@smoke' }, async ({page})=>{
        await expect(footer.footerSection).toBeVisible();
    });

    test('Check the BC Logo and link is working', async ({page}) =>{
        await footer.BCParksLogoFooterIsPresent();
        await footer.BCParksFooterClick();
        await expect(page).toHaveURL('/');
    });

    test('Check the heading on the footer is visible', { tag: '@smoke'}, async ({page}) =>{
        await footer.getAPermitColumnIsPresent();
        await footer.getInvolvedColumnIsPresent();
        await footer.stayConnectedColumnIsPresent(); 
    });

    test('Land acknowledgement message is visible', async ({page})=>{
        await footer.landAcknowledgementMessageIsPresent();
    });

    // Footer Links
    test('Park-use permits footer link', async ({page}) =>{
        await footer.parkUsePermitsLinkIsPresent();
        await footer.clickParkUsePermitsLink();
        await expect(page).toHaveURL('/' + 'park-use-permits/');
    });

    test('Filming in parks footer link', async ({ page })=>{
        await footer.filmingInParksLinkIsPresent();
        await footer.clickFilmingInParksLink();
        await expect(page).toHaveURL('/' + 'park-use-permits/filming-in-parks/');
    });

    test('Travel trade footer link', async ({ page })=>{
        await footer.travelTradeLinkIsPresent();
        await footer.clickTravelTradeLink();
        await expect(page).toHaveURL('/' + 'park-use-permits/travel-trade/');       
    });

    test('Donate footer link', async ({ page })=>{        
        await footer.donateLinkIsPresent();
        await footer.clickDonateLink();
        await expect(page).toHaveURL('/' + 'get-involved/donate/');
    });


    test('Buy a licence plate footer link', async ({ page })=>{
        await footer.buyLicencePlateLinkIsPresent();
        await footer.clickBuyLicencePlateLink();
        await expect(page).toHaveURL('/' + 'get-involved/buy-licence-plate/');
    });


    test('Volunteer footer link', async ({ page })=>{
        await footer.volunteerLinkIsPresent();
        await footer.clickVolunteerLink();
        await expect(page).toHaveURL('/' + 'get-involved/volunteer/');
    });

    test('Contact us footer link', async ({ page })=>{
        await footer.contactUsLinkIsPresent();
        await footer.clickContactUsLink();
        await expect(page).toHaveURL('/' + 'contact/');
    });


    test('BC Parks blog footer link', async({ page })=>{
        await footer.bcParksBlogLinkIsPresent();
        await footer.clickBcParksBlogLink();
        await expect(page).toHaveURL('https://engage.gov.bc.ca/bcparksblog/');
    });

    test('Site map footer link', async({ page })=>{
        await footer.siteMapLinkIsPresent();
        await footer.clickSiteMapLink();
        await expect(page).toHaveURL('/' + 'site-map/');
    });

    test('Disclaimer footer link', async({ page })=>{
        await footer.disclaimerLinkIsPresent();
        await footer.clickDisclaimerLink();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/disclaimer');
    });


    test('Privacy footer link', async ({ page })=>{
        await footer.privacyLinkIsPresent();
        await footer.clickPrivacyLink();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/privacy');
    });

    test('Accessibility footer link', async({ page })=>{
        await footer.accessibilityLinkIsPresent();
        await footer.clickAccessibilityLink();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/accessible-government');
    });

    test('Copyright footer link', async ({ page })=>{
        await footer.copyrightLinkIsPresent();
        await footer.clickCopyrightLink();
        await expect(page).toHaveURL('https://www2.gov.bc.ca/gov/content/home/copyright');
    });

    test('Verify social media links are visible and redirect to the correct page', async ({ browser }) => {
        // Set a custom user-agent to mimic a real browser
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        const page = await context.newPage();

        await page.goto('/');
        await page.getByRole('link', { name: 'Facebook' }).click();
        await expect(page).toHaveURL('https://www.facebook.com/YourBCParks/');
        await page.goBack();
        await page.waitForLoadState('networkidle');
        // Click on the Instagram link
        await page.getByRole('link', { name: 'Instagram' }).click();
        await page.waitForLoadState('networkidle');

        const instagramURL = page.url();
        console.log(`Current URL after clicking Instagram: ${instagramURL}`);
        if(instagramURL.includes('login')){
            console.warn('Redirected to Instagram login page.');
        } else{
            await expect(page).toHaveURL('https://www.instagram.com/yourbcparks/');
        };
    });
});