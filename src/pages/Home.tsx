import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePhotos } from '@/hooks/usePhotos';
import { ImageCard } from '@/components/gallery/ImageCard';
import { Lightbox } from '@/components/gallery/Lightbox';
import { useLightbox } from '@/hooks/useLightbox';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ROUTES } from '@/config/routes';
import { getHomeContent, defaultHomeContent, type HomeContent } from '@/services/contentService';

/**
 * Home page component
 */
export const Home = () => {
    const { featuredPhotos, isLoading: photosLoading, fetchFeaturedPhotos } = usePhotos();
    const lightbox = useLightbox();
    const [homeContent, setHomeContent] = useState<Omit<HomeContent, 'id' | 'updatedAt'>>(defaultHomeContent);
    const [isContentLoading, setIsContentLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedPhotos();

        // Fetch home page content
        const loadContent = async () => {
            try {
                const content = await getHomeContent();
                setHomeContent(content);
            } catch (error) {
                console.error('Error loading home content:', error);
            } finally {
                setIsContentLoading(false);
            }
        };
        loadContent();
    }, [fetchFeaturedPhotos]);

    const isLoading = photosLoading || isContentLoading;

    return (
        <Box>
            {/* Hero Section */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                sx={{
                    position: 'relative',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    overflow: 'hidden',
                }}
            >
                {/* Background Image */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${homeContent.heroBackgroundUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.4)',
                    }}
                />

                {/* Hero Content */}
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                letterSpacing: '-0.02em',
                                mb: 2,
                            }}
                        >
                            {homeContent.heroTitle}
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: 400,
                                mb: 4,
                                maxWidth: 600,
                                mx: 'auto',
                            }}
                        >
                            {homeContent.heroSubtitle}
                        </Typography>
                        <Button
                            component={RouterLink}
                            to={ROUTES.GALLERY}
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                borderRadius: '50px',
                            }}
                        >
                            {homeContent.heroButtonText}
                        </Button>
                    </motion.div>
                </Container>

                {/* Scroll Indicator */}
                <Box
                    component={motion.div}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    sx={{
                        position: 'absolute',
                        bottom: 40,
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Box
                        sx={{
                            width: 30,
                            height: 50,
                            border: '2px solid rgba(255,255,255,0.5)',
                            borderRadius: '15px',
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 1,
                        }}
                    >
                        <Box
                            component={motion.div}
                            animate={{ y: [0, 15, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.8)',
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* Featured Photos Section */}
            <Box sx={{ py: 10, backgroundColor: 'background.default' }}>
                <Container maxWidth="xl">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        sx={{ textAlign: 'center', mb: 6 }}
                    >
                        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                            {homeContent.featuredSectionSubtitle}
                        </Typography>
                        <Typography variant="h2" sx={{ mt: 1, fontWeight: 600 }}>
                            {homeContent.featuredSectionTitle}
                        </Typography>
                    </Box>

                    {isLoading ? (
                        <LoadingSkeleton variant="gallery" />
                    ) : (
                        <Grid container spacing={3}>
                            {featuredPhotos.map((photo, index) => (
                                <Grid item key={photo.id} xs={12} sm={6} md={4}>
                                    <ImageCard
                                        photo={photo}
                                        index={index}
                                        onClick={() => lightbox.open(featuredPhotos, index)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* View All Button */}
                    <Box sx={{ textAlign: 'center', mt: 6 }}>
                        <Button
                            component={RouterLink}
                            to={ROUTES.GALLERY}
                            variant="outlined"
                            size="large"
                            endIcon={<ArrowForward />}
                        >
                            View All Photos
                        </Button>
                    </Box>
                </Container>
            </Box>



            {/* Lightbox */}
            <Lightbox
                isOpen={lightbox.isOpen}
                photos={lightbox.photos}
                currentIndex={lightbox.currentIndex}
                onClose={lightbox.close}
                onNext={lightbox.next}
                onPrev={lightbox.prev}
            />
        </Box>
    );
};
