---
name: nextjs-env-diagnostics
description: Patterns and procedures for diagnosing environment variable issues in Next.js applications, specifically for Firebase client-side usage.
---

# Next.js Environment Variable Diagnostics Skill

## Overview

This skill provides a standard way to verify if environment variables (prefixed with `NEXT_PUBLIC_`) are correctly loaded into the client-side runtime of a Next.js application.

## 1. Local Verification

- Check if `.env.local` exists in the project root.
- Ensure only one development server is running to avoid stale processes reading old configurations.
- Use `Get-Process` or `tasklist` to identify orphaned `node` or `next` processes.

## 2. Secure Diagnostic Page Pattern

When creating a debug/diagnostic page:

- **Environment Check**: Always wrap the page component to return a 404 (or null) if `process.env.NODE_ENV !== "development"`.
- **Secret Protection**: Never display the actual value of non-public keys (e.g., `FIREBASE_API_KEY`).
- **Public Key Reporting**: Only show whether the key is defined (boolean) or specific public identifiers like `PROJECT_ID` or `STORAGE_BUCKET`.

### Implementation Example (Partial)

```tsx
if (process.env.NODE_ENV !== "development") {
  return null; // Or use notFound() from next/navigation
}

const envStatus = {
  apiKeyExists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};
```

## 3. Runtime Initialization Guard

Implement a guard in your Firebase client initialization:

- Log a descriptive warning in development if keys are missing.
- Throw a fatal error in production to prevent silent failures.
- Provide a UI hook to show a "Missing Configuration" banner in the browser.

## 4. Troubleshooting Checklist

1. **Case Sensitivity**: Ensure `NEXT_PUBLIC_` is all caps.
2. **Path**: Ensure `.env.local` is in the root, not inside `src/`.
3. **Restart**: Next.js requires a full restart of the dev server after editing `.env` files.
4. **Browser Cache**: Sometimes a hard refresh (Ctrl+F5) is needed if the client-side bundle is cached.
