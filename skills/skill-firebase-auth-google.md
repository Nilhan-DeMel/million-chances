# Skill: Firebase Authentication (Google Sign-In)

**Purpose**: Implement user authentication using Firebase Auth with Google as the primary provider.

**When to Use**: User login, signup, session management, protected routes.

---

## AG-Optimized Defaults

- **Provider**: Google Sign-In (primary)
- **Strategy**: Popup (better UX than redirect for desktop)
- **Session**: Persist auth state in localStorage (default)
- **Context**: Use React Context to share auth state app-wide
- **Protected Routes**: Middleware to guard authenticated pages
- **Environment Variables**: Store Firebase config in `.env.local`

---

## Installation

Firebase SDK is already installed. Additional setup:

```bash
# Ensure firebase is in package.json
npm install firebase
```

---

## Setup

### 1. Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2. Firebase Config (`src/lib/firebase.ts`)
```ts
import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
```

### 3. Auth Context (`src/context/AuthContext.tsx`)
```tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 4. Wrap App in Provider (`src/app/layout.tsx`)
```tsx
import { AuthProvider } from "@/context/AuthContext"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

---

## Usage Patterns

### Sign In Button
```tsx
"use client"

import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export default function SignInButton() {
  const { user, signInWithGoogle, logout } = useAuth()

  if (user) {
    return <Button onClick={logout}>Sign Out</Button>
  }

  return <Button onClick={signInWithGoogle}>Sign In with Google</Button>
}
```

### Protected Component
```tsx
"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) return <div>Loading...</div>
  if (!user) return null

  return <div>Protected content for {user.displayName}</div>
}
```

---

## Do / Don't

### ✅ Do
- Store Firebase config in environment variables
- Use popup for Google Sign-In (better UX)
- Listen to auth state changes with `onAuthStateChanged`
- Show loading states while checking auth
- Handle errors (user cancels popup, network issues)

### ❌ Don't
- Hardcode Firebase credentials in source code
- Commit `.env.local` to git (add to .gitignore)
- Trust client-side auth alone - always verify in security rules
- Forget to unsubscribe from auth listeners
- Use redirect for Google Sign-In (unless mobile-specific)

---

## Verification

- [ ] Firebase config is in environment variables
- [ ] AuthContext wraps the entire app
- [ ] Google Sign-In popup works
- [ ] User state persists across page reloads
- [ ] Sign out works correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] No Firebase credentials in source code

---

## Evidence to Provide Nilhan

1. **Environment setup**: Confirm `.env.local` exists (don't paste keys)
2. **Sign-in flow**: Screenshot or screen recording of Google Sign-In popup
3. **Authenticated state**: Screenshot showing user's name/email after login
4. **Persistence**: Reload page and confirm user stays logged in
5. **Sign out**: Screenshot showing sign-out button works

---

## Official Documentation

- Firebase Auth: https://firebase.google.com/docs/auth
- Google Sign-In: https://firebase.google.com/docs/auth/web/google-signin
- Firebase with Next.js: https://firebase.google.com/docs/web/setup
