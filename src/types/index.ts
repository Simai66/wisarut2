// Re-export all types
export * from './photo';
export * from './album';
export * from './user';
export * from './content';

/**
 * Generic API response
 */
export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
    page: number;
    limit: number;
    hasMore: boolean;
    total: number;
}

/**
 * Filter options for gallery
 */
export interface GalleryFilters {
    albumId: string | null;
    searchQuery: string;
    tags: string[];
}

/**
 * Contact form data
 */
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}
