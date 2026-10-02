import { test, expect } from '@playwright/test';
import { AllAdvisoriesPage } from './pages/AllAdvisoriesPage.js'; 

test.describe('All advisories page tests', ()=>{
    let allAdvisoriesPage;

    test.beforeEach(async ({page})=>{
        allAdvisoriesPage = new AllAdvisoriesPage(page);
        await allAdvisoriesPage.goto('active-advisories/');
        await allAdvisoriesPage.waitForLoad();
    });

    test('User can connect to the active advisories page', async({page})=>{
        await allAdvisoriesPage.expectPageTitleVisible();
        await expect(page).toHaveURL('/active-advisories/');
        await expect(page).toHaveTitle('Active advisories | BC Parks');
    });

    test('User can go to home page via breadcrumb', async ({page})=>{
        await allAdvisoriesPage.expectHomeBreadcrumbLinkVisible();
        await allAdvisoriesPage.clickHomeBreadcrumbLink();
        await expect(page).toHaveURL('/');
    });

    test('User can see the active advisories breadcrumb', async({page})=>{
        await allAdvisoriesPage.expectActiveAdvisoriesBreadcrumbVisible();
    });

    test('Advisory types can be selected from suggestion menu', async({page})=>{
        await allAdvisoriesPage.selectAdvisoryType("Campfires");
        await allAdvisoriesPage.expectAdvisoryTypeSuggestionMenuVisible();
        await expect(page.getByRole('option', { name: 'Campfires' })).toBeVisible();
        await page.getByRole('option', { name: 'Campfires' }).click();
        await expect(page).toHaveURL('/active-advisories/?type=Campfires');
    });

    test('Advisory type can be cleared via x button in the advisory type field', async({page})=>{
        await allAdvisoriesPage.selectAdvisoryType("Campfires");
        await allAdvisoriesPage.expectAdvisoryTypeSuggestionMenuVisible();
        await expect(page.getByRole('option', { name: 'Campfires' })).toBeVisible();
        await page.getByRole('option', { name: 'Campfires' }).click();
        await allAdvisoriesPage.clickClearButton();
        await expect(allAdvisoriesPage.advisoryType).toBeEmpty();
    });

    test('Search with filter park name applied', async({page})=>{
        await allAdvisoriesPage.clickParkNameFilter();
        await allAdvisoriesPage.clickSearchField();
        await allAdvisoriesPage.fillSearchField('Garibaldi');
        await allAdvisoriesPage.clickSearchButton();
        await expect(page.locator('.park-link').first()).toHaveText('Garibaldi Park');
    });

    test('Search field can be cleared with x button', async({page})=>{
        await allAdvisoriesPage.clickSearchField();
        await allAdvisoriesPage.fillSearchField('Garibaldi');
        await allAdvisoriesPage.clickSearchFieldClearButton();
        await expect(allAdvisoriesPage.searchField).toBeEmpty();
    });

    // External links are checked by href, not by loading the other site,
    // which may block GitHub Actions runners
    test('BC Wildfire link points to the correct page', async()=>{
        await expect(allAdvisoriesPage.wildfireServicesLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/safety/wildfire-status');
    });

    test('BC River Forecast Centre link points to the correct page', async()=>{
        await expect(allAdvisoriesPage.riverForecaseCentreLink).toHaveAttribute('href', 'https://www2.gov.bc.ca/gov/content/environment/air-land-water/water/drought-flooding-dikes-dams/river-forecast-centre');
    });

    test('DriveBC link points to the correct page', async()=>{
        await expect(allAdvisoriesPage.driveBCLink).toHaveAttribute('href', 'https://drivebc.ca');
    });

    test('Emergency Info BC link points to the correct page', async()=>{
        await expect(allAdvisoriesPage.emergencyInfoLink).toHaveAttribute('href', 'https://www.emergencyinfobc.gov.bc.ca');
    });


    test('The land acknowledgment message is visible', async ({page})=>{
        await allAdvisoriesPage.scrollToBottom();
        await allAdvisoriesPage.expectLandAcknowledgementMessageVisible();
        await allAdvisoriesPage.landAcknowledgementMessageText();
    });

    test('Back to Top button is present and scrolls the focus to the top', async ({page})=>{
        await allAdvisoriesPage.scrollToBottom();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).not.toBeInViewport();
        await allAdvisoriesPage.expectBackToTopButtonVisible();
        await allAdvisoriesPage.clickBackToTopButton();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).toBeInViewport();
    });

    test('Back to Top button is not visible when use is at the top of the page', async({ page })=>{
        await allAdvisoriesPage.expectBackToTopButtonNotVisible();
    });

    test('Back to top button is working', async ({ page }) => {
        await allAdvisoriesPage.scrollToBottom();
        await allAdvisoriesPage.expectBackToTopButtonVisible();
        await allAdvisoriesPage.clickBackToTopButton();
        await expect(page.getByRole('link', { name: 'BC Parks Logo' })).toBeInViewport();
        await allAdvisoriesPage.expectBackToTopButtonNotVisible();
    });
});

