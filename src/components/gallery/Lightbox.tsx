import { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo } from '@/types';

interface LightboxProps {
    isOpen: boolean;
    photos: Photo[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

/**
 * Full-screen image lightbox viewer
 */
export const Lightbox = ({
    isOpen,
    photos,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}: LightboxProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [touchStart, setTouchStart] = useState<number | null>(null);

    const currentPhoto = photos[currentIndex];
    const hasNext = currentIndex < photos.length - 1;
    const hasPrev = currentIndex > 0;

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowRight':
                    if (hasNext) onNext();
                    break;
                case 'ArrowLeft':
                    if (hasPrev) onPrev();
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, hasNext, hasPrev, onNext, onPrev, onClose]);

    // Handle touch swipe
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStart(e.touches[0]?.clientX ?? null);
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStart === null) return;

            const touchEnd = e.changedTouches[0]?.clientX ?? 0;
            const diff = touchStart - touchEnd;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && hasNext) {
                    onNext();
                } else if (diff < 0 && hasPrev) {
                    onPrev();
                }
            }

            setTouchStart(null);
        },
        [touchStart, hasNext, hasPrev, onNext, onPrev]
    );

    if (!currentPhoto) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            color: 'white',
                            zIndex: 10,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <Close fontSize="large" />
                    </IconButton>

                    {/* Navigation Buttons */}
                    {!isMobile && (
                        <>
                            <IconButton
                                onClick={onPrev}
                                disabled={!hasPrev}
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    color: 'white',
                                    opacity: hasPrev ? 1 : 0.3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <ChevronLeft fontSize="large" />
                            </IconButton>
                            <IconButton
                                onClick={onNext}
                                disabled={!hasNext}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    color: 'white',
                                    opacity: hasNext ? 1 : 0.3,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <ChevronRight fontSize="large" />
                            </IconButton>
                        </>
                    )}

                    {/* Image */}
                    <AnimatePresence mode="wait">
                        <Box
                            component={motion.div}
                            key={currentPhoto.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            sx={{
                                maxWidth: '90vw',
                                maxHeight: '85vh',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Box
                                component="img"
                                src={currentPhoto.url}
                                alt={currentPhoto.title}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                    borderRadius: 1,
                                }}
                            />

                            {/* Photo Info */}
                            <Box sx={{ mt: 2, textAlign: 'center', color: 'white' }}>
                                <Typography variant="h6">{currentPhoto.title}</Typography>
                                {currentPhoto.description && (
                                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                        {currentPhoto.description}
                                    </Typography>
                                )}
                                <Typography variant="caption" sx={{ opacity: 0.6, mt: 1, display: 'block' }}>
                                    {currentIndex + 1} / {photos.length}
                                </Typography>
                            </Box>
                        </Box>
                    </AnimatePresence>
                </Box>
            )}
        </AnimatePresence>
    );
};
