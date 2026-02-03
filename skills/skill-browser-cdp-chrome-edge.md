# Skill: External Browser Automation (CDP Chrome/Edge)

**Purpose**: Automate and verify the application using a real, external browser (Chrome or Edge) via the Chrome DevTools Protocol (CDP). This bypasses internal browser limitations.

**When to Use**:

- When the internal browser subagent fails (e.g., $HOME not set).
- When testing features that require a real user profile or persistence.
- When verifying production deployments on Firebase.

---

## AG-Optimized Defaults

- **Protocol**: Chrome DevTools Protocol (CDP)
- **Port**: 9222 (standard)
- **Profile**: Dedicated repo-local profile in `.cdp-profile/`
- **Automation Tool**: Playwright `connectOverCDP`

---

## SOP: Start Browser with Remote Debugging

### 1. Launch Browser (Windows PowerShell)

Use the provided scripts to launch a clean browser instance with the debugging port open:

```powershell
./scripts/start-chrome-cdp.ps1
# OR
./scripts/start-edge-cdp.ps1
```

### 2. Verify Endpoint

Confirm the CDP endpoint is live by visiting:
`http://localhost:9222/json/version`

You should see a JSON response with a `webSocketDebuggerUrl`.

---

## Usage Patterns: Playwright Connect

### 1. Connecting in a Test

```ts
import { chromium, test } from "@playwright/test";

test("verify via CDP", async () => {
  const browser = await chromium.connectOverCDP("http://localhost:9222");
  const defaultContext = browser.contexts()[0];
  const page = defaultContext.pages()[0] || (await defaultContext.newPage());

  await page.goto("http://localhost:3000");
  await page.screenshot({ path: "artifacts/cdp-verification.png" });

  await browser.close();
});
```

---

## Do / Don't

### ✅ Do

- Use the dedicated profile directory to avoid conflicts with your main browser.
- Close the CDP connection (`browser.close()`) but keep the browser window open if needed for manual steps.
- Verify the 9222 port is open before running automation.

### ❌ Don't

- Use the internal `browser_subagent` (it is currently broken).
- Hardcode absolute paths to browser executables in scripts (use the wrapper scripts).
- Run automation on a profile with sensitive personal data.

---

## Verification & Evidence

### Verification

- [ ] Browser window opens with "Remote debugging" notice.
- [ ] `http://localhost:9222/json/version` returns valid JSON.
- [ ] Playwright test connects and captures a screenshot.

### Evidence Format

1. **CDP Link**: Paste the `webSocketDebuggerUrl` from the JSON endpoint.
2. **Screenshot**: Provide path to the captured verification image in `/artifacts`.

---

## Known Limitations

- **Headless Mode**: CDP automation usually runs "headed" (visible window).
- **Session Auth**: If the site requires login, you may need to manually sign in once in the CDP window to persist the session in the profile.
- **Environment**: Requires the user (Nilhan) to be on a system where Chrome/Edge is installed.
