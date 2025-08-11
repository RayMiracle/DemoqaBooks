// Import Playwright types for page and locator
import { Page, Locator } from '@playwright/test';

// Page Object Model for the Books page
export class BooksPage {
    // Locator for all book title links in the grid
    readonly allBookLinks: Locator;
    // Playwright page instance
    readonly page: Page;
    // Locator for the search input box
    readonly searchBox: Locator;
    // Locator for the search button
    readonly searchButton: Locator;
    // Locator for the next page button
    readonly nextPageButton: Locator;
    // Locator for the previous page button
    readonly previousPageButton: Locator;
    // Locator for the page number spinbutton
    readonly jumpToPageSpinButton: Locator;
    // Locator for the rows per page dropdown
    readonly rowsPerPageSelect: Locator;

    // Initialize all static locators in the constructor
    constructor(page: Page) {
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
        this.searchButton = page.locator('#basic-addon2 span');
        this.nextPageButton = page.getByRole('button', { name: 'Next' });
        this.previousPageButton = page.getByRole('button', { name: 'Previous' });
        this.jumpToPageSpinButton = page.getByRole('spinbutton', { name: 'jump to page' });
        this.rowsPerPageSelect = page.getByLabel('rows per page');
        this.allBookLinks = page.getByRole('link');
    }

    // Get all book titles currently visible on the page
    async getVisibleBookTitles(): Promise<string[]> {
        return await this.allBookLinks.allTextContents();
    }

    // Fill the search box and click the search button
    async searchBook(title: string) {
        await this.searchBox.fill(title);
        await this.searchButton.click();
    }

    // Get a locator for a book link by its title (dynamic)
    getBookLink(title: string) {
        return this.page.getByRole('link', { name: title });
    }

    // Select the number of rows per page in the dropdown
    async selectRowsPerPage(rows: string) {
        await this.rowsPerPageSelect.selectOption(rows);
    }

    // Attempt to close advertisement overlay if present
    async closeAdOverlayIfPresent() {
        // Locate the outer advertisement iframe on the page
        const adFrame = this.page.locator('[id="google_ads_iframe_/21849154601,22343295815/Ad.Plus-300x250_0"]').contentFrame();
        if (adFrame) {
            // Locate the inner iframe that contains the actual ad content
            const innerAdFrame = adFrame.locator('iframe[name="ad_iframe"]').contentFrame();
            if (innerAdFrame) {
                // Find the 'Close ad' button inside the inner ad iframe
                const closeAdButton = innerAdFrame.getByRole('button', { name: 'Close ad' });
                // If the button is visible, click it to close the ad overlay
                if (await closeAdButton.isVisible()) {
                    await closeAdButton.click();
                }
            }
        }
    }
}