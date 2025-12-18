import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/config/routes';

interface ProtectedRouteProps {
    children: ReactNode;
    requireAdmin?: boolean;
}

/**
 * Protected route component for authentication
 */
export const ProtectedRoute = ({
    children,
    requireAdmin = false,
}: ProtectedRouteProps) => {
    const { isAuthenticated, isAdmin, isLoading } = useAuthStore();
    const location = useLocation();

    // Show loading state
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    gap: 2,
                }}
            >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                    Checking authentication...
                </Typography>
            </Box>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    textAlign: 'center',
                    p: 4,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    You don't have permission to access this page.
                </Typography>
            </Box>
        );
    }

    return <>{children}</>;
};
