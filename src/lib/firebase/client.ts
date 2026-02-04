import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Guard: Warn if environment variables are missing (development only)
if (typeof window !== "undefined") {
    const requiredEnvVars = [
        "NEXT_PUBLIC_FIREBASE_API_KEY",
        "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        "NEXT_PUBLIC_FIREBASE_APP_ID",
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingEnvVars.length > 0) {
        const errorMsg = `⚠️ Missing Firebase environment variables: ${missingEnvVars.join(", ")}. Check your .env.local file.`;
        
        if (process.env.NODE_ENV === "production") {
            // In production, some keys might be missing if they are optional, 
            // but usually we want at least API_KEY and PROJECT_ID.
            const criticalKeys = ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"];
            const missingCritical = criticalKeys.filter(key => !process.env[key]);
            if (missingCritical.length > 0) {
                throw new Error(`CRITICAL: Missing Firebase environment variables: ${missingCritical.join(", ")}`);
            }
        } else if (process.env.NODE_ENV === "development") {
            console.warn(errorMsg);
        }
    }
}

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export { app };
