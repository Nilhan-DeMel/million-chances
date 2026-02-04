"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function EnvBanner() {
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const envKeys = [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ];

    const missingKeys = envKeys.filter((key) => !process.env[key]);
    
    // We update in a timeout to avoid cascading render lint error
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
        <span className="opacity-90">{missing.length} environment variables failed to load.</span>
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
