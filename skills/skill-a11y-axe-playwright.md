# Skill: Accessibility Testing with Axe-core/Playwright

**Purpose**: Ensure the application is accessible to all users, following WCAG standards.

**When to Use**: During E2E testing to catch accessibility violations automatically.

---

## AG-Optimized Defaults

- **Library**: `@axe-core/playwright`
- **Runner**: Playwright
- **Standard**: WCAG 2.1 AA (baseline)
- **Automatic Scans**: Scan whole pages during E2E runs.

---

## Installation

```bash
npm install -D @axe-core/playwright
```

---

## Usage Patterns

### 1. Accessibility Scan (`tests/a11y.spec.ts`)
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('login page accessibility check', async ({ page }) => {
  await page.goto('/login');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 2. NPM Scripts
```json
"test:a11y": "playwright test tests/a11y.spec.ts"
```

---

## Do / Don't

### ✅ Do
- Scan interactive states (open modals, expanded menus).
- Aim for ZERO violations in every core page.
- Use semantic HTML (headers, buttons, labels).

### ❌ Don't
- Rely *only* on automated tools (manual testing is still needed).
- Ignore warnings (even if they aren't "violations").
- Use `aria-label` when a visible label is possible.

---

## Verification

- [ ] `@axe-core/playwright` is installed in `package.json`.
- [ ] Accessibility test passes with no violations.
- [ ] Scan output shows "0 violations".

---

## Evidence to Provide Nilhan

1. **A11y Report**: Terminal output from `npx playwright test tests/a11y.spec.ts`.
2. **Violation Count**: Statement confirming 0 violations.

---

## Official Documentation

- Playwright A11y: https://playwright.dev/docs/accessibility-testing
- Axe-core Reference: https://github.com/dequelabs/axe-core
