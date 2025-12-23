import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { YouTube, PlayArrow, CheckCircle } from '@mui/icons-material';
import type { Album } from '@/types';
import { createPhoto } from '@/services/photoService';

interface YouTubeAdderProps {
    albums: Album[];
    onSuccess?: () => void;
    showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

/**
 * Component to add YouTube videos to the gallery
 */
export const YouTubeAdder = ({ albums, onSuccess, showSnackbar }: YouTubeAdderProps) => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); // This is mapped to 'concept'
    const [albumId, setAlbumId] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewId, setPreviewId] = useState<string | null>(null);

    const extractVideoId = (inputUrl: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = inputUrl.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        const videoId = extractVideoId(newUrl);
        setPreviewId(videoId);

        if (videoId && !title) {
            // Auto-set title placeholder if empty
            setTitle(`YouTube Video ${videoId}`);
        }
    };

    const handleSubmit = async () => {
        if (!previewId) {
            showSnackbar('Invalid YouTube URL', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const thumbnailUrl = `https://img.youtube.com/vi/${previewId}/maxresdefault.jpg`;
            // Fallback to hqdefault if maxres doesn't exist (handled by UI error, but for data saving we optimistically use maxres)

            await createPhoto({
                mediaType: 'video',
                youtubeUrl: url,
                url: thumbnailUrl, // Use thumbnail as the main image capable URL for consistency
                thumbnail: thumbnailUrl,
                title: title || 'Untitled Video',
                description: '', // Legacy description field
                concept: description, // Use the proper concept field
                albumId: albumId,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                order: 0,
            });

            showSnackbar('Video added successfully', 'success');
            setUrl('');
            setTitle('');
            setDescription('');
            setTags('');
            setPreviewId(null);
            onSuccess?.();

        } catch (error) {
            console.error('Failed to add video:', error);
            showSnackbar('Failed to add video', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxWidth="sm" sx={{ mx: 'auto', mt: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
                    <YouTube color="error" fontSize="large" />
                    <Typography variant="h6">Add YouTube Video</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="YouTube URL"
                        fullWidth
                        value={url}
                        onChange={handleUrlChange}
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        helperText={previewId ? "Valid video ID detected" : "Enter a valid YouTube URL"}
                        error={!!url && !previewId}
                    />

                    {previewId && (
                        <Box sx={{
                            position: 'relative',
                            paddingTop: '56.25%',
                            backgroundColor: '#000',
                            borderRadius: 1,
                            overflow: 'hidden',
                            mb: 2
                        }}>
                            <img
                                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                                alt="Video Thumbnail"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    opacity: 0.7
                                }}
                            />
                            <PlayArrow sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: 64,
                                opacity: 0.9
                            }} />
                        </Box>
                    )}

                    <TextField
                        label="Title"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        label="Concept / Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write a concept or description for this video..."
                    />

                    <FormControl fullWidth>
                        <InputLabel>Album</InputLabel>
                        <Select
                            value={albumId}
                            label="Album"
                            onChange={(e) => setAlbumId(e.target.value)}
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
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        disabled={isLoading || !previewId}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircle />}
                    >
                        {isLoading ? 'Adding...' : 'Add Video'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};
