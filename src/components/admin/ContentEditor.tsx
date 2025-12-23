import { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Grid,
    CircularProgress,
    Alert,
    Collapse,
} from '@mui/material';
import { ExpandMore, Add, Delete, Save, Close } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
    getAboutContent,
    updateAboutContent,
    getContactContent,
    updateContactContent,
    getHomeContent,
    updateHomeContent,
    type HomeContent,
} from '@/services/contentService';
import type { AboutContent, ContactContent } from '@/types';
import { useUIStore } from '@/stores/uiStore';

/**
 * Admin content editor for About and Contact pages
 */
export const ContentEditor = () => {
    const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
    const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
    const [contactContent, setContactContent] = useState<ContactContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [actionStatus, setActionStatus] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({ open: false, message: '', severity: 'info' });

    const { showSnackbar } = useUIStore();

    const setFeedback = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
        setActionStatus({ open: true, message, severity });
        showSnackbar(message, severity);
    };

    const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;

    // Fetch content on mount
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [home, about, contact] = await Promise.all([
                    getHomeContent(),
                    getAboutContent(),
                    getContactContent(),
                ]);
                setHomeContent(home);
                setAboutContent(about);
                setContactContent(contact);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load content';
                setError(message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleSaveHome = async () => {
        if (!homeContent) return;
        setIsSaving(true);
        setActionStatus(prev => ({ ...prev, open: false }));
        try {
            await updateHomeContent(homeContent);
            setFeedback('Home page updated successfully', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save home content';
            setFeedback(message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveAbout = async () => {
        if (!aboutContent) return;
        setIsSaving(true);
        setActionStatus(prev => ({ ...prev, open: false }));
        try {
            await updateAboutContent(aboutContent);
            setFeedback('About page updated successfully', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save about content';
            setFeedback(message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveContact = async () => {
        if (!contactContent) return;
        setIsSaving(true);
        setActionStatus(prev => ({ ...prev, open: false }));
        try {
            await updateContactContent(contactContent);
            setFeedback('Contact page updated successfully', 'success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save contact content';
            setFeedback(message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
                Edit Page Content
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Content source: Cloudflare D1 API{firebaseProjectId ? ` • Firebase Auth Project: ${firebaseProjectId}` : ''}
            </Typography>

            {/* Persistent Feedback Alert */}
            <Box sx={{ mb: 3 }}>
                <Collapse in={actionStatus.open}>
                    <Alert
                        severity={actionStatus.severity}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setActionStatus(prev => ({ ...prev, open: false }));
                                }}
                            >
                                <Close fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2, boxShadow: 1 }}
                    >
                        {actionStatus.message}
                    </Alert>
                </Collapse>
            </Box>

            {/* Home Page Editor */}
            <Accordion
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ mb: 2 }}
            >
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Home Page</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {homeContent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Site Name"
                                fullWidth
                                value={homeContent.siteName}
                                onChange={(e) => setHomeContent({ ...homeContent, siteName: e.target.value })}
                                helperText="Displays in navbar and footer (e.g., PHOTO GALLERY)"
                            />
                            <TextField
                                label="Hero Title"
                                fullWidth
                                value={homeContent.heroTitle}
                                onChange={(e) => setHomeContent({ ...homeContent, heroTitle: e.target.value })}
                                helperText="Main headline on the home page"
                            />
                            <TextField
                                label="Hero Subtitle"
                                fullWidth
                                multiline
                                rows={2}
                                value={homeContent.heroSubtitle}
                                onChange={(e) => setHomeContent({ ...homeContent, heroSubtitle: e.target.value })}
                                helperText="Description text below the title"
                            />
                            <TextField
                                label="Hero Background URL (Image or Video)"
                                fullWidth
                                value={homeContent.heroBackgroundUrl}
                                onChange={(e) => setHomeContent({ ...homeContent, heroBackgroundUrl: e.target.value })}
                                helperText="URL of image or YouTube/MP4 video for hero background"
                            />
                            <TextField
                                label="Hero Button Text"
                                fullWidth
                                value={homeContent.heroButtonText}
                                onChange={(e) => setHomeContent({ ...homeContent, heroButtonText: e.target.value })}
                                helperText="Text for the main call-to-action button"
                            />
                            <TextField
                                label="Featured Section Title"
                                fullWidth
                                value={homeContent.featuredSectionTitle}
                                onChange={(e) => setHomeContent({ ...homeContent, featuredSectionTitle: e.target.value })}
                            />
                            <TextField
                                label="Featured Section Subtitle"
                                fullWidth
                                value={homeContent.featuredSectionSubtitle}
                                onChange={(e) => setHomeContent({ ...homeContent, featuredSectionSubtitle: e.target.value })}
                            />

                            {/* Social Links */}
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                                Social Links
                            </Typography>
                            <TextField
                                label="Instagram URL"
                                fullWidth
                                value={homeContent.instagramUrl || ''}
                                onChange={(e) => setHomeContent({ ...homeContent, instagramUrl: e.target.value })}
                                placeholder="https://instagram.com/yourprofile"
                            />
                            <TextField
                                label="Twitter URL"
                                fullWidth
                                value={homeContent.twitterUrl || ''}
                                onChange={(e) => setHomeContent({ ...homeContent, twitterUrl: e.target.value })}
                                placeholder="https://twitter.com/yourprofile"
                            />
                            <TextField
                                label="Facebook URL"
                                fullWidth
                                value={homeContent.facebookUrl || ''}
                                onChange={(e) => setHomeContent({ ...homeContent, facebookUrl: e.target.value })}
                                placeholder="https://facebook.com/yourprofile"
                            />

                            {/* Theme Settings */}
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                                Theme Settings
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <TextField
                                    label="Primary Color"
                                    value={homeContent.primaryColor || '#D4AF37'}
                                    onChange={(e) => setHomeContent({ ...homeContent, primaryColor: e.target.value })}
                                    helperText="Hex color code (e.g., #D4AF37)"
                                    sx={{ flex: 1 }}
                                />
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 1,
                                        backgroundColor: homeContent.primaryColor || '#D4AF37',
                                        border: '2px solid',
                                        borderColor: 'divider',
                                    }}
                                />
                                <input
                                    type="color"
                                    value={homeContent.primaryColor || '#D4AF37'}
                                    onChange={(e) => setHomeContent({ ...homeContent, primaryColor: e.target.value })}
                                    style={{ width: 48, height: 48, cursor: 'pointer', border: 'none' }}
                                />
                            </Box>

                            {/* ImgBB Settings */}
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
                                ImgBB Settings
                            </Typography>
                            <TextField
                                label="ImgBB API Key"
                                fullWidth
                                type="password"
                                value={homeContent.imgbbApiKey || ''}
                                onChange={(e) => setHomeContent({ ...homeContent, imgbbApiKey: e.target.value })}
                                helperText="Get your API key from https://api.imgbb.com/"
                            />

                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveHome}
                                disabled={isSaving}
                                sx={{ alignSelf: 'flex-start', mt: 2 }}
                            >
                                {isSaving ? 'Saving...' : 'Save Home Page'}
                            </Button>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* About Page Editor */}
            <Accordion
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                defaultExpanded
            >
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">About Page</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {aboutContent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Page Title"
                                fullWidth
                                value={aboutContent.title}
                                onChange={(e) =>
                                    setAboutContent({ ...aboutContent, title: e.target.value })
                                }
                            />
                            <TextField
                                label="Subtitle"
                                fullWidth
                                value={aboutContent.subtitle}
                                onChange={(e) =>
                                    setAboutContent({ ...aboutContent, subtitle: e.target.value })
                                }
                            />
                            <TextField
                                label="Hero Image URL"
                                fullWidth
                                value={aboutContent.heroImage}
                                onChange={(e) =>
                                    setAboutContent({ ...aboutContent, heroImage: e.target.value })
                                }
                            />
                            <TextField
                                label="Profile Image URL"
                                fullWidth
                                value={aboutContent.profileImage}
                                onChange={(e) =>
                                    setAboutContent({ ...aboutContent, profileImage: e.target.value })
                                }
                            />
                            <TextField
                                label="Story Title"
                                fullWidth
                                value={aboutContent.storyTitle}
                                onChange={(e) =>
                                    setAboutContent({ ...aboutContent, storyTitle: e.target.value })
                                }
                            />

                            {/* Story Paragraphs */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Story Paragraphs
                            </Typography>
                            {aboutContent.storyContent.map((paragraph, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={paragraph}
                                        onChange={(e) => {
                                            const newContent = [...aboutContent.storyContent];
                                            newContent[index] = e.target.value;
                                            setAboutContent({ ...aboutContent, storyContent: newContent });
                                        }}
                                    />
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            const newContent = aboutContent.storyContent.filter(
                                                (_, i) => i !== index
                                            );
                                            setAboutContent({ ...aboutContent, storyContent: newContent });
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    setAboutContent({
                                        ...aboutContent,
                                        storyContent: [...aboutContent.storyContent, ''],
                                    })
                                }
                            >
                                Add Paragraph
                            </Button>

                            {/* Skills */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Skills (comma separated)
                            </Typography>
                            <TextField
                                fullWidth
                                value={aboutContent.skills.join(', ')}
                                onChange={(e) =>
                                    setAboutContent({
                                        ...aboutContent,
                                        skills: e.target.value.split(',').map((s) => s.trim()),
                                    })
                                }
                                helperText="Enter skills separated by commas"
                            />

                            {/* Stats */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Stats
                            </Typography>
                            {aboutContent.stats.map((stat, index) => (
                                <Grid container key={index} spacing={1} alignItems="center">
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Value"
                                            value={stat.value}
                                            onChange={(e) => {
                                                const newStats = [...aboutContent.stats];
                                                newStats[index] = { ...stat, value: e.target.value };
                                                setAboutContent({ ...aboutContent, stats: newStats });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <TextField
                                            fullWidth
                                            label="Label"
                                            value={stat.label}
                                            onChange={(e) => {
                                                const newStats = [...aboutContent.stats];
                                                newStats[index] = { ...stat, label: e.target.value };
                                                setAboutContent({ ...aboutContent, stats: newStats });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                const newStats = aboutContent.stats.filter(
                                                    (_, i) => i !== index
                                                );
                                                setAboutContent({ ...aboutContent, stats: newStats });
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    setAboutContent({
                                        ...aboutContent,
                                        stats: [
                                            ...aboutContent.stats,
                                            { icon: 'camera', value: '', label: '' },
                                        ],
                                    })
                                }
                            >
                                Add Stat
                            </Button>

                            {/* Equipment */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Equipment
                            </Typography>
                            {aboutContent.equipment.map((item, index) => (
                                <Grid container key={index} spacing={1} alignItems="center">
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newEquipment = [...aboutContent.equipment];
                                                newEquipment[index] = { ...item, name: e.target.value };
                                                setAboutContent({ ...aboutContent, equipment: newEquipment });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Type"
                                            value={item.type}
                                            onChange={(e) => {
                                                const newEquipment = [...aboutContent.equipment];
                                                newEquipment[index] = { ...item, type: e.target.value };
                                                setAboutContent({ ...aboutContent, equipment: newEquipment });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                const newEquipment = aboutContent.equipment.filter(
                                                    (_, i) => i !== index
                                                );
                                                setAboutContent({ ...aboutContent, equipment: newEquipment });
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    setAboutContent({
                                        ...aboutContent,
                                        equipment: [...aboutContent.equipment, { name: '', type: '' }],
                                    })
                                }
                            >
                                Add Equipment
                            </Button>

                            {/* Save Button */}
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                                    onClick={handleSaveAbout}
                                    disabled={isSaving}
                                >
                                    Save About Page
                                </Button>
                            </Box>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>

            {/* Contact Page Editor */}
            <Accordion
                component={motion.div}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                sx={{ mt: 2 }}
            >
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Contact Page</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {contactContent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Page Title"
                                fullWidth
                                value={contactContent.title}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, title: e.target.value })
                                }
                            />
                            <TextField
                                label="Subtitle"
                                fullWidth
                                value={contactContent.subtitle}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, subtitle: e.target.value })
                                }
                            />
                            <TextField
                                label="Hero Image URL"
                                fullWidth
                                value={contactContent.heroImage}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, heroImage: e.target.value })
                                }
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                value={contactContent.email}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, email: e.target.value })
                                }
                            />
                            <TextField
                                label="Phone"
                                fullWidth
                                value={contactContent.phone}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, phone: e.target.value })
                                }
                            />
                            <TextField
                                label="Location"
                                fullWidth
                                value={contactContent.location}
                                onChange={(e) =>
                                    setContactContent({ ...contactContent, location: e.target.value })
                                }
                            />

                            {/* Business Hours */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Business Hours
                            </Typography>
                            {contactContent.businessHours.map((hours, index) => (
                                <Grid container key={index} spacing={1} alignItems="center">
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Days"
                                            value={hours.days}
                                            onChange={(e) => {
                                                const newHours = [...contactContent.businessHours];
                                                newHours[index] = { ...hours, days: e.target.value };
                                                setContactContent({ ...contactContent, businessHours: newHours });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <TextField
                                            fullWidth
                                            label="Hours"
                                            value={hours.hours}
                                            onChange={(e) => {
                                                const newHours = [...contactContent.businessHours];
                                                newHours[index] = { ...hours, hours: e.target.value };
                                                setContactContent({ ...contactContent, businessHours: newHours });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                const newHours = contactContent.businessHours.filter(
                                                    (_, i) => i !== index
                                                );
                                                setContactContent({ ...contactContent, businessHours: newHours });
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    setContactContent({
                                        ...contactContent,
                                        businessHours: [
                                            ...contactContent.businessHours,
                                            { days: '', hours: '' },
                                        ],
                                    })
                                }
                            >
                                Add Hours
                            </Button>

                            {/* Social Links */}
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>
                                Social Links
                            </Typography>
                            {contactContent.socialLinks.map((link, index) => (
                                <Grid container key={index} spacing={1} alignItems="center">
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            label="Platform"
                                            value={link.platform}
                                            onChange={(e) => {
                                                const newLinks = [...contactContent.socialLinks];
                                                newLinks[index] = { ...link, platform: e.target.value };
                                                setContactContent({ ...contactContent, socialLinks: newLinks });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <TextField
                                            fullWidth
                                            label="URL"
                                            value={link.url}
                                            onChange={(e) => {
                                                const newLinks = [...contactContent.socialLinks];
                                                newLinks[index] = { ...link, url: e.target.value };
                                                setContactContent({ ...contactContent, socialLinks: newLinks });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                const newLinks = contactContent.socialLinks.filter(
                                                    (_, i) => i !== index
                                                );
                                                setContactContent({ ...contactContent, socialLinks: newLinks });
                                            }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Button
                                startIcon={<Add />}
                                onClick={() =>
                                    setContactContent({
                                        ...contactContent,
                                        socialLinks: [
                                            ...contactContent.socialLinks,
                                            { platform: '', url: '' },
                                        ],
                                    })
                                }
                            >
                                Add Social Link
                            </Button>

                            {/* Save Button */}
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    startIcon={isSaving ? <CircularProgress size={20} /> : <Save />}
                                    onClick={handleSaveContact}
                                    disabled={isSaving}
                                >
                                    Save Contact Page
                                </Button>
                            </Box>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};
