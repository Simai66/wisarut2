import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';

/**
 * Get theme configuration based on mode
 */
const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#ffffff' : '#000000',
            light: mode === 'dark' ? '#ffffff' : '#333333',
            dark: mode === 'dark' ? '#cccccc' : '#000000',
            contrastText: mode === 'dark' ? '#000000' : '#ffffff',
        },
        secondary: {
            main: '#9e9e9e',
            light: '#cfcfcf',
            dark: '#707070',
        },
        background: {
            default: mode === 'dark' ? '#0a0a0a' : '#fafafa',
            paper: mode === 'dark' ? '#141414' : '#ffffff',
        },
        text: {
            primary: mode === 'dark' ? '#ffffff' : '#000000',
            secondary: mode === 'dark' ? '#a0a0a0' : '#666666',
        },
        divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(128, 128, 128, 0.5)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'rgba(128, 128, 128, 0.2)',
                },
            },
        },
    },
});

/**
 * Create theme for light or dark mode
 */
export const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));

/**
 * Default light theme
 */
export const lightTheme = createAppTheme('light');

/**
 * Default dark theme
 */
export const darkTheme = createAppTheme('dark');
