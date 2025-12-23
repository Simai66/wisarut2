/**
 * Photo Service - Using Cloudflare D1 API
 */
import type { Photo, PhotoFormData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'https://photo-api.sirarom12285.workers.dev';

/**
 * Get all photos with optional filters
 */
export const getPhotos = async (
    pageSize: number = 100,
    _lastDoc?: unknown
): Promise<{ photos: Photo[]; lastDoc: null }> => {
    const response = await fetch(`${API_URL}/photos?limit=${pageSize}`);

    if (!response.ok) {
        throw new Error('Failed to fetch photos');
    }

    const data = await response.json();

    const photos: Photo[] = data.photos.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        url: p.url as string,
        thumbnail: p.thumbnail as string,
        title: p.title as string || '',
        description: p.description as string || '',
        albumId: p.albumId as string || p.album_id as string || '',
        tags: (p.tags as string[]) || [],
        createdAt: new Date(p.createdAt as string || p.created_at as string || Date.now()),
        order: p.order as number || 0,
        width: p.width as number | undefined,
        height: p.height as number | undefined,
        mediaType: (p.mediaType as string || p.media_type as string || 'image') as 'image' | 'video',
        youtubeUrl: p.youtubeUrl as string || p.youtube_url as string || '',
        concept: p.concept as string || '',
    }));

    return { photos, lastDoc: null };
};

/**
 * Get photo by ID
 */
export const getPhotoById = async (id: string): Promise<Photo | null> => {
    const { photos } = await getPhotos(1000);
    return photos.find(p => p.id === id) || null;
};

/**
 * Get photos by album ID
 */
export const getPhotosByAlbum = async (
    albumId: string,
    pageSize: number = 100,
    _lastDoc?: unknown
): Promise<{ photos: Photo[]; lastDoc: null }> => {
    const response = await fetch(`${API_URL}/photos?albumId=${albumId}&limit=${pageSize}`);

    if (!response.ok) {
        throw new Error('Failed to fetch photos');
    }

    const data = await response.json();

    const photos: Photo[] = data.photos.map((p: Record<string, unknown>) => ({
        id: p.id as string,
        url: p.url as string,
        thumbnail: p.thumbnail as string,
        title: p.title as string || '',
        description: p.description as string || '',
        albumId: p.albumId as string || p.album_id as string || '',
        tags: (p.tags as string[]) || [],
        createdAt: new Date(p.createdAt as string || p.created_at as string || Date.now()),
        order: p.order as number || 0,
        width: p.width as number | undefined,
        height: p.height as number | undefined,
        mediaType: (p.mediaType as string || p.media_type as string || 'image') as 'image' | 'video',
        youtubeUrl: p.youtubeUrl as string || p.youtube_url as string || '',
        concept: p.concept as string || '',
    }));

    return { photos, lastDoc: null };
};

/**
 * Search photos by title or tags
 */
export const searchPhotos = async (searchQuery: string): Promise<Photo[]> => {
    const { photos } = await getPhotos(1000);
    const searchLower = searchQuery.toLowerCase();

    return photos.filter(photo => {
        const titleMatch = photo.title.toLowerCase().includes(searchLower);
        const tagMatch = photo.tags.some(tag => tag.toLowerCase().includes(searchLower));
        return titleMatch || tagMatch;
    });
};

/**
 * Create a new photo
 */
export const createPhoto = async (
    photoData: PhotoFormData & { url?: string; thumbnail?: string }
): Promise<string> => {
    const response = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create photo');
    }

    const data = await response.json();
    return data.id;
};

/**
 * Update a photo
 */
export const updatePhoto = async (
    id: string,
    photoData: Partial<PhotoFormData>
): Promise<void> => {
    const response = await fetch(`${API_URL}/photos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photoData),
    });

    if (!response.ok) {
        throw new Error('Failed to update photo');
    }
};

/**
 * Delete a photo
 */
export const deletePhoto = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/photos/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete photo');
    }
};
