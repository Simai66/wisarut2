import { useState, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
} from '@mui/material';
import { PhotoLibrary, Collections, Edit } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { PhotoUploader } from '@/components/admin/PhotoUploader';
import { AlbumManager } from '@/components/admin/AlbumManager';
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
    const [isUploading, setIsUploading] = useState(false);
    const { albums, refetch: refetchAlbums } = useAlbums(true);
    const { showSnackbar } = useUIStore();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Photo upload handler - optimized for speed
    const handleUpload = useCallback(
        async (files: File[]) => {
            setIsUploading(true);

            try {
                // Upload all files in parallel for speed
                const uploadPromises = files.map(async (file) => {
                    // Upload to ImgBB (returns both URL and thumbnail)
                    const { uploadImageWithThumbnail } = await import('@/services/storageService');
                    const { url, thumbnail } = await uploadImageWithThumbnail(file);

                    // Create photo document
                    await createPhoto({
                        url,
                        thumbnail,
                        title: file.name.replace(/\.[^/.]+$/, ''),
                        description: '',
                        albumId: '',
                        tags: [],
                        order: 0,
                    });
                });

                await Promise.all(uploadPromises);
                showSnackbar(`${files.length} photo(s) uploaded successfully`, 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Upload failed';
                showSnackbar(message, 'error');
                throw error;
            } finally {
                setIsUploading(false);
            }
        },
        [showSnackbar]
    );

    // Album handlers
    const handleCreateAlbum = useCallback(
        async (data: AlbumFormData) => {
            try {
                await createAlbum(data);
                await refetchAlbums();
                showSnackbar('Album created successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to create album';
                showSnackbar(message, 'error');
                throw error;
            }
        },
        [refetchAlbums, showSnackbar]
    );

    const handleUpdateAlbum = useCallback(
        async (id: string, data: Partial<AlbumFormData>) => {
            try {
                await updateAlbum(id, data);
                await refetchAlbums();
                showSnackbar('Album updated successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to update album';
                showSnackbar(message, 'error');
                throw error;
            }
        },
        [refetchAlbums, showSnackbar]
    );

    const handleDeleteAlbum = useCallback(
        async (id: string) => {
            try {
                await deleteAlbumService(id);
                await refetchAlbums();
                showSnackbar('Album deleted successfully', 'success');
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to delete album';
                showSnackbar(message, 'error');
                throw error;
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
                            label="Upload Photos"
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
                            <PhotoUploader onUpload={handleUpload} maxFiles={20} maxSizeMB={15} />
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <AlbumManager
                                albums={albums}
                                onCreateAlbum={handleCreateAlbum}
                                onUpdateAlbum={handleUpdateAlbum}
                                onDeleteAlbum={handleDeleteAlbum}
                                isLoading={isUploading}
                            />
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <ContentEditor />
                        </TabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
