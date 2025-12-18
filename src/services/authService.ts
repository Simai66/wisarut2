import {
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isAdminEmail } from '@/config/firebase';
import type { User } from '@/types';

/**
 * Convert Firebase user to app user
 */
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    isAdmin: isAdminEmail(firebaseUser.email),
});

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    return convertFirebaseUser(result.user);
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): User | null => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;
    return convertFirebaseUser(firebaseUser);
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (
    callback: (user: User | null) => void
): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            callback(convertFirebaseUser(firebaseUser));
        } else {
            callback(null);
        }
    });
};
