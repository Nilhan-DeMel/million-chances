# Skill: TanStack Query (React Query)

**Purpose**: Manage server state, caching, and data synchronization with Firebase or APIs.

**When to Use**: Fetching data from Firebase, caching user data, managing loading/error states, real-time syncing.

---

## AG-Optimized Defaults

- **Library**: @tanstack/react-query v5
- **DevTools**: Enabled in development
- **Cache Time**: 5 minutes (default)
- **Stale Time**: 1 minute (configurable per query)
- **Refetch**: On window focus (disabled for real-time Firebase listeners)
- **Firebase Integration**: Use with `onSnapshot` for real-time data

---

## Installation

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

---

## Setup

### 1. Query Client Provider (`src/app/layout.tsx`)
```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

---

## Usage Patterns

### Fetch Data (One-Time)
```tsx
import { useQuery } from "@tanstack/react-query"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useWorkMemories(userId: string) {
  return useQuery({
    queryKey: ['workMemories', userId],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'workMemories'))
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    },
    enabled: !!userId, // Only run if userId exists
  })
}

// In component
function MemoriesList() {
  const { data, isLoading, error } = useWorkMemories('user123')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data?.map(memory => (
        <li key={memory.id}>{memory.title}</li>
      ))}
    </ul>
  )
}
```

### Real-Time Data (Firebase onSnapshot)
```tsx
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useEffect } from "react"

export function useRealtimeMemories(userId: string) {
  const queryClient = useQueryClient()
  const queryKey = ['workMemories', userId]

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'workMemories'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        queryClient.setQueryData(queryKey, data)
      }
    )
    return unsubscribe
  }, [userId, queryClient, queryKey])

  return useQuery({
    queryKey,
    queryFn: () => [], // Initial data
    refetchOnWindowFocus: false,
  })
}
```

### Mutations (Create/Update/Delete)
```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { userId: string; title: string }) => {
      const docRef = await addDoc(collection(db, 'workMemories'), {
        ...data,
        createdAt: new Date(),
      })
      return docRef.id
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['workMemories'] })
    },
  })
}

// In component
function CreateMemoryForm() {
  const createMemory = useCreateMemory()

  const handleSubmit = () => {
    createMemory.mutate({ userId: 'user123', title: 'New Memory' })
  }

  return (
    <button onClick={handleSubmit} disabled={createMemory.isPending}>
      {createMemory.isPending ? 'Creating...' : 'Create Memory'}
    </button>
  )
}
```

---

## Do / Don't

### ✅ Do
- Use query keys that include all variables (`['memories', userId]`)
- Invalidate queries after mutations
- Use `enabled` option to conditionally run queries
- Use DevTools in development to debug cache
- Handle loading and error states in components
- Use `refetchOnWindowFocus: false` for real-time Firebase listeners

### ❌ Don't
- Forget to wrap app in `QueryClientProvider`
- Use the same query key for different data
- Mutate cache directly (use `setQueryData` or `invalidateQueries`)
- Fetch data in `useEffect` when you can use `useQuery`
- Skip error handling
- Enable window focus refetch for real-time listeners

---

## Verification

- [ ] `@tanstack/react-query` is installed
- [ ] `QueryClientProvider` wraps the app
- [ ] DevTools are visible in development
- [ ] At least one `useQuery` hook works
- [ ] Mutations invalidate cache correctly
- [ ] Loading and error states are handled

---

## Evidence to Provide Nilhan

1. **Installation**: `package.json` snippet showing TanStack Query
2. **Setup**: Paste `QueryClientProvider` from `layout.tsx`
3. **Working query**: Screenshot showing data loaded via TanStack Query
4. **DevTools**: Screenshot of React Query DevTools panel
5. **Code example**: Paste one custom hook using `useQuery`

---

## Official Documentation

- TanStack Query: https://tanstack.com/query/latest
- Firebase with React Query: https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching
