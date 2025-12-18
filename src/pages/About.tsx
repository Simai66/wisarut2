import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Chip, Paper, CircularProgress } from '@mui/material';
import { CameraAlt, Landscape, Portrait, LocationOn } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getAboutContent } from '@/services/contentService';
import type { AboutContent } from '@/types';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
    camera: <CameraAlt />,
    portrait: <Portrait />,
    landscape: <Landscape />,
    location: <LocationOn />,
};

/**
 * About page component with dynamic content
 */
export const About = () => {
    const [content, setContent] = useState<AboutContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getAboutContent();
                setContent(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!content) return null;

    return (
        <Box sx={{ py: 4 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 300, md: 400 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 6,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${content.heroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.3)',
                    }}
                />
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: { xs: '2.5rem', md: '3.5rem' },
                            }}
                        >
                            {content.title}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{ color: 'rgba(255,255,255,0.8)', mt: 2 }}
                        >
                            {content.subtitle}
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            {/* Bio Section */}
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Box
                                component="img"
                                src={content.profileImage}
                                alt="Photographer Portrait"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                                My Story
                            </Typography>
                            <Typography variant="h3" sx={{ mt: 1, mb: 3, fontWeight: 600 }}>
                                {content.storyTitle}
                            </Typography>
                            {content.storyContent.map((paragraph, index) => (
                                <Typography
                                    key={index}
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mb: 2, lineHeight: 1.8 }}
                                >
                                    {paragraph}
                                </Typography>
                            ))}

                            {/* Skills */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 3 }}>
                                {content.skills.map((skill) => (
                                    <Chip
                                        key={skill}
                                        label={skill}
                                        variant="outlined"
                                        size="medium"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Stats Section */}
                <Box sx={{ py: 8 }}>
                    <Grid container spacing={3}>
                        {content.stats.map((stat, index) => (
                            <Grid item key={stat.label} xs={6} md={3}>
                                <Paper
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: 1,
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main', mb: 1 }}>
                                        {iconMap[stat.icon] || <CameraAlt />}
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Equipment Section */}
                <Box sx={{ py: 4 }}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, textAlign: 'center' }}>
                        My Equipment
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {content.equipment.map((item, index) => (
                            <Grid item key={item.name} xs={6} sm={3}>
                                <Paper
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        border: 1,
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                    }}
                                >
                                    <CameraAlt sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.type}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};
