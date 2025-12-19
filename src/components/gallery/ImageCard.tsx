import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
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

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                mb: 2,
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

            {/* Image */}
            <Box
                component="img"
                src={photo.url}
                alt={photo.title}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                sx={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    transition: 'transform 0.5s ease, filter 0.3s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    opacity: isLoaded ? 1 : 0,
                }}
            />

            {/* Hover Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: 2,
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
                    {photo.description && (
                        <Box
                            component="span"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.875rem',
                                display: 'block',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                mt: 0.5,
                            }}
                        >
                            {photo.description}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
