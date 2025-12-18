import { useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/config/theme';
import { ROUTES } from '@/config/routes';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';

// Pages
import { Home, Gallery, AlbumDetail, About, Contact, Login, Admin } from '@/pages';

/**
 * Main App component
 */
function App() {
  const { darkMode } = useUIStore();
  const { initializeAuth } = useAuthStore();

  // Create theme based on dark mode
  const theme = useMemo(
    () => createAppTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  // Initialize auth on mount
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.GALLERY} element={<Gallery />} />
              <Route path={ROUTES.ALBUM} element={<AlbumDetail />} />
              <Route path={ROUTES.ABOUT} element={<About />} />
              <Route path={ROUTES.CONTACT} element={<Contact />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.ADMIN}
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
