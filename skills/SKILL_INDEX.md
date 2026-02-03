# Skill Index

A catalog of all available skill packs for the Million Chances Now app.

## When to Use Which Skill

| Skill Pack                               | Use When                                                             | File                                                                                   |
| ---------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **UI with shadcn/ui + Radix + Tailwind** | Building any UI component, form, dialog, dropdown, etc.              | [skill-ui-shadcn-radix-tailwind.md](./skill-ui-shadcn-radix-tailwind.md)               |
| **Motion & Animations**                  | Adding animations, transitions, gestures, or micro-interactions      | [skill-motion-animations.md](./skill-motion-animations.md)                             |
| **Firebase Auth (Google)**               | Implementing authentication with Google Sign-In                      | [skill-firebase-auth-google.md](./skill-firebase-auth-google.md)                       |
| **Firebase Security Rules**              | Writing, deploying, and maintaining Firestore/Storage security rules | [skill-firebase-security-rules.md](./skill-firebase-security-rules.md)                 |
| **Firebase Rules Testing (Emulator)**    | Testing security rules locally before deploying                      | [skill-firebase-rules-testing-emulator.md](./skill-firebase-rules-testing-emulator.md) |
| **TanStack Query**                       | Fetching, caching, and syncing server/Firebase data                  | [skill-tanstack-query.md](./skill-tanstack-query.md)                                   |
| **Forms (React Hook Form + Zod)**        | Building forms with validation                                       | [skill-forms-react-hook-form-zod.md](./skill-forms-react-hook-form-zod.md)             |
| **Firebase + Next.js Deploy**            | Deploying Next.js app to Firebase Hosting                            | [skill-firebase-nextjs-deploy.md](./skill-firebase-nextjs-deploy.md)                   |
| **Color System (Radix Colors)**          | Implementing warm accents (Orange/Tomato) and accessible grays       | [skill-color-system-radix-colors.md](./skill-color-system-radix-colors.md)             |
| **Typography (Next.js font)**            | Premium typography with Outfit font and zero layout shift            | [skill-typography-next-font.md](./skill-typography-next-font.md)                       |
| **E2E Testing (Playwright)**             | Cross-browser testing for critical user paths                        | [skill-e2e-playwright.md](./skill-e2e-playwright.md)                                   |
| **Accessibility (Axe + Playwright)**     | Automated a11y scans based on WCAG standards                         | [skill-a11y-axe-playwright.md](./skill-a11y-axe-playwright.md)                         |
| **Repo Sync & Deploy**                   | Standardizing Local ↔ GitHub ↔ Firebase sync                         | [skill-repo-sync-deploy.md](./skill-repo-sync-deploy.md)                               |
| **CDP Browser (Chrome/Edge)**            | Automation via external browser debugging                            | [skill-browser-cdp-chrome-edge.md](./skill-browser-cdp-chrome-edge.md)                 |
| **Human Browser Pilot**                  | Manual verification by Nilhan                                        | [skill-browser-human-pilot.md](./skill-browser-human-pilot.md)                         |
| **Firestore Client CRUD Patterns**       | Frontend patterns for reliable data access                           | [skill-firestore-client-crud.md](./skill-firestore-client-crud.md)                     |
| **Firebase Storage Image Upload**        | Standardized image upload with progress tracking                     | [skill-firebase-storage-image-upload.md](./skill-firebase-storage-image-upload.md)     |
| **Firestore Realtime Listeners**         | Pattern for onSnapshot usage and cleanup                             | [skill-firestore-realtime-listeners.md](./skill-firestore-realtime-listeners.md)       |

## Skill Pack Quick Reference

### UI & Design

- shadcn/ui + Radix + Tailwind
- Radix Colors (Warm System)
- Typography (Outfit)

### Interactions

- Motion & Animations

### Authentication & Authorization

- Firebase Auth (Google)
- Firebase Security Rules
- Firebase Rules Testing

### Data & State

- TanStack Query

### Forms & Validation

- React Hook Form + Zod

### Deployment & Quality

- Firebase + Next.js Deploy
- E2E Testing (Playwright)
- Accessibility Scans (Axe)
- Repo Sync & Deploy (Deterministic sync)
- CDP Browser Automation (External)
- Human Browser Pilot (Manual)
- Firestore Client CRUD (Patterns)
- Firebase Storage Image Upload (Standardized)
- Firestore Realtime Listeners (onSnapshot)

## Update Process

When adding a new skill:

1. Create the skill pack markdown file in `/skills`
2. Add entry to this index table
3. Commit with message: `chore: add skill-[name]`
