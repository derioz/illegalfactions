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
    },
    {
        id: 'los-santos-mob',
        name: 'Los Santos Mob',
        tagline: 'Respect Is Everything',
        type: 'mafia',
        primaryColor: '#1e3a8a',
        accentColor: '#d4af37',
        gradientFrom: '#1e40af',
        gradientTo: '#172554',
        description: 'Old school values. New school methods. The family always comes first.',
    },
    {
        id: 'mujou-kai',
        name: 'Mujou Kai',
        tagline: '無常会 - Nothing Lasts Forever',
        type: 'yakuza',
        primaryColor: '#f472b6',
        accentColor: '#1e3a8a',
        gradientFrom: '#db2777',
        gradientTo: '#500724',
        description: 'Honor. Discipline. Sacrifice. The way of the warrior knows no compromise.',
    },
];

export const getFactionById = (id: string): Faction | undefined => {
    return factions.find((f) => f.id === id);
};

export const getFactionsByType = (type: Faction['type']): Faction[] => {
    return factions.filter((f) => f.type === type);
};
