import { useEffect, useCallback } from 'react';
import { useGalleryStore } from '@/stores/galleryStore';
import type { GalleryFilters } from '@/types';

/**
 * Hook for fetching and filtering photos
 */
export const usePhotos = () => {
    const {
        photos,
        featuredPhotos,
        filters,
        isLoading,
        error,
        hasMore,
        fetchPhotos,
        fetchFeaturedPhotos,
        setFilters,
        clearFilters,
    } = useGalleryStore();

    // Load more photos (for infinite scroll)
    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchPhotos(false);
        }
    }, [isLoading, hasMore, fetchPhotos]);

    // Apply new filters and refetch
    const applyFilters = useCallback(
        (newFilters: Partial<GalleryFilters>) => {
            setFilters(newFilters);
        },
        [setFilters]
    );

    // Refetch when filters change
    useEffect(() => {
        fetchPhotos(true);
    }, [filters.albumId, filters.searchQuery, fetchPhotos]);

    return {
        photos,
        featuredPhotos,
        filters,
        isLoading,
        error,
        hasMore,
        loadMore,
        applyFilters,
        clearFilters,
        fetchPhotos,
        fetchFeaturedPhotos,
    };
};
