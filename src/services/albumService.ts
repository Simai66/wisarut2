/**
 * Album Service - Using Cloudflare D1 API
 */
import type { Album, AlbumFormData } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'https://photo-api.photo-wisarut.workers.dev';

/**
 * Get all albums
 */
export const getAlbums = async (includePrivate = false): Promise<Album[]> => {
    const response = await fetch(`${API_URL}/albums`);

    if (!response.ok) {
        throw new Error('Failed to fetch albums');
    }

    const data = await response.json();

    let albums: Album[] = data.albums.map((a: Record<string, unknown>) => ({
        id: a.id as string,
        name: a.name as string,
        description: a.description as string || '',
        coverUrl: a.coverUrl as string || a.cover_url as string || '',
        order: a.order as number || 0,
        isPublic: Boolean(a.isPublic ?? a.is_public ?? true),
        createdAt: new Date(a.createdAt as string || a.created_at as string || Date.now()),
    }));

    // Filter private albums unless requested
    if (!includePrivate) {
        albums = albums.filter(a => a.isPublic);
    }

    return albums;
};

/**
 * Get album by ID
 */
export const getAlbumById = async (id: string): Promise<Album | null> => {
    const albums = await getAlbums(true);
    return albums.find(a => a.id === id) || null;
};

/**
 * Create a new album
 */
export const createAlbum = async (albumData: AlbumFormData): Promise<string> => {
    const response = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to create album');
    }

    const data = await response.json();
    return data.id;
};

/**
 * Update an album
 */
export const updateAlbum = async (
    id: string,
    albumData: Partial<AlbumFormData>
): Promise<void> => {
    const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumData),
    });

    if (!response.ok) {
        throw new Error('Failed to update album');
    }
};

/**
 * Delete an album
 */
export const deleteAlbum = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete album');
    }
};
