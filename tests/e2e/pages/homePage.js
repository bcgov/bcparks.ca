import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';

export class HomePage extends BasePage{
    constructor(page){
        super(page);

        // Section headings
        this.advisoriesHeading = page.getByRole('heading', { name: "Advisories" });
        this.whatsNewHeading = page.getByRole('heading', { name: "What’s new" });
        this.visitingUsHeading = page.getByRole('heading', { name: "Visiting us" })
        this.aboutBCParksHeading = page.getByRole('heading', { name: "About BC Parks" });

        // Advisory links
        this.floodAdvisoriesLink = page.getByRole('link', { name: 'See flood advisories'});
        this.wildfireAdvisoriesLink = page.getByRole('link', { name: 'See wildfire advisories'})
        this.allAdvisoriesLink = page.getByRole('link', { name: 'See all advisories'});

        // Find a park search
        this.findParkSearch = page.getByText('Find a parkBy park nameorNear');
        this.findParkSearchHeading = page.locator('h1', {name: 'Find a park'});
        this.findParkByParkName = page.getByLabel('By park name'); 
        this.findParkByCityName = page.getByLabel('Near a city'); 
        this.findParkSearchButton = page.getByRole('button', { name: 'Search'});
        this.parkSuggestion = page.getByLabel('menu-options');

        // Visiting us links
        this.campingInformationLink = page.getByRole('link', { name: 'Campers sitting near a tent' });
        this.thingsToDoLink = page.getByRole('link', { name: 'People taking a photo' });
        this.accessibilityLink = page.getByRole('link', { name: 'A child in a wheelchair on a' });
        this.visitingResponsiblyLink = page.getByRole('link', { name: 'Cleaning up after a dog Visit' });

        // About BC Parks links
        this.indigenousRelationsLink = page.getByRole('link', { name: 'An indigenous carving' });
        this.wildlifeViewingLink = page.getByRole('link', { name: 'A Bighorn Sheep Wildlife'});
        this.conservationLink = page.getByRole('link', { name: 'A mountain peak Conservation' });
        this.historyParkLink = page.getByRole('link', { name: 'Family walking on a trail' });
        this.getInvolvedLink = page.getByRole('link', { name: 'People holding licence plates' });
    }

    // --- Section headings ---
    async expectSectionHeadingsVisible(){
        await expect(this.advisoriesHeading).toBeVisible();
        await expect(this.whatsNewHeading).toBeVisible();
        await expect(this.visitingUsHeading).toBeVisible();
        await expect(this.aboutBCParksHeading).toBeVisible();
    }

    // --- Advisory links ---
    async expectAdvisoryLinksVisible(){
        await expect(this.floodAdvisoriesLink).toBeVisible();
        await expect(this.wildfireAdvisoriesLink).toBeVisible();
        await expect(this.allAdvisoriesLink).toBeVisible();
    }

    async clickFloodAdvisories(){
        await this.floodAdvisoriesLink.click();
    }

    async clickWildfireAdvisories(){
        await this.wildfireAdvisoriesLink.click();
    }

    async clickAllAdvisories(){
        await this.allAdvisoriesLink.click();
    }

    // --- Find a park search box ---
    async expectFindParkSearchVisible(){
        await expect(this.findParkSearch).toBeVisible();
    }

    async fillParkNameSearch(value){
        await this.findParkByParkName.click();
        await this.findParkByParkName.fill(value);
    }

    async expectSuggestionVisible(){
        await expect(this.parkSuggestion).toBeVisible();
    }

    async expectSuggestionOptionVisible(value){
        await expect(this.parkSuggestion.getByRole('option', { name: value })).toBeVisible();
    }

    async selectSuggestionOption(value){
        await this.parkSuggestion.getByRole('option', { name: value }).click();
    }

    async fillCityNameSearch(value){
        await this.findParkByCityName.click();
        await this.findParkByCityName.fill(value);
    }

    async clickFindParkSearchButton(){
        await this.findParkSearchButton.click();
    }

    async focusCityNameSearch(){
        await this.findParkByCityName.click();
    }

    // --- Visiting us section ---
    async campingInformationPage(){
        await this.campingInformationLink.click();
    }

    async thingsToDoPage(){
        await this.thingsToDoLink.click();
    }

    async accessibilityPage(){
        await this.accessibilityLink.click();
    }

    async visitingResponsiblyPage(){
        await this.visitingResponsiblyLink.click();
    }

    
    // --- About BC Parks section ---
    async indigenousRelationsPage(){
        await this.indigenousRelationsLink.click();
    }

    async wildlifeViewingPage(){
        await this.wildlifeViewingLink.click();
    }

    async conservationPage(){
        await this.conservationLink.click();
    }

    async historyOfParksPage(){
        await this.historyParkLink.click();
    }

    async getInvolvedPage(){
        await this.getInvolvedLink.click();
    }
}
