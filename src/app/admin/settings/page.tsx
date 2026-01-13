'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { factions } from '@/lib/factions';
import { COLLECTIONS } from '@/lib/db-types';
import { useAuth } from '@/lib/auth-context';

export default function AdminSettings() {
    const { userRole } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const isSuperAdmin = userRole?.isSuperAdmin || false;

    const seedDatabase = async () => {
        const db = getFirebaseDb();
        if (!db) {
            showMessage('error', 'Database not available');
            return;
        }

        if (!confirm('This will wipe existing lore and rosters for all factions and reset them to defaults. Are you sure?')) {
            return;
        }

        setLoading(true);
        try {
            // Predefined rosters for factions
            const rosterData: Record<string, { name: string; role: string; rank: string; isLeader: boolean }[]> = {
                'redacted': [
                    { name: 'Eevee Jacobs', role: 'Leader', rank: 'Founder', isLeader: true },
                    { name: 'Henry Royce', role: 'Gaffa', rank: 'Co-Founder', isLeader: false },
                    { name: 'Jackson "JakJak" Jacobs', role: 'Lieutenant', rank: 'Officer', isLeader: false },
                    { name: 'Jimmy Streets', role: 'Gaffa', rank: 'Officer', isLeader: false },
                    { name: 'Marianna Cross', role: 'Enforcer', rank: 'Veteran', isLeader: false },
                    { name: 'Damon Vox', role: 'Enforcer', rank: 'Veteran', isLeader: false },
                    { name: 'Swae Lee', role: 'Enforcer', rank: 'Veteran', isLeader: false },
                    { name: 'Skittlez McBooba', role: 'Enforcer', rank: 'Veteran', isLeader: false },
                    { name: 'Monkey D. Luffy', role: 'Soldier', rank: 'Member', isLeader: false },
                    { name: 'Jinn Cross', role: 'Soldier', rank: 'Member', isLeader: false },
                    { name: 'Derek Cross', role: 'Soldier', rank: 'Member', isLeader: false },
                    { name: 'Trashy', role: 'Runner', rank: 'Prospect', isLeader: false },
                    { name: 'Asher Riggs', role: 'Runner', rank: 'Prospect', isLeader: false },
                    { name: 'Sunny Shreds', role: 'Runner', rank: 'Prospect', isLeader: false },
                    { name: 'Nav White', role: 'Runner', rank: 'Prospect', isLeader: false },
                    { name: 'Amir', role: 'Runner', rank: 'Prospect', isLeader: false },
                    { name: 'Brad Gibbs', role: 'Runner', rank: 'Prospect', isLeader: false },
                ],
            };

            // Seed all factions
            for (const faction of factions) {
                // Update faction doc
                await setDoc(doc(db, COLLECTIONS.FACTIONS, faction.id), {
                    ...faction,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                // Clear existing lore
                const existingLore = await getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'lore'));
                const loreDeletions = existingLore.docs.map(d => deleteDoc(d.ref));
                await Promise.all(loreDeletions);

                // Add sample lore for each faction
                const loreEntries = [
                    { title: 'The Beginning', content: `The founding story of ${faction.name}.`, year: '2024', order: 0 },
                    { title: 'Rise to Power', content: `How ${faction.name} claimed their territory.`, year: '2024', order: 1 },
                    { title: 'The Code', content: `The rules and values that define ${faction.name}.`, year: '2025', order: 2 },
                ];

                for (const entry of loreEntries) {
                    await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'lore'), {
                        factionId: faction.id,
                        ...entry,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });
                }

                // Clear existing members
                const existingMembers = await getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'members'));
                const memberDeletions = existingMembers.docs.map(d => deleteDoc(d.ref));
                await Promise.all(memberDeletions);

                // Add roster members
                const members = rosterData[faction.id] || [
                    { name: 'Unknown', role: 'Leader', rank: 'Founder', isLeader: true },
                    { name: 'Unknown', role: 'Member', rank: 'Member', isLeader: false },
                ];

                for (const member of members) {
                    await addDoc(collection(db, COLLECTIONS.FACTIONS, faction.id, 'members'), {
                        factionId: faction.id,
                        ...member,
                        joinedAt: new Date(),
                        updatedAt: new Date(),
                    });
                }
            }

            showMessage('success', `Successfully wiped and re-seeded ${factions.length} factions!`);
        } catch (err) {
            console.error('Error seeding database:', err);
            showMessage('error', 'Failed to seed database. Check console for details.');
        }
        setLoading(false);
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    // Settings page accessible to all authenticated users

    return (
        <div>
            <motion.h1
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Settings
            </motion.h1>
            <motion.p
                className="text-[var(--foreground-muted)] mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                System configuration and database management
            </motion.p>

            {message && (
                <motion.div
                    className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} border`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="grid gap-6 max-w-2xl">
                {/* Database section */}
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Database</h2>
                    <p className="text-[var(--foreground-muted)] mb-4">
                        Seed the Firestore database with initial faction data. This will create documents for all {factions.length} factions with sample lore entries.
                    </p>
                    <button
                        onClick={seedDatabase}
                        disabled={loading}
                        className="btn-cinematic disabled:opacity-50"
                    >
                        {loading ? 'Seeding...' : 'Seed Database'}
                    </button>
                </motion.div>

                {/* Firebase info */}
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Firebase Project</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[var(--foreground-muted)]">Project ID:</span>
                            <span className="text-white font-mono">illegalfactions-6a5e8</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[var(--foreground-muted)]">Auth Domain:</span>
                            <span className="text-white font-mono">illegalfactions-6a5e8.firebaseapp.com</span>
                        </div>
                    </div>
                </motion.div>

                {/* User setup instructions */}
                <motion.div
                    className="glass-card p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-lg font-semibold text-white mb-4">Super Admin Setup</h2>
                    <p className="text-[var(--foreground-muted)] mb-4">
                        To set yourself as a Super Admin:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-[var(--foreground-muted)]">
                        <li>Create an account in Firebase Console → Authentication</li>
                        <li>Copy your User UID</li>
                        <li>Go to Firestore → users collection</li>
                        <li>Create a document with ID = your UID</li>
                        <li>Add fields: <code className="text-red-400">isSuperAdmin: true</code>, <code className="text-red-400">email: &quot;your@email.com&quot;</code></li>
                    </ol>
                </motion.div>
            </div>
        </div>
    );
}
