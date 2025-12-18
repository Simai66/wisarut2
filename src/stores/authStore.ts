import { create } from 'zustand';
import type { User } from '@/types';
import { signInWithGoogle, signOut, onAuthStateChange } from '@/services/authService';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    error: string | null;
}

interface AuthActions {
    signIn: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    initializeAuth: () => () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
    // State
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    error: null,

    // Actions
    signIn: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = await signInWithGoogle();
            set({
                user,
                isAuthenticated: true,
                isAdmin: user.isAdmin,
                isLoading: false,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to sign in';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await signOut();
            set({
                user: null,
                isAuthenticated: false,
                isAdmin: false,
                isLoading: false,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to sign out';
            set({ error: message, isLoading: false });
            throw error;
        }
    },

    setUser: (user) => {
        set({
            user,
            isAuthenticated: !!user,
            isAdmin: user?.isAdmin ?? false,
        });
    },

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    initializeAuth: () => {
        const unsubscribe = onAuthStateChange((user) => {
            set({
                user,
                isAuthenticated: !!user,
                isAdmin: user?.isAdmin ?? false,
                isLoading: false,
            });
        });
        return unsubscribe;
    },
}));
