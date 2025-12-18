import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Photo, PhotoFormData } from '@/types';

const COLLECTION_NAME = 'photos';
const photosCollection = collection(db, COLLECTION_NAME);

/**
 * Convert Firestore document to Photo
 */
const convertDocToPhoto = (doc: DocumentSnapshot): Photo | null => {
    const data = doc.data();
    if (!data) return null;

    return {
        id: doc.id,
        url: data.url as string,
        thumbnail: data.thumbnail as string,
        title: data.title as string,
        description: data.description as string,
        albumId: data.albumId as string,
        tags: data.tags as string[],
        createdAt: (data.createdAt as Timestamp).toDate(),
        order: data.order as number,
        width: data.width as number | undefined,
        height: data.height as number | undefined,
    };
};

/**
 * Get all photos with optional pagination
 */
export const getPhotos = async (
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
): Promise<{ photos: Photo[]; lastDoc: DocumentSnapshot | null }> => {
    let q = query(
        photosCollection,
        orderBy('order', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
    );

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const photos: Photo[] = [];

    snapshot.docs.forEach((doc) => {
        const photo = convertDocToPhoto(doc);
        if (photo) photos.push(photo);
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

    return { photos, lastDoc: newLastDoc };
};

/**
 * Get photo by ID
 */
export const getPhotoById = async (id: string): Promise<Photo | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return convertDocToPhoto(docSnap);
};

/**
 * Get photos by album ID
 */
export const getPhotosByAlbum = async (
    albumId: string,
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
): Promise<{ photos: Photo[]; lastDoc: DocumentSnapshot | null }> => {
    let q = query(
        photosCollection,
        where('albumId', '==', albumId),
        orderBy('order', 'asc'),
        limit(pageSize)
    );

    if (lastDoc) {
        q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const photos: Photo[] = [];

    snapshot.docs.forEach((doc) => {
        const photo = convertDocToPhoto(doc);
        if (photo) photos.push(photo);
    });

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1] ?? null;

    return { photos, lastDoc: newLastDoc };
};

/**
 * Search photos by title or tags
 */
export const searchPhotos = async (
    searchQuery: string
): Promise<Photo[]> => {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that fetches all and filters client-side
    // For production, consider using Algolia or Elasticsearch
    const snapshot = await getDocs(
        query(photosCollection, orderBy('order', 'asc'))
    );

    const searchLower = searchQuery.toLowerCase();
    const photos: Photo[] = [];

    snapshot.docs.forEach((doc) => {
        const photo = convertDocToPhoto(doc);
        if (photo) {
            const titleMatch = photo.title.toLowerCase().includes(searchLower);
            const tagMatch = photo.tags.some((tag) =>
                tag.toLowerCase().includes(searchLower)
            );
            if (titleMatch || tagMatch) {
                photos.push(photo);
            }
        }
    });

    return photos;
};

/**
 * Create a new photo (Admin only)
 */
export const createPhoto = async (
    photoData: PhotoFormData & { url: string; thumbnail: string }
): Promise<string> => {
    const docRef = await addDoc(photosCollection, {
        ...photoData,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
};

/**
 * Update a photo (Admin only)
 */
export const updatePhoto = async (
    id: string,
    photoData: Partial<PhotoFormData>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, photoData);
};

/**
 * Delete a photo (Admin only)
 */
export const deletePhoto = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
