'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Faction } from '@/lib/factions';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { COLLECTIONS, Member } from '@/lib/db-types';

interface RosterSectionProps {
    faction: Faction;
}

interface RosterMember {
    id: string;
    name: string;
    role: string;
    rank: string;
    isLeader: boolean;
}

export function RosterSection({ faction }: RosterSectionProps) {
    const [members, setMembers] = useState<RosterMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const db = getFirebaseDb();
                if (!db) {
                    setLoading(false);
                    return;
                }

                const membersSnap = await getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'members'));
                const dbMembers = membersSnap.docs.map(d => {
                    const data = d.data() as Member;
                    return {
                        id: d.id,
                        name: data.name,
                        role: data.role,
                        rank: data.rank,
                        isLeader: data.isLeader,
                    };
                });
                // Sort by leader first, then by role
                dbMembers.sort((a, b) => {
                    if (a.isLeader && !b.isLeader) return -1;
                    if (!a.isLeader && b.isLeader) return 1;
                    return 0;
                });
                setMembers(dbMembers);
            } catch (err) {
                console.error('Error loading members:', err);
            }
            setLoading(false);
        };
        loadMembers();
    }, [faction.id]);

    const isClassified = faction.type === 'classified';
    const fontClass = isClassified ? 'font-mono' : '';

    return (
        <section id="roster" className={`relative py-24 px-4 md:px-8 bg-neutral-950/30 backdrop-blur-sm ${fontClass}`}>
            {/* Background accent */}
            <div
                className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-10 blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${faction.primaryColor}30 0%, transparent 70%)`,
                }}
            />

            <div className="relative max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span
                        className="inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{
                            background: `${faction.primaryColor}15`,
                            color: faction.primaryColor,
                            border: `1px solid ${faction.primaryColor}30`,
                        }}
                    >
                        {isClassified ? 'Active Personnel' : 'The Family'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {isClassified ? 'OPERATIVES' : 'Roster'}
                    </h2>
                    <p className="mx-auto text-[var(--foreground-muted)] text-neutral-400">
                        {loading ? (isClassified ? 'Decrypting manifest...' : 'Loading members...') :
                            isClassified ? `${members.length} identified active units` : `${members.length} members in our ranks`}
                    </p>
                </motion.div>

                {/* Member grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                        <motion.div
                            key={member.id}
                            className="group relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <motion.div
                                className="glass-card p-6 h-full transition-all duration-300 bg-neutral-900/40 border border-white/5 rounded-xl"
                                style={{
                                    borderColor: member.isLeader ? `${faction.primaryColor}40` : `${faction.primaryColor}10`,
                                }}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: `${faction.primaryColor}60`,
                                    background: `${faction.primaryColor}05`
                                }}
                            >
                                {/* Leader crown */}
                                {member.isLeader && (
                                    <div
                                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                                        style={{
                                            background: faction.primaryColor,
                                            color: isClassified ? '#000' : '#fff',
                                            boxShadow: `0 0 20px ${faction.primaryColor}60`,
                                        }}
                                    >
                                        {isClassified ? 'COMMANDER' : 'LEADER'}
                                    </div>
                                )}

                                {/* Avatar placeholder */}
                                <div className="relative mx-auto w-24 h-24 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${faction.gradientFrom} 0%, ${faction.gradientTo} 100%)`,
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-white/80">
                                            {member.name.charAt(0)}
                                        </span>
                                    </div>
                                    {/* Glow effect on hover */}
                                    <motion.div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            boxShadow: `inset 0 0 30px ${faction.primaryColor}40`,
                                        }}
                                    />
                                </div>

                                {/* Member info */}
                                <div className="text-center">
                                    <h3
                                        className="text-lg font-bold text-white mb-1 group-hover:text-opacity-100 transition-colors"
                                        style={{ fontFamily: isClassified ? 'monospace' : 'inherit' }}
                                    >
                                        {member.name}
                                    </h3>
                                    <p
                                        className="text-sm font-medium mb-2"
                                        style={{ color: faction.primaryColor }}
                                    >
                                        {member.role}
                                    </p>
                                    <span
                                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            background: `${faction.primaryColor}15`,
                                            color: `${faction.primaryColor}cc`,
                                        }}
                                    >
                                        {member.rank}
                                    </span>
                                </div>

                                {/* Bottom accent line */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background: `linear-gradient(90deg, transparent, ${faction.primaryColor}, transparent)`,
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Join us CTA */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-[var(--foreground-muted)] mb-4 text-neutral-400">
                        {isClassified ? 'Clearance level required.' : 'Think you have what it takes?'}
                    </p>
                    <motion.button
                        className="btn-cinematic px-8 py-3 rounded-md font-bold text-white uppercase tracking-wider relative overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${faction.primaryColor} 0%, ${faction.gradientTo} 100%)`,
                            boxShadow: `0 4px 20px ${faction.primaryColor}40`
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isClassified ? 'REQUEST ACCESS' : 'Apply to Join'}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
