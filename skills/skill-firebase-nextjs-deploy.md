# Skill: Firebase + Next.js Deployment

**Purpose**: Deploy Next.js application to Firebase Hosting with proper configuration.

**When to Use**: Deploying production builds, setting up CI/CD, hosting the app publicly.

---

## AG-Optimized Defaults

- **Hosting**: Firebase Hosting
- **Export**: Static export (`output: 'export'` in next.config.ts)
- **Build Directory**: `out/` (Next.js static export output)
- **Deployment**: Firebase CLI
- **URL**: Custom domain or `[project-id].web.app`

---

## Installation

Firebase tools should already be installed:
```bash
npm install -D firebase-tools
```

---

## Setup

### 1. Configure Next.js for Static Export (`next.config.ts`)
```ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: 'export', // Enable static HTML export
  images: {
    unoptimized: true, // Required for static export
  },
}

export default nextConfig
```

### 2. Configure Firebase Hosting (`firebase.json`)
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. Add Build Script to `package.json`
```json
{
  "scripts": {
    "build": "next build",
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

---

## Deployment Process

### Manual Deployment
```bash
# 1. Build the app
npm run build

# 2. Test locally (optional)
npx firebase serve

# 3. Deploy to Firebase Hosting
npx firebase deploy --only hosting
```

### One-Command Deployment
```bash
npm run deploy
```

---

## Post-Deployment

### View Deployed App
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/million-chances-now/overview
Hosting URL: https://million-chances-now.web.app
```

### Set Custom Domain (Optional)
1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps

---

## Environment Variables

### For Static Export
Environment variables must be **build-time** only (no runtime secrets).

**`.env.production`**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

**⚠️ Important**: All env vars must start with `NEXT_PUBLIC_` for client-side access in static export.

---

## Do / Don't

### ✅ Do
- Use `output: 'export'` in next.config.ts
- Set `images.unoptimized: true` (required for static export)
- Build locally first to catch errors before deploying
- Use Firebase preview channels for testing
- Set up GitHub Actions for automated deploys

### ❌ Don't
- Use server-side features (API routes, ISR, etc.) with static export
- Forget to build before deploying
- Hardcode environment variables in source code
- Deploy without testing locally first
- Use runtime environment variables (they won't work in static export)

---

## GitHub Actions CI/CD (Optional)

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: million-chances-now
```

---

## Verification

- [ ] `next.config.ts` has `output: 'export'`
- [ ] `firebase.json` points to `out/` directory
- [ ] Build completes without errors
- [ ] Local preview works (`firebase serve`)
- [ ] Deployment succeeds
- [ ] Deployed app is accessible at Firebase Hosting URL
- [ ] All pages load correctly on production

---

## Evidence to Provide Nilhan

1. **Config files**: Paste `next.config.ts` and `firebase.json`
2. **Build output**: Terminal output from `npm run build`
3. **Deployment output**: Terminal output from `firebase deploy --only hosting`
4. **Live URL**: Screenshot or link to deployed app
5. **Firebase Console**: Screenshot showing active deployment

---

## Official Documentation

- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Firebase CLI: https://firebase.google.com/docs/cli
