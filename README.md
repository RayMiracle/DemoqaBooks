
# DemoqaBooks

This repository contains Playwright automated tests for the demoqa.com Books application, written in TypeScript. It covers both UI and API scenarios using Playwright's test runner and Page Object Model.

---

## Main Features

- **UI Automation**: Tests for searching books, navigating book details, and validating pagination on the Books page.
- **API Automation**: Tests for verifying the Books API response schema and adding books to a user's collection via API.
- **Reusable Helpers**: Utility functions for API requests (user registration, token generation) and random test data generation.
- **Fixtures**: JSON files with expected book titles for pagination validation.
- **Page Object Model**: Encapsulates selectors and actions for the Books page.

---

## Project Structure

- `tests/`
  - `UI_scenarios.spec.ts`: UI test scenarios (search, details, pagination).
  - `API_scenarios.spec.ts`: API test scenarios (book list, add book).
  - `fixtures/`: Expected book titles for pagination tests.
- `pages/`
  - `BooksPage.ts`: Page Object Model for the Books page.
- `utils/`
  - `ApiHelpers.ts`: API helper functions (register user, generate token).
  - `TestDataHelpers.ts`: Generates random credentials for test users.
- `playwright.config.ts`: Playwright configuration (test settings, browser projects).
- `package.json`: Scripts for running tests, reports, and installing browsers.
- `.gitignore`: Ignores Playwright output and node_modules.

---

## How to Run

1. **Install dependencies**:
  ```sh
  npm install
  ```
2. **Install Playwright browsers**:
  ```sh
  npx playwright install
  ```
3. **Run all tests**:
  ```sh
  npx playwright test
  ```
4. **Run specific tests**: Use scripts in `package.json` (e.g., `npm run test:ui:spec`)
5. **View HTML report**:
  ```sh
  npx playwright show-report
  ```

---

## Requirements

- Node.js (v16 or newer)
- npm

---

## Customization

- Modify browser/project settings in `playwright.config.ts`.
- Add new test scenarios in the `tests/` folder.
- Extend page objects in `pages/`.

---

## References

- [Playwright documentation](https://playwright.dev/docs/intro)
