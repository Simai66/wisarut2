/**
 * Photo entity representing an image in the gallery
 */
export interface Photo {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    description: string;
    albumId: string;
    tags: string[];
    createdAt: Date;
    order: number;
    width?: number;
    height?: number;
}

/**
 * Form data for creating/updating a photo
 */
export interface PhotoFormData {
    title: string;
    description: string;
    albumId: string;
    tags: string[];
    order: number;
}

/**
 * Photo with Firestore document data (dates as strings)
 */
export interface PhotoDocument {
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    description: string;
    albumId: string;
    tags: string[];
    createdAt: string;
    order: number;
    width?: number;
    height?: number;
}
