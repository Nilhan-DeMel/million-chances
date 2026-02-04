"use client";

import { useEffect, useState } from "react";
import { app, FIREBASE_CONFIG } from "@/lib/firebase/client";

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

    // Use explicit literals for check (to match what Next.js inlines)
    const missing: string[] = [];
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missing.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missing.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missing.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missing.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missing.push("NEXT_PUBLIC_FIREBASE_APP_ID");
    
    // We update in a timeout to avoid cascading render lint warning
    const timer = setTimeout(() => {
      setStatus({
        isDevelopment: isDev,
        missingCount: missing.length,
        missingKeys: missing,
        projectId: FIREBASE_CONFIG.projectId || "MISSING",
        storageBucket: FIREBASE_CONFIG.storageBucket || "MISSING",
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
      <div className="flex items-center justify-between border-b pb-2">
        <h1 className="text-2xl font-bold text-indigo-600">Firebase Diagnostics</h1>
        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold animate-pulse">
          RESTART REQUIRED AFTER .ENV CHANGES
        </div>
      </div>
      
      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">Environment Load (Literal Checks)</h2>
        <div className={`p-4 rounded border ${status.missingCount === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="font-bold text-lg">
            {status.missingCount === 0 ? "✅ 0 Keys Missing" : `❌ ${status.missingCount} Keys Missing`}
          </p>
          <p className="text-xs text-gray-500 mt-1">Note: We use static literals for these checks to ensure Next.js inlining is working.</p>
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
        <h2 className="text-lg font-semibold border-l-4 border-indigo-500 pl-2">Config Object (FIREBASE_CONFIG)</h2>
        <div className="bg-gray-50 p-4 rounded border space-y-1 text-sm">
          <p><span className="text-gray-500">Project ID:</span> {status.projectId}</p>
          <p><span className="text-gray-500">Storage Bucket:</span> {status.storageBucket}</p>
          <p><span className="text-gray-500">Firebase App:</span> {status.firebaseInitialized ? "INITIALIZED" : "FAILED"}</p>
        </div>
      </section>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
        <strong>Troubleshooting Tip:</strong> If keys show as missing but they exist in .env.local, run <code>scripts/dev-restart.ps1</code> to kill all orphaned node processes.
      </div>
    </div>
  );
}
