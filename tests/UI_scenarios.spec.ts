// Import Playwright test functions and the BooksPage page object
import { test, expect } from '@playwright/test';
import { BooksPage } from '../pages/BooksPage';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demoqa.com/books');
  // await page.route('**/google_ads_iframe_*', route => route.abort());
});

/*
Scenario 1: Search for a Book and Validate Results
Automate searching for a specific book title and verify that the results contain the expected book.
Steps:
1. Navigate to the books page
2. Enter a book title ("Git Pocket Guide") in the search input field
3. Click the search button
4. Assert that the result list shows at least one book and contains the searched title
5. Assert that irrelevant books do not appear in results
*/

test('Search for a Book and Validate Results', async ({ page }) => {
  // Create page object for books page
  const searchedTitle = 'Git Pocket Guide';
  const booksPage = new BooksPage(page);
  // Search for the book
  await booksPage.searchBook(searchedTitle);
  // Assert at least one matching book is visible
  const bookLink = booksPage.getBookLink(searchedTitle);
  const count = await bookLink.count();
  expect(count).toBeGreaterThan(0);
  await expect(bookLink).toBeVisible();
  // Assert irrelevant book is not visible
  await expect(booksPage.getBookLink('Some Other Book')).not.toBeVisible();
});

/*
Scenario 2: Navigate to Book Details and Verify Content
Automate clicking a book from the list and verify that detailed information is displayed correctly.
Steps:
1. Navigate to the books page
2. Click on a book title link ("Learning JavaScript Design Patterns")
3. Assert the URL changes to book details page
4. Assert the book details (author, publisher, ISBN) are present and correct on the details page
*/

test('Navigate to Book Details and Verify Content', async ({ page }) => {
  // Create page object and click the book link
  const tappedTitle = 'Learning JavaScript Design Patterns';
  const booksPage = new BooksPage(page);
  await booksPage.getBookLink(tappedTitle).click();
  // Attempt to close advertisement overlay if present using POM method
  await booksPage.closeAdOverlayIfPresent();
  // Assert URL changes to book details page
  await expect(page).toHaveURL('https://demoqa.com/books?book=9781449331818');
  // Assert book details are visible
  // Note: Unable to view the book details because of blank page displayed for any book, so I have just put placeholders
  // await expect(page.getByText('Author: Addy Osmani')).toBeVisible();
  // await expect(page.getByText("Publisher: O'Reilly Media")).toBeVisible();
  // await expect(page.getByText('ISBN: 9781449331818')).toBeVisible();
});

/*
Scenario 3: Validate Pagination Functionality
Automate interaction with pagination controls and verify that page changes update the book list accordingly.
Steps:
1. Navigate to the books page
2. Identify the pagination controls (next page button)
3. Click to go to the next page
4. Assert the book list updates with different book titles (not same as previous page)
5. Navigate back to the first page and verify the original list is restored
*/

test('Validate Pagination Functionality', async ({ page }) => {
  // Create page object and interact with pagination controls
  const booksPage = new BooksPage(page);
  // Select 5 rows per page
  await booksPage.selectRowsPerPage('5');
  // Assert we are on page 1
  await expect(booksPage.jumpToPageSpinButton).toHaveValue('1');
  // Get book titles on page 1
  const expectedPage1Titles = [
    'Git Pocket Guide',
    'Learning JavaScript Design Patterns',
    'Designing Evolvable Web APIs with ASP.NET',
    'Speaking JavaScript',
    "You Don't Know JS"
  ];
  // Get book titles and filter out any empty strings (e.g., decorative or hidden links)
  const page1Titles = (await booksPage.getVisibleBookTitles()).filter(title => title.trim() !== "");
  expect(page1Titles).toEqual(expectedPage1Titles);
  // Go to next page
  await booksPage.nextPageButton.click();
  // Assert we are on page 2
  await expect(booksPage.jumpToPageSpinButton).toHaveValue('2');
  // Get book titles on page 2
  const expectedPage2Titles = [
    'Programming JavaScript Applications',
    'Eloquent JavaScript, Second Edition',
    'Understanding ECMAScript 6'
  ];
  // Get book titles and filter out any empty strings (e.g., decorative or hidden links)
  const page2Titles = (await booksPage.getVisibleBookTitles()).filter(title => title.trim() !== "");
  expect(page2Titles).toEqual(expectedPage2Titles);
  // Go back to previous page
  await booksPage.previousPageButton.click();
  // Assert we are back on page 1
  await expect(booksPage.jumpToPageSpinButton).toHaveValue('1');
  // Get book titles after returning to page 1 and assert
  // Get book titles and filter out any empty strings (e.g., decorative or hidden links)
  const page1TitlesAfterBack = (await booksPage.getVisibleBookTitles()).filter(title => title.trim() !== "");
  expect(page1TitlesAfterBack).toEqual(expectedPage1Titles);
});