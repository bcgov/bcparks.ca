# Contact BC Parks Page Test Plan

## Application Overview

The page at https://bcparks.ca/contact/ ("Contact BC Parks") is a static informational content page — it is NOT a contact form. It provides three main sections: (1) "Get a quick answer" — a set of links to self-serve help topics (camping reservations, policies, popular topics); (2) "Contact us" — direct contact channels (email mailto: link, two tel: phone numbers, a physical mail address, and a note about contacting individual campgrounds directly via each park's page); and (3) "Follow us" — links to social media (Facebook, Instagram), the BC Parks blog, and a PDF social media moderation policy. The page also includes a sticky/anchor "On this page" table of contents (desktop only), a breadcrumb trail, the shared site header (logo, "Book camping" CTA button, and mega-menu navigation with a hamburger menu on mobile), and the shared site footer (permit/get-involved/stay-connected link columns and legal links). There are no form inputs, dropdowns, or submit buttons on this page, so this plan focuses on content accuracy, link correctness/destinations, in-page anchor navigation, external link behavior, responsive layout, accessibility basics, and shared header/footer integration as experienced from this page. Assume every test starts from a fresh browser context navigated directly to https://bcparks.ca/contact/ with no prior state.

## Test Scenarios

### 1. Page Load and Core Content

**Seed:** `tests/e2e/seed.spec.js`

#### 1.1. Contact page loads with correct title, heading, and breadcrumb

**File:** `tests/e2e/contact/contact-page-load.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
    - expect: Page responds with HTTP 200
    - expect: Page title is 'Contact BC Parks | BC Parks'
    - expect: The main H1 heading 'Contact BC Parks' is visible
  2. Inspect the breadcrumb navigation at the top of the content area
    - expect: Breadcrumb shows 'Home › Contact'
    - expect: The 'Home' breadcrumb link has href '/'
  3. Click the 'Home' breadcrumb link
    - expect: Browser navigates to the BC Parks home page (https://bcparks.ca/)

#### 1.2. All three main sections and their headings are present

**File:** `tests/e2e/contact/contact-page-load.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Locate the 'Get a quick answer' section
    - expect: Section heading 'Get a quick answer' is visible
    - expect: Sub-headings 'How to reserve camping', 'Camping policies', and 'Popular topics' are visible
    - expect: Introductory paragraph 'If you have a quick question, these links might provide your answer.' is visible
  3. Locate the 'Contact us' section
    - expect: Section heading 'Contact us' is visible
    - expect: Sub-headings 'Email', 'Phone', 'Mail', and 'Contact a campground' are visible
  4. Locate the 'Follow us' section
    - expect: Section heading 'Follow us' is visible
    - expect: Facebook, Instagram, and 'BC Parks blog' links are visible

#### 1.3. 'On this page' table of contents is present on desktop viewport

**File:** `tests/e2e/contact/contact-page-load.spec.js`

**Steps:**
  1. Set viewport to a desktop size (e.g. 1280x800) and navigate to https://bcparks.ca/contact/
    - expect: An 'On this page' widget is visible with three links: 'Get a quick answer', 'Contact us', 'Follow us'
  2. Verify the href of each 'On this page' link
    - expect: 'Get a quick answer' link href is '#get-a-quick-answer'
    - expect: 'Contact us' link href is '#contact-us'
    - expect: 'Follow us' link href is '#follow-us'

### 2. In-Page Anchor Navigation

**Seed:** `tests/e2e/seed.spec.js`

#### 2.1. Clicking each 'On this page' link scrolls to the corresponding section

