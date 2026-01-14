import { notFound } from 'next/navigation';
import { factions, getFactionById } from '@/lib/factions';
import { FactionHero } from '@/components/faction/FactionHero';
import { LoreSection } from '@/components/faction/LoreSection';
import { RosterSection } from '@/components/faction/RosterSection';
import { GallerySection } from '@/components/faction/GallerySection';


// Custom pages
import { RedactedPage } from '@/components/faction/RedactedPage';
import { PaleRidersPage } from '@/components/faction/PaleRidersPage';
import { AngelsPage } from '@/components/faction/AngelsPage';
import { OdinsChosenPage } from '@/components/faction/OdinsChosenPage';
import { MujouKaiPage } from '@/components/faction/MujouKaiPage';

// Generate static paths for all factions
export function generateStaticParams() {
    return factions.map((faction) => ({
        faction: faction.id,
    }));
}

// Generate metadata for each faction page
export async function generateMetadata({ params }: { params: Promise<{ faction: string }> }) {
    const { faction: factionId } = await params;
    const faction = getFactionById(factionId);

    if (!faction) {
        return {
            title: 'Faction Not Found | Illegal Factions',
        };
    }

    return {
        title: `${faction.name} | Illegal Factions`,
        description: faction.description,
        openGraph: {
            title: `${faction.name} | Illegal Factions`,
            description: faction.tagline,
        },
    };
}

export default async function FactionPage({ params }: { params: Promise<{ faction: string }> }) {
    const { faction: factionId } = await params;
    const faction = getFactionById(factionId);

    if (!faction) {
        notFound();
    }

    // Use custom page for REDACTED faction
    if (faction.id === 'redacted') {
        return <RedactedPage faction={faction} />;
    }

    if (faction.id === 'pale-riders') {
        return <PaleRidersPage faction={faction} />;
    }

    if (faction.id === 'angels') {
        return <AngelsPage faction={faction} />;
    }

    if (faction.id === 'odins-chosen') {
        return <OdinsChosenPage faction={faction} />;
    }

    if (faction.id === 'mujou-kai') {
        return <MujouKaiPage faction={faction} />;
    }

    return (
        <div
            style={
                {
                    '--faction-primary': faction.primaryColor,
                    '--faction-accent': faction.accentColor,
                } as React.CSSProperties
            }
        >
            <FactionHero faction={faction} />
            <LoreSection faction={faction} />
            <RosterSection faction={faction} />
            <GallerySection faction={faction} />
        </div>
    );
}
