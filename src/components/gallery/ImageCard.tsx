import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
// PlayArrow removed as it is no longer used
import type { Photo } from '@/types';

interface ImageCardProps {
    photo: Photo;
    index: number;
    onClick: () => void;
}

/**
 * Image card component for gallery grid
 */
export const ImageCard = ({ photo, index, onClick }: ImageCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const getVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = photo.mediaType === 'video' && photo.youtubeUrl ? getVideoId(photo.youtubeUrl) : null;

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                mb: 2,
                aspectRatio: photo.width && photo.height ? `${photo.width}/${photo.height}` : '3/2',
                willChange: 'transform, opacity',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            {/* Loading Skeleton */}
            {!isLoaded && (
                <Skeleton
                    variant="rectangular"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 2,
                    }}
                />
            )}

            {/* Image (Background - shown for non-videos or while loading) */}
            <Box
                component="img"
                src={photo.url || photo.thumbnail}
                alt={photo.title}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    transform: isHovered && !videoId ? 'scale(1.03)' : 'scale(1)',
                    opacity: isLoaded ? 1 : 0,
                    willChange: 'transform',
                }}
            />

            {/* Video Autoplay (Always) */}
            {videoId && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 5,
                        bgcolor: 'black',
                    }}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&start=0&rel=0&modestbranding=1&playlist=${videoId}&loop=1&playsinline=1`}
                        title={photo.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style={{
                            display: 'block',
                            pointerEvents: 'none', // Pass clicks to parent to open Lightbox
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </Box>
            )}

            {/* Hover Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2,
                    zIndex: 20,
                    pointerEvents: 'none',
                }}
            >
                <Box
                    component={motion.div}
                    initial={false}
                    animate={{
                        y: isHovered ? 0 : 10,
                        opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <Box
                        component="span"
                        sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '1rem',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {photo.title}
                    </Box>
                    {photo.concept && (
                        <Box
                            component="span"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '0.875rem',
                                display: 'block',
                                mt: 0.5,
                                lineHeight: 1.4,
                            }}
                        >
                            {photo.concept}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
