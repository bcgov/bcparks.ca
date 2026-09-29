import { test, expect } from '@playwright/test';


test.describe('Park Operating Date tests', ()=>{

    test.beforeEach(async ({page})=>{
        await page.goto('/');
    });

    test('Navigate to the Park Operating page via mega menu', async ({page})=>{
    await page.waitForLoadState('networkidle');        
    await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
    await page.getByRole('menuitem', { name: 'Park operating dates'}).click();
    await expect(page).toHaveURL('/' + 'plan-your-trip/park-operating-dates/');
    await expect(page).toHaveTitle('Park operating dates | BC Parks');
    });

    test('Check the breadcrumbs displayed', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');        
        await expect (page.locator('#main-content')).toBeVisible();
        await page.getByRole('link', { name: 'Home' }).click();
        await expect(page).toHaveURL('/');
        await page.goBack();
        await page.getByRole('link', { name: 'Plan your trip' }).click();
        await expect(page).toHaveURL('/' + 'plan-your-trip/');
        await page.goBack();
        await expect(page.getByLabel('breadcrumb').getByText('Park operating dates')).toBeVisible();
    });

    test('Check the filter menu is present and in default setting', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');      
        await expect(page.getByRole('heading', { name: 'Filter' })).toBeVisible();

        // Check if 'All' button is visible and selected
        const allButton = page.getByRole('button', { name: 'All'});
        await expect(allButton).toBeVisible();

        // Letters to check in the filter menu
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        
        // Loop through each letter and verify if the button is visible and not selected
        for (const letter of letters) {
            const button = page.getByLabel(letter, { exact: true });
            await expect(button).toBeVisible();
        }
    });

    test('Verify that the park names redirect to the correct park page', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');     
        await page.getByRole('link', { name: 'Adams Lake Park – Bush Creek' }).click();
        await expect(page).toHaveURL('/adams-lake-park-bush-creek-site/');
        await expect(page).toHaveTitle('Adams Lake Park – Bush Creek Site | BC Parks');
        await expect(page.getByRole('heading', { name: 'Adams Lake Park – Bush Creek' })).toHaveText('Adams Lake Park – Bush Creek Site');
        await page.goBack();
        await page.getByRole('link', { name: 'Akamina-Kishinena Park' }).click();
        await expect(page).toHaveURL('/akamina-kishinena-park/');
        await expect(page).toHaveTitle('Akamina-Kishinena Park | BC Parks');
        await expect(page.getByRole('heading', { name: 'Akamina-Kishinena Park' })).toHaveText('Akamina-Kishinena Park');
    })

    test('Verify the hyperlinks on the page are working', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');          
        await page.getByRole('link', { name: 'active advisories' }).click();
        await expect(page).toHaveURL('/' + 'active-advisories/');
        await page.goBack();
    });


    test('Check the park links are working and redirect to the correct site', async({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        //await page.waitForLoadState('networkidle');  
        test.setTimeout(60000); // Increase the timeout to 60 seconds           
        // Select all links on the page
        const links = await page.$$(`a`);
        // Loop through each link
        for (const link of links) { 
        const text = await link.textContent(); // Get the text content of the link
        
        // Check if the text includes 'Check the park'
            if (text.includes('Check the park')) {
                await link.click();
                await expect(page).toHaveURL('/' + 'find-a-park/'); 
                await page.goBack();
            }
        
        };
    });

    test('Check the land acknowledgment message is visible', async ({page})=>{
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');
        await page.evaluate(() =>{
            window.scrollBy(0, 5000);
        });
        await expect(page.locator('div').filter({ hasText: 'We acknowledge all First' }).nth(3)).toBeVisible();
        await expect(page.locator('div').filter({ hasText: 'We acknowledge all First' }).nth(3)).toContainText('We acknowledge all First Nations on whose territories BC Parks were established. We honour their connection to the land and respect the importance of their diverse teachings, traditions, and practices within these territories.')
        await expect(page.getByText('We acknowledge all First')).toBeVisible();
    });


    test('Check the back to top button is working', async ({ page }) => {
        await page.getByRole('menuitem', { name: 'Plan your trip' }).click();
        await page.getByRole('menuitem', { name: 'Park operating dates' }).click();
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => {
            window.scrollBy(0, 5000);
        });
        await expect(page.getByLabel('scroll to top')).toBeVisible();
        await page.getByLabel('scroll to top').click();
        await page.waitForTimeout(5000)
        const updatedScrollPosition = await page.evaluate(() => window.scrollY);
        expect(updatedScrollPosition).toBe(0);
        await expect(page.getByLabel('scroll to top')).toBeHidden();
    });

});

