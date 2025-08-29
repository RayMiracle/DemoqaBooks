// Import Playwright test functions for API testing
import { test, expect } from '@playwright/test';
import { registerUser, generateToken } from '../utils/ApiHelpers';
import { generateRandomCredentials } from '../utils/TestDataHelpers';

// API Endpoints and test data constants
const BOOKS_API_URL = 'https://demoqa.com/BookStore/v1/Books';
const TEST_ISBN = '9781449331818';

/**
 * Scenario 1: Verify Book List API Response Status and Schema
 * Automate a GET request to the books API endpoint and validate the response.
 * Steps:
 * 1. Send a GET request to the API endpoint that returns the list of books (BOOKS_API_URL)
 * 2. Assert response status is 200 OK
 * 3. Assert response JSON includes a non-empty array of books
 * 4. Validate presence of required fields (title, author, isbn, etc.) in each book object
 */

test('Verify Book List API Response Status and Schema', async ({ request }) => {
    let response: import('@playwright/test').APIResponse;
    let responseBody: any;
    let books: Array<{
        isbn: string;
        title: string;
        author: string;
        publish_date: string;
        publisher: string;
        pages: number;
        description: string;
        website: string;
    }>;
    await test.step('Send a GET request to the API endpoint that returns the list of books', async () => {
        response = await request.get(BOOKS_API_URL);
    });
    await test.step('Assert response status is 200 OK', async () => {
        expect(response.status()).toBe(200);
    });
    await test.step('Assert response JSON includes a non-empty array of books', async () => {
        responseBody = await response.json();
        books = responseBody.books;
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeGreaterThan(0);
    });
    await test.step('Validate presence of required fields (title, author, isbn, etc.) in each book object', async () => {
        books.forEach((element: {
            isbn: string;
            title: string;
            author: string;
            publish_date: string;
            publisher: string;
            pages: number;
            description: string;
            website: string;
        }) => {
            expect(element).toHaveProperty('isbn');
            expect(typeof element.isbn).toBe('string');
            expect(element).toHaveProperty('title');
            expect(typeof element.title).toBe('string');
            expect(element).toHaveProperty('author');
            expect(typeof element.author).toBe('string');
            expect(element).toHaveProperty('publish_date');
            expect(typeof element.publish_date).toBe('string');
            // Check that publish_date matches ISO 8601 date-time format
            const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
            expect(element.publish_date).toMatch(isoDateTimeRegex);
            expect(element).toHaveProperty('publisher');
            expect(typeof element.publisher).toBe('string');
            expect(element).toHaveProperty('pages');
            expect(typeof element.pages).toBe('number');
            expect(element).toHaveProperty('description');
            expect(typeof element.description).toBe('string');
            expect(element).toHaveProperty('website');
            expect(typeof element.website).toBe('string');
        });
    });
});

/**
 * Scenario 2: Add a Book to User's Collection via API and Verify
 * Automate POST request to add a book to a user's collection and verify success response.
 * Steps:
 * 1. Authenticate or use a test user token if required
 * 2. Send a POST request to the API endpoint (BOOKS_API_URL) with a payload including a book's ISBN and user ID/token
 * 3. Assert the response status is 201 Created or 200 OK
 * 4. Assert the response body confirms the book was added successfully
 */

test('Register user, generate token, and add a book to user collection', async ({ request }) => {
    let username: string;
    let password: string;
    let userId: string;
    let token: string;
    let payload: { userId: string; collectionOfIsbns: Array<{ isbn: string }> };
    let response: import('@playwright/test').APIResponse;
    let responseBody: any;
    let books: Array<{ isbn: string }>;
    await test.step('Authenticate or use a test user token if required', async () => {
        // Generate a random username and password using utility
        ({ username, password } = generateRandomCredentials());
        // Register user using helper function
        userId = await registerUser(request, username, password);
        expect(userId).toBeDefined();
        // Generate token using helper function
        token = await generateToken(request, username, password);
        expect(token).toBeDefined();
    });
    await test.step('Send a POST request to the API endpoint with a payload including a book\'s ISBN and user ID/token', async () => {
        payload = {
            userId,
            collectionOfIsbns: [{ isbn: TEST_ISBN }]
        };
        response = await request.post(BOOKS_API_URL, {
            data: payload,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
    await test.step('Assert the response status is 201 Created or 200 OK', async () => {
        expect([200, 201]).toContain(response.status());
    });
    await test.step('Assert the response body confirms the book was added successfully', async () => {
        responseBody = await response.json();
        books = responseBody.books;
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBe(1);
        expect(books[0].isbn).toBe(TEST_ISBN);
    });
});