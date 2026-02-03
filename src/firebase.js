// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your project's config object
// You can get this from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "REDACTED_PUBLIC_FIREBASE_WEB_KEY",
    authDomain: "million-chances-now.firebaseapp.com",
    projectId: "million-chances-now",
    storageBucket: "million-chances-now.firebasestorage.app",
    messagingSenderId: "964512207059",
    appId: "1:964512207059:web:0ecab63ef4d0ac5c318426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
