import { Box, Container, Typography, IconButton, Link as MuiLink } from '@mui/material';
import { Instagram, Twitter, Facebook } from '@mui/icons-material';
import { motion } from 'framer-motion';

/**
 * Footer component
 */
export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <Instagram />, href: '#', label: 'Instagram' },
        { icon: <Twitter />, href: '#', label: 'Twitter' },
        { icon: <Facebook />, href: '#', label: 'Facebook' },
    ];

    return (
        <Box
            component={motion.footer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            sx={{
                py: 6,
                mt: 'auto',
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    {/* Logo and Copyright */}
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, letterSpacing: '0.1em', mb: 1 }}
                        >
                            PHOTO GALLERY
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            © {currentYear} All rights reserved.
                        </Typography>
                    </Box>

                    {/* Social Links */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {socialLinks.map((social) => (
                            <IconButton
                                key={social.label}
                                component={MuiLink}
                                href={social.href}
                                aria-label={social.label}
                                sx={{
                                    color: 'text.secondary',
                                    transition: 'transform 0.2s, color 0.2s',
                                    '&:hover': {
                                        color: 'primary.main',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                {social.icon}
                            </IconButton>
                        ))}
                    </Box>

                    {/* Quick Links */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <MuiLink
                                key={item}
                                href="#"
                                underline="hover"
                                color="text.secondary"
                                sx={{
                                    fontSize: '0.875rem',
                                    '&:hover': { color: 'text.primary' },
                                }}
                            >
                                {item}
                            </MuiLink>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};
