/**
 * Generates random credentials for test users.
 * @returns {{ username: string; password: string }} An object containing a unique username and password.
 */
export function generateRandomCredentials(): { username: string; password: string } {
    const randomSuffix = Math.floor(Math.random() * 1e6);
    return {
        username: `testuser_${randomSuffix}`,
        password: `TestPassword${randomSuffix}!`
    };
}