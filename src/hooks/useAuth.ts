import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for accessing auth state and actions
 */
export const useAuth = () => {
    const {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        error,
        signIn,
        logout,
        initializeAuth,
    } = useAuthStore();

    // Initialize auth listener on mount
    useEffect(() => {
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, [initializeAuth]);

    return {
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        error,
        signIn,
        logout,
    };
};
