import { ReactNode } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useUIStore } from '@/stores/uiStore';

interface LayoutProps {
    children: ReactNode;
    hideFooter?: boolean;
}

/**
 * Main layout wrapper component
 */
export const Layout = ({ children, hideFooter = false }: LayoutProps) => {
    const { snackbar, hideSnackbar } = useUIStore();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <Navbar />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    pt: { xs: 7, md: 8 }, // Account for fixed navbar
                }}
            >
                {children}
            </Box>

            {/* Footer */}
            {!hideFooter && <Footer />}

            {/* Global Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={hideSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{ top: { xs: 80, sm: 90 } }} // Avoid overlap with Navbar
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%', boxShadow: 3 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
