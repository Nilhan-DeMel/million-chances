# Skill: E2E Testing with Playwright

**Purpose**: Ensure the application works as expected from a user's perspective across different browsers.

**When to Use**: Before every push/deploy to ensure no regressions in critical paths (login, data entry).

---

## AG-Optimized Defaults

- **Framework**: Playwright
- **Runner**: `npx playwright test`
- **Location**: `/tests` directory
- **Browsers**: Chromium (main), WebKit, Firefox
- **Reporting**: HTML report (standard)

---

## Installation

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

---

## Usage Patterns

### 1. Smoke Test (`tests/smoke.spec.ts`)
```ts
import { test, expect } from '@playwright/test';

test('login page renders correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/Login/i);
  await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
});
```

### 2. NPM Scripts
```json
"test:e2e": "playwright test"
```

---

## Do / Don't

### ✅ Do
- Target interactive elements using `getByRole` or `getByLabel`.
- Run tests against a local dev server or preview build.
- Keep tests focused on "happy paths" for speed.

### ❌ Don't
- Use brittle CSS selectors (avoid `.btn-primary`).
- Test implementation details (testing the "what", not the "how").
- Skip tests on CI.

---

## Verification

- [ ] Playwright is installed as a dev dependency.
- [ ] `tests/smoke.spec.ts` passes locally.
- [ ] `npx playwright test` command works.

---

## Evidence to Provide Nilhan

1. **Test Results**: Terminal output from `npx playwright test`.
2. **Config snippet**: `playwright.config.ts` content.
3. **Test Code**: Paste the smoke test file.

---

## Official Documentation

- Playwright Docs: https://playwright.dev/docs/intro
- Testing Next.js: https://playwright.dev/docs/test-nextjs
