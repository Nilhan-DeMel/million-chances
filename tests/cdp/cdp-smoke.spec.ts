import { chromium, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('CDP Connect Smoke Test', async () => {
  // Connect to the externally launched browser
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  console.log('CDP CONNECT OK');

  // Use the existing context (since we started with a profile)
  const context = browser.contexts()[0];
  const page = context.pages()[0] || await context.newPage();

  // Navigate and verify
  await page.goto('about:blank');
  await page.goto('https://firebase.google.com', { waitUntil: 'domcontentloaded' });
  
  // Ensure artifacts directory exists
  const artifactsDir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir);
  }

  // Take screenshot
  const screenshotPath = path.join(artifactsDir, 'cdp-smoke.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  const stats = fs.statSync(screenshotPath);
  console.log(`File size: ${stats.size} bytes`);

  // Close the CDP connection (does not close browser window)
  await browser.close();
});
