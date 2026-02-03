import { chromium, test } from "@playwright/test";

test("Gallery Verification", async () => {
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const context = browser.contexts()[0];
  const page = context.pages()[0] || (await context.newPage());

  // Navigate to gallery
  await page.goto("http://localhost:3000/gallery");
  await page.waitForTimeout(2000); // Wait for loading state to finish

  // Take screenshot of initial state (empty or existing cards)
  await page.screenshot({ path: "artifacts/gallery-initial.png" });
  console.log("Initial gallery state captured.");

  // Check if "New Card (Stub)" button exists and click it
  const createButton = page.getByRole("button", { name: /New Card/i });
  if (await createButton.isVisible()) {
    console.log("Creating new card stub...");
    await createButton.click();
    await page.waitForTimeout(3000); // Wait for mutation and re-fetch
    await page.screenshot({ path: "artifacts/gallery-after-create.png" });
    console.log("Gallery state after creation captured.");
  } else {
    console.log("Create button not visible. Are you logged in?");
  }

  await browser.close();
});
