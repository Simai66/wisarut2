/**
 * Media type for photos/videos
 */
export type MediaType = 'image' | 'video';

/**
 * Photo entity representing an image or video in the gallery
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
    /** Type of media: image or video */
    mediaType: MediaType;
    /** YouTube video URL (only for videos) */
    youtubeUrl?: string;
    /** Concept/description text displayed under the media */
    concept?: string;
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
    mediaType?: MediaType;
    youtubeUrl?: string;
    concept?: string;
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
    mediaType?: MediaType;
    youtubeUrl?: string;
    concept?: string;
}
