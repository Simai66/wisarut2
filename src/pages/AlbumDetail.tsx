import { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Button, Breadcrumbs, Link } from '@mui/material';
import { ArrowBack, NavigateNext } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { Lightbox } from '@/components/gallery/Lightbox';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useLightbox } from '@/hooks/useLightbox';
import { getAlbumById } from '@/services/albumService';
import { getPhotosByAlbum } from '@/services/photoService';
import { ROUTES } from '@/config/routes';
import type { Album, Photo } from '@/types';

/**
 * Album detail page component
 */
export const AlbumDetail = () => {
    const { albumId } = useParams<{ albumId: string }>();
    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const lightbox = useLightbox();

    useEffect(() => {
        const fetchData = async () => {
            if (!albumId) return;

            setIsLoading(true);
            setError(null);

            try {
                const [albumData, photosData] = await Promise.all([
                    getAlbumById(albumId),
                    getPhotosByAlbum(albumId),
                ]);

                setAlbum(albumData);
                setPhotos(photosData.photos);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load album');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [albumId]);

    const handlePhotoClick = useCallback(
        (index: number) => {
            lightbox.open(photos, index);
        },
        [lightbox, photos]
    );

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <LoadingSkeleton variant="text" />
                <Box sx={{ mt: 4 }}>
                    <LoadingSkeleton variant="gallery" />
                </Box>
            </Container>
        );
    }

    if (error || !album) {
        return (
            <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Album Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {error || 'The album you are looking for does not exist.'}
                </Typography>
                <Button
                    component={RouterLink}
                    to={ROUTES.GALLERY}
                    variant="contained"
                    startIcon={<ArrowBack />}
                >
                    Back to Gallery
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNext fontSize="small" />}
                    sx={{ mb: 4 }}
                >
                    <Link
                        component={RouterLink}
                        to={ROUTES.HOME}
                        color="inherit"
                        underline="hover"
                    >
                        Home
                    </Link>
                    <Link
                        component={RouterLink}
                        to={ROUTES.GALLERY}
                        color="inherit"
                        underline="hover"
                    >
                        Gallery
                    </Link>
                    <Typography color="text.primary">{album.name}</Typography>
                </Breadcrumbs>

                {/* Album Header */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{ mb: 6 }}
                >
                    {album.coverUrl && (
                        <Box
                            sx={{
                                height: { xs: 200, md: 300 },
                                borderRadius: 2,
                                overflow: 'hidden',
                                mb: 4,
                            }}
                        >
                            <Box
                                component="img"
                                src={album.coverUrl}
                                alt={album.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    )}

                    <Typography variant="h2" sx={{ fontWeight: 600 }}>
                        {album.name}
                    </Typography>
                    {album.description && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 2, maxWidth: 800 }}
                        >
                            {album.description}
                        </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {photos.length} photos
                    </Typography>
                </Box>

                {/* Single Item Layout - large media with concept below */}
                {photos.length === 1 ? (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{ maxWidth: '1000px', mx: 'auto' }}
                    >
                        {photos[0].mediaType === 'video' && photos[0].youtubeUrl ? (
                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    mb: 3,
                                }}
                            >
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${photos[0].youtubeUrl.match(/(?:youtu\.be\/|v=)([^&]+)/)?.[1]}?autoplay=1&mute=1&rel=0`}
                                    title={photos[0].title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </Box>
                        ) : (
                            <Box
                                component="img"
                                src={photos[0].url}
                                alt={photos[0].title}
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    mb: 3,
                                }}
                            />
                        )}
                        {photos[0].concept && (
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.8,
                                    textAlign: 'center',
                                }}
                            >
                                {photos[0].concept}
                            </Typography>
                        )}
                    </Box>
                ) : (
                    <>
                        {/* Multi-item: Photos Grid */}
                        <MasonryGallery
                            photos={photos}
                            isLoading={isLoading}
                            onPhotoClick={handlePhotoClick}
                        />

                        {/* Empty State */}
                        {!isLoading && photos.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h5" color="text.secondary">
                                    No photos in this album yet
                                </Typography>
                            </Box>
                        )}
                    </>
                )}

                {/* Lightbox */}
                <Lightbox
                    isOpen={lightbox.isOpen}
                    photos={lightbox.photos}
                    currentIndex={lightbox.currentIndex}
                    onClose={lightbox.close}
                    onNext={lightbox.next}
                    onPrev={lightbox.prev}
                />
            </Container>
        </Box>
    );
};
