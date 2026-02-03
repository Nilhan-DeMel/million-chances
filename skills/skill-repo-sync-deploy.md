# Skill: Repo Sync & Deployment (Local ↔ GitHub ↔ Firebase)

**Purpose**: Ensure deterministic synchronization between development, source control, and production environments.

**When to Use**: Before starting work, before committing/pushing, and before deploying to Firebase.

---

## Source-of-Truth Rules

1. **GitHub `main` is Canonical**: All code deployed to production must exist on the `main` branch of the origin repository.
2. **Local Must be Clean**: No uncommitted changes should exist when pulling or performing critical sync operations.
3. **Deploy from Known Commits**: Never deploy uncommitted or local-only changes to production.

---

## Standard Operating Procedure (SOP)

### 1. Preflight Checklist (The "Dev Readiness" Scan)

- [ ] **Environment**: `.env.local` exists with correct keys.
- [ ] **Dependencies**: `package-lock.json` matches `package.json` (`npm install` ran).
- [ ] **Quality**: `npm run lint` passes.
- [ ] **Health**: App builds locally without errors (`npm run build`).
- [ ] **Tests**: Playwright smoke tests and A11y scans pass (`npm run test:e2e`).

### 2. "Sync Up" Procedure (Local ↔ GitHub)

```bash
# Before starting new work
git checkout main
git pull origin main
npm install

# Before pushing work
git status          # Ensure no accidental file changes
git add -A
git commit -m "feat/fix: descriptive message"
git push origin main
```

### 3. "Ship" Procedure (GitHub → Firebase)

We use **Firebase Hosting** for deployment.

**Standard Command:**

```bash
# AG-Optimized deploy command (ensures build + deploy)
npm run build && npx firebase deploy --only hosting
```

---

## Do / Don't

### ✅ Do

- Keep commit messages descriptive and prefixed (e.g., `feat:`, `fix:`, `chore:`).
- Verify the local build (`npm run build`) before every deployment.
- Sync with GitHub daily to avoid merge conflicts.
- Check the Firebase Console after deployment to verify the release.

### ❌ Don't

- Force push to `main` unless absolutely necessary.
- Deploy a "dirty" working directory (commit your changes first).
- Skip testing before a production deploy.
- Hardcode production keys in `globals.css` or components (use `.env`).

---

## Verification & Evidence

### Release Verification

- Check the **Commit Hash**: Surfaced in the footer (if implemented) or via `git rev-parse HEAD`.
- Check the **Firebase Console**: Verify the latest version index matches the local commit date.

### Evidence Format

To prove a successful sync/ship:

1. **GitHub Sync**: `git status` (clean) + `git log -n 1 --oneline`.
2. **Firebase Deploy**: Terminal output showing `✔ Deploy complete!`.
3. **Live URL Check**: URL of the deployed app.

---

## Official Documentation

- GitHub Docs: https://docs.github.com/
- Firebase Hosting Docs: https://firebase.google.com/docs/hosting
- Playwright Testing: https://playwright.dev/docs/intro
