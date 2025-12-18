/**
 * User entity representing an authenticated user
 */
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAdmin: boolean;
}

/**
 * Auth state for the application
 */
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
}
