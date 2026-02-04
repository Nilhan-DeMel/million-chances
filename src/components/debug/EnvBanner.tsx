"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function EnvBanner() {
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Use explicit literals for check
    const missingKeys: string[] = [];
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingKeys.push("NEXT_PUBLIC_FIREBASE_API_KEY");
    if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingKeys.push("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingKeys.push("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
    if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
    if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingKeys.push("NEXT_PUBLIC_FIREBASE_APP_ID");
    
    // We update in a timeout to avoid cascading render lint warning
    const timer = setTimeout(() => {
      setMissing(missingKeys);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (missing.length === 0) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm sticky top-0 z-[9999] shadow-lg">
      <div className="flex items-center gap-2">
        <span className="font-bold">⚠️ FIREBASE CONFIG MISSING:</span>
        <span className="opacity-90">{missing.length} keys failed to load. (Inlining error?)</span>
      </div>
      <Link 
        href="/debug/firebase" 
        className="bg-white text-red-600 px-3 py-1 rounded font-bold hover:bg-gray-100 transition-colors"
      >
        Diagnostics →
      </Link>
    </div>
  );
}
