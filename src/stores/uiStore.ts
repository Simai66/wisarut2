import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Photo } from '@/types';

interface UIState {
    darkMode: boolean;
    lightboxOpen: boolean;
    lightboxPhotos: Photo[];
    currentPhotoIndex: number;
    sidebarOpen: boolean;
    snackbar: {
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    };
}

interface UIActions {
    toggleDarkMode: () => void;
    setDarkMode: (darkMode: boolean) => void;
    openLightbox: (photos: Photo[], index: number) => void;
    closeLightbox: () => void;
    nextPhoto: () => void;
    prevPhoto: () => void;
    goToPhoto: (index: number) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    showSnackbar: (message: string, severity?: UIState['snackbar']['severity']) => void;
    hideSnackbar: () => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
    persist(
        (set, get) => ({
            // State
            darkMode: true, // Default to dark mode for photography portfolio
            lightboxOpen: false,
            lightboxPhotos: [],
            currentPhotoIndex: 0,
            sidebarOpen: false,
            snackbar: {
                open: false,
                message: '',
                severity: 'info',
            },

            // Actions
            toggleDarkMode: () => {
                set((state) => ({ darkMode: !state.darkMode }));
            },

            setDarkMode: (darkMode) => set({ darkMode }),

            openLightbox: (photos, index) => {
                set({
                    lightboxOpen: true,
                    lightboxPhotos: photos,
                    currentPhotoIndex: index,
                });
            },

            closeLightbox: () => {
                set({
                    lightboxOpen: false,
                    lightboxPhotos: [],
                    currentPhotoIndex: 0,
                });
            },

            nextPhoto: () => {
                const { currentPhotoIndex, lightboxPhotos } = get();
                if (currentPhotoIndex < lightboxPhotos.length - 1) {
                    set({ currentPhotoIndex: currentPhotoIndex + 1 });
                }
            },

            prevPhoto: () => {
                const { currentPhotoIndex } = get();
                if (currentPhotoIndex > 0) {
                    set({ currentPhotoIndex: currentPhotoIndex - 1 });
                }
            },

            goToPhoto: (index) => {
                const { lightboxPhotos } = get();
                if (index >= 0 && index < lightboxPhotos.length) {
                    set({ currentPhotoIndex: index });
                }
            },

            toggleSidebar: () => {
                set((state) => ({ sidebarOpen: !state.sidebarOpen }));
            },

            setSidebarOpen: (open) => set({ sidebarOpen: open }),

            showSnackbar: (message, severity = 'info') => {
                set({
                    snackbar: { open: true, message, severity },
                });
            },

            hideSnackbar: () => {
                set((state) => ({
                    snackbar: { ...state.snackbar, open: false },
                }));
            },
        }),
        {
            name: 'ui-storage',
            partialize: (state) => ({ darkMode: state.darkMode }),
        }
    )
);
