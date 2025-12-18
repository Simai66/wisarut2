import { create } from 'zustand';
import type { Photo, Album, GalleryFilters } from '@/types';
import {
    getPhotos,
    getPhotosByAlbum,
    searchPhotos,
} from '@/services/photoService';
import { getAlbums } from '@/services/albumService';

interface GalleryState {
    photos: Photo[];
    albums: Album[];
    featuredPhotos: Photo[];
    filters: GalleryFilters;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    lastDoc: null;  // No longer using Firestore pagination
}

interface GalleryActions {
    fetchPhotos: (reset?: boolean) => Promise<void>;
    fetchAlbums: (includePrivate?: boolean) => Promise<void>;
    fetchFeaturedPhotos: () => Promise<void>;
    setFilters: (filters: Partial<GalleryFilters>) => void;
    clearFilters: () => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

type GalleryStore = GalleryState & GalleryActions;

const initialFilters: GalleryFilters = {
    albumId: null,
    searchQuery: '',
    tags: [],
};

export const useGalleryStore = create<GalleryStore>((set, get) => ({
    // State
    photos: [],
    albums: [],
    featuredPhotos: [],
    filters: initialFilters,
    isLoading: false,
    error: null,
    hasMore: true,
    lastDoc: null,

    // Actions
    fetchPhotos: async (reset = false) => {
        const { filters, lastDoc, photos } = get();

        if (reset) {
            set({ photos: [], lastDoc: null, hasMore: true });
        }

        set({ isLoading: true, error: null });

        try {
            let result: { photos: Photo[]; lastDoc: null };

            // If there's a search query, use search
            if (filters.searchQuery) {
                const searchResults = await searchPhotos(filters.searchQuery);
                // Filter by album if specified
                const filtered = filters.albumId
                    ? searchResults.filter((p) => p.albumId === filters.albumId)
                    : searchResults;
                set({
                    photos: filtered,
                    isLoading: false,
                    hasMore: false,
                    lastDoc: null,
                });
                return;
            }

            // If album filter is set
            if (filters.albumId) {
                result = await getPhotosByAlbum(
                    filters.albumId,
                    20,
                    reset ? undefined : (lastDoc ?? undefined)
                );
            } else {
                // Get all photos
                result = await getPhotos(20, reset ? undefined : (lastDoc ?? undefined));
            }

            set({
                photos: reset ? result.photos : [...photos, ...result.photos],
                lastDoc: result.lastDoc,
                hasMore: result.photos.length === 20,
                isLoading: false,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch photos';
            set({ error: message, isLoading: false });
        }
    },

    fetchAlbums: async (includePrivate = false) => {
        set({ isLoading: true, error: null });

        try {
            const albums = await getAlbums(includePrivate);
            set({ albums, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch albums';
            set({ error: message, isLoading: false });
        }
    },

    fetchFeaturedPhotos: async () => {
        set({ isLoading: true, error: null });

        try {
            const result = await getPhotos(6);
            set({ featuredPhotos: result.photos, isLoading: false });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch featured photos';
            set({ error: message, isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }));
    },

    clearFilters: () => {
        set({ filters: initialFilters });
    },

    setError: (error) => set({ error }),

    reset: () => {
        set({
            photos: [],
            lastDoc: null,
            hasMore: true,
            filters: initialFilters,
        });
    },
}));
