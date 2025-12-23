import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AlbumCard } from '@/components/gallery/AlbumCard';
import { useAlbums } from '@/hooks/useAlbums';
import { getAlbumRoute } from '@/config/routes';

/**
 * Gallery page component - Shows albums for selection
 */
export const Gallery = () => {
    // useAlbums already fetches on mount - no need for additional useEffect
    const { albums, isLoading, error, refetch } = useAlbums();
    const navigate = useNavigate();

    const handleAlbumClick = (albumId: string) => {
        navigate(getAlbumRoute(albumId));
    };

    // Show loading state
    if (isLoading && albums.length === 0) {
        return (
            <Box
                sx={{
                    height: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // Show error state with retry
    if (error && albums.length === 0) {
        return (
            <Box
                sx={{
                    height: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    gap: 2,
                }}
            >
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={() => refetch()}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    // Filter only public albums
    const publicAlbums = albums.filter(album => album.isPublic);

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    sx={{ textAlign: 'center', mb: 6 }}
                >
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                        Portfolio
                    </Typography>
                    <Typography variant="h2" sx={{ mt: 1, fontWeight: 600 }}>
                        Photo Gallery
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                        Select an album to explore the collection
                    </Typography>
                </Box>

                {/* Album Grid */}
                <Grid container spacing={3}>
                    {publicAlbums.map((album, index) => (
                        <Grid item key={album.id} xs={12} sm={6} md={4} lg={3}>
                            <AlbumCard
                                album={album}
                                index={index}
                                onClick={() => handleAlbumClick(album.id)}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* Empty State */}
                {!isLoading && publicAlbums.length === 0 && !error && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary">
                            No albums available yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Check back soon for new content
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};
