import { useState, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    TextField,
    Button,
    Backdrop,
    CircularProgress,
    Alert,
    Collapse,
    IconButton,
} from '@mui/material';
import { PhotoLibrary, Collections, Edit, Close, Image } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AlbumManager } from '@/components/admin/AlbumManager';
import { PhotoManager } from '@/components/admin/PhotoManager';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { useAlbums } from '@/hooks/useAlbums';
import { useUIStore } from '@/stores/uiStore';
import { createPhoto } from '@/services/photoService';
import { createAlbum, updateAlbum, deleteAlbum as deleteAlbumService } from '@/services/albumService';
import type { AlbumFormData } from '@/types';

interface TabPanelProps {
    children: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <Box
        role="tabpanel"
        hidden={value !== index}
        sx={{ pt: 3 }}
    >
        {value === index && children}
    </Box>
);

/**
 * Admin dashboard page
 */
export const Admin = () => {
    const [tabValue, setTabValue] = useState(0);
    const [isBusy, setIsBusy] = useState(false);
    const [photoLinksText, setPhotoLinksText] = useState('');
    const [actionStatus, setActionStatus] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning' | 'info';
    }>({ open: false, message: '', severity: 'info' });

    const { albums, refetch: refetchAlbums } = useAlbums(true);
    const { showSnackbar } = useUIStore();

    const setFeedback = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
        setActionStatus({ open: true, message, severity });
        showSnackbar(message, severity);
    };


    const isLikelyOfflineError = (error: unknown): boolean => {
        const message = error instanceof Error ? error.message : String(error);
        return (
            /client is offline/i.test(message) ||
            /offline/i.test(message) ||
            /unavailable/i.test(message) ||
            /network/i.test(message) ||
            /failed to fetch/i.test(message)
        );
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const guessTitleFromUrl = (rawUrl: string): string => {
        try {
            const url = new URL(rawUrl);
            const last = url.pathname.split('/').filter(Boolean).pop();
            if (!last) return 'Photo';
            return decodeURIComponent(last).replace(/\.[^/.]+$/, '') || 'Photo';
        } catch {
            return 'Photo';
        }
    };

    const extractUrls = (text: string): string[] => {
        // Extract http(s) URLs from any text (supports multiple per line)
        const matches = text.match(/https?:\/\/[^\s|]+/g);
        if (!matches) return [];
        return matches.map((u) => u.replace(/[),.;]+$/, ''));
    };

    // Add photos by pasting ImgBB URLs
    const handleAddPhotoLinks = useCallback(async () => {
        const rawLines = photoLinksText
            .split(/\r?\n/)
            .map((l) => l.trim())
            .filter(Boolean);

        // Build entries of { url, thumbnail }.
        const entries: Array<{ url: string; thumbnail: string }> = [];
        for (const raw of rawLines) {
            // Preferred explicit format: url | thumbnailUrl
            if (raw.includes('|')) {
                const [urlPart, thumbPart] = raw.split('|').map((s) => s.trim());
                if (urlPart) {
                    entries.push({ url: urlPart, thumbnail: thumbPart || urlPart });
                }
                continue;
            }

            // Otherwise: extract any URLs found in the text
            const urls = extractUrls(raw);
            for (const url of urls) {
                entries.push({ url, thumbnail: url });
            }
        }

        if (entries.length === 0) {
            showSnackbar('Paste at least one image URL', 'warning');
            return;
        }

        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            setFeedback('You appear to be offline. Check your connection and try again.', 'error');
            return;
        }

        setIsBusy(true);
        setActionStatus(prev => ({ ...prev, open: false })); // dismiss old alerts
        try {
            let added = 0;
            let failed = 0;
            let showedConnectivityHint = false;

            for (const entry of entries) {
                const { url, thumbnail } = entry;
                try {
                    // Validate URL
                    // eslint-disable-next-line no-new
                    new URL(url);

                    // Direct API call - D1 is fast and reliable
                    await createPhoto({
                        url,
                        thumbnail,
                        title: guessTitleFromUrl(url),
                        description: '',
                        albumId: '',
                        tags: [],
                        order: 0,
                    });
                    added += 1;
                } catch (error) {
                    console.error('Failed to add photo:', url, error);
                    failed += 1;

                    if (!showedConnectivityHint && isLikelyOfflineError(error)) {
                        showedConnectivityHint = true;
                        setFeedback(
                            'Firestore seems unreachable (offline/network blocked). Try disabling ad-block/VPN or switch networks.',
                            'error'
                        );
                        // If connectivity is broken, remaining adds are very likely to fail.
                        break;
                    }

                    // Show actual error message for debugging
                    if (failed === 1 && !showedConnectivityHint) {
                        const errMsg = error instanceof Error ? error.message : String(error);
                        setFeedback(`Error adding photo: ${errMsg}`, 'error');
                    }
                }
            }

            if (added > 0 && failed === 0) {
                setFeedback(`${added} photo(s) added successfully`, 'success');
                setPhotoLinksText('');
            } else if (added === 0) {
                setFeedback('Failed to add photos (check URLs / Firestore connection)', 'error');
            } else {
                setFeedback(`Added ${added}, failed ${failed}`, 'warning');
            }
        } finally {
            setIsBusy(false);
        }
    }, [photoLinksText, showSnackbar]);

    // Album handlers
    const handleCreateAlbum = useCallback(
        async (data: AlbumFormData) => {
            setIsBusy(true);
            setActionStatus(prev => ({ ...prev, open: false }));
            try {
                await createAlbum(data);
                await refetchAlbums();
                setFeedback('Album created successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to create album';
                setFeedback(message, 'error');
                throw error;
            } finally {
                setIsBusy(false);
            }
        },
        [refetchAlbums, showSnackbar]
    );

    const handleUpdateAlbum = useCallback(
        async (id: string, data: Partial<AlbumFormData>) => {
            setIsBusy(true);
            setActionStatus(prev => ({ ...prev, open: false }));
            try {
                await updateAlbum(id, data);
                await refetchAlbums();
                setFeedback('Album updated successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to update album';
                setFeedback(message, 'error');
                throw error;
            } finally {
                setIsBusy(false);
            }
        },
        [refetchAlbums, showSnackbar]
    );

    const handleDeleteAlbum = useCallback(
        async (id: string) => {
            setIsBusy(true);
            setActionStatus(prev => ({ ...prev, open: false }));
            try {
                await deleteAlbumService(id);
                await refetchAlbums();
                setFeedback('Album deleted successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to delete album';
                setFeedback(message, 'error');
                throw error;
            } finally {
                setIsBusy(false);
            }
        },
        [refetchAlbums, showSnackbar]
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
                    sx={{ mb: 4 }}
                >
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Manage your photos, albums, and page content
                    </Typography>
                </Box>

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

                {/* Tabs */}
                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    elevation={0}
                    sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                    >
                        <Tab
                            icon={<PhotoLibrary />}
                            iconPosition="start"
                            label="Add Photo Links"
                            sx={{ minHeight: 64 }}
                        />
                        <Tab
                            icon={<Image />}
                            iconPosition="start"
                            label="Manage Photos"
                            sx={{ minHeight: 64 }}
                        />
                        <Tab
                            icon={<Collections />}
                            iconPosition="start"
                            label="Manage Albums"
                            sx={{ minHeight: 64 }}
                        />
                        <Tab
                            icon={<Edit />}
                            iconPosition="start"
                            label="Edit Pages"
                            sx={{ minHeight: 64 }}
                        />
                    </Tabs>

                    <Box sx={{ p: 3 }}>
                        <TabPanel value={tabValue} index={0}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 900 }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Paste ImgBB links
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Upload your image(s) to ImgBB first, then paste the direct image URL(s) here.
                                    You can paste many URLs at once (multiple per line is OK). Optional: use <strong>url | thumbnailUrl</strong> per line.
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={6}
                                    label="Image URLs"
                                    placeholder="https://i.ibb.co/.../image.jpg\nhttps://i.ibb.co/.../another.png\n\n# or: https://i.ibb.co/.../a.jpg https://i.ibb.co/.../b.jpg\n# or: https://i.ibb.co/.../a.jpg | https://i.ibb.co/.../a-thumb.jpg"
                                    value={photoLinksText}
                                    onChange={(e) => setPhotoLinksText(e.target.value)}
                                />
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAddPhotoLinks}
                                        disabled={isBusy || photoLinksText.trim().length === 0}
                                    >
                                        {isBusy ? 'Adding...' : 'Add Photos'}
                                    </Button>
                                    <Typography variant="caption" color="text.secondary">
                                        Creates D1 records from the pasted URLs.
                                    </Typography>
                                </Box>
                            </Box>
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <PhotoManager
                                albums={albums}
                                onRefetch={refetchAlbums}
                                showSnackbar={setFeedback}
                            />
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <AlbumManager
                                albums={albums}
                                onCreateAlbum={handleCreateAlbum}
                                onUpdateAlbum={handleUpdateAlbum}
                                onDeleteAlbum={handleDeleteAlbum}
                                isLoading={isBusy}
                            />
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <ContentEditor />
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isBusy}
            >
                <CircularProgress color="inherit" />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Processing...
                </Typography>
            </Backdrop>
        </Box>
    );
};
