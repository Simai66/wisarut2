import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import type { Album } from '@/types';

interface AlbumCardProps {
    album: Album;
    index: number;
    onClick: () => void;
}

/**
 * Album card component for gallery album selection
 */
export const AlbumCard = ({ album, index, onClick }: AlbumCardProps) => {
    return (
        <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            elevation={0}
            onClick={onClick}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                aspectRatio: '16/10',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                    borderColor: 'primary.main',
                    '& .album-overlay': {
                        opacity: 1,
                    },
                    '& .album-image': {
                        transform: 'scale(1.05)',
                    },
                },
            }}
        >
            {/* Cover Image */}
            <Box
                className="album-image"
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: album.coverUrl
                        ? `url(${album.coverUrl})`
                        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.5s ease',
                }}
            />

            {/* Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                }}
            />

            {/* Content */}
            <Box
                className="album-overlay"
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2.5,
                    transition: 'opacity 0.3s ease',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 0.5,
                    }}
                >
                    {album.name}
                </Typography>
                {album.description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {album.description}
                    </Typography>
                )}
                {album.photoCount !== undefined && album.photoCount > 0 && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255,255,255,0.5)',
                            mt: 1,
                            display: 'block',
                        }}
                    >
                        {album.photoCount} {album.photoCount === 1 ? 'item' : 'items'}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};
