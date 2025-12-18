/**
 * Site content type definitions
 */

export interface AboutContent {
    id: string;
    heroImage: string;
    title: string;
    subtitle: string;
    profileImage: string;
    storyTitle: string;
    storyContent: string[];
    skills: string[];
    stats: {
        icon: string;
        value: string;
        label: string;
    }[];
    equipment: {
        name: string;
        type: string;
    }[];
    updatedAt: Date;
}

export interface ContactContent {
    id: string;
    heroImage: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    businessHours: {
        days: string;
        hours: string;
    }[];
    socialLinks: {
        platform: string;
        url: string;
    }[];
    updatedAt: Date;
}

export interface SiteContent {
    about: AboutContent;
    contact: ContactContent;
}

// Default content values
export const defaultAboutContent: Omit<AboutContent, 'id' | 'updatedAt'> = {
    heroImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1920',
    title: 'About Me',
    subtitle: 'Photographer • Visual Storyteller • Artist',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    storyTitle: 'Passion for Visual Art',
    storyContent: [
        'Photography has been my passion since I was young. What started as a hobby quickly became my life\'s calling. I believe that every moment has a story worth telling, and my goal is to capture those stories in the most authentic way possible.',
        'Over the years, I\'ve had the privilege of working with amazing clients from around the world. From intimate weddings to corporate events, from stunning landscapes to heartfelt portraits, each project has taught me something new and helped me grow as an artist.',
    ],
    skills: [
        'Portrait Photography',
        'Landscape',
        'Wedding',
        'Product Photography',
        'Street Photography',
        'Photo Editing',
    ],
    stats: [
        { icon: 'camera', value: '10+', label: 'Years Experience' },
        { icon: 'portrait', value: '500+', label: 'Clients Served' },
        { icon: 'landscape', value: '50+', label: 'Locations' },
        { icon: 'location', value: '20+', label: 'Countries' },
    ],
    equipment: [
        { name: 'Sony A7 IV', type: 'Camera' },
        { name: 'Sony 24-70mm f/2.8 GM', type: 'Lens' },
        { name: 'Sony 85mm f/1.4 GM', type: 'Lens' },
        { name: 'Sony 16-35mm f/2.8 GM', type: 'Lens' },
    ],
};

export const defaultContactContent: Omit<ContactContent, 'id' | 'updatedAt'> = {
    heroImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920',
    title: 'Get In Touch',
    subtitle: 'Let\'s create something beautiful together',
    email: 'hello@photographer.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    businessHours: [
        { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
        { days: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { days: 'Sunday', hours: 'Closed' },
    ],
    socialLinks: [
        { platform: 'Instagram', url: 'https://instagram.com' },
        { platform: 'Facebook', url: 'https://facebook.com' },
        { platform: 'Twitter', url: 'https://twitter.com' },
    ],
};
