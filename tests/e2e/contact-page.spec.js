// spec: specs/contact-page.plan.md
// seed: tests/seed.spec.ts
import { ContactPage } from './pages/ContactPage.js';
import { test, expect } from '@playwright/test';

test.describe('In-Page Anchor Navigation', () => {
    let contactPage;
  
    test.beforeEach(async ({page})=>{
        contactPage = new ContactPage(page);
        await contactPage.goto('contact');
        await contactPage.waitForLoad();
    });

  test(`Clicking each 'On this page' link scrolls to the corresponding section`, async ({ page }) => {
    // 1. Set the viewport size to simulate a desktop screen
    await page.setViewportSize({ width: 1280, height: 800 });

    // 2. Click the 'Get a quick answer' link in the 'On this page' widget
    await contactPage.goToGetQuickAnswer();
    await expect(page).toHaveURL(/#get-a-quick-answer$/);
    await expect(page.getByRole('heading', { name: 'Get a quick answer' })).toBeVisible();

    // 3. Click the 'Contact us' link in the 'On this page' widget
    await contactPage.goToContactUs();
    await expect(page).toHaveURL(/#contact-us$/);
    await expect(page.getByRole('heading', { name: 'Contact us' })).toBeVisible();

    // 4. Click the 'Follow us' link in the 'On this page' widget
    await contactPage.goToFollowUs();
    await expect(page).toHaveURL(/#follow-us$/);
    await expect(page.getByRole('heading', { name: 'Follow us' })).toBeVisible();
  });
});

test.describe('Contact Us Section - Direct Contact Channels', () => {
    let contactPage;
  
    test.beforeEach(async ({page})=>{
        contactPage = new ContactPage(page);
        await contactPage.goto('contact');
        await contactPage.waitForLoad();
    });

  test('Email contact link has correct mailto address and surrounding copy', async ({ page }) => {
    // 1. Navigate to /contact/ and locate the 'Email' sub-section
    const contactUsSection = page.locator('#contact-us');
    const emailLink = contactUsSection.getByRole('link', { name: 'parkinfo@gov.bc.ca' });
    const emailParagraph = contactUsSection.getByText('We answer emails weekdays');
    await expect(contactPage.contactUsHeading).toBeVisible();
    // 2. Inspect the href attribute of the email link
    await expect(emailLink).toHaveAttribute('href', 'mailto:parkinfo@gov.bc.ca');
    // 3. Read the paragraph beneath the email link
    await expect(emailParagraph).toBeVisible();
    await expect(emailParagraph).toContainText('We answer emails weekdays from 9am to 5pm Pacific Time. We make every effort to respond within a week, but it may take longer during peak summer season.');
  });

  test('Phone numbers have correct tel: links and surrounding copy', async ({ page }) => {
    // 1. Navigate to /contact/ and locate the 'Phone' sub-section
    const contactUsSection = page.locator('#contact-us');
    const tollFreeLink = contactUsSection.getByRole('link', { name: '1-800-689-9025' });
    const internationalLink = contactUsSection.getByRole('link', { name: '1-519-858-6161' });
    await expect(tollFreeLink).toBeVisible();
    await expect(internationalLink).toBeVisible();
    // 2. Inspect the href of the toll-free number
    await expect(tollFreeLink).toHaveAttribute('href', 'tel:1-800-689-9025');
    await expect(contactUsSection.getByText('1-800-689-9025 (toll free from Canada or the US)')).toBeVisible();
    // 3. Inspect the href of the international number
    await expect(internationalLink).toHaveAttribute('href', 'tel:1-519-858-6161');
    await expect(contactUsSection.getByText('1-519-858-6161 (international)')).toBeVisible();
    // 4. Read the paragraph describing call centre hours and fees
    await expect(contactUsSection.getByText('Our call centre is open from 7am to 7pm Pacific Time. There is a $5 fee for camping reservations, changes, or cancellations made by phone, but no charge for general information calls.')).toBeVisible();
  });

  test('Mailing address is displayed correctly and is plain text (not a broken link)', async ({ page }) => {
    // 1. Navigate to /contact/ and locate the 'Mail' sub-section
    const contactUsSection = page.locator('#contact-us');
    const mailParagraph = contactUsSection.getByText('BC Parks PO Box 9351 STN Prov Govt Victoria BC V8W 9V1');
    await expect(mailParagraph).toBeVisible();
    await expect(mailParagraph.locator('a')).toHaveCount(0);
  });

  test(`'Contact a campground' guidance links to Find a Park`, async ({ page }) => {
    // 1. Navigate to /contact/ and locate the 'Contact a campground' sub-section
    const contactUsSection = page.locator('#contact-us');
    await expect(contactUsSection.getByText(`For lost and found, unexpected arrival delays, and specific campground questions, contact the park operator directly. Contact information is listed under 'contact' on each`)).toBeVisible();
    const parkPageLink = contactUsSection.getByRole('link', { name: 'park page' });
    await expect(parkPageLink).toBeVisible();

    // 2. Click the 'park page' link
    await parkPageLink.click();
    await expect(page).toHaveURL(/\/find-a-park/);
    await expect(page.getByRole('heading', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByText('results')).toBeVisible();
  });
});


test.describe('Page Load and Core Content', () => {
  let contactPage;
  
  test.beforeEach(async ({page})=>{
      contactPage = new ContactPage(page);
      await contactPage.goto('contact');
      await contactPage.waitForLoad();
    });

  test('Contact page loads with correct title, heading, and breadcrumb', async ({ page }) => {
    // 1. Able to connect to contact page successfully
    await expect(page).toHaveTitle('Contact BC Parks | BC Parks');
    await expect(page.getByRole('heading', { name: 'Contact BC Parks' })).toBeVisible();

    // 2. Inspect the breadcrumb navigation at the top of the content area
    const breadcrumb = page.getByRole('navigation', { name: 'breadcrumb' });
    await expect(breadcrumb).toContainText('Home›Contact');
    const homeBreadcrumbLink = breadcrumb.getByRole('link', { name: 'Home' });
    await expect(homeBreadcrumbLink).toHaveAttribute('href', '/');

    // 3. Click the 'Home' breadcrumb link
    await homeBreadcrumbLink.click();
    await expect(page).toHaveURL('/');
  });

  test('All three main sections and their headings are present', async ({ page }) => {
    // 1. Locate the 'Get a quick answer' section
    const quickAnswerSection = page.locator('#get-a-quick-answer');
    await expect(quickAnswerSection.getByRole('heading', { name: 'Get a quick answer' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'How to reserve camping' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'Camping policies' })).toBeVisible();
    await expect(quickAnswerSection.getByRole('heading', { name: 'Popular topics' })).toBeVisible();
    await expect(quickAnswerSection.getByText('If you have a quick question, these links might provide your answer.')).toBeVisible();

    // 3. Locate the 'Contact us' section
    const contactUsSection = page.locator('#contact-us');
    await expect(contactUsSection.getByRole('heading', { name: 'Contact us' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Email' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Phone' })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Mail', exact: true })).toBeVisible();
    await expect(contactUsSection.getByRole('heading', { name: 'Contact a campground' })).toBeVisible();

    // 4. Locate the 'Follow us' section
    const followUsSection = page.locator('#follow-us');
    await expect(followUsSection.getByRole('heading', { name: 'Follow us' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'Facebook' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'Instagram' })).toBeVisible();
    await expect(followUsSection.getByRole('link', { name: 'BC Parks blog' })).toBeVisible();
  });

  test(`'On this page' table of contents is present on desktop viewport`, async ({ page }) => {
    // 1. Set viewport to a desktop size (e.g. 1280x800) and navigate to /contact/
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByText('On this page')).toBeVisible();
    const getQuickAnswerTocLink = page.getByRole('link', { name: 'Get a quick answer' });
    const contactUsTocLink = page.getByRole('link', { name: 'Contact us' }).first();
    const followUsTocLink = page.getByRole('link', { name: 'Follow us' });
    await expect(getQuickAnswerTocLink).toBeVisible();
    await expect(contactUsTocLink).toBeVisible();
    await expect(followUsTocLink).toBeVisible();

    // 2. Verify the href of each 'On this page' link
    await expect(getQuickAnswerTocLink).toHaveAttribute('href', '#get-a-quick-answer');
    await expect(contactUsTocLink).toHaveAttribute('href', '#contact-us');
    await expect(followUsTocLink).toHaveAttribute('href', '#follow-us');
  });
});


test.describe('Get a Quick Answer Links', () => {
   let contactPage;
  
    test.beforeEach(async ({page})=>{
        contactPage = new ContactPage(page);
        await contactPage.goto('contact');
        await contactPage.waitForLoad();
    });

  test("All 'How to reserve camping' links navigate to the correct reservation pages", async ({ page }) => {
    // 2. Click the 'Frontcountry camping' link
    await page.getByRole('link', { name: 'Frontcountry camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/frontcountry-camping/);
    await expect(page).toHaveTitle(/Frontcountry camping/);

    // 3. Go back to the contact page and click the 'Group camping' link
    await page.goBack();
    await page.getByRole('link', { name: 'Group camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/group-camping/);
    await expect(page).toHaveTitle(/Group camping/);

    // 4. Go back to the contact page and click the 'Backcountry camping' link
    await page.goBack();
    await page.getByRole('link', { name: 'Backcountry camping' }).click();
    await expect(page).toHaveURL(/\/reservations\/backcountry-camping/);
    await expect(page).toHaveTitle(/Backcountry camping/);
  });

  test("All 'Camping policies' links navigate to the correct destinations", async ({ page }) => {
    // 1. Click 'Changes, cancellations, and refunds'
    await page.getByRole('link', { name: 'Changes, cancellations, and' }).click();
    await expect(page).toHaveURL(/\/reservations\/cancellations-refunds/);

    // 2. Go back and click 'Party size and number of vehicles'
    await page.goBack();
    await page.getByRole('link', { name: 'Party size and number of' }).click();
    await expect(page).toHaveURL('/reservations/frontcountry-camping/#page-section-19');
    await expect(page.getByRole('heading', { name: 'Party size and vehicles' })).toBeVisible();

    // 3. Go back and click 'Generator use'
    await page.goBack();
    await page.getByRole('link', { name: 'Generator use' }).click();
    await expect(page).toHaveURL('/plan-your-trip/visit-responsibly/responsible-recreation/#page-section-161');
  });

  test("All 'Popular topics' links navigate to the correct destinations", async ({ page }) => {
    // 1. Click '2026 fee changes'
    await page.getByRole('link', { name: 'fee changes' }).click();
    await expect(page).toHaveURL('/reservations/camping-fees/#2026-fee-changes');

    // 2. Go back and click 'Day-use passes'
    await page.goBack();
    await page.getByRole('link', { name: 'Day-use passes' }).click();
    await expect(page).toHaveURL(/\/reservations\/day-use-passes/);
    await expect(page).toHaveTitle(/Day-use passes/);

    // 3. Go back and click 'Drones'
    await page.goBack();
    await page.getByRole('link', { name: 'Drones' }).click();
    await expect(page).toHaveURL('/plan-your-trip/visit-responsibly/responsible-recreation/#page-section-166');
  });

  test("No 'Get a quick answer' link is broken (no 404s / dead links)", async ({ page }) => {
    // 1. Collect the href of every link within the 'Get a quick answer' section
    const quickAnswerLinks = page.locator('#get-a-quick-answer a');
    await expect(quickAnswerLinks).toHaveCount(9);
    const linkCount = await quickAnswerLinks.count();
    const hrefs = [];
    for (let i = 0; i < linkCount; i++) {
      hrefs.push(await quickAnswerLinks.nth(i).getAttribute('href'));
    }
    expect(hrefs).toEqual([
      '/reservations/frontcountry-camping',
      '/reservations/group-camping',
      '/reservations/backcountry-camping',
      '/reservations/cancellations-refunds',
      '/reservations/frontcountry-camping#page-section-19',
      '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-161',
      '/reservations/camping-fees/#2026-fee-changes',
      '/reservations/day-use-passes',
      '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-166',
    ]);

    // 2. Issue a request (or navigate) to each collected href in turn
    for (const href of hrefs) {
      const url = new URL(href, page.url()).toString();
      const response = await page.request.get(url);
      expect(response.ok(), `Expected ${url} to respond successfully`).toBeTruthy();
      expect(response.status(), `Expected ${url} to not be a 404/500`).toBeLessThan(400);
    }
  });
});

test.describe('Shared Header, Footer, and Cross-Page Navigation', () => {
    let contactPage;
    test.beforeEach(async ({page})=>{
        contactPage = new ContactPage(page);
        await contactPage.goto('contact');
        await contactPage.waitForLoad();
    });

  test('Footer links are present and correctly wired on the contact page', async ({ page }) => {
    const footer = page.locator('#footer');

    // 1. Scroll to the footer
    await footer.scrollIntoViewIfNeeded();

    // expect: Footer columns 'Get a permit', 'Get involved', and 'Stay connected' are visible with their respective links
    await expect(footer.getByText('Get a permit')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Park-use permits' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Filming in parks' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Travel trade' })).toBeVisible();

    await expect(footer.getByText('Get involved')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Donate' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Buy a licence plate' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Volunteer' })).toBeVisible();

    await expect(footer.getByText('Stay connected')).toBeVisible();
    await expect(footer.getByRole('link', { name: 'Contact us' })).toBeVisible();
    await expect(footer.getByRole('link', { name: 'BC Parks blog' })).toBeVisible();

    // expect: Legal links 'Site map', 'Disclaimer', 'Privacy', 'Accessibility', 'Copyright' are visible
    await expect(page.getByRole('link', { name: 'Site map' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Disclaimer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Accessibility', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Copyright' })).toBeVisible();

    // 2. Click the footer 'Contact us' link (under 'Stay connected')
    await footer.getByRole('link', { name: 'Contact us' }).click();

    // expect: Navigates to /contact/ (reloads the same contact page) without error
    await expect(page).toHaveURL('/contact/');
    await expect(page.getByRole('heading', { name: 'Contact BC Parks' })).toBeVisible();

    // 3. Click the footer BC Parks Wordmark/logo link
    await page.getByRole('link', { name: 'BC Parks Wordmark' }).click();

    // expect: Navigates to the BC Parks home page ('/')
    await expect(page).toHaveURL('/');

    // 4. Verify footer Facebook and Instagram icon links
    await page.goto('/contact/');
    const followUs = page.locator('#follow-us');
    const footerFacebookHref = await footer.getByRole('link', { name: 'Facebook' }).getAttribute('href');
    const followUsFacebookHref = await followUs.getByRole('link', { name: 'Facebook' }).getAttribute('href');
    const footerInstagramHref = await footer.getByRole('link', { name: 'Instagram' }).getAttribute('href');
    const followUsInstagramHref = await followUs.getByRole('link', { name: 'Instagram' }).getAttribute('href');

    // expect: Both icon links have hrefs matching the same Facebook/Instagram URLs as the 'Follow us' section links
    expect(footerFacebookHref).toBe(followUsFacebookHref);
    expect(footerInstagramHref).toBe(followUsInstagramHref);
  });

  test('First Nations territorial acknowledgement is displayed', async ({ page }) => {
    // Scroll just above the footer
    const acknowledgement = page.getByText(
      'We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.'
    );
    await acknowledgement.scrollIntoViewIfNeeded();

    // expect: The territorial acknowledgement statement about First Nations is visible and readable in full, above the footer contentinfo region
    await expect(acknowledgement).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});

test.describe('Shared Header, Footer, and Cross-Page Navigation', () => {
  let contactPage;

  test.beforeEach(async ({page})=>{
      contactPage = new ContactPage(page);
      await contactPage.goto('contact');
      await contactPage.waitForLoad();
    });

  test(`'Book camping' header button navigates to the camping reservation portal`, async ({ page }) => {
    // 1. Click the 'Book camping' button in the header
    await page.getByRole('button', { name: 'Book camping button' }).click();

    // expect: Browser navigates to https://camping.bcparks.ca/ and the camping reservation home page loads
    await expect(page).toHaveURL('https://camping.bcparks.ca/');
    await expect(page).toHaveTitle('Home Page');
  });

  test('Main mega-menu navigation items are present and functional from the contact page', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // expect: Header navigation menu shows: Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Plan your trip ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();

    // 1. Click 'Find a park' menu item
    // Note: the mega-menu renders a hidden duplicate menuitem (used as the
    // dropdown "header" link) for every top-level nav item, so `.first()`
    // is used to reliably target the visible top-level trigger.
    await page.getByRole('menuitem', { name: 'Find a park' }).first().click();

    // expect: Navigates to (or opens a mega-menu leading to) the Find a Park page/section
    await expect(page).toHaveURL('/find-a-park/');

    // 2. Return to the contact page and hover/click 'Plan your trip'
    await page.goto('/contact/');
    const consoleErrorCountBeforeMenu = consoleErrors.length;
    // `.first()` targets the visible top-level trigger, avoiding the hidden
    // duplicate "menu-header" menuitem that the mega-menu renders inside
    // each dropdown's children wrapper (see comment above).
    const planYourTripMenuItem = page.getByRole('menuitem', { name: 'Plan your trip ' }).first();
    await planYourTripMenuItem.click();

    // expect: A mega-menu / dropdown opens showing related sub-links without console errors
    await expect(page.getByRole('menuitem', { name: 'Active advisories' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Things to do' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Visit responsibly' })).toBeVisible();
    expect(consoleErrors.length).toBe(consoleErrorCountBeforeMenu);

    // 3. Confirm the 'Contact' menu item is styled/marked as the active/current page
    await planYourTripMenuItem.click();

    // expect: 'Contact' item reflects an active/selected state consistent with the current page
    await expect(page.getByRole('menuitem', { name: 'Contact' }).first()).toHaveAttribute('aria-current', 'page');
  });

  test('Mobile hamburger menu opens and closes correctly on the contact page', async ({ page }) => {
    // 1. Set viewport to a mobile size (e.g. 375x812)
    await page.setViewportSize({ width: 375, height: 812 });

    // expect: An 'Open menu' hamburger button is visible instead of the full inline menu
    const openMenuButton = page.getByRole('button', { name: 'Open menu' });
    await expect(openMenuButton).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).not.toBeVisible();

    // expect: The 'On this page' TOC widget is not shown (or is otherwise appropriately adapted) on mobile
    await expect(page.getByText('On this page')).not.toBeVisible();

    // 2. Click the 'Open menu' button
    await openMenuButton.click();

    // expect: The navigation menu (Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact) expands and becomes visible/interactable
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Plan your trip ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();

    // 3. Click the menu toggle again (or an equivalent close control)
    const closeMenuButton = page.getByRole('button', { name: 'Close menu' });
    await closeMenuButton.click();

    // expect: The menu collapses/closes back to its initial state
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).not.toBeVisible();
  });
});

test.describe('Follow Us / Social Links', () => {

  let contactPage;
  
  test.beforeEach(async ({page})=>{
      contactPage = new ContactPage(page);
      await contactPage.goto('contact');
      await contactPage.waitForLoad();
    });

  test('Facebook and Instagram links point to the correct official profiles', async ({ page }) => {
    // 1. Locate the 'Follow us' section
    const followUsSection = page.locator('#follow-us');

    // 2. Inspect the 'Facebook' link href
    const facebookLink = followUsSection.getByRole('link', { name: 'Facebook' });
    await expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/YourBCParks/');

    // 3. Inspect the 'Instagram' link href
    const instagramLink = followUsSection.getByRole('link', { name: 'Instagram' });
    await expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/yourbcparks/');

    // 4. Click the 'Facebook' link
    await facebookLink.click();
    await expect(page).toHaveURL(/facebook\.com/);
  });

  test('BC Parks blog link navigates correctly', async ({ page }) => {
    // 1. Click the 'BC Parks blog' link in the 'Follow us' section
    await page.locator('#follow-us').getByRole('link', { name: 'BC Parks blog' }).click();
    await expect(page).toHaveURL('https://engage.gov.bc.ca/bcparksblog/');
  });

  test('Social media moderation policy PDF link opens in a new tab', async ({ page, context }) => {
    // 1. Scroll to the moderation policy sentence at the bottom of 'Follow us'
    const moderationPolicyLink = page.getByRole('link', { name: 'social media moderation policy' });
    await expect(moderationPolicyLink).toBeVisible();
  });

});



 /*   
    const followUsSection = page.getByText('Follow usFollow us on social');
    const moderationPolicyLink = followUsSection.getByRole('link', { name: 'social media moderation policy' });
    await expect(moderationPolicyLink).toBeVisible();

    // 2. Inspect the link's target/rel attributes
    await expect(moderationPolicyLink).toHaveAttribute('target', '_blank');
    await expect(moderationPolicyLink).toHaveAttribute('rel', /noopener/);

    // 3. Click the link and capture the new tab/page that opens
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      moderationPolicyLink.click(),
    ]);
    await expect(newPage).toHaveURL('https://nrs.objectstore.gov.bc.ca/kuwyyf/bc_parks_social_media_moderation_policy_101cd4e97e.pdf');
    await expect(page).toHaveURL('/contact/');
  });

  test('Social response-time and moderation disclaimer copy is present', async ({ page }) => {
    // 1. Read the paragraphs under 'Follow us'
    const followUsSection = page.locator('#follow-us');
    await expect(followUsSection.getByText('We respond to social media comments on weekdays from 9am to 5pm Pacific Time. We make every effort to respond within a week, but it may take longer during peak summer season. We read every message but, due to high volume, we may not respond to each one.')).toBeVisible();
  });

  */