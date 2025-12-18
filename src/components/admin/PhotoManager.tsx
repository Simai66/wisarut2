import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Chip,
    CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Photo, Album, PhotoFormData } from '@/types';
import { getPhotos, updatePhoto, deletePhoto } from '@/services/photoService';

interface PhotoManagerProps {
    albums: Album[];
    onRefetch?: () => void;
    showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

interface EditFormData {
    title: string;
    description: string;
    albumId: string;
    tags: string;
}

/**
 * Photo management component (Edit/Delete)
 */
export const PhotoManager = ({ albums, onRefetch, showSnackbar }: PhotoManagerProps) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [editForm, setEditForm] = useState<EditFormData>({
        title: '',
        description: '',
        albumId: '',
        tags: '',
    });

    const fetchPhotos = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getPhotos(200);
            setPhotos(result.photos);
        } catch (error) {
            console.error('Failed to fetch photos:', error);
            showSnackbar('Failed to load photos', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    const handleOpenEdit = (photo: Photo) => {
        setSelectedPhoto(photo);
        setEditForm({
            title: photo.title,
            description: photo.description,
            albumId: photo.albumId || '',
            tags: photo.tags.join(', '),
        });
        setEditDialogOpen(true);
    };

    const handleOpenDelete = (photo: Photo) => {
        setSelectedPhoto(photo);
        setDeleteDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedPhoto) return;

        setIsSaving(true);
        try {
            const updateData: Partial<PhotoFormData> = {
                title: editForm.title,
                description: editForm.description,
                albumId: editForm.albumId,
                tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            await updatePhoto(selectedPhoto.id, updateData);
            showSnackbar('Photo updated successfully', 'success');
            setEditDialogOpen(false);
            fetchPhotos();
            onRefetch?.();
        } catch (error) {
            console.error('Failed to update photo:', error);
            showSnackbar('Failed to update photo', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedPhoto) return;

        setIsSaving(true);
        try {
            await deletePhoto(selectedPhoto.id);
            showSnackbar('Photo deleted successfully', 'success');
            setDeleteDialogOpen(false);
            fetchPhotos();
            onRefetch?.();
        } catch (error) {
            console.error('Failed to delete photo:', error);
            showSnackbar('Failed to delete photo', 'error');
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

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                    Manage Photos ({photos.length})
                </Typography>
                <Button variant="outlined" onClick={fetchPhotos}>
                    Refresh
                </Button>
            </Box>

            {photos.length === 0 ? (
                <Typography color="text.secondary">No photos yet. Add some from the "Add Photo Links" tab.</Typography>
            ) : (
                <Grid container spacing={2}>
                    <AnimatePresence>
                        {photos.map((photo) => (
                            <Grid item key={photo.id} xs={6} sm={4} md={3} lg={2}>
                                <Card
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="120"
                                        image={photo.thumbnail || photo.url}
                                        alt={photo.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, py: 1, px: 1.5 }}>
                                        <Typography variant="body2" fontWeight={500} noWrap>
                                            {photo.title || 'Untitled'}
                                        </Typography>
                                        {photo.tags.length > 0 && (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                                {photo.tags.slice(0, 2).map((tag) => (
                                                    <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                                                ))}
                                                {photo.tags.length > 2 && (
                                                    <Chip label={`+${photo.tags.length - 2}`} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                    <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                                        <IconButton size="small" onClick={() => handleOpenEdit(photo)}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleOpenDelete(photo)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Photo</DialogTitle>
                <DialogContent>
                    {selectedPhoto && (
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <img
                                    src={selectedPhoto.thumbnail || selectedPhoto.url}
                                    alt={selectedPhoto.title}
                                    style={{ maxHeight: 150, objectFit: 'contain', borderRadius: 8 }}
                                />
                            </Box>
                            <TextField
                                label="Title"
                                fullWidth
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                multiline
                                rows={2}
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Album</InputLabel>
                                <Select
                                    value={editForm.albumId}
                                    label="Album"
                                    onChange={(e) => setEditForm({ ...editForm, albumId: e.target.value })}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {albums.map((album) => (
                                        <MenuItem key={album.id} value={album.id}>
                                            {album.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Tags (comma separated)"
                                fullWidth
                                value={editForm.tags}
                                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                helperText="e.g. landscape, sunset, mountain"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveEdit} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Photo</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{selectedPhoto?.title || 'this photo'}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleConfirmDelete} disabled={isSaving}>
                        {isSaving ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
