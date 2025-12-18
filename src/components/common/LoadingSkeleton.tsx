import { Skeleton, Box, Grid } from '@mui/material';

interface LoadingSkeletonProps {
    variant?: 'image' | 'card' | 'text' | 'gallery';
    count?: number;
}

/**
 * Loading skeleton for different content types
 */
export const LoadingSkeleton = ({
    variant = 'image',
    count = 1,
}: LoadingSkeletonProps) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'image':
                return (
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        sx={{
                            aspectRatio: '4/3',
                            borderRadius: 2,
                        }}
                    />
                );

            case 'card':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            sx={{
                                aspectRatio: '4/3',
                                borderRadius: 2,
                                mb: 1,
                            }}
                        />
                        <Skeleton variant="text" width="80%" height={24} />
                        <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                );

            case 'text':
                return (
                    <Box sx={{ width: '100%' }}>
                        <Skeleton variant="text" width="100%" height={24} />
                        <Skeleton variant="text" width="90%" height={24} />
                        <Skeleton variant="text" width="70%" height={24} />
                    </Box>
                );

            case 'gallery':
                return (
                    <Grid container spacing={2}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid item key={i} xs={12} sm={6} md={4}>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    sx={{
                                        aspectRatio: '4/3',
                                        borderRadius: 2,
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                );

            default:
                return null;
        }
    };

    if (count === 1) {
        return renderSkeleton();
    }

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    {renderSkeleton()}
                </Box>
            ))}
        </>
    );
};
