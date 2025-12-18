/**
 * Album entity representing a collection of photos
 */
export interface Album {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    order: number;
    isPublic: boolean;
    createdAt: Date;
    photoCount?: number;
}

/**
 * Form data for creating/updating an album
 */
export interface AlbumFormData {
    name: string;
    description: string;
    coverUrl: string;
    order: number;
    isPublic: boolean;
}

/**
 * Album with Firestore document data (dates as strings)
 */
export interface AlbumDocument {
    id: string;
    name: string;
    description: string;
    coverUrl: string;
    order: number;
    isPublic: boolean;
    createdAt: string;
}
