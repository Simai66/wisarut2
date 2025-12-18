import { useMemo, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/config/theme';
import { ROUTES } from '@/config/routes';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { initializeDefaultContent, getHomeContent } from '@/services/contentService';

// Pages
import { Home, Gallery, AlbumDetail, About, Contact, Login, Admin } from '@/pages';

/**
 * Main App component
 */
function App() {
  const { darkMode } = useUIStore();
  const { initializeAuth } = useAuthStore();
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(undefined);

  // Load primary color on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const content = await getHomeContent();
        if (content.primaryColor) {
          setPrimaryColor(content.primaryColor);
        }
      } catch (e) {
        console.error('Failed to load theme color:', e);
      }
    };
    loadTheme();
  }, []);

  // Create theme based on dark mode and primary color
  const theme = useMemo(
    () => createAppTheme(darkMode ? 'dark' : 'light', primaryColor),
    [darkMode, primaryColor]
  );

  // Initialize auth on mount
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  // Best-effort: seed About/Contact docs in Firestore if missing.
  // If Firestore is unreachable, this will fail silently and the UI will fall back.
  useEffect(() => {
    const contentSource = (import.meta.env.VITE_CONTENT_SOURCE as string | undefined)?.toLowerCase() || 'firestore';
    if (contentSource !== 'firestore') return;

    initializeDefaultContent().catch(() => {
      // ignore
    });
  }, []);

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