**File:** `tests/e2e/contact/contact-anchor-navigation.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ on a desktop viewport
  2. Click the 'Get a quick answer' link in the 'On this page' widget
    - expect: URL updates to include '#get-a-quick-answer'
    - expect: The 'Get a quick answer' heading is scrolled into view / at or near the top of the viewport
  3. Click the 'Contact us' link in the 'On this page' widget
    - expect: URL updates to include '#contact-us'
    - expect: The 'Contact us' heading is scrolled into view
  4. Click the 'Follow us' link in the 'On this page' widget
    - expect: URL updates to include '#follow-us'
    - expect: The 'Follow us' heading is scrolled into view

#### 2.2. Direct navigation to a page anchor URL scrolls to that section on load

**File:** `tests/e2e/contact/contact-anchor-navigation.spec.js`

**Steps:**
  1. Navigate directly to https://bcparks.ca/contact/#contact-us
    - expect: Page loads successfully
    - expect: The 'Contact us' section is visible in the viewport shortly after load without any manual scrolling

#### 2.3. Navigating to an invalid/unknown anchor does not break the page

**File:** `tests/e2e/contact/contact-anchor-navigation.spec.js`

**Steps:**
  1. Navigate directly to https://bcparks.ca/contact/#does-not-exist
    - expect: Page loads successfully with HTTP 200
    - expect: Page renders normally at the top (or unchanged position) since the anchor target does not exist
    - expect: No JavaScript errors are thrown as a direct result of the invalid anchor

### 3. Get a Quick Answer Links

**Seed:** `tests/e2e/seed.spec.js`

#### 3.1. All 'How to reserve camping' links navigate to the correct reservation pages

**File:** `tests/e2e/contact/contact-quick-answer-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Click the 'Frontcountry camping' link
    - expect: Navigates to a page whose URL contains '/reservations/frontcountry-camping' and which loads successfully (HTTP 200)
  3. Go back to the contact page and click the 'Group camping' link
    - expect: Navigates to a page whose URL contains '/reservations/group-camping' and which loads successfully
  4. Go back to the contact page and click the 'Backcountry camping' link
    - expect: Navigates to a page whose URL contains '/reservations/backcountry-camping' and which loads successfully

#### 3.2. All 'Camping policies' links navigate to the correct destinations

**File:** `tests/e2e/contact/contact-quick-answer-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Click 'Changes, cancellations, and refunds'
    - expect: Navigates to a page whose URL contains '/reservations/cancellations-refunds'
  3. Go back and click 'Party size and number of vehicles'
    - expect: Navigates to '/reservations/frontcountry-camping#page-section-19' and the relevant content section is visible/highlighted
  4. Go back and click 'Generator use'
    - expect: Navigates to '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-161'

#### 3.3. All 'Popular topics' links navigate to the correct destinations

**File:** `tests/e2e/contact/contact-quick-answer-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Click '2026 fee changes'
    - expect: Navigates to '/reservations/camping-fees/#2026-fee-changes'
  3. Go back and click 'Day-use passes'
    - expect: Navigates to '/reservations/day-use-passes' and the page loads successfully
  4. Go back and click 'Drones'
    - expect: Navigates to '/plan-your-trip/visit-responsibly/responsible-recreation#page-section-166'

#### 3.4. No 'Get a quick answer' link is broken (no 404s / dead links)

**File:** `tests/e2e/contact/contact-quick-answer-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Collect the href of every link within the 'Get a quick answer' section
    - expect: List includes exactly 9 links matching the ones documented above
  3. Issue a request (or navigate) to each collected href in turn
    - expect: Every request returns a successful status (not 404/500) and target pages render meaningful content
    - expect: Any failing link is reported as a defect

### 4. Contact Us Section - Direct Contact Channels

**Seed:** `tests/e2e/seed.spec.js`

#### 4.1. Email contact link has correct mailto address and surrounding copy

**File:** `tests/e2e/contact/contact-channels.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and locate the 'Email' sub-section
    - expect: A link with visible text 'parkinfo@gov.bc.ca' is present
  2. Inspect the href attribute of the email link
    - expect: href equals exactly 'mailto:parkinfo@gov.bc.ca' (no typos, correct domain)
  3. Read the paragraph beneath the email link
    - expect: Text communicates weekday 9am-5pm Pacific Time response hours and a best-effort one-week response time, noting possible delays in peak summer season

#### 4.2. Phone numbers have correct tel: links and surrounding copy

**File:** `tests/e2e/contact/contact-channels.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and locate the 'Phone' sub-section
    - expect: Two phone links are visible: '1-800-689-9025' and '1-519-858-6161'
  2. Inspect the href of the toll-free number
    - expect: href equals 'tel:1-800-689-9025'
    - expect: Adjacent text reads '(toll free from Canada or the US)'
  3. Inspect the href of the international number
    - expect: href equals 'tel:1-519-858-6161'
    - expect: Adjacent text reads '(international)'
  4. Read the paragraph describing call centre hours and fees
    - expect: Text states the call centre is open 7am-7pm Pacific Time, a $5 fee applies for reservation-related calls, and general information calls are free

#### 4.3. Mailing address is displayed correctly and is plain text (not a broken link)

**File:** `tests/e2e/contact/contact-channels.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and locate the 'Mail' sub-section
    - expect: Text reads 'BC Parks PO Box 9351 STN Prov Govt Victoria BC V8W 9V1' exactly, displayed as plain (non-link) text

