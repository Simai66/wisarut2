import { useState, useCallback } from 'react';
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
    Alert,
} from '@mui/material';
import { Add, Edit, Delete, DragIndicator } from '@mui/icons-material';
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
import type { Album, AlbumFormData } from '@/types';

interface AlbumManagerProps {
    albums: Album[];
    onCreateAlbum: (data: AlbumFormData) => Promise<void>;
    onUpdateAlbum: (id: string, data: Partial<AlbumFormData>) => Promise<void>;
    onDeleteAlbum: (id: string) => Promise<void>;
    isLoading?: boolean;
}

interface SortableAlbumCardProps {
    album: Album;
    onEdit: (album: Album) => void;
    onDelete: (album: Album) => void;
}

const defaultFormData: AlbumFormData = {
    name: '',
    description: '',
    coverUrl: '',
    order: 0,
    isPublic: true,
};

/**
 * Sortable album card component
 */
const SortableAlbumCard = ({ album, onEdit, onDelete }: SortableAlbumCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: album.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 'auto',
    };

    return (
        <Grid item xs={12} sm={6} md={4} ref={setNodeRef} style={style}>
            <Card sx={{ height: '100%', cursor: isDragging ? 'grabbing' : 'default' }}>
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
                        {album.isPublic ? 'Public' : 'Private'}
                    </Typography>
                </CardContent>
                <CardActions>
                    <IconButton size="small" onClick={() => onEdit(album)}>
                        <Edit />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(album)}>
                        <Delete />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    );
};

/**
 * Album management component with drag-drop reordering
 */
export const AlbumManager = ({
    albums: initialAlbums,
    onCreateAlbum,
    onUpdateAlbum,
    onDeleteAlbum,
    isLoading,
}: AlbumManagerProps) => {
    const [albums, setAlbums] = useState<Album[]>(initialAlbums);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
    const [formData, setFormData] = useState<AlbumFormData>(defaultFormData);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
    const [quickName, setQuickName] = useState('');
    const [quickCoverUrl, setQuickCoverUrl] = useState('');
    const [hasReordered, setHasReordered] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Sync with parent albums
    useState(() => {
        setAlbums(initialAlbums);
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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setAlbums((items) => {
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
            const updates = albums.map((album, index) =>
                onUpdateAlbum(album.id, { order: index })
            );
            await Promise.all(updates);
            setHasReordered(false);
        } catch (error) {
            console.error('Failed to save album order:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingAlbum(null);
        const nextOrder = albums.length > 0 ? Math.max(...albums.map((a) => a.order ?? 0)) + 1 : 0;
        setFormData({ ...defaultFormData, order: nextOrder });
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

    const handleQuickCreate = async () => {
        if (!quickName.trim()) return;
        const nextOrder = albums.length > 0 ? Math.max(...albums.map((a) => a.order ?? 0)) + 1 : 0;
        await onCreateAlbum({
            name: quickName.trim(),
            description: '',
            coverUrl: quickCoverUrl.trim(),
            order: nextOrder,
            isPublic: true,
        });
        setQuickName('');
        setQuickCoverUrl('');
    };

    const handleDelete = async () => {
        if (albumToDelete) {
            await onDeleteAlbum(albumToDelete.id);
            setDeleteDialogOpen(false);
            setAlbumToDelete(null);
        }
    };

    const handleOpenDelete = useCallback((album: Album) => {
        setAlbumToDelete(album);
        setDeleteDialogOpen(true);
    }, []);

    // Use initialAlbums if no reorder happened
    const displayAlbums = hasReordered ? albums : initialAlbums;

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight={600}>
                    Albums ({displayAlbums.length})
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
                    <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
                        New Album
                    </Button>
                </Box>
            </Box>

            {/* Reorder hint */}
            <Alert severity="info" sx={{ mb: 2 }}>
                🔄 Drag the ⋮⋮ handle on each album to reorder. Click "Save Order" when done. <strong>(PC only)</strong>
            </Alert>

            {/* Quick create */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                <TextField
                    label="Album name"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Cover URL (optional)"
                    value={quickCoverUrl}
                    onChange={(e) => setQuickCoverUrl(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleQuickCreate}
                    disabled={!quickName.trim() || isLoading}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Quick add
                </Button>
            </Box>

            {/* Albums Grid with DnD */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={displayAlbums.map(a => a.id)} strategy={rectSortingStrategy}>
                    <Grid container spacing={2}>
                        <AnimatePresence>
                            {displayAlbums.map((album) => (
                                <SortableAlbumCard
                                    key={album.id}
                                    album={album}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleOpenDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </Grid>
                </SortableContext>
            </DndContext>

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
