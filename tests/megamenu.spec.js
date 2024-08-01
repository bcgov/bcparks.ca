// @ts-check

// Import the test and expect functions from Playwright
import { test, expect } from '@playwright/test';

//base URL for the tests
const baseURL = 'https://bcparks.ca/';

//wait for the page to load before running the tests
test.beforeEach(async ({page})=>{
    await page.goto(baseURL);
});

//test tverify the Megamenu
test('Check the Megamenu is displayed', async ({page})=>{
    await expect(page.getByRole('navigation').nth(1)).toBeVisible();
});

//test to check if the level 1 menu items are displayed
test.describe('Check the level 1 menu items are displayed, active & clickable', ()=>{

test('Check the Find a park menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Find a park' }).click();
    await expect(page).toHaveURL(baseURL + 'find-a-park/');
    //check if the correct page title is displayed. Add tests.
})

test('Check the Plan your trip menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Plan your trip ' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Plan your trip ' }).click();
    await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackPlan your' }).nth(4)).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Plan your trip', exact: true })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Plan your trip');
    await expect(page.getByRole('menuitem', { name: 'Active advisories' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Active advisories');
    await expect(page.getByRole('menuitem', { name: 'Park operating dates' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Park operating dates');
    await expect(page.getByRole('menuitem', { name: 'Things to do ' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Things to do');
    await expect(page.getByRole('menuitem', { name: 'Visit responsibly ' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Visit responsibly');
    await expect(page.getByRole('menuitem', { name: 'Accessibility' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Accessibility');
    await page.getByRole('menuitem', { name: 'Plan your trip', exact: true }).click();
    await expect(page).toHaveURL(baseURL + 'plan-your-trip/');
    //check if the correct page title is displayed. Add tests.
    //verify the breadcrumbs. Add tests.

})

test('Check the Reservations menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Reservations ' }).click();
    await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackReservationsCamping feesMain Menu BackCamping feesBC Senior' }).nth(4)).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Reservations', exact: true })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Reservations');
    await expect(page.getByRole('menuitem', { name: 'Camping fees ' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Camping fees');
    await page.getByRole('menuitem', { name: 'Camping fees ' }).click();
    await expect(page.getByText('BackCamping feesBC Senior')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Camping fees', exact: true })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Camping fees');
    await expect(page.getByRole('menuitem', { name: 'BC Senior Camping Discount' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('BC Senior Camping Discount');
    await expect(page.getByRole('menuitem', { name: 'Social Services Camping Fee' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Social Services Camping Fee Exemption');
    await page.getByRole('menuitem', { name: 'Camping fees ' }).click();
    await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackReservationsCamping feesMain Menu BackCamping feesBC Senior' }).nth(4)).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Frontcountry camping' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Frontcountry camping');
    await expect(page.getByRole('menuitem', { name: 'Group camping' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Group camping');
    await expect(page.getByRole('menuitem', { name: 'Picnic shelters' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Picnic shelters');
    await expect(page.getByRole('menuitem', { name: 'Backcountry camping ' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Backcountry camping');
    await page.getByRole('menuitem', { name: 'Backcountry camping ' }).click();
    await expect(page.getByText('BackBackcountry')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Backcountry camping', exact: true })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Backcountry camping');
    await expect(page.getByRole('menuitem', { name: 'Backcountry camping reservations' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Backcountry camping reservations');
    await expect(page.getByRole('menuitem', { name: 'Backcountry permit' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Backcountry permit registration');
    await expect(page.getByRole('menuitem', { name: 'Joffre Lakes' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Joffre Lakes');
    await expect(page.getByRole('menuitem', { name: 'Garibaldi' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Garibaldi');
    await expect(page.getByRole('menuitem', { name: 'Berg Lake Trail' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Berg Lake Trail');
    await expect(page.getByRole('menuitem', { name: 'Bowron Lake Canoe Circuit' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Bowron Lake Canoe Circuit');
    await expect(page.getByRole('menuitem', { name: 'Mount Assiniboine' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Mount Assiniboine');
    await expect(page.getByRole('menuitem', { name: 'E.C. Manning' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('E.C. Manning');
    await page.getByRole('menuitem', { name: 'Backcountry camping ' }).click();
    await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackReservationsCamping feesMain Menu BackCamping feesBC Senior' }).nth(4)).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Day-use passes' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Day-use passes');
    await expect(page.getByRole('menuitem', { name: 'Cancellations and refunds ' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Cancellations and refunds');
    await page.getByRole('menuitem', { name: 'Cancellations and refunds ' }).click();
    await expect(page.getByText('BackCancellations and')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Cancellations and refunds', exact: true })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Cancellations and refunds');
    await expect(page.getByRole('menuitem', { name: 'Cancellation windows' })).toBeVisible();
    await expect(page.getByRole('menu')).toContainText('Cancellation windows');
    await page.getByRole('menuitem', { name: 'Cancellations and refunds ' }).click();
    await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackReservationsCamping feesMain Menu BackCamping feesBC Senior' }).nth(4)).toBeVisible();
    await page.getByRole('menuitem', { name: 'Reservations ' }).click();
    await page.getByRole('menuitem', { name: 'Reservations', exact: true }).click();
    
  /**

test('Check the Conservation menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();

})

test('Check the Get involved menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();

})

test('Check the Park-use permits menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();

})

test ('Check the About menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();


})

test ('Check the Contact menu item' , async ({page})=>{
    await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();

})
     */
})});

