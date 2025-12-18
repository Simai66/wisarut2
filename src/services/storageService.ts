import { v4 as uuidv4 } from 'uuid';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY || '';
const IMGBB_PROXY_URL = 'https://imgbb-proxy.photo-wisarut.workers.dev';

/**
 * Generate unique photo ID
 */
export const generatePhotoId = (): string => {
    return uuidv4();
};

/**
 * Compress image before upload
 */
const compressImage = async (
    file: File,
    maxWidth = 1920,
    quality = 0.85
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            // Only resize if larger than maxWidth
            if (width > maxWidth) {
                const ratio = maxWidth / width;
                width = maxWidth;
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to compress image'));
                    }
                },
                'image/jpeg',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

/**
 * Convert blob to base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Upload image to ImgBB via CORS proxy
 */
export const uploadImage = async (
    file: File,
    _photoId?: string,
    _type?: 'original' | 'thumbnail'
): Promise<string> => {
    if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key is not configured');
    }

    // Compress image first
    let imageToUpload: Blob = file;
    if (file.size > 500 * 1024) {
        try {
            imageToUpload = await compressImage(file);
        } catch {
            imageToUpload = file;
        }
    }

    // Convert to base64 for ImgBB API
    const base64Image = await blobToBase64(imageToUpload);

    const formData = new URLSearchParams();
    formData.append('image', base64Image);
    formData.append('key', IMGBB_API_KEY);

    // Use Cloudflare Worker as proxy (your own server, no CORS issues)
    const response = await fetch(IMGBB_PROXY_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image to ImgBB');
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data.data.url;
};

/**
 * Upload image and get both original and thumbnail URLs
 */
export const uploadImageWithThumbnail = async (
    file: File
): Promise<{ url: string; thumbnail: string }> => {
    if (!IMGBB_API_KEY) {
        throw new Error('ImgBB API key is not configured');
    }

    // Compress image first
    let imageToUpload: Blob = file;
    if (file.size > 500 * 1024) {
        try {
            imageToUpload = await compressImage(file);
        } catch {
            imageToUpload = file;
        }
    }

    // Convert to base64 for ImgBB API
    const base64Image = await blobToBase64(imageToUpload);

    const formData = new URLSearchParams();
    formData.append('image', base64Image);
    formData.append('key', IMGBB_API_KEY);

    // Use Cloudflare Worker as proxy (your own server, no CORS issues)
    const response = await fetch(IMGBB_PROXY_URL, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload image to ImgBB');
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error?.message || 'Failed to upload image');
    }

    return {
        url: data.data.url,
        thumbnail: data.data.thumb?.url || data.data.medium?.url || data.data.url,
    };
};

/**
 * Create thumbnail from image file (for local preview)
 */
export const createThumbnail = async (
    file: File,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.7
): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create thumbnail blob'));
                    }
                },
                'image/jpeg',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
};

/**
 * Delete image (not supported by ImgBB free API)
 */
export const deleteImage = async (_photoId: string): Promise<void> => {
    console.warn('ImgBB free API does not support image deletion');
    return Promise.resolve();
};
