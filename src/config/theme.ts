import { createTheme, ThemeOptions, PaletteMode } from '@mui/material';

/**
 * Adjust a hex color by a percentage (-100 to 100)
 */
const adjustColor = (hex: string, percent: number): string => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse RGB
    const num = parseInt(hex, 16);
    let r = (num >> 16) + Math.round((percent / 100) * 255);
    let g = ((num >> 8) & 0x00FF) + Math.round((percent / 100) * 255);
    let b = (num & 0x0000FF) + Math.round((percent / 100) * 255);

    // Clamp values
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
};

/**
 * Check if color is light (for contrast text)
 */
const isLightColor = (hex: string): boolean => {
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    const r = (num >> 16);
    const g = ((num >> 8) & 0x00FF);
    const b = (num & 0x0000FF);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance > 186;
};

/**
 * Get theme configuration based on mode and primary color
 */
const getThemeOptions = (mode: PaletteMode, primaryColor?: string): ThemeOptions => {
    const primary = primaryColor || '#D4AF37';  // Default gold

    return {
        palette: {
            mode,
            primary: {
                main: primary,
                light: adjustColor(primary, 15),
                dark: adjustColor(primary, -15),
                contrastText: isLightColor(primary) ? '#000000' : '#ffffff',
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
    };
};

/**
 * Create theme for light or dark mode with optional primary color
 */
export const createAppTheme = (mode: PaletteMode, primaryColor?: string) =>
    createTheme(getThemeOptions(mode, primaryColor));

/**
 * Default light theme
 */
export const lightTheme = createAppTheme('light');

/**
 * Default dark theme
 */
export const darkTheme = createAppTheme('dark');
