/**
 * Content Service - Using Cloudflare D1 API
 */
import type { AboutContent, ContactContent } from '@/types';
import { defaultAboutContent, defaultContactContent } from '@/types/content';

const API_URL = import.meta.env.VITE_API_URL || 'https://photo-api.photo-wisarut.workers.dev';

/**
 * Get About page content
 */
export const getAboutContent = async (): Promise<AboutContent> => {
    try {
        const response = await fetch(`${API_URL}/content/about`);

        if (!response.ok) {
            return { ...defaultAboutContent, id: 'about', updatedAt: new Date() };
        }

        const data = await response.json();

        if (!data.content) {
            return { ...defaultAboutContent, id: 'about', updatedAt: new Date() };
        }

        return {
            ...defaultAboutContent,
            ...data.content,
            id: 'about',
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        };
    } catch (error) {
        console.error('Error getting about content:', error);
        return { ...defaultAboutContent, id: 'about', updatedAt: new Date() };
    }
};

/**
 * Update About page content
 */
export const updateAboutContent = async (
    content: Partial<Omit<AboutContent, 'id' | 'updatedAt'>>
): Promise<void> => {
    const response = await fetch(`${API_URL}/content/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Failed to save about content');
    }
};

/**
 * Get Contact page content
 */
export const getContactContent = async (): Promise<ContactContent> => {
    try {
        const response = await fetch(`${API_URL}/content/contact`);

        if (!response.ok) {
            return { ...defaultContactContent, id: 'contact', updatedAt: new Date() };
        }

        const data = await response.json();

        if (!data.content) {
            return { ...defaultContactContent, id: 'contact', updatedAt: new Date() };
        }

        return {
            ...defaultContactContent,
            ...data.content,
            id: 'contact',
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        };
    } catch (error) {
        console.error('Error getting contact content:', error);
        return { ...defaultContactContent, id: 'contact', updatedAt: new Date() };
    }
};

/**
 * Update Contact page content
 */
export const updateContactContent = async (
    content: Partial<Omit<ContactContent, 'id' | 'updatedAt'>>
): Promise<void> => {
    const response = await fetch(`${API_URL}/content/contact`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Failed to save contact content');
    }
};

/**
 * Initialize default content (no-op for D1 - content is created on first save)
 */
export const initializeDefaultContent = async (): Promise<void> => {
    // No-op for D1 API
};

// ==================== HOME PAGE CONTENT ====================

export interface HomeContent {
    id: string;
    siteName: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBackgroundUrl: string;
    heroButtonText: string;
    featuredSectionTitle: string;
    featuredSectionSubtitle: string;
    updatedAt?: Date;
}

export const defaultHomeContent: Omit<HomeContent, 'id' | 'updatedAt'> = {
    siteName: 'PHOTO GALLERY',
    heroTitle: 'Capturing Moments',
    heroSubtitle: 'A visual journey through light, shadow, and emotion. Explore the world through my lens.',
    heroBackgroundUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    heroButtonText: 'View Gallery',
    featuredSectionTitle: 'Recent Captures',
    featuredSectionSubtitle: 'Featured Work',
};

/**
 * Get Home page content
 */
export const getHomeContent = async (): Promise<HomeContent> => {
    try {
        const response = await fetch(`${API_URL}/content/home`);

        if (!response.ok) {
            return { ...defaultHomeContent, id: 'home', updatedAt: new Date() };
        }

        const data = await response.json();

        if (!data.content) {
            return { ...defaultHomeContent, id: 'home', updatedAt: new Date() };
        }

        return {
            ...defaultHomeContent,
            ...data.content,
            id: 'home',
            updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        };
    } catch (error) {
        console.error('Error getting home content:', error);
        return { ...defaultHomeContent, id: 'home', updatedAt: new Date() };
    }
};

/**
 * Update Home page content
 */
export const updateHomeContent = async (
    content: Partial<Omit<HomeContent, 'id' | 'updatedAt'>>
): Promise<void> => {
    const response = await fetch(`${API_URL}/content/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Failed to save home content');
    }
};
