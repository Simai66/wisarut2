/**
 * Application route configuration
 */
export const ROUTES = {
    HOME: '/',
    GALLERY: '/gallery',
    ALBUM: '/album/:albumId',
    ABOUT: '/about',
    CONTACT: '/contact',
    LOGIN: '/login',
    ADMIN: '/admin',
} as const;

/**
 * Get album route with ID
 */
export const getAlbumRoute = (albumId: string): string => `/album/${albumId}`;

/**
 * Navigation items for main menu
 */
export const NAV_ITEMS = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Gallery', path: ROUTES.GALLERY },
    { label: 'About', path: ROUTES.ABOUT },
    { label: 'Contact', path: ROUTES.CONTACT },
] as const;

/**
 * Admin navigation items
 */
export const ADMIN_NAV_ITEMS = [
    { label: 'Dashboard', path: ROUTES.ADMIN },
] as const;
