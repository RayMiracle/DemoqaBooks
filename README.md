# GiacomDemoqaBooks

This repository contains Playwright automated tests for the demoqa.com Books application, written in TypeScript.

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/RayMiracle/GiacomDemoqaBooks.git
   cd GiacomDemoqaBooks
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Install Playwright browsers**
   ```sh
   npx playwright install
   ```

## Running the Tests

- **Run all tests:**
  ```sh
  npx playwright test
  ```

- **Run a specific test file:**
  ```sh
  npx playwright test tests/API_scenarios.spec.ts
  ```

- **View HTML test report:**
  After running tests, open the report:
  ```sh
  npx playwright show-report
  ```

## Project Structure
- `tests/` - Contains UI and API test scenarios
- `pages/` - Page Object Model classes for UI tests
- `utils/` - Reusable helper functions for API tests
- `playwright.config.ts` - Playwright configuration

## Requirements
- Node.js (v16 or newer recommended)
- npm

## Additional Notes
- All tests are written in TypeScript and use Playwright Test Runner.
- You can customize browser/project settings in `playwright.config.ts`.
- For more info, see [Playwright documentation](https://playwright.dev/docs/intro).
