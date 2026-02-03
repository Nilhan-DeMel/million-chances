import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from "firebase/auth";
import { app } from "./client";

// Initialize Firebase Auth
export const auth = getAuth(app);

// Configure Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Sign in with Google using popup
 */
export const loginWithGoogle = async (): Promise<User> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: unknown) {
        // Handle specific error codes
        if (error && typeof error === 'object' && 'code' in error) {
            const err = error as { code: string };
            if (err.code === 'auth/popup-blocked') {
                throw new Error('Popup was blocked by the browser. Please allow popups for this site.');
            } else if (err.code === 'auth/popup-closed-by-user') {
                throw new Error('Sign-in was cancelled.');
            } else if (err.code === 'auth/cancelled-popup-request') {
                // Multiple popups attempted, this is expected behavior
                throw new Error('Another sign-in is in progress.');
            }
        }
        throw error;
    }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

/**
 * Listen to auth state changes
 */
export { onAuthStateChanged, type User };
