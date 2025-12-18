import { useEffect } from 'react';
import { useGalleryStore } from '@/stores/galleryStore';

/**
 * Hook for fetching and managing albums
 */
export const useAlbums = (includePrivate = false) => {
    const { albums, isLoading, error, fetchAlbums } = useGalleryStore();

    useEffect(() => {
        fetchAlbums(includePrivate);
    }, [includePrivate, fetchAlbums]);

    return {
        albums,
        isLoading,
        error,
        refetch: () => fetchAlbums(includePrivate),
    };
};
