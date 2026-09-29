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
        expect(this.bcParksFooterLogo).toBeVisible();
    }
    
    async BCParksFooterClick(){
        this.bcParksFooterLogo.click();
    }

    //Land Acknowledgement message is visible
    async landAcknowledgementMessageIsPresent() {
        expect(this.landAcknowledgementMessage).toBeVisible();
    }

    //Footer columns are visible
    async getAPermitColumnIsPresent() {
        expect(this.getAPermitColumn).toBeVisible();
    }

    async getInvolvedColumnIsPresent() {
        expect(this.getInvolvedColumn).toBeVisible();
    }

    async stayConnectedColumnIsPresent() {
        expect(this.stayConnectedColumn).toBeVisible();
    }

    //Footer links are visible
    async parkUsePermitsLinkIsPresent() {
        expect(this.parkUsePermitsLink).toBeVisible();
    }

    async filmingInParksLinkIsPresent() {
        expect(this.filmingInParksLink).toBeVisible();
    }

    async travelTradeLinkIsPresent() {
        expect(this.travelTradeLink).toBeVisible();
    }

    async donateLinkIsPresent() {
        expect(this.donateLink).toBeVisible();
    }

    async buyLicencePlateLinkIsPresent() {
        expect(this.buyLicencePlateLink).toBeVisible();
    }

    async volunteerLinkIsPresent() {
        expect(this.volunteerLink).toBeVisible();
    }

    async contactUsLinkIsPresent() {
        expect(this.contactUsLink).toBeVisible();
    }

    async bcParksBlogLinkIsPresent() {
        expect(this.bcParksBlogLink).toBeVisible();
    }

    async faceBooklinkIsPresent() {
        expect(this.faceBooklink).toBeVisible();
    }

    async instagramLinkIsPresent() {
        expect(this.instagramLink).toBeVisible();
    }

    async siteMapLinkIsPresent() {
        expect(this.siteMapLink).toBeVisible();
    }

    async disclaimerLinkIsPresent() {
        expect(this.disclaimerLink).toBeVisible();
    }

    async privacyLinkIsPresent() {
        expect(this.privacyLink).toBeVisible();
    }

    async accessibilityLinkIsPresent() {
        expect(this.accessibilityLink).toBeVisible();
    }

    async copyrightLinkIsPresent() {
        expect(this.copyrightLink).toBeVisible();
    }

    // Clicking footer links
    async clickParkUsePermitsLink() {
        this.parkUsePermitsLink.click();
    }

    async clickFilmingInParksLink() {
        this.filmingInParksLink.click();
    }

    async clickTravelTradeLink() {
        this.travelTradeLink.click();
    }

    async clickDonateLink() {
        this.donateLink.click();
    }

    async clickBuyLicencePlateLink() {
        this.buyLicencePlateLink.click();
    }

    async clickVolunteerLink() {
        this.volunteerLink.click();
    }

    async clickContactUsLink() {
        this.contactUsLink.click();
    }

    async clickBcParksBlogLink() {
        this.bcParksBlogLink.click();
    }

    async clickFaceBooklink() {
        this.faceBooklink.click();
    }

    async clickInstagramLink() {
        this.instagramLink.click();
    }

    async clickSiteMapLink() {
        this.siteMapLink.click();
    }

    async clickDisclaimerLink() {
        this.disclaimerLink.click();
    }

    async clickPrivacyLink() {
        this.privacyLink.click();
    }

    async clickAccessibilityLink() {
        this.accessibilityLink.click();
    }

    async clickCopyrightLink() {
        this.copyrightLink.click();
    }
}