import { BasePage } from './basePage.js';
import { expect } from '@playwright/test';

export class AllAdvisoriesPage extends BasePage{
    constructor(page){
        super(page);

        // Page heading
        this.activeAdvisoryPageTitle = page.getByRole('heading', { name: 'Active advisories' });

        // Breadcrumbs
        this.homeBreadcrumb = page.getByRole('link', { name: 'Home' });
        this.activeAdvisoriesBreadcrumb = page.getByLabel('breadcrumb').getByText('Active advisories');

        // Search Fields
        this.advisoryType = page.getByLabel('Select a type');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.advisoryTypeSuggestionMenu = page.getByLabel('menu-options');
        this.advisoryTypeClearButton = page.getByLabel('Clear');
        this.parkNameFilter = page.getByLabel('Park names');
        this.searchField = page.getByRole('textbox', { name: 'Search' });
        this.searchFieldClearButton = page.getByRole('button', { name: '×' });

        // Links
        this.wildfireServicesLink = page.getByRole('link', { name: 'BC Wildfire Service', exact: true });
        this.riverForecaseCentreLink = page.getByRole('link', { name: 'BC River Forecast Centre' });
        this.driveBCLink = page.getByRole('link', { name: 'DriveBC' });
        this.emergencyInfoLink = page.getByRole('link', { name: 'EmergencyInfoBC' });

    }

    // Page
    async expectPageTitleVisible(){
        await expect(this.activeAdvisoryPageTitle).toBeVisible();
    }

    // Breadcrumbs
    async expectHomeBreadcrumbLinkVisible(){
        await expect(this.homeBreadcrumb).toBeVisible();
    }

    async clickHomeBreadcrumbLink(){
        await this.homeBreadcrumb.click();
    }

    async expectActiveAdvisoriesBreadcrumbVisible(){
        await expect(this.activeAdvisoriesBreadcrumb).toBeVisible();
        await expect(this.activeAdvisoriesBreadcrumb).toHaveText('Active advisories');
    }

    // Search fields
    async selectAdvisoryType(value){
        await this.advisoryType.click();
        await this.advisoryType.fill(value);
    }

    async clickSearchButton(){
        await this.searchButton.click();
    }

    async expectAdvisoryTypeSuggestionMenuVisible(){
        await expect(this.advisoryTypeSuggestionMenu).toBeVisible();
    }

    async clickClearButton(){
        await this.advisoryTypeClearButton.click();
    }

    async clickParkNameFilter(value){
        await this.parkNameFilter.click();
    }

    async clickSearchField(){
        await this.searchField.click();
    }

    async fillSearchField(value){
        await this.searchField.fill(value);
    }

    async clickSearchFieldClearButton(){
        await this.searchFieldClearButton.click();
    }

    // Links
    async clickWildfireServicesLink(){
        await this.wildfireServicesLink.click();
    }

    async clickRiverForecastCentreLink(){
        await this.riverForecaseCentreLink.click();
    }

    async clickDriveBCLink(){
        await this.driveBCLink.click();
    }

    async clickEmergencyInfoLink(){
        await this.emergencyInfoLink.click()
    }

}



/*
        this.wildfireServicesLink = page.getByRole('link', { name: 'BC Wildfire Service' });
        this.riverForecaseCentreLink = page.getByRole('link', { name: 'BC River Forecast Centre' });
        this.driveBCLink = page.getByRole('link', { name: 'DriveBC' });
        this.emergencyInfoLink = page.getByRole('link', { name: 'EmergencyInfoBC' });


*/