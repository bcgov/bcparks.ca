import { BasePage } from './basePage.js';

export class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.getAQuickAnswerHeading = page.getByRole('heading', { name: 'Get a quick answer' });
    this.contactUsHeading = page.getByRole('heading', { name: 'Contact us' });
    this.followUsHeading = page.getByRole('heading', { name: 'Follow us' });

    // On this page links
    this.getaQuickAnswerLink = page.getByRole('link', { name: 'Get a quick answer' });
    this.contactUsLink = page.getByRole('link', { name: 'Contact us' }).first();
    this.followUsLink = page.getByRole('link', { name: 'Follow us' });
  }
    // Actions
    async goToGetQuickAnswer(){
        await this.getaQuickAnswerLink.click();
    }
    async goToContactUs(){
        await this.contactUsLink.click();
    }

    async goToFollowUs(){
        await this.followUsLink.click();
    }
}