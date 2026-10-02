import { test, expect } from '@playwright/test';   
import { HomePage } from './pages/homePage.js';

test.describe('Home page tests', { tag: '@smoke' }, ()=>{
    let homePage;

    test.beforeEach(async ({page})=>{
        homePage = new HomePage(page);
        await homePage.goto();
        await homePage.waitForLoad();
    })

    test('User can connect to homepage', async ({page}) =>{
        await expect(page).toHaveTitle('Home | BC Parks');
        await expect(page).toHaveURL('/');
    });

    test('Section headings are visible on the homepage', async ({page}) =>{
        await homePage.expectSectionHeadingsVisible();
    });

    test('Find a Park search box is visible on the homepage', async ({page}) =>{
        await homePage.expectFindParkSearchVisible();
    });
    
    test('Suggestion dropdown menu for park name is visible in the search field', async ({page}) =>{
        await homePage.fillParkNameSearch('Garibaldi');
        await homePage.expectSuggestionVisible();
        await homePage.expectSuggestionOptionVisible('Garibaldi Park');
        await homePage.selectSuggestionOption('Garibaldi Park');
        await expect(page).toHaveURL('/garibaldi-park/');
    });

    test('Suggestion dropdown menu for city is visible in the search field', async ({page}) =>{
        await homePage.fillCityNameSearch('Burnaby');
        await homePage.expectSuggestionVisible();
        await homePage.expectSuggestionOptionVisible('Burnaby');
        await homePage.selectSuggestionOption('Burnaby');
        await expect(page).toHaveURL('/find-a-park/?l=268');
    });

    test('Search button should complete search and redirect to results page', async ({page}) =>{
        await homePage.fillParkNameSearch('Garibaldi');
        await homePage.clickFindParkSearchButton();
        await expect(page).toHaveURL('/find-a-park/?q=Garibaldi');
        await expect(page).toHaveTitle('Find a park | BC Parks');
    });

    test('Search button works with no search terms', async ({page})=>{
        await homePage.clickFindParkSearchButton();
        await expect(page).toHaveURL('/find-a-park/');
    });

    test('Advisories links are present on the page', async()=>{
        await homePage.expectAdvisoryLinksVisible();
    });

    test('Flood advisory link redirects to the advisories page with flood filter', async({page})=>{
        await homePage.clickFloodAdvisories();
        await expect(page).toHaveURL('/active-advisories/?type=Flood');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('Wildfire advisory link redirects to the advisories page with wildfire filter', async({page})=>{
        await homePage.clickWildfireAdvisories();
        await expect(page).toHaveURL('/active-advisories/?type=Wildfire');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('All advisories link redirects to the advisories page for all advisories', async ({page})=>{
        await homePage.clickAllAdvisories();
        await expect(page).toHaveURL('/active-advisories/');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('Camping information routing link should redirect to the reservations page', async({page})=>{
        await homePage.campingInformationPage();
        await expect(page).toHaveURL('/reservations/');
        await expect(page).toHaveTitle('Reservations | BC Parks');
    });

    test('Things to do routing link should redirect to the things to do page', async({page})=>{
        await homePage.thingsToDoPage();
        await expect(page).toHaveURL('/plan-your-trip/things-to-do/');
        await expect(page).toHaveTitle('Things to do | BC Parks');
    })

    // External links are checked by href, not by loading the other site,
    // which may block GitHub Actions runners
    test('Accessibility routing link points to the accessibility page', async()=>{
        await expect(homePage.accessibilityLink).toHaveAttribute('href', 'https://accessibility.bcparks.ca/');
    });

    test('Visit responsibly routing link should redirect to the visit responsibly page', async ({page})=>{
        await homePage.visitingResponsiblyPage();
        await expect(page).toHaveURL('/plan-your-trip/visit-responsibly/');
        await expect(page).toHaveTitle('Visit responsibly | BC Parks');
    });

    test('Indigenous relations and reconciliation routing link should redirect to the indigenous relations page', async({page})=>{
        await homePage.indigenousRelationsPage();
        await expect(page).toHaveURL('/about/indigenous-relations-reconciliation/');
        await expect(page).toHaveTitle('Indigenous relations and reconciliation  - Province of British Columbia | BC Parks');
    });

    test('Wildlife viewing and safety routing link should redirect to the wildlife safety page', async({page})=>{
        await homePage.wildlifeViewingPage();
        await expect(page).toHaveURL('/plan-your-trip/visit-responsibly/wildlife-safety/');
        await expect(page).toHaveTitle('Wildlife safety | BC Parks');
    });

    test('Conservation routing link should redirect to the conservation page', async({page})=>{
        await homePage.conservationPage();
        await expect(page).toHaveURL('/conservation/');
        await expect(page).toHaveTitle('Conservation | BC Parks');
    });

    test('History of BC Parks routing link should redirect to the history page', async({page})=>{
        await homePage.historyOfParksPage();
        await expect(page).toHaveURL('/about/our-mission-responsibilities/history/');
        await expect(page).toHaveTitle('History of BC Parks  | BC Parks');
    });

    test('Get involved routing link should redirect to the get involved page', async ({page})=>{
        await homePage.getInvolvedPage();
        await expect(page).toHaveURL('/get-involved/');
        await expect(page).toHaveTitle('Get involved | BC Parks');
    });

    test('Back to Top button is present and scrolls the focus to the top', async ({page})=>{
        await homePage.scrollToBottom();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).not.toBeInViewport();
        await homePage.expectBackToTopButtonVisible();
        await homePage.clickBackToTopButton();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).toBeInViewport();
    });

    test('Back to Top button is not visible when use is at the top of the page', async({ page })=>{
        await homePage.expectBackToTopButtonNotVisible();
    });

    test('Back to top button is working', async ({ page }) => {
        await homePage.scrollToBottom();
        await homePage.expectBackToTopButtonVisible();
        await homePage.clickBackToTopButton();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).toBeInViewport();
        await homePage.expectBackToTopButtonNotVisible();
    });

    test("Suggestion box is displayed when search by city has been selected", async ({page})=>{
        await homePage.focusCityNameSearch();
        await homePage.expectSuggestionVisible();
        await homePage.expectSuggestionOptionVisible('Current location');
    })

    test('Suggestion box in search is displayed for park search', async ({page})=>{
        await homePage.fillParkNameSearch('b');
        await homePage.expectSuggestionVisible();
        await expect(homePage.parkSuggestion).toContainText("Babine Lake Marine Park");
        await expect(homePage.parkSuggestion).toContainText("Babine Mountains Park");
        await expect(homePage.parkSuggestion).toContainText("Babine River Corridor Park");
        await expect(homePage.parkSuggestion).toContainText("Bamberton Park");
        await expect(homePage.parkSuggestion).toContainText("Banana Island Park");
        await expect(homePage.parkSuggestion).toContainText("Bear Creek Park");
        await expect(homePage.parkSuggestion).toContainText("Bear Glacier Park");
    });

    test('Suggestion box in search is displayed for city search', async ({page})=>{
        await homePage.fillCityNameSearch('v');
        await homePage.expectSuggestionVisible();
        await expect(homePage.parkSuggestion).toContainText("Vancouver");
        await expect(homePage.parkSuggestion).toContainText("Victoria");
        await expect(homePage.parkSuggestion).toContainText("Valemount");
        await expect(homePage.parkSuggestion).toContainText("Vanderhoof");
        await expect(homePage.parkSuggestion).toContainText("Vernon");
        await expect(homePage.parkSuggestion).toContainText("View Royal");
        await expect(homePage.parkSuggestion).toContainText("North Vancouver");
        await expect(homePage.parkSuggestion).toContainText("Current location");
    });

    test('Book camping button is visible and points to correct page', async ()=>{
        await homePage.expectBookingCampingButtonVisible();
        await expect(homePage.bookingCampingButton).toHaveAttribute('href', 'https://camping.bcparks.ca');
    });

    test('The land acknowledgment message is visible', async ({page})=>{
        await homePage.scrollToBottom();
        await homePage.expectLandAcknowledgementMessageVisible();
        await homePage.landAcknowledgementMessageText();
    });
});


