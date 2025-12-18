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
    DocumentSnapshot,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Album, AlbumFormData } from '@/types';

const COLLECTION_NAME = 'albums';
const albumsCollection = collection(db, COLLECTION_NAME);

/**
 * Convert Firestore document to Album
 */
const convertDocToAlbum = (doc: DocumentSnapshot): Album | null => {
    const data = doc.data();
    if (!data) return null;

    return {
        id: doc.id,
        name: data.name as string,
        description: data.description as string,
        coverUrl: data.coverUrl as string,
        order: data.order as number,
        isPublic: data.isPublic as boolean,
        createdAt: (data.createdAt as Timestamp).toDate(),
        photoCount: data.photoCount as number | undefined,
    };
};

/**
 * Get all public albums
 */
export const getAlbums = async (): Promise<Album[]> => {
    const q = query(
        albumsCollection,
        where('isPublic', '==', true),
        orderBy('order', 'asc')
    );

    const snapshot = await getDocs(q);
    const albums: Album[] = [];

    snapshot.docs.forEach((doc) => {
        const album = convertDocToAlbum(doc);
        if (album) albums.push(album);
    });

    return albums;
};

/**
 * Get all albums (including private, for admin)
 */
export const getAllAlbums = async (): Promise<Album[]> => {
    const q = query(albumsCollection, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    const albums: Album[] = [];

    snapshot.docs.forEach((doc) => {
        const album = convertDocToAlbum(doc);
        if (album) albums.push(album);
    });

    return albums;
};

/**
 * Get album by ID
 */
export const getAlbumById = async (id: string): Promise<Album | null> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return convertDocToAlbum(docSnap);
};

/**
 * Create a new album (Admin only)
 */
export const createAlbum = async (albumData: AlbumFormData): Promise<string> => {
    const docRef = await addDoc(albumsCollection, {
        ...albumData,
        createdAt: Timestamp.now(),
        photoCount: 0,
    });
    return docRef.id;
};

/**
 * Update an album (Admin only)
 */
export const updateAlbum = async (
    id: string,
    albumData: Partial<AlbumFormData>
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, albumData);
};

/**
 * Delete an album (Admin only)
 */
export const deleteAlbum = async (id: string): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
};
