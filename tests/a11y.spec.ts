import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Scans', () => {
    test('login page should have no automatically detectable accessibility violations', async ({ page }) => {
        await page.goto('/login');

        const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