#### 4.4. 'Contact a campground' guidance links to Find a Park

**File:** `tests/e2e/contact/contact-channels.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and locate the 'Contact a campground' sub-section
    - expect: Explanatory text about lost and found, arrival delays, and campground-specific questions is visible, containing an inline link with text 'park page'
  2. Click the 'park page' link
    - expect: Navigates to the Find a Park page (URL contains '/find-a-park') and it loads a searchable list/map of parks

### 5. Follow Us / Social Links

**Seed:** `tests/e2e/seed.spec.js`

#### 5.1. Facebook and Instagram links point to the correct official profiles

**File:** `tests/e2e/contact/contact-social-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and locate the 'Follow us' section
  2. Inspect the 'Facebook' link href
    - expect: href equals 'https://www.facebook.com/YourBCParks/'
  3. Inspect the 'Instagram' link href
    - expect: href equals 'https://www.instagram.com/yourbcparks/'
  4. Click the 'Facebook' link
    - expect: Browser navigates to the Facebook domain and the BC Parks Facebook page loads (allow for Facebook's own login/consent interstitials)

#### 5.2. BC Parks blog link navigates correctly

**File:** `tests/e2e/contact/contact-social-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Click the 'BC Parks blog' link in the 'Follow us' section
    - expect: Navigates to https://engage.gov.bc.ca/bcparksblog/ and the blog site loads successfully

#### 5.3. Social media moderation policy PDF link opens in a new tab

**File:** `tests/e2e/contact/contact-social-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and scroll to the moderation policy sentence at the bottom of 'Follow us'
    - expect: A link with text 'social media moderation policy' is visible
  2. Inspect the link's target/rel attributes
    - expect: target='_blank' and rel includes 'noopener' (safe external link handling)
  3. Click the link and capture the new tab/page that opens
    - expect: A new browser tab opens (original contact page tab remains open, unaffected)
    - expect: The new tab loads the PDF at https://nrs.objectstore.gov.bc.ca/kuwyyf/bc_parks_social_media_moderation_policy_101cd4e97e.pdf successfully

#### 5.4. Social response-time and moderation disclaimer copy is present

**File:** `tests/e2e/contact/contact-social-links.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and read the paragraphs under 'Follow us'
    - expect: Text explains social comments are answered weekdays 9am-5pm Pacific Time, best-effort one week response (longer in peak summer), and that not every message receives a reply due to volume

### 6. Shared Header, Footer, and Cross-Page Navigation

**Seed:** `tests/e2e/seed.spec.js`

#### 6.1. 'Book camping' header button navigates to the camping reservation portal

**File:** `tests/e2e/contact/contact-shared-header.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Click the 'Book camping' button in the header
    - expect: Browser navigates to https://camping.bcparks.ca/ and the camping reservation home page loads

#### 6.2. Main mega-menu navigation items are present and functional from the contact page

**File:** `tests/e2e/contact/contact-shared-header.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ on a desktop viewport
    - expect: Header navigation menu shows: Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact
  2. Click 'Find a park' menu item
    - expect: Navigates to (or opens a mega-menu leading to) the Find a Park page/section
  3. Return to the contact page and hover/click 'Plan your trip'
    - expect: A mega-menu / dropdown opens showing related sub-links without console errors
  4. Confirm the 'Contact' menu item is styled/marked as the active/current page
    - expect: 'Contact' item reflects an active/selected state consistent with the current page

#### 6.3. Mobile hamburger menu opens and closes correctly on the contact page

**File:** `tests/e2e/contact/contact-shared-header.spec.js`

**Steps:**
  1. Set viewport to a mobile size (e.g. 375x812) and navigate to https://bcparks.ca/contact/
    - expect: An 'Open menu' hamburger button is visible instead of the full inline menu
    - expect: The 'On this page' TOC widget is not shown (or is otherwise appropriately adapted) on mobile
  2. Click the 'Open menu' button
    - expect: The navigation menu (Find a park, Plan your trip, Reservations, Conservation, Get involved, Park-use permits, About, Contact) expands and becomes visible/interactable
  3. Click the menu toggle again (or an equivalent close control)
    - expect: The menu collapses/closes back to its initial state

#### 6.4. Footer links are present and correctly wired on the contact page

**File:** `tests/e2e/contact/contact-shared-footer.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and scroll to the footer
    - expect: Footer columns 'Get a permit', 'Get involved', and 'Stay connected' are visible with their respective links
    - expect: Legal links 'Site map', 'Disclaimer', 'Privacy', 'Accessibility', 'Copyright' are visible
  2. Click the footer 'Contact us' link (under 'Stay connected')
    - expect: Navigates to /contact/ (reloads the same contact page) without error
  3. Click the footer BC Parks Wordmark/logo link
    - expect: Navigates to the BC Parks home page ('/')
  4. Verify footer Facebook and Instagram icon links
    - expect: Both icon links have hrefs matching the same Facebook/Instagram URLs as the 'Follow us' section links

#### 6.5. First Nations territorial acknowledgement is displayed

**File:** `tests/e2e/contact/contact-shared-footer.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and scroll just above the footer
    - expect: The territorial acknowledgement statement about First Nations is visible and readable in full, above the footer contentinfo region

### 7. Accessibility and Robustness

**Seed:** `tests/e2e/seed.spec.js`

#### 7.1. 'Skip to main content' link is present and functional

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and press Tab once from the top of the page
    - expect: A 'Skip to main content' link receives focus and becomes visible
  2. Activate (press Enter on) the focused 'Skip to main content' link
    - expect: Focus/scroll moves to the '#main-content' region, bypassing the header navigation

#### 7.2. Page heading structure is logical for assistive technology

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ and inspect the heading hierarchy
    - expect: Exactly one H1 ('Contact BC Parks') exists
    - expect: H2 headings ('Get a quick answer', 'Contact us', 'Follow us') logically nest under the H1
    - expect: H3 sub-headings nest under their respective H2 without skipped levels

#### 7.3. All content and mailto/tel links remain accessible via keyboard-only navigation

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/
  2. Tab sequentially through all interactive elements on the page (nav, TOC links, quick-answer links, email/phone links, social links, footer links)
    - expect: Every link is reachable via Tab in a sensible visual order
    - expect: Each focused link shows a visible focus indicator
    - expect: No keyboard focus trap occurs anywhere on the page

#### 7.4. Page loads without unexpected new JavaScript console errors

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Navigate to https://bcparks.ca/contact/ with console message monitoring enabled
    - expect: Record baseline console output. Note: at the time of writing, known pre-existing React hydration errors (Minified React error #418 / #423) occur on load; these should be tracked as a known issue rather than a new regression
  2. Compare captured console errors against the known baseline
    - expect: No NEW/unexpected error types beyond the documented baseline appear
    - expect: Any new error type is filed as a defect for investigation

#### 7.5. Page renders correctly across common viewport sizes

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Load https://bcparks.ca/contact/ at a desktop viewport (e.g. 1280x800)
    - expect: Layout shows the two/three-column arrangement with the 'On this page' TOC sidebar, content is not clipped or overlapping
  2. Resize/reload at a tablet viewport (e.g. 768x1024)
    - expect: Content reflows without horizontal scrollbars or overlapping elements
  3. Resize/reload at a mobile viewport (e.g. 375x812)
    - expect: Content reflows into a single column, hamburger menu replaces inline nav, all text remains readable and links remain tappable (adequate touch target size)

#### 7.6. Page behaves correctly when navigated to directly (deep link) vs. via internal site navigation

**File:** `tests/e2e/contact/contact-accessibility.spec.js`

**Steps:**
  1. Open a fresh browser context and navigate directly to https://bcparks.ca/contact/ (simulating a bookmark or external link click)
    - expect: Page loads fully and correctly with no dependency on prior navigation state
  2. From the BC Parks home page, click through the header menu to reach the Contact page instead
    - expect: Resulting Contact page content is identical to the directly-loaded version
