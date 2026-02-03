# Skill: Firebase Security Rules

**Purpose**: Write, test, and deploy Firestore and Storage security rules to protect user data.

**When to Use**: Setting up database collections, implementing access control, securing user data.

---

## AG-Optimized Defaults

- **Default Policy**: Deny all, allow explicitly
- **Authentication**: Require auth for all user data
- **Ownership**: Users can only read/write their own data
- **Structure**: Organize rules by collection
- **Validation**: Validate data types and required fields
- **Testing**: Test locally with emulator before deploying

---

## Installation

No additional packages needed. Rules are written in `firestore.rules` and `storage.rules` files.

---

## Setup

### Create Rules Files

**`firestore.rules`** (in repo root):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Users collection: users can read/write their own document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Example: work memories collection
    match /workMemories/{memoryId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

**`storage.rules`** (in repo root):
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Default: deny all
    match /{allPaths=**} {
      allow read, write: if false;
    }
    
    // User uploads: organized by userId
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

---

## Common Patterns

### Require Authentication
```
allow read, write: if request.auth != null;
```

### User Owns Data
```
allow read, write: if request.auth.uid == resource.data.userId;
```

### Validate Required Fields
```
allow create: if request.resource.data.keys().hasAll(['userId', 'title', 'createdAt']);
```

### Validate Data Types
```
allow create: if request.resource.data.title is string
               && request.resource.data.createdAt is timestamp;
```

### File Size Limit
```
allow write: if request.resource.size < 5 * 1024 * 1024; // 5MB
```

### File Type Restriction
```
allow write: if request.resource.contentType.matches('image/.*');
```

---

## Deployment

### Deploy Rules to Firebase
```bash
npx firebase deploy --only firestore:rules
npx firebase deploy --only storage:rules

# Or deploy both
npx firebase deploy --only firestore:rules,storage:rules
```

---

## Do / Don't

### ✅ Do
- Start with deny-all, allow explicitly
- Require authentication for user data
- Validate data shapes and types
- Use `resource.data` for existing data, `request.resource.data` for incoming
- Test rules locally with emulator before deploying
- Document complex rules with comments

### ❌ Don't
- Use `allow read, write: if true;` in production
- Trust client-side validation alone
- Forget to check ownership (`userId == auth.uid`)
- Skip testing rules (use emulator)
- Deploy untested rules to production
- Use overly complex rules (refactor or rethink data model)

---

## Verification

- [ ] `firestore.rules` file exists in repo root
- [ ] `storage.rules` file exists in repo root
- [ ] Default rule is deny-all
- [ ] Authentication is required for user data
- [ ] Ownership checks are in place
- [ ] Rules are deployed to Firebase project
- [ ] Rules are tested (see skill-firebase-rules-testing-emulator.md)

---

## Evidence to Provide Nilhan

1. **Rules files**: Paste contents of `firestore.rules` and `storage.rules`
2. **Firebase Console**: Screenshot showing rules deployed in Firebase Console
3. **Deployment output**: Terminal output from `firebase deploy --only firestore:rules`
4. **Test results**: Output from emulator tests (if applicable)

---

## Official Documentation

- Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
- Storage Security Rules: https://firebase.google.com/docs/storage/security/
- Rules Language Reference: https://firebase.google.com/docs/rules/rules-language
