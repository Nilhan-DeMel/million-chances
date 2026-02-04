import { initializeApp, getApps, getApp } from "firebase/app";

// Chunk A: Use explicit literal reads for all NEXT_PUBLIC variables
// Next.js needs these to be statically analyzable to inline them into the client bundle.
export const FIREBASE_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

// Guard: Warn if environment variables are missing (development only)
if (typeof window !== "undefined") {
    const missingKeys: string[] = [];
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingKeys.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_APP_ID");

    if (missingKeys.length > 0) {
        const errorMsg = `⚠️ Missing Firebase environment variables: ${missingKeys.join(", ")}. Check your .env.local file.`;
        
        if (process.env.NODE_ENV === "production") {
            // Critical check for production
            if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
                throw new Error(`CRITICAL: Missing Firebase environment variables: ${missingKeys.filter(k => k.includes('API_KEY') || k.includes('PROJECT_ID')).join(", ")}`);
            }
        } else if (process.env.NODE_ENV === "development") {
            console.warn(errorMsg);
        }
    }
}

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

export { app };
