import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/uiStore';
import type { Photo } from '@/types';

/**
 * Hook for controlling the lightbox
 */
export const useLightbox = () => {
    const {
        lightboxOpen,
        lightboxPhotos,
        currentPhotoIndex,
        openLightbox,
        closeLightbox,
        nextPhoto,
        prevPhoto,
        goToPhoto,
    } = useUIStore();

    // Current photo being displayed
    const currentPhoto = lightboxPhotos[currentPhotoIndex] ?? null;

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!lightboxOpen) return;

            switch (event.key) {
                case 'ArrowRight':
                    nextPhoto();
                    break;
                case 'ArrowLeft':
                    prevPhoto();
                    break;
                case 'Escape':
                    closeLightbox();
                    break;
            }
        },
        [lightboxOpen, nextPhoto, prevPhoto, closeLightbox]
    );

    // Add keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [lightboxOpen]);

    const open = useCallback(
        (photos: Photo[], index: number) => {
            openLightbox(photos, index);
        },
        [openLightbox]
    );

    return {
        isOpen: lightboxOpen,
        photos: lightboxPhotos,
        currentIndex: currentPhotoIndex,
        currentPhoto,
        hasNext: currentPhotoIndex < lightboxPhotos.length - 1,
        hasPrev: currentPhotoIndex > 0,
        open,
        close: closeLightbox,
        next: nextPhoto,
        prev: prevPhoto,
        goTo: goToPhoto,
    };
};
