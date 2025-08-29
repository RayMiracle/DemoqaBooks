/**
 * Reusable API helper functions for user registration and token generation
 */
import { APIRequestContext } from '@playwright/test';

// API Endpoints and test data constants
const REGISTER_USER_URL = 'https://demoqa.com/Account/v1/User';
const GENERATE_TOKEN_URL = 'https://demoqa.com/Account/v1/GenerateToken';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Registers a new user via the API.
 * @param request - Playwright APIRequestContext
 * @param username - Username for registration
 * @param password - Password for registration
 * @returns The registered user's ID
 * @throws Error if registration fails
 */
export async function registerUser(request: APIRequestContext, username: string, password: string): Promise<string> {
    // Send POST request to register user
    const response = await request.post(REGISTER_USER_URL, {
        data: { userName: username, password },
        headers: JSON_HEADERS
    });
    const body = await response.json();
    // Check for successful registration (HTTP 201)
    if (response.status() !== 201) {
        const errorMessage = body.message || JSON.stringify(body);
        throw new Error(`User registration failed: Response status is ${response.status()}, Error message is ${errorMessage}`);
    }
    // Return user ID
    return body.userID;
}

/**
 * Generates an authentication token for a user via the API.
 * @param request - Playwright APIRequestContext
 * @param username - Username for authentication
 * @param password - Password for authentication
 * @returns The authentication token string
 * @throws Error if token generation fails
 */
export async function generateToken(request: APIRequestContext, username: string, password: string): Promise<string> {
    // Send POST request to generate token
    const response = await request.post(GENERATE_TOKEN_URL, {
        data: { userName: username, password },
        headers: JSON_HEADERS
    });
    const body = await response.json();
    // Check for successful token generation (HTTP 200)
    if (response.status() !== 200) {
        const errorMessage = body.message || JSON.stringify(body);
        throw new Error(`Token generation failed: Response status is ${response.status()}, Error message is ${errorMessage}`);
    }
    // Return token
    return body.token;
}