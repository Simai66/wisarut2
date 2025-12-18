import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress,
} from '@mui/material';
import { Email, Phone, LocationOn, Send } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getContactContent } from '@/services/contentService';
import type { ContactFormData, ContactContent } from '@/types';
import { defaultContactContent } from '@/types/content';

/**
 * Contact page component with dynamic content
 */
export const Contact = () => {
    // Render instantly with defaults; then hydrate from Firestore in background.
    const [content, setContent] = useState<ContactContent>(() => ({
        ...defaultContactContent,
        id: 'contact',
        updatedAt: new Date(),
    }));
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await getContactContent();
                setContent(data);
            } catch {
                // keep defaults
            }
        };
        fetchContent();
    }, []);

    const handleChange = (field: keyof ContactFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // In production, you would send this to your backend or Firebase
            console.log('Form submitted:', formData);

            setSubmitStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Email />,
            label: 'Email',
            value: content.email,
            href: `mailto:${content.email}`,
        },
        {
            icon: <Phone />,
            label: 'Phone',
            value: content.phone,
            href: `tel:${content.phone.replace(/[^+\d]/g, '')}`,
        },
        {
            icon: <LocationOn />,
            label: 'Location',
            value: content.location,
            href: '#',
        },
    ];

    return (
        <Box sx={{ py: 4 }}>
            {/* Header */}
            <Box
                sx={{
                    position: 'relative',
                    height: { xs: 200, md: 300 },
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

            <Container maxWidth="lg">
                <Grid container spacing={6}>
                    {/* Contact Form */}
                    <Grid item xs={12} md={7}>
                        <Paper
                            component={motion.form}
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            elevation={0}
                            sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 2 }}
                        >
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Send a Message
                            </Typography>

                            {submitStatus === 'success' && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Thank you! Your message has been sent successfully.
                                </Alert>
                            )}

                            {submitStatus === 'error' && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    Something went wrong. Please try again.
                                </Alert>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Your Name"
                                        value={formData.name}
                                        onChange={handleChange('name')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange('email')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        value={formData.subject}
                                        onChange={handleChange('subject')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        multiline
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange('message')}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={isSubmitting}
                                        endIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                                        sx={{ px: 4 }}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={5}>
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Contact Information
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                Feel free to reach out through any of the following channels. I typically respond within 24 hours.
                            </Typography>

                            {contactInfo.map((item, index) => (
                                <Box
                                    key={item.label}
                                    component={motion.a}
                                    href={item.href}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        mb: 3,
                                        textDecoration: 'none',
                                        color: 'text.primary',
                                        '&:hover': {
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            border: 1,
                                            borderColor: 'divider',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.label}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}

                            {/* Business Hours */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mt: 4,
                                    border: 1,
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Business Hours
                                </Typography>
                                {content.businessHours.map((hours, index) => (
                                    <Typography key={index} variant="body2" color="text.secondary">
                                        {hours.days}: {hours.hours}
                                    </Typography>
                                ))}
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
