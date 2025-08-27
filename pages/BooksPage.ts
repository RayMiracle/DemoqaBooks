// Import Playwright types for page and locator
import { Page, Locator } from '@playwright/test';

// Page Object Model for the Books page
export class BooksPage {
    /** Playwright page instance */
    readonly page: Page;
    /** Locator for the search input box */
    readonly searchBox: Locator;
    /** Locator for the search button */
    readonly searchButton: Locator;
    /** Locator for the next page button */
    readonly nextPageButton: Locator;
    /** Locator for the previous page button */
    readonly previousPageButton: Locator;
    /** Locator for the page number spinbutton */
    readonly jumpToPageSpinButton: Locator;
    /** Locator for the rows per page dropdown */
    readonly rowsPerPageSelect: Locator;
    /** Locator for all book title links in the grid */
    readonly allBookLinks: Locator;
    /** Locator for the author text on the book details page */
    readonly authorLocator: Locator;
    /** Locator for the publisher text on the book details page */
    readonly publisherLocator: Locator;
    /** Locator for the ISBN text on the book details page */
    readonly isbnLocator: Locator;

    /**
     * Initializes all static locators in the constructor.
     * @param page Playwright Page instance
     */
    constructor(page: Page) {
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
        this.searchButton = page.locator('#basic-addon2');
        this.nextPageButton = page.getByRole('button', { name: 'Next' });
        this.previousPageButton = page.getByRole('button', { name: 'Previous' });
        this.jumpToPageSpinButton = page.getByRole('spinbutton', { name: 'jump to page' });
        this.rowsPerPageSelect = page.getByLabel('rows per page');
        // this.allBookLinks = page.getByRole('link');
        this.allBookLinks = page.locator('.rt-td:nth-child(2)').getByRole('link');
        this.authorLocator = page.getByText('Author: Addy Osmani');
        this.publisherLocator = page.getByText("Publisher: O'Reilly Media");
        this.isbnLocator = page.getByText('ISBN: 9781449331818');
    }

    /**
     * Gets all book titles currently visible on the page.
     * @returns Array of visible book titles as strings
     */
    async getVisibleBookTitles(): Promise<string[]> {
        return await this.allBookLinks.allTextContents();
    }

    /**
     * Fills the search box and clicks the search button.
     * @param title Book title to search for
     */
    async searchBook(title: string) {
        await this.searchBox.fill(title);
        await this.searchButton.click();
    }

    /**
     * Gets a locator for a book link by its title (dynamic)
     * @param title Book title to locate
     * @returns Locator for the book link
     */
    // getBookLink(title: string): Locator {
    //     return this.page.getByRole('link', { name: title });
    // }

    /**
     * Returns a locator for the book link with the given title.
     * Throws an error if the link is not found or not visible within 5 seconds.
     * @param title Book title to locate
     * @returns Locator for the book link
     */
    async getBookLink(title: string): Promise<Locator> {
        const locator = this.page.getByRole('link', { name: title });
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        return locator;
    }

    /**
     * Returns a locator for a book link by its title without waiting for visibility.
     * @param title Book title to locate
     * @returns Locator for the book link
     */
    getBookLinkNoWait(title: string): Locator {
        return this.page.getByRole('link', { name: title });
    }

    /**
     * Selects the number of rows per page in the dropdown.
     * @param rows Number of rows per page as string
     */
    async selectRowsPerPage(rows: string) {
        await this.rowsPerPageSelect.selectOption(rows);
    }

    /**
     * Attempts to close advertisement overlay if present on the page.
     */
    async closeAdOverlayIfPresent() {
        // Locate the outer advertisement iframe on the page
        const adFrame = this.page.locator('[id="google_ads_iframe_/21849154601,22343295815/Ad.Plus-300x250_0"]').contentFrame();
        if (adFrame) {
            // Find the 'Close ad' button inside the outer ad iframe
            const closeAdButton = adFrame.getByRole('button', { name: 'Close ad' });
            // If the button is visible, click it to close the ad overlay
            if (await closeAdButton.isVisible()) {
                await closeAdButton.click();
                return; // Exit if ad was closed
            }
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