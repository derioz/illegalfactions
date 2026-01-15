// Faction data configuration with unique theming
export interface Faction {
    id: string;
    name: string;
    tagline: string;
    type: 'mc' | 'racing' | 'gang' | 'mafia' | 'yakuza' | 'classified';
    primaryColor: string;
    accentColor: string;
    gradientFrom: string;
    gradientTo: string;
    description: string;
    logo?: string;
    featuredImage?: string;
}

export const factions: Faction[] = [
    {
        id: 'redacted',
        name: '[REDACTED]',
        tagline: 'Chaos Is Inevitable. We Control It.',
        type: 'classified',
        primaryColor: '#dc2626',
        accentColor: '#000000',
        gradientFrom: '#18181b',
        gradientTo: '#09090b',
        description: 'Forged from the ashes of gang wars and burned bridges. They came together not out of loyalty to a neighborhood, but because they recognized that together, they could rewrite the rules.',
        logo: '/factions/redacted-logo.png',
        featuredImage: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'pale-riders',
        name: 'Pale Riders MC',
        tagline: 'Respect Gets Respect',
        type: 'mc',
        primaryColor: '#2563eb', // Royal Blue
        accentColor: '#ffffff',  // White
        gradientFrom: '#1e40af', // Blue 800
        gradientTo: '#172554',   // Blue 950
        description: "Steel thunder echoed down the back roads as the Northside Chapter rolled into town. We didn't come for the spotlight. We came to ride, build, and claim our space—one mile, one deal, one earned name at a time.",
        logo: '/factions/paleriders-logo.png',
        featuredImage: 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'iron-reapers',
        name: 'Iron Reapers MC',
        tagline: 'Rust Never Sleeps',
        type: 'mc',
        primaryColor: '#ea580c',
        accentColor: '#431407',
        gradientFrom: '#c2410c',
        gradientTo: '#7c2d12',
        description: 'Born from the rust and iron of the industrial wasteland. Forged in fire.',
        featuredImage: 'https://images.unsplash.com/photo-1471466054146-e71bcc0d2bb2?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'blackout',
        name: 'Blackout',
        tagline: 'When The Lights Go Out',
        type: 'racing',
        primaryColor: '#06b6d4',
        accentColor: '#0a0a0a',
        gradientFrom: '#0891b2',
        gradientTo: '#164e63',
        description: 'The streets belong to us after dark. Speed is life. Hesitation is death.',
        featuredImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'souls-of-anarchy',
        name: 'Souls of Anarchy',
        tagline: 'Chaos Is Freedom',
        type: 'gang',
        primaryColor: '#ef4444',
        accentColor: '#fef2f2',
        gradientFrom: '#dc2626',
        gradientTo: '#7f1d1d',
        description: 'We reject your order. We embrace the chaos. In anarchy, we find our true selves.',
        featuredImage: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'shadows',
        name: 'Shadows',
        tagline: 'Unseen. Unheard. Unforgotten.',
        type: 'gang',
        primaryColor: '#7c3aed',
        accentColor: '#0f0f0f',
        gradientFrom: '#6d28d9',
        gradientTo: '#2e1065',
        description: 'We move in silence. We strike from darkness. You will never see us coming.',
        featuredImage: 'https://images.unsplash.com/photo-1500462859194-845728a71f01?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'odins-chosen',
        name: "Odin's Chosen",
        tagline: 'Valhalla Awaits',
        type: 'gang',
        primaryColor: '#eab308',
        accentColor: '#3b82f6',
        gradientFrom: '#ca8a04',
        gradientTo: '#422006',
        description: 'Warriors blessed by the Allfather. We fight with honor, we die with glory.',
        logo: '/factions/odins-chosen-logo.png',
        featuredImage: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'gearhead-society',
        name: 'Gearhead Society',
        tagline: 'Built Different',
        type: 'racing',
        primaryColor: '#f97316',
        accentColor: '#18181b',
        gradientFrom: '#ea580c',
        gradientTo: '#431407',
        description: 'Grease runs in our veins. Every engine tells a story. Every ride is a masterpiece.',
        featuredImage: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'black-mamba',
        name: 'Black Mamba',
        tagline: 'One Bite Is All It Takes',
        type: 'gang',
        primaryColor: '#22c55e',
        accentColor: '#0a0a0a',
        gradientFrom: '#16a34a',
        gradientTo: '#14532d',
        description: 'Silent. Deadly. Vengeful. Cross us once, and you will never cross anyone again.',
        featuredImage: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c4709?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'angels',
        name: 'Angels',
        tagline: 'Heaven Has No Mercy',
        type: 'gang',
        primaryColor: '#ec4899', // Hot Pink
        accentColor: '#ffffff',
        gradientFrom: '#db2777',
        gradientTo: '#831843',
        description: 'Do not be fooled by the name. We are the fallen. And we have risen.',
        logo: '/factions/angels-logo.png',
        featuredImage: 'https://images.unsplash.com/photo-1531267063023-ec0d1bd991dd?auto=format&fit=crop&q=80&w=1920'
    },
    {
        id: 'los-santos-mob',
        name: 'Los Santos Mob',
        tagline: 'Business Over Bloodshed',
        type: 'mafia',
        primaryColor: '#8b7355',  // Smoky brown from logo
        accentColor: '#c4a574',   // Muted gold/tan
        gradientFrom: '#1a1816',  // Dark charcoal
        gradientTo: '#0d0c0b',    // Near black
        description: 'The MOB was quietly growing, stacking numbers with known, money driven shooters. Guys with reputations. Guys who didn\'t talk much, but everyone knew they\'d stand shoulder to shoulder when it mattered.',
        logo: '/factions/los-santos-mob-logo.png',
        featuredImage: '/factions/los-santos-mob-logo.png'
    },
    {
        id: 'mujou-kai',
        name: 'Mujō-Kai',
        tagline: '無常 - Nothing Lasts. Not Even You.',
        type: 'yakuza',
        primaryColor: '#d4a574', // Warm gold from logo
        accentColor: '#1a1a1a',  // Deep black
        gradientFrom: '#a67c52', // Darker gold
        gradientTo: '#0d0d0d',   // Near black
        description: 'Like ash settling after a fire, the Mujō-Kai coalesced into a new, darker shape. They do not build empires to be toppled—they become a directed current within the chaos. Their doctrine is understood in silence: become the agent of impermanence for others, while structuring oneself to flow with it.',
        logo: '/factions/mujou-kai-logo.png',
        featuredImage: '/factions/mujou-kai-logo.png'
    },
];

export const getFactionById = (id: string): Faction | undefined => {
    return factions.find((f) => f.id === id);
};

export const getFactionsByType = (type: Faction['type']): Faction[] => {
    return factions.filter((f) => f.type === type);
};
