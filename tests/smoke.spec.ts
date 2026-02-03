import { test, expect } from '@playwright/test';

test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');

    // Assert title
    await expect(page).toHaveTitle(/Million Chances/i);

    // Assert Google Sign-In button exists
    const googleButton = page.getByRole('button', { name: /Continue with Google/i });
    await expect(googleButton).toBeVisible();
});
