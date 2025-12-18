import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Typography,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { Album, AlbumFormData } from '@/types';

interface AlbumManagerProps {
    albums: Album[];
    onCreateAlbum: (data: AlbumFormData) => Promise<void>;
    onUpdateAlbum: (id: string, data: Partial<AlbumFormData>) => Promise<void>;
    onDeleteAlbum: (id: string) => Promise<void>;
    isLoading?: boolean;
}

const defaultFormData: AlbumFormData = {
    name: '',
    description: '',
    coverUrl: '',
    order: 0,
    isPublic: true,
};

/**
 * Album management component (CRUD)
 */
export const AlbumManager = ({
    albums,
    onCreateAlbum,
    onUpdateAlbum,
    onDeleteAlbum,
    isLoading,
}: AlbumManagerProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [formData, setFormData] = useState<AlbumFormData>(defaultFormData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

    const handleOpenCreate = () => {
        setEditingAlbum(null);
        setFormData(defaultFormData);
        setDialogOpen(true);
    };

    const handleOpenEdit = (album: Album) => {
        setEditingAlbum(album);
        setFormData({
            name: album.name,
            description: album.description,
            coverUrl: album.coverUrl,
            order: album.order,
            isPublic: album.isPublic,
        });
        setDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (editingAlbum) {
            await onUpdateAlbum(editingAlbum.id, formData);
        } else {
            await onCreateAlbum(formData);
        }
        setDialogOpen(false);
        setFormData(defaultFormData);
    };

    const handleDelete = async () => {
        if (albumToDelete) {
            await onDeleteAlbum(albumToDelete.id);
            setDeleteDialogOpen(false);
            setAlbumToDelete(null);
        }
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={600}>
                    Albums
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenCreate}
                >
                    New Album
                </Button>
            </Box>

            {/* Albums Grid */}
            <Grid container spacing={2}>
                <AnimatePresence>
                    {albums.map((album) => (
                        <Grid item key={album.id} xs={12} sm={6} md={4}>
                            <Card
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                sx={{ height: '100%' }}
                            >
                                {album.coverUrl && (
                                    <Box
                                        sx={{
                                            height: 140,
                                            backgroundImage: `url(${album.coverUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {album.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {album.description || 'No description'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        {album.isPublic ? 'Public' : 'Private'} • Order: {album.order}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton size="small" onClick={() => handleOpenEdit(album)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => {
                                            setAlbumToDelete(album);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </AnimatePresence>
            </Grid>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingAlbum ? 'Edit Album' : 'Create New Album'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <TextField
                            label="Cover URL"
                            fullWidth
                            value={formData.coverUrl}
                            onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                        />
                        <TextField
                            label="Order"
                            type="number"
                            fullWidth
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.isPublic}
                                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                />
                            }
                            label="Public"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.name || isLoading}
                    >
                        {editingAlbum ? 'Save' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Album</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{albumToDelete?.name}"? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
