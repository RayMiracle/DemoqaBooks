// Import Playwright types for page and locator
import { Page, Locator } from '@playwright/test';

// Page Object Model for the Books page
export class BooksPage {
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
    // Locator for all book title links in the grid
    readonly allBookLinks: Locator;

    // Initialize all static locators in the constructor
    constructor(page: Page) {
        this.page = page;
        this.searchBox = page.getByRole('textbox', { name: 'Type to search' });
        this.searchButton = page.locator('#basic-addon2');
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

    // Attempt to close any advertisement overlay if present (searches all iframes and common close buttons)
    async closeAdOverlayIfPresent() {
        /*
         Attempts to close any advertisement overlay that may be present on the page.
         This function works by searching through all iframes for common close button selectors.
         If a visible close button is found, it will be clicked to dismiss the overlay.
         The search stops after the first successful close.
        */

        // Helper function: tries to click a close button in a given frame
        const tryCloseInFrame = async (frame: import('@playwright/test').Frame) => {
            // List of possible selectors for close buttons (role-based and CSS-based)
            const closeSelectors: Array<
                { role: 'button', name: string } | { css: string }
            > = [
                    // Common ARIA role/button names
                    { role: 'button', name: 'Close ad' },
                    { role: 'button', name: 'Close' },
                    // Common CSS selectors for close buttons
                    { css: '#ad_position_box button' },
                    { css: '.close-ad' },
                    { css: '.close' },
                    { css: '[aria-label="close"]' },
                    { css: '[aria-label="Close"]' },
                ];
            // Try each selector in order
            for (const sel of closeSelectors) {
                let locator: import('@playwright/test').Locator | undefined;
                // If selector is role-based, use getByRole
                if ('role' in sel) {
                    locator = frame.getByRole('button', { name: sel.name });
                } else if ('css' in sel) {
                    locator = frame.locator(sel.css);
                }
                // If locator is defined and visible, attempt to click it
                if (locator && await locator.isVisible().catch(() => false)) {
                    await locator.click().catch(() => { /* ignore click errors */ });
                    return true; // Successfully closed overlay
                }
            }
            return false; // No close button found/visible in this frame
        };

        // Get all frames (including iframes) on the page
        const frames = this.page.frames();
        // Iterate through each frame and try to close any ad overlay
        for (const frame of frames) {
            if (await tryCloseInFrame(frame)) {
                // If an overlay was closed, stop searching further
                break;
            }
        }
    }
}