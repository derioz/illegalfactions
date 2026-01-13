import { factions } from '@/lib/factions';
import { FactionEditor } from '@/components/admin/FactionEditor';

// Generate static paths for all factions
export function generateStaticParams() {
    return factions.map((faction) => ({
        factionId: faction.id,
    }));
}

export default async function FactionEditPage({ params }: { params: Promise<{ factionId: string }> }) {
    const { factionId } = await params;
    return <FactionEditor factionId={factionId} />;
}
