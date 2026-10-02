import { test, expect } from './fixtures.js';
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


    // External links are checked by href, not by loading the other site,
    // which may block GitHub Actions runners
    test('BC Parks blog footer link', async()=>{
        await footer.bcParksBlogLinkIsPresent();
        await expect(footer.bcParksBlogLink).toHaveAttribute('href', 'https://engage.gov.bc.ca/bcparksblog/');
    });

    test('Site map footer link', async({ page })=>{
        await footer.siteMapLinkIsPresent();
        await footer.clickSiteMapLink();
        await expect(page).toHaveURL('/' + 'site-map/');
    });

    test('Disclaimer footer link', async()=>{
        await footer.disclaimerLinkIsPresent();
        await expect(footer.disclaimerLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/home/disclaimer');
    });


    test('Privacy footer link', async ()=>{
        await footer.privacyLinkIsPresent();
        await expect(footer.privacyLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/home/privacy');
    });

    test('Accessibility footer link', async()=>{
        await footer.accessibilityLinkIsPresent();
        await expect(footer.accessibilityLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/home/accessible-government');
    });

    test('Copyright footer link', async ()=>{
        await footer.copyrightLinkIsPresent();
        await expect(footer.copyrightLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/home/copyright');
    });

    test('Verify social media links are visible and point to the correct page', async () => {
        await expect(footer.faceBooklink).toBeVisible();
        await expect(footer.faceBooklink).toHaveAttribute('href', 'https://www.facebook.com/YourBCParks/');
        await expect(footer.instagramLink).toBeVisible();
        await expect(footer.instagramLink).toHaveAttribute('href', 'https://www.instagram.com/yourbcparks/');
    });
});