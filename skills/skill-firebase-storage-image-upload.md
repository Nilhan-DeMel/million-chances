# Skill: Firebase Storage Image Upload

**Purpose**: Standardize image uploads to Firebase Storage with progress tracking, metadata handling, and secure retrieval patterns.

**When to Use**: Whenever you need to upload an image from the client to Firebase Storage.

---

## AG-Optimized Defaults

- **Library**: `firebase/storage`
- **Method**: `uploadBytesResumable` for progress tracking.
- **Metadata**: Always include `contentType` to ensure proper browser rendering.
- **Pathing**: `imageCards/{cardId}/original/{uuid}.{ext}` (or as defined in `storage.rules`).
- **Persistence**: **DO NOT persist downloadURL in Firestore**. Store only the `storagePath`.

---

## Usage Patterns

### 1. Upload Helper

```ts
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "./client";

const storage = getStorage(app);

export const uploadImage = (
  path: string,
  file: File,
  onProgress?: (progress: number) => void,
) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      () => {
        // Return the storage path for persistence
        resolve(path);
      },
    );
  });
};
```

### 2. Retrieval Hook (React)

```tsx
import { useQuery } from "@tanstack/react-query";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export function useStorageUrl(storagePath: string | null | undefined) {
  const storage = getStorage();

  return useQuery({
    queryKey: ["storageUrl", storagePath],
    queryFn: async () => {
      if (!storagePath) return null;
      return await getDownloadURL(ref(storage, storagePath));
    },
    enabled: !!storagePath,
    staleTime: 1000 * 60 * 60, // URLs are valid for a while
  });
}
```

---

## ⚠️ Security Warning: No Persistent URLs

**Never write the `downloadURL` (the one with the token) to Firestore.**

- Tokens can be revoked.
- Persisting URLs makes rotation impossible.
- Store only the `storagePath` (e.g., `imageCards/123/original/abc.jpg`).
- Use `getDownloadURL` on-the-fly or via cached hooks.

---

## Verification & Evidence

### Verification

- [ ] Upload shows a progress bar or percentage.
- [ ] File is visible in Firebase Console under the correct path.
- [ ] Firestore document contains `storagePath`, NOT `downloadURL`.
- [ ] Image renders in UI after upload completes.

### Evidence Format

1. **Console Check**: Screenshot of Firebase Storage showing the file path.
2. **Code Snippet**: The call to `uploadBytesResumable`.
3. **Firestore Check**: Screenshot or JSON of the card document showing `storagePath`.
