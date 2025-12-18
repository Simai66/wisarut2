import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper, CircularProgress } from '@mui/material';
import { Google } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';

interface LocationState {
    from?: { pathname: string };
}

/**
 * Login page component
 */
export const Login = () => {
    const { isAuthenticated, isLoading, signIn, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as LocationState)?.from?.pathname || ROUTES.HOME;

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleSignIn = async () => {
        try {
            await signIn();
        } catch {
            // Error is handled in the store
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        textAlign: 'center',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, mb: 1 }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Sign in to access the admin dashboard
                    </Typography>

                    {error && (
                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                borderRadius: 1,
                                backgroundColor: 'error.light',
                                color: 'error.contrastText',
                            }}
                        >
                            <Typography variant="body2">{error}</Typography>
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSignIn}
                        disabled={isLoading}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <Google />
                            )
                        }
                        sx={{
                            py: 1.5,
                            fontSize: '1rem',
                            backgroundColor: '#4285f4',
                            '&:hover': {
                                backgroundColor: '#3367d6',
                            },
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Continue with Google'}
                    </Button>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 3, display: 'block' }}
                    >
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};
