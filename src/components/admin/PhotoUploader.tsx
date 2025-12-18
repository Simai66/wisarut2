import { useState, useCallback } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    IconButton,
    Grid,
    Paper,
    Alert,
} from '@mui/material';
import { CloudUpload, Close, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadFile {
    file: File;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    error?: string;
}

interface PhotoUploaderProps {
    onUpload: (files: File[]) => Promise<void>;
    maxFiles?: number;
    maxSizeMB?: number;
}

/**
 * Multiple image upload component with drag and drop
 */
export const PhotoUploader = ({
    onUpload,
    maxFiles = 10,
    maxSizeMB = 10,
}: PhotoUploaderProps) => {
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            setError(null);
            const validFiles: UploadFile[] = [];

            Array.from(files).forEach((file) => {
                // Check file type
                if (!file.type.startsWith('image/')) {
                    setError('Only image files are allowed');
                    return;
                }

                // Check file size
                if (file.size > maxSizeBytes) {
                    setError(`File size must be less than ${maxSizeMB}MB`);
                    return;
                }

                // Check max files
                if (uploadFiles.length + validFiles.length >= maxFiles) {
                    setError(`Maximum ${maxFiles} files allowed`);
                    return;
                }

                validFiles.push({
                    file,
                    preview: URL.createObjectURL(file),
                    progress: 0,
                    status: 'pending',
                });
            });

            setUploadFiles((prev) => [...prev, ...validFiles]);
        },
        [maxFiles, maxSizeBytes, uploadFiles.length]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const removeFile = useCallback((index: number) => {
        setUploadFiles((prev) => {
            const newFiles = [...prev];
            const removed = newFiles.splice(index, 1)[0];
            if (removed) {
                URL.revokeObjectURL(removed.preview);
            }
            return newFiles;
        });
    }, []);

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;

        setIsUploading(true);
        setError(null);

        try {
            // Update all files to uploading status
            setUploadFiles((prev) =>
                prev.map((f) => ({ ...f, status: 'uploading' as const }))
            );

            const files = uploadFiles.map((uf) => uf.file);
            await onUpload(files);

            // Mark all as completed
            setUploadFiles((prev) =>
                prev.map((f) => ({ ...f, status: 'completed' as const, progress: 100 }))
            );

            // Clear after delay
            setTimeout(() => {
                setUploadFiles([]);
            }, 2000);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Upload failed';
            setError(message);
            setUploadFiles((prev) =>
                prev.map((f) => ({ ...f, status: 'error' as const, error: message }))
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Drop Zone */}
            <Paper
                component={motion.div}
                animate={{
                    borderColor: isDragging ? 'primary.main' : 'divider',
                    backgroundColor: isDragging ? 'action.hover' : 'background.paper',
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onClick={() => document.getElementById('file-input')?.click()}
            >
                <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFiles(e.target.files)}
                />
                <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                    Drop images here or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Max {maxFiles} files, {maxSizeMB}MB each
                </Typography>
            </Paper>

            {/* File Previews */}
            <AnimatePresence>
                {uploadFiles.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {uploadFiles.map((uploadFile, index) => (
                                <Grid item key={index} xs={6} sm={4} md={3}>
                                    <Box
                                        component={motion.div}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        sx={{
                                            position: 'relative',
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={uploadFile.preview}
                                            alt={`Preview ${index}`}
                                            sx={{
                                                width: '100%',
                                                aspectRatio: '1',
                                                objectFit: 'cover',
                                            }}
                                        />

                                        {/* Status Overlay */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor:
                                                    uploadFile.status === 'completed'
                                                        ? 'rgba(76, 175, 80, 0.7)'
                                                        : uploadFile.status === 'error'
                                                            ? 'rgba(244, 67, 54, 0.7)'
                                                            : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {uploadFile.status === 'completed' && (
                                                <CheckCircle sx={{ color: 'white', fontSize: 40 }} />
                                            )}
                                        </Box>

                                        {/* Progress Bar */}
                                        {uploadFile.status === 'uploading' && (
                                            <LinearProgress
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                }}
                                            />
                                        )}

                                        {/* Remove Button */}
                                        {uploadFile.status === 'pending' && (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(index);
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 4,
                                                    right: 4,
                                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                                    },
                                                }}
                                            >
                                                <Close fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Upload Button */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isUploading}
                                onClick={handleUpload}
                                style={{
                                    padding: '12px 32px',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isUploading ? 'not-allowed' : 'pointer',
                                    opacity: isUploading ? 0.7 : 1,
                                }}
                            >
                                {isUploading ? 'Uploading...' : `Upload ${uploadFiles.length} Photos`}
                            </motion.button>
                        </Box>
                    </Box>
                )}
            </AnimatePresence>
        </Box>
    );
};
