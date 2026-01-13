// Firestore database types for the Illegal Factions website

export interface FactionData {
    id: string;
    name: string;
    tagline: string;
    type: 'mc' | 'racing' | 'gang' | 'mafia' | 'yakuza' | 'classified';
    primaryColor: string;
    accentColor: string;
    gradientFrom: string;
    gradientTo: string;
    description: string;
    logoUrl?: string;
    heroImageUrl?: string;
    discordInvite?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface LoreEntry {
    id: string;
    factionId: string;
    title: string;
    content: string;
    imageUrl?: string;
    order: number;
    year: string;
    eventDate: any; // Firestore Timestamp or Date
    createdAt: Date;
    updatedAt: Date;
}

export interface Member {
    id: string;
    factionId: string;
    userId?: string; // Link to auth user if they have an account
    name: string;
    role: string;
    rank: string;
    avatarUrl?: string;
    isLeader: boolean;
    joinedAt: Date;
    updatedAt: Date;
}

export interface GalleryItem {
    id: string;
    factionId: string;
    imageUrl: string;
    thumbnailUrl?: string;
    title?: string;
    tag?: string;
    desc?: string;
    caption?: string;
    uploadedBy?: string;
    uploadedAt: Date;
}

export interface Clip {
    id: string;
    factionId: string;
    title: string;
    videoUrl: string;
    thumbnailUrl?: string;
    platform: 'youtube' | 'twitch' | 'streamable' | 'other';
    uploadedBy: string;
    uploadedAt: Date;
}

export interface Update {
    id: string;
    factionId: string;
    title: string;
    content: string;
    isNew: boolean;
    postedBy: string;
    postedAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    isSuperAdmin: boolean;
    factionIds: string[]; // Factions user can edit
    createdAt: Date;
    lastLoginAt: Date;
}

// Collection names
export const COLLECTIONS = {
    FACTIONS: 'factions',
    LORE: 'lore',
    MEMBERS: 'members',
    GALLERY: 'gallery',
    CLIPS: 'clips',
    UPDATES: 'updates',
    USERS: 'users',
} as const;
