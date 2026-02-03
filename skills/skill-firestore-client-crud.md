# Skill: Firestore Client CRUD Patterns

**Purpose**: Standardize how we perform Create, Read, Update, and Delete operations on the Firestore client side using types and helper modules.

**When to Use**: Whenever you need to interact with a Firestore collection from the frontend.

---

## AG-Optimized Defaults

- **Collection Helpers**: Create a function to return a typed collection reference.
- **Mapping**: Convert Firestore Data to local Types (handling Timestamps).
- **Separation**: Keep Firestore logic in `src/lib/firestore/`.
- **Typing**: Use strict TypeScript interfaces for all document shapes.

---

## Patterns

### 1. File Structure

`src/lib/firestore/[collectionName].ts`

### 2. Collection Reference

```ts
import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase"; // Path to initialized Firebase app

export const getMyCollection = () =>
  collection(db, "myCollection") as CollectionReference<MyType, DocumentData>;
```

### 3. Timestamp Matching

Firestore returns `Timestamp` objects. Local types should reflect this or convert to `Date`.

```ts
import { Timestamp } from "firebase/firestore";

export interface MyType {
  id: string;
  createdAt: Timestamp;
  // ...
}
```

---

## CRUD Operations

### Create

Always include metadata like `createdAt`, `createdBy`, and `updatedAt` (or `lastActivity`).

```ts
import { addDoc, serverTimestamp } from "firebase/firestore";

export const createItem = async (data: Partial<MyType>) => {
  const colRef = getMyCollection();
  return await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
};
```

### Read (List)

Use `query` and `getDocs`.

```ts
import { query, orderBy, getDocs } from "firebase/firestore";

export const listItems = async () => {
  const q = query(getMyCollection(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
```

---

## Do / Don't

### ✅ Do

- Use `serverTimestamp()` for consistency.
- Keep business logic outside of the component.
- Use path aliases (e.g., `@/lib/...`).
- Export specific functions for each action.

### ❌ Don't

- Mix Firestore calls directly inside React components (use hooks).
- Hardcode collection names in multiple places.
- Ignore error handling (let the caller catch or handle specific cases).

---

## Verification & Evidence

### Verification

- [ ] Collection helper returns a typed reference.
- [ ] CRUD functions are exported and functional.
- [ ] TypeScript types match the Firestore schema.

### Evidence Format

1. **File Path**: The path to the Firestore module.
2. **Code Snippet**: The specific CRUD function being verified.
