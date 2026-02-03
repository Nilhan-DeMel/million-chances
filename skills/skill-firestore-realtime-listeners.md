# Skill: Firestore Realtime Listeners

Standardizing the usage of `onSnapshot` for realtime data updates in React and TanStack Query contexts.

## Trigger

Use this skill when you need the UI to update automatically whenever data changes in Firestore (e.g., chat messages, shared status, live dashboards).

## Implementation Pattern

### 1. Basic Listener Module

Define the listener function in your firestore library. Always include an `onUpdate` callback and return an `unsubscribe` function.

```typescript
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";

export const listenToCollection = (
  path: string,
  constraints: QueryConstraint[],
  onUpdate: (data: any[]) => void,
) => {
  const q = query(collection(db, path), ...constraints);

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onUpdate(data);
    },
    (error) => {
      console.error("Snapshot error:", error);
    },
  );

  return unsubscribe;
};
```

### 2. React Hook with Cleanup

Wrap the listener in a `useEffect` to manage the lifecycle and prevent memory leaks.

```tsx
export function useRealtimeData(id: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToCollection(
      `parent/${id}/subcollection`,
      [orderBy("createdAt", "asc")],
      (newData) => {
        setData(newData);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [id]);

  return { data, loading };
}
```

### 3. TanStack Query Native Support (Advanced)

For deep integration with TanStack Query's cache and devtools:

```typescript
import { useQueryClient, useQuery } from "@tanstack/react-query";

export function useRealtimeQuery(id: string) {
  const queryClient = useQueryClient();
  const queryKey = ["data", id];

  useEffect(() => {
    const unsubscribe = listenToCollection(
      `parent/${id}/subcollection`,
      [orderBy("createdAt", "asc")],
      (newData) => {
        queryClient.setQueryData(queryKey, newData);
      },
    );

    return () => unsubscribe();
  }, [id, queryClient, queryKey]);

  return useQuery({
    queryKey,
    queryFn: () => fetchOnce(id), // Initial fetch or fallback
  });
}
```

## Best Practices

- **Cleanup**: Always return the `unsubscribe` function and call it in `useEffect` cleanup.
- **Ordering**: Ensure you use `orderBy()` in the query constraints to maintain a consistent UI state.
- **Error Handling**: Provide an error callback to `onSnapshot` to detect permission issues or network failures.
- **Complexity**: Avoid complex joins in listeners; Firestore snapshots are flat.

## Verification

1. Open the UI and manually edit a document in the Firebase Console.
2. Observe if the UI updates without a manual refresh.
3. Check the console for any "Snapshot error" logs.
