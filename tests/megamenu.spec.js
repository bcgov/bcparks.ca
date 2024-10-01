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

    //Check the Find a park menu item, assert the navigateion to the corret page url
    test('Check the Find a park menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Find a park' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Find a park' }).click();
        await expect(page).toHaveURL(baseURL + 'find-a-park/');
        //check if the correct page title is displayed. Add tests.
    })

    //Check the Plan your trip menu item, assert the navigateion to the corret page url
    test('Check the Plan your trip menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Plan your trip' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await expect(page.locator('#home div').filter({ hasText: 'Main Menu BackPlan your' }).nth(4)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Plan your trip', exact: true })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Plan your trip');
        await expect(page.getByRole('menuitem', { name: 'Active advisories' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Active advisories');
        await expect(page.getByRole('menuitem', { name: 'Park operating dates' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Park operating dates');
        await expect(page.getByRole('menuitem', { name: 'Things to do' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Things to do');
        await expect(page.getByRole('menuitem', { name: 'Visit responsibly' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Visit responsibly');
        await expect(page.getByRole('menuitem', { name: 'Accessibility' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Accessibility');
        await page.getByRole('menuitem', { name: 'Plan your trip', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'plan-your-trip/');
        

    })

    //Check the Reservation menu item, assert the navigateion to the corret page url
    test('Check the Reservations menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Reservations ' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Reservations ' }).click();
        await expect(page.getByRole('menuitem', { name: 'Reservations', exact: true })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Reservations');
        await expect(page.getByRole('menuitem', { name: 'Camping fees' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Frontcountry camping' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Group camping' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Group camping' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Picnic shelters' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Backcountry camping' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Day-use passes' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Cancellations and refunds' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Camping fees' }).click();
        await expect(page.getByRole('menuitem', { name: 'Camping fees' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'BC Senior Camping Discount' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Social Services Camping Fee' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Reservations', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'reservations/');
    
        
    })

    //Check the Conservation menu item, assert the navigateion to the corret page url
    test('Check the Conservation menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Conservation ' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Conservation ' }).click();
        await expect(page.getByRole('menuitem', { name: 'Conservation', exact: true })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Conservation');
        await expect(page.getByRole('menuitem', { name: 'Conservation resources' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Long-Term Ecological' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Climate change' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Impact assessment process' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Impact assessment process' }).click();
        await expect(page.getByRole('menuitem', { name: 'Impact assessment process' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Non-reviewable actions' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Guidelines for external' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Living Lab Program' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Living Lab Program' }).click();
        await expect(page.getByRole('menuitem', { name: 'Living Lab Program' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Invasive species' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Invasive species' }).click();
        await expect(page.getByRole('menuitem', { name: 'Invasive species' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Ecological reserves' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Conservation', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'conservation/');

    })

    //Check the Get involved menu item, assert the navigateion to the corret page url
    test('Check the Get involved menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Get involved ' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Get involved ' }).click();
        await expect(page.getByRole('menuitem', { name: 'Get involved', exact: true })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Donate' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Donate' }).click();
        await expect(page.getByRole('menuitem', { name: 'Donate' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Donate land' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Buy a licence plate' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Volunteer' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Volunteer' }).click();
        await expect(page.getByRole('menuitem', { name: 'Volunteer' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Volunteer Awards' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Engage with us arrow-up-right' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Participate in design' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Get involved', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'get-involved/');

    })

    //Check the Park-use permit menu item, assert the navigateion to the corret page url
    test('Check the Park-use permits menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Park-use permits ' }).click();
        await expect(page.getByRole('menuitem', { name: 'Park-use permits ' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Park-use permits');
        await expect(page.getByRole('menuitem', { name: 'Park-use permits', exact: true })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Policies' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Permit information' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Public notification for' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Filming' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Travel trade' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Park-use permits', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'park-use-permits/');

    })

    //Check the About menu item, assert the navigateion to the corret page url of About landing page
    test ('Check the About menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'About ' })).toBeVisible();
        await page.getByRole('menuitem', {name: 'About'}).click();
        await expect(page.getByRole('menuitem', { name: 'About', exact: true })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('About');
        await page.getByRole('menuitem', { name: 'About', exact: true }).click();
        await expect(page).toHaveURL(baseURL + 'about/');
        await page.getByRole('menuitem', { name: 'About ' }).click();
        await page.getByRole('menuitem', { name: 'Our mission and' }).click();
        await expect(page.getByRole('menu')).toContainText('Our mission and responsibilities');
        await expect(page.getByRole('menu')).toContainText('Our mission and responsibilities');
        await expect(page.getByRole('menuitem', { name: 'Our mission and' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Legislation' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Types of parks and protected' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'History' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Indigenous relations and' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Indigenous relations and reconciliation');
        await expect(page.getByRole('menuitem', { name: 'Commitment to Inclusion' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Commitment to Inclusion');
        await expect(page.getByRole('menuitem', { name: 'Management plans' })).toBeVisible();
        await expect(page.getByRole('menu')).toContainText('Management plans');
        await page.getByRole('menuitem', { name: 'Management plans' }).click();
        await expect(page.getByRole('menuitem', { name: 'Management plans' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Approved management plans' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Management planning process' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Park boundary adjustment' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Kootenay Okanagan projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'South Coast projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'West Coast projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Thompson Cariboo projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Omineca Peace projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Skeena projects' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'News' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Reports and surveys' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Careers' })).toBeVisible();
        await page.getByRole('menuitem', { name: 'Careers' }).click();
        await expect(page.getByRole('menuitem', { name: 'Careers' }).nth(1)).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Park Ranger careers' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Student Rangers' })).toBeVisible();
        await expect(page.getByRole('menuitem', { name: 'Park operators' })).toBeVisible();

    })

    //Check the Contact menu item, assert the navigateion to the corret page url
    test ('Check the Contact menu item' , async ({page})=>{
        await expect(page.getByRole('menuitem', { name: 'Contact' })).toBeVisible();
        await page.getByRole('menuitem', {name: 'Contact'}).click();
        await expect(page).toHaveURL(baseURL + 'contact/');
        ////latest code////
    })
     
});

