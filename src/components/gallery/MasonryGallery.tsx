import { Box, Container, CircularProgress } from '@mui/material';
import Masonry from 'react-masonry-css';
import { ImageCard } from './ImageCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import type { Photo } from '@/types';

interface MasonryGalleryProps {
    photos: Photo[];
    isLoading: boolean;
    onPhotoClick: (index: number) => void;
    loadMoreRef?: React.RefObject<HTMLDivElement | null>;
    hasMore?: boolean;
}

// Breakpoints for masonry columns
const breakpointColumns = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1,
};

/**
 * Masonry gallery grid component
 */
export const MasonryGallery = ({
    photos,
    isLoading,
    onPhotoClick,
    loadMoreRef,
    hasMore,
}: MasonryGalleryProps) => {
    // Show skeleton on initial load
    if (isLoading && photos.length === 0) {
        return (
            <Container maxWidth="xl">
                <LoadingSkeleton variant="gallery" />
            </Container>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Masonry
                breakpointCols={breakpointColumns}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
            >
                {photos.map((photo, index) => (
                    <ImageCard
                        key={photo.id}
                        photo={photo}
                        index={index}
                        onClick={() => onPhotoClick(index)}
                    />
                ))}
            </Masonry>

            {/* Load More Trigger */}
            {loadMoreRef && hasMore && (
                <Box
                    ref={loadMoreRef}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        py: 4,
                    }}
                >
                    {isLoading && <CircularProgress size={32} />}
                </Box>
            )}

            {/* Empty State */}
            {!isLoading && photos.length === 0 && (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        color: 'text.secondary',
                    }}
                >
                    No photos found
                </Box>
            )}

            {/* Masonry Grid Styles */}
            <style>{`
        .masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }
        .masonry-grid-column {
          padding-left: 16px;
          background-clip: padding-box;
        }
      `}</style>
        </Box>
    );
};
