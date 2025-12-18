import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { AboutContent, ContactContent } from '@/types';
import { defaultAboutContent, defaultContactContent } from '@/types/content';

const CONTENT_COLLECTION = 'siteContent';

/**
 * Get About page content
 */
export const getAboutContent = async (): Promise<AboutContent> => {
    try {
        const docRef = doc(db, CONTENT_COLLECTION, 'about');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as AboutContent;
        }

        // Return default content if not found
        return {
            ...defaultAboutContent,
            id: 'about',
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Error getting about content:', error);
        return {
            ...defaultAboutContent,
            id: 'about',
            updatedAt: new Date(),
        };
    }
};

/**
 * Update About page content
 */
export const updateAboutContent = async (
    content: Partial<Omit<AboutContent, 'id' | 'updatedAt'>>
): Promise<void> => {
    const docRef = doc(db, CONTENT_COLLECTION, 'about');
    await setDoc(
        docRef,
        {
            ...content,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
};

/**
 * Get Contact page content
 */
export const getContactContent = async (): Promise<ContactContent> => {
    try {
        const docRef = doc(db, CONTENT_COLLECTION, 'contact');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as ContactContent;
        }

        // Return default content if not found
        return {
            ...defaultContactContent,
            id: 'contact',
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error('Error getting contact content:', error);
        return {
            ...defaultContactContent,
            id: 'contact',
            updatedAt: new Date(),
        };
    }
};

/**
 * Update Contact page content
 */
export const updateContactContent = async (
    content: Partial<Omit<ContactContent, 'id' | 'updatedAt'>>
): Promise<void> => {
    const docRef = doc(db, CONTENT_COLLECTION, 'contact');
    await setDoc(
        docRef,
        {
            ...content,
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
};

/**
 * Initialize default content (run once)
 */
export const initializeDefaultContent = async (): Promise<void> => {
    const aboutRef = doc(db, CONTENT_COLLECTION, 'about');
    const contactRef = doc(db, CONTENT_COLLECTION, 'contact');

    const [aboutSnap, contactSnap] = await Promise.all([
        getDoc(aboutRef),
        getDoc(contactRef),
    ]);

    const promises: Promise<void>[] = [];

    if (!aboutSnap.exists()) {
        promises.push(
            setDoc(aboutRef, {
                ...defaultAboutContent,
                updatedAt: serverTimestamp(),
            })
        );
    }

    if (!contactSnap.exists()) {
        promises.push(
            setDoc(contactRef, {
                ...defaultContactContent,
                updatedAt: serverTimestamp(),
            })
        );
    }

    await Promise.all(promises);
};
