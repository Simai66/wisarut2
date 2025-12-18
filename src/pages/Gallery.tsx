import { useEffect, useCallback } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { SearchBar } from '@/components/gallery/SearchBar';
import { AlbumFilter } from '@/components/gallery/AlbumFilter';
import { Lightbox } from '@/components/gallery/Lightbox';
import { usePhotos } from '@/hooks/usePhotos';
import { useAlbums } from '@/hooks/useAlbums';
import { useLightbox } from '@/hooks/useLightbox';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

/**
 * Gallery page component
 */
export const Gallery = () => {
    const {
        photos,
        filters,
        isLoading,
        hasMore,
        loadMore,
        applyFilters,
        fetchPhotos,
    } = usePhotos();
    const { albums } = useAlbums();
    const lightbox = useLightbox();

    // Infinite scroll
    const { loadMoreRef } = useInfiniteScroll({
        loading: isLoading,
        hasMore,
        onLoadMore: loadMore,
    });

    // Initial fetch
    useEffect(() => {
        fetchPhotos(true);
    }, [fetchPhotos]);

    const handleSearch = useCallback(
        (query: string) => {
            applyFilters({ searchQuery: query });
        },
        [applyFilters]
    );

    const handleAlbumChange = useCallback(
        (albumId: string | null) => {
            applyFilters({ albumId });
        },
        [applyFilters]
    );

    const handlePhotoClick = useCallback(
        (index: number) => {
            lightbox.open(photos, index);
        },
        [lightbox, photos]
    );

    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{ textAlign: 'center', mb: 6 }}
                >
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                        Portfolio
                    </Typography>
                    <Typography variant="h2" sx={{ mt: 1, fontWeight: 600 }}>
                        Photo Gallery
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
                        Explore my collection of photographs. Use the search and filter options to find what you're looking for.
                    </Typography>
                </Box>

                {/* Filters */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    sx={{ mb: 4 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <SearchBar
                                onSearch={handleSearch}
                                initialValue={filters.searchQuery}
                                placeholder="Search by title or tags..."
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AlbumFilter
                                albums={albums}
                                selectedAlbumId={filters.albumId}
                                onAlbumChange={handleAlbumChange}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Gallery Grid */}
                <MasonryGallery
                    photos={photos}
                    isLoading={isLoading}
                    onPhotoClick={handlePhotoClick}
                    loadMoreRef={loadMoreRef}
                    hasMore={hasMore}
                />

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
