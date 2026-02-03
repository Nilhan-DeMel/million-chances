# Skill: Firebase Rules Testing (Emulator)

**Purpose**: Test Firestore and Storage security rules locally before deploying to production.

**When to Use**: Before deploying security rules, when modifying rules, adding new collections.

---

## AG-Optimized Defaults

- **Test Framework**: Vitest (chosen for this project)
- **Emulator**: Firebase Local Emulator Suite
- **Test Library**: `@firebase/rules-unit-testing`
- **Approach**: Write tests for both allowed and denied operations
- **CI/CD**: Run tests in GitHub Actions before deploying

---

## Installation

```bash
npm install -D vitest @firebase/rules-unit-testing
npm install -D firebase-tools
```

### Configure Vitest (`vitest.config.ts` in repo root)
```ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Update package.json scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:rules": "vitest run rules.test.ts",
    "emulator": "firebase emulators:start --only firestore,auth"
  }
}
```

---

## Setup

### 1. Firebase Emulator Config (`firebase.json`)
```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### 2. Example Test File (`__tests__/rules.test.ts`)
```ts
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { describe, beforeAll, afterAll, it } from 'vitest'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test-project',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('Firestore Security Rules', () => {
  it('should deny reads when not authenticated', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore()
    const docRef = doc(unauthedDb, 'users/user123')
    await assertFails(getDoc(docRef))
  })

  it('should allow user to read their own document', async () => {
    const authedDb = testEnv.authenticatedContext('user123').firestore()
    const docRef = doc(authedDb, 'users/user123')
    await assertSucceeds(getDoc(docRef))
  })

  it('should deny user from reading another user document', async () => {
    const authedDb = testEnv.authenticatedContext('user123').firestore()
    const docRef = doc(authedDb, 'users/user456')
    await assertFails(getDoc(docRef))
  })

  it('should allow user to create work memory with their userId', async () => {
    const authedDb = testEnv.authenticatedContext('user123').firestore()
    const memoryRef = doc(authedDb, 'workMemories/memory1')
    await assertSucceeds(
      setDoc(memoryRef, {
        userId: 'user123',
        title: 'Test Memory',
        createdAt: new Date(),
      })
    )
  })

  it('should deny user from creating work memory with different userId', async () => {
    const authedDb = testEnv.authenticatedContext('user123').firestore()
    const memoryRef = doc(authedDb, 'workMemories/memory1')
    await assertFails(
      setDoc(memoryRef, {
        userId: 'user456', // Different user!
        title: 'Test Memory',
        createdAt: new Date(),
      })
    )
  })
})
```

---

## Running Tests

### Start Emulator (in one terminal)
```bash
npm run emulator
```

### Run Tests (in another terminal)
```bash
npm run test:rules
```

---

## Do / Don't

### ✅ Do
- Test both successful and failed operations
- Test unauthenticated users
- Test ownership boundaries (user can't access other users' data)
- Test data validation rules
- Run tests before deploying rules
- Use `assertSucceeds` for allowed ops, `assertFails` for denied

### ❌ Don't
- Skip testing rules (it's critical for security)
- Test only happy paths (test denials too)
- Forget to cleanup test environment
- Use production Firebase project for tests
- Deploy without running tests first

---

## Verification

- [ ] Vitest is installed and configured
- [ ] `@firebase/rules-unit-testing` is installed
- [ ] `vitest.config.ts` exists
- [ ] Test file exists (`__tests__/rules.test.ts`)
- [ ] Tests cover allowed and denied operations
- [ ] Tests pass with `npm run test:rules`
- [ ] Firebase emulator runs without errors

---

## Evidence to Provide Nilhan

1. **Test file**: Paste the rules test file
2. **Test output**: Terminal output showing all tests passing
3. **Emulator UI**: Screenshot of emulator UI running (optional)
4. **Coverage**: Number of test cases written (at least 5+)

---

## Official Documentation

- Firebase Emulator: https://firebase.google.com/docs/emulator-suite
- Rules Unit Testing: https://firebase.google.com/docs/rules/unit-tests
- Vitest: https://vitest.dev/
