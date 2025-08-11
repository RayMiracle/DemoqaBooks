// Reusable API helper functions for user registration and token generation
import { APIRequestContext } from '@playwright/test';

// Registers a new user and returns the user ID
export async function registerUser(request: APIRequestContext, username: string, password: string): Promise<string> {
    // Send POST request to register user
    const response = await request.post('https://demoqa.com/Account/v1/User', {
        data: { userName: username, password },
        headers: { 'Content-Type': 'application/json' }
    });
    // Check for successful registration (HTTP 201)
    if (response.status() !== 201) {
        throw new Error(`User registration failed: ${response.status()}`);
    }
    // Parse response and return user ID
    const body = await response.json();
    return body.userID;
}

// Generates an authentication token for a user and returns the token string
export async function generateToken(request: APIRequestContext, username: string, password: string): Promise<string> {
    // Send POST request to generate token
    const response = await request.post('https://demoqa.com/Account/v1/GenerateToken', {
        data: { userName: username, password },
        headers: { 'Content-Type': 'application/json' }
    });
    // Check for successful token generation (HTTP 200)
    if (response.status() !== 200) {
        throw new Error(`Token generation failed: ${response.status()}`);
    }
    // Parse response and return token
    const body = await response.json();
    return body.token;
}