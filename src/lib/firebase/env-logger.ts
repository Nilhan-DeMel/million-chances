// This file is intended to run on the server side only during initialization.
export function logEnvironmentStatus() {
  if (typeof window !== 'undefined') return;

  const keys = {
    apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const allLoaded = Object.values(keys).every(v => v);

  console.log('-------------------------------------------');
  console.log(`[SERVER] Million Chances Env Status: ${allLoaded ? '✅ ALL LOADED' : '❌ SOME MISSING'}`);
  if (!allLoaded) {
    Object.entries(keys).forEach(([key, loaded]) => {
      if (!loaded) console.warn(`[SERVER] Missing: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`);
    });
  }
  console.log('-------------------------------------------');
}
