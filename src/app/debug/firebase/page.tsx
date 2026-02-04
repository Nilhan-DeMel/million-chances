"use client";

import { useEffect, useState } from "react";
import { app } from "@/lib/firebase/client";

interface FirebaseStatus {
  isDevelopment: boolean;
  missingCount: number;
  missingKeys: string[];
  projectId: string;
  storageBucket: string;
  firebaseInitialized: boolean;
}

export default function FirebaseDebugPage() {
  const [status, setStatus] = useState<FirebaseStatus | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!isDev) return;

    const envKeys = [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ];

    const missing = envKeys.filter((key) => !process.env[key]);
    
    // We update in a timeout to avoid cascading render lint error
    const timer = setTimeout(() => {
      setStatus({
        isDevelopment: isDev,
        missingCount: missing.length,
        missingKeys: missing,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "MISSING",
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "MISSING",
        firebaseInitialized: !!app,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [isDev]);

  if (!isDev) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">404 - Not Found</h1>
      </div>
    );
  }

  if (!status) return <div className="p-8">Loading diagnostics...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 font-mono">
      <h1 className="text-2xl font-bold border-b pb-2 text-indigo-600">Firebase Diagnostics</h1>
      
      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">Environment Load</h2>
        <div className={`p-4 rounded border ${status.missingCount === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="font-bold text-lg">
            {status.missingCount === 0 ? "✅ All Keys Loaded" : `❌ ${status.missingCount} Keys Missing`}
          </p>
          {status.missingKeys.length > 0 && (
            <ul className="list-disc list-inside mt-2 text-sm text-red-700">
              {status.missingKeys.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">Public config</h2>
        <div className="bg-gray-50 p-4 rounded border space-y-1 text-sm">
          <p><span className="text-gray-500">Project ID:</span> {status.projectId}</p>
          <p><span className="text-gray-500">Storage Bucket:</span> {status.storageBucket}</p>
          <p><span className="text-gray-500">Initialized:</span> {status.firebaseInitialized ? "YES" : "NO"}</p>
        </div>
      </section>

      <div className="text-xs text-gray-400 italic">
        * This page is only visible in development mode. Secrets are redacted.
      </div>
    </div>
  );
}
