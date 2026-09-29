import { expect } from '@playwright/test';
import { BasePage } from './basePage.js';

export class Footer extends BasePage{
    constructor(page){
        super(page);

        this.footerSection = page.locator('#footer');
        this.bcParksFooterLogo = page.getByRole('link', { name: 'BC Parks Wordmark' });
        this.landAcknowledgementMessage = page.locator('div').filter({ hasText: 'We acknowledge all First' }).nth(3);
        this.getAPermitColumn = page.getByText('Get a permitPark-use');
        this.getInvolvedColumn = page.getByText('Get involvedDonateBuy a');
        this.stayConnectedColumn = page.getByText('Stay connectedContact usBC');
        this.getAPermitHeading = page.getByRole('listitem').filter({ hasText: 'Get a permit' });
        this.getInvolvedHeading = page.getByRole('listitem').filter({ hasText: 'Get involved' });
        this.stayConnectedHeading = page.getByRole('listitem').filter({ hasText: 'Stay connected' });
        this.parkUsePermitsLink = page.getByRole('link', { name: 'Park-use permits' });
        this.filmingInParksLink = page.getByRole('link', { name: 'Filming in parks' });
        this.travelTradeLink = page.getByRole('link', { name: 'Travel trade' });
        this.donateLink = page.getByRole('link', { name: 'Donate' });
        this.buyLicencePlateLink = page.getByRole('link', { name: 'Buy a licence plate' });
        this.volunteerLink = page.getByRole('link', { name: 'Volunteer' });
        this.contactUsLink = page.locator('#home-footer').getByRole('link', { name: 'Contact us' });
        this.bcParksBlogLink = page.locator('#home-footer').getByRole('link', { name: 'BC Parks blog' });
        this.faceBooklink = page.locator('#home-footer').getByRole('link', { name: 'Facebook' });
        this.instagramLink = page.locator('#home-footer').getByRole('link', { name: 'Instagram' });
        this.siteMapLink = page.getByRole('link', { name: 'Site map' });
        this.disclaimerLink = page.getByRole('link', { name: 'Disclaimer' });
        this.privacyLink = page.getByRole('link', { name: 'Privacy' });
        this.accessibilityLink = page.getByRole('link', { name: 'Accessibility', exact: true });
        this.copyrightLink = page.getByRole('link', { name: 'Copyright' });
    }

    //BCParks Logo
    async BCParksLogoFooterIsPresent() {
        await expect(this.bcParksFooterLogo).toBeVisible();
    }
    
    async BCParksFooterClick(){
        await this.bcParksFooterLogo.click();
    }

    //Land Acknowledgement message is visible
    async landAcknowledgementMessageIsPresent() {
        await expect(this.landAcknowledgementMessage).toBeVisible();
    }

    //Footer columns are visible
    async getAPermitColumnIsPresent() {
        await expect(this.getAPermitColumn).toBeVisible();
    }

    async getInvolvedColumnIsPresent() {
        await expect(this.getInvolvedColumn).toBeVisible();
    }

    async stayConnectedColumnIsPresent() {
        await expect(this.stayConnectedColumn).toBeVisible();
    }

    //Footer links are visible
    async parkUsePermitsLinkIsPresent() {
        await expect(this.parkUsePermitsLink).toBeVisible();
    }

    async filmingInParksLinkIsPresent() {
        await expect(this.filmingInParksLink).toBeVisible();
    }

    async travelTradeLinkIsPresent() {
        await expect(this.travelTradeLink).toBeVisible();
    }

    async donateLinkIsPresent() {
        await expect(this.donateLink).toBeVisible();
    }

    async buyLicencePlateLinkIsPresent() {
        await expect(this.buyLicencePlateLink).toBeVisible();
    }

    async volunteerLinkIsPresent() {
        await expect(this.volunteerLink).toBeVisible();
    }

    async contactUsLinkIsPresent() {
        await expect(this.contactUsLink).toBeVisible();
    }

    async bcParksBlogLinkIsPresent() {
        await expect(this.bcParksBlogLink).toBeVisible();
    }

    async faceBooklinkIsPresent() {
        await expect(this.faceBooklink).toBeVisible();
    }

    async instagramLinkIsPresent() {
        await expect(this.instagramLink).toBeVisible();
    }

    async siteMapLinkIsPresent() {
        await expect(this.siteMapLink).toBeVisible();
    }

    async disclaimerLinkIsPresent() {
        await expect(this.disclaimerLink).toBeVisible();
    }

    async privacyLinkIsPresent() {
        await expect(this.privacyLink).toBeVisible();
    }

    async accessibilityLinkIsPresent() {
        await expect(this.accessibilityLink).toBeVisible();
    }

    async copyrightLinkIsPresent() {
        await expect(this.copyrightLink).toBeVisible();
    }

    // Clicking footer links
    async clickParkUsePermitsLink() {
        await this.parkUsePermitsLink.click();
    }

    async clickFilmingInParksLink() {
        await this.filmingInParksLink.click();
    }

    async clickTravelTradeLink() {
        await this.travelTradeLink.click();
    }

    async clickDonateLink() {
        await this.donateLink.click();
    }

    async clickBuyLicencePlateLink() {
        await this.buyLicencePlateLink.click();
    }

    async clickVolunteerLink() {
        await this.volunteerLink.click();
    }

    async clickContactUsLink() {
        await this.contactUsLink.click();
    }

    async clickBcParksBlogLink() {
        await this.bcParksBlogLink.click();
    }

    async clickFaceBooklink() {
        await this.faceBooklink.click();
    }

    async clickInstagramLink() {
        await this.instagramLink.click();
    }

    async clickSiteMapLink() {
        await this.siteMapLink.click();
    }

    async clickDisclaimerLink() {
        await this.disclaimerLink.click();
    }

    async clickPrivacyLink() {
        await this.privacyLink.click();
    }

    async clickAccessibilityLink() {
        await this.accessibilityLink.click();
    }

    async clickCopyrightLink() {
        await this.copyrightLink.click();
    }
}