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
    Alert,
} from '@mui/material';
import { Edit, Delete, DragIndicator } from '@mui/icons-material';
import { AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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

interface SortablePhotoCardProps {
    photo: Photo;
    onEdit: (photo: Photo) => void;
    onDelete: (photo: Photo) => void;
}

/**
 * Sortable photo card component
 */
const SortablePhotoCard = ({ photo, onEdit, onDelete }: SortablePhotoCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: photo.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <Grid item xs={6} sm={4} md={3} lg={2} ref={setNodeRef} style={style}>
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: isDragging ? 'grabbing' : 'default',
                }}
            >
                {/* Drag Handle */}
                <Box
                    {...attributes}
                    {...listeners}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 0.5,
                        cursor: 'grab',
                        backgroundColor: 'action.hover',
                        '&:hover': { backgroundColor: 'action.selected' },
                    }}
                >
                    <DragIndicator fontSize="small" color="action" />
                </Box>
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
                    <IconButton size="small" onClick={() => onEdit(photo)}>
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(photo)}>
                        <Delete fontSize="small" />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    );
};

/**
 * Photo management component with drag-drop reordering
 */
export const PhotoManager = ({ albums, onRefetch, showSnackbar }: PhotoManagerProps) => {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [hasReordered, setHasReordered] = useState(false);
    const [editForm, setEditForm] = useState<EditFormData>({
        title: '',
        description: '',
        albumId: '',
        tags: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const fetchPhotos = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getPhotos(200);
            // Sort by order field
            const sorted = result.photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setPhotos(sorted);
            setHasReordered(false);
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPhotos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            setHasReordered(true);
        }
    };

    const handleSaveOrder = async () => {
        setIsSaving(true);
        try {
            // Update order for all photos
            const updates = photos.map((photo, index) =>
                updatePhoto(photo.id, { order: index })
            );
            await Promise.all(updates);
            showSnackbar('Order saved successfully', 'success');
            setHasReordered(false);
            onRefetch?.();
        } catch (error) {
            console.error('Failed to save order:', error);
            showSnackbar('Failed to save order', 'error');
        } finally {
            setIsSaving(false);
        }
    };

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                    Manage Photos ({photos.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {hasReordered && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveOrder}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Order'}
                        </Button>
                    )}
                    <Button variant="outlined" onClick={fetchPhotos}>
                        Refresh
                    </Button>
                </Box>
            </Box>

            {/* Reorder hint */}
            <Alert severity="info" sx={{ mb: 2 }}>
                🔄 Drag the ⋮⋮ handle on each photo to reorder. Click "Save Order" when done. <strong>(PC only)</strong>
            </Alert>

            {photos.length === 0 ? (
                <Typography color="text.secondary">No photos yet. Add some from the "Add Photo Links" tab.</Typography>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
                        <Grid container spacing={2}>
                            <AnimatePresence>
                                {photos.map((photo) => (
                                    <SortablePhotoCard
                                        key={photo.id}
                                        photo={photo}
                                        onEdit={handleOpenEdit}
                                        onDelete={handleOpenDelete}
                                    />
                                ))}
                            </AnimatePresence>
                        </Grid>
                    </SortableContext>
                </DndContext>
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
