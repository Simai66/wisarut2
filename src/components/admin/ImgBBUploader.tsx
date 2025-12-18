import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    LinearProgress,
    Alert,
    Paper,
} from '@mui/material';
import { CloudUpload, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { getHomeContent } from '@/services/contentService';
import { createPhoto } from '@/services/photoService';

interface UploadResult {
    name: string;
    status: 'uploading' | 'success' | 'error';
    progress: number;
    error?: string;
    url?: string;
}

interface ImgBBUploaderProps {
    onSuccess?: () => void;
    showSnackbar: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

/**
 * Direct upload to ImgBB with drag-drop support
 */
export const ImgBBUploader = ({ onSuccess, showSnackbar }: ImgBBUploaderProps) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploads, setUploads] = useState<UploadResult[]>([]);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load API key from settings
    useEffect(() => {
        const loadApiKey = async () => {
            try {
                const content = await getHomeContent();
                setApiKey(content.imgbbApiKey || null);
            } catch (e) {
                console.error('Failed to load ImgBB API key:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadApiKey();
    }, []);

    const uploadToImgBB = async (file: File): Promise<{ url: string; thumbnail: string; title: string }> => {
        if (!apiKey) {
            throw new Error('ImgBB API key not configured');
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return {
            url: data.data.url,
            thumbnail: data.data.thumb?.url || data.data.url,
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        };
    };

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        if (!apiKey) {
            showSnackbar('Please configure ImgBB API key in Edit Pages > Home Page', 'warning');
            return;
        }

        const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (fileArray.length === 0) {
            showSnackbar('Please select image files only', 'warning');
            return;
        }

        // Initialize upload states
        const initialUploads: UploadResult[] = fileArray.map(f => ({
            name: f.name,
            status: 'uploading',
            progress: 0,
        }));
        setUploads(initialUploads);

        let successCount = 0;
        let errorCount = 0;

        // Process each file
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];

            try {
                // Update progress
                setUploads(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, progress: 50 } : u
                ));

                const result = await uploadToImgBB(file);

                // Save to D1
                await createPhoto({
                    url: result.url,
                    thumbnail: result.thumbnail,
                    title: result.title,
                    description: '',
                    albumId: '',
                    tags: [],
                    order: 0,
                });

                // Update success
                setUploads(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, status: 'success', progress: 100, url: result.url } : u
                ));
                successCount++;

            } catch (error) {
                const message = error instanceof Error ? error.message : 'Upload failed';
                setUploads(prev => prev.map((u, idx) =>
                    idx === i ? { ...u, status: 'error', progress: 100, error: message } : u
                ));
                errorCount++;
            }
        }

        // Show summary
        if (successCount > 0) {
            showSnackbar(`Uploaded ${successCount} photo(s) successfully`, 'success');
            onSuccess?.();
        }
        if (errorCount > 0) {
            showSnackbar(`${errorCount} upload(s) failed`, 'error');
        }
    }, [apiKey, showSnackbar, onSuccess]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    if (isLoading) {
        return <LinearProgress />;
    }

    if (!apiKey) {
        return (
            <Alert severity="warning">
                ImgBB API key not configured. Go to <strong>Edit Pages &gt; Home Page &gt; ImgBB Settings</strong> to add your API key.
                Get one free at <a href="https://api.imgbb.com/" target="_blank" rel="noopener noreferrer">api.imgbb.com</a>
            </Alert>
        );
    }

    return (
        <Box>
            {/* Drop Zone */}
            <Paper
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                sx={{
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px dashed',
                    borderColor: isDragOver ? 'primary.main' : 'divider',
                    backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                    },
                }}
            >
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Drag & Drop Images Here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    or click to browse files
                </Typography>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFileChange}
                />
            </Paper>

            {/* Upload Progress */}
            {uploads.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Upload Progress
                    </Typography>
                    {uploads.map((upload, idx) => (
                        <Box key={idx} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                {upload.status === 'success' && <CheckCircle color="success" fontSize="small" />}
                                {upload.status === 'error' && <ErrorIcon color="error" fontSize="small" />}
                                <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                                    {upload.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {upload.status === 'uploading' ? `${upload.progress}%` : upload.status}
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={upload.progress}
                                color={upload.status === 'error' ? 'error' : upload.status === 'success' ? 'success' : 'primary'}
                            />
                            {upload.error && (
                                <Typography variant="caption" color="error">
                                    {upload.error}
                                </Typography>
                            )}
                        </Box>
                    ))}
                    <Button
                        variant="text"
                        size="small"
                        onClick={() => setUploads([])}
                        sx={{ mt: 1 }}
                    >
                        Clear
                    </Button>
                </Box>
            )}
        </Box>
    );
};
