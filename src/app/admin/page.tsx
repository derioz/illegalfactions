'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { factions } from '@/lib/factions';

export default function AdminDashboard() {
    const { user, userRole } = useAuth();
    const isSuperAdmin = userRole?.isSuperAdmin || false;
    const accessibleFactions = isSuperAdmin
        ? factions
        : factions.filter((f) => userRole?.factionIds.includes(f.id));

    return (
        <div>
            <div className="mb-8">
                <motion.h1
                    className="text-3xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Welcome back{isSuperAdmin ? ', Super Admin' : ''}
                </motion.h1>
                <motion.p
                    className="text-[var(--foreground-muted)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {user?.email}
                </motion.p>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <StatCard title="Total Factions" value={factions.length.toString()} color="#dc2626" />
                <StatCard title="Your Factions" value={accessibleFactions.length.toString()} color="#22c55e" />
                <StatCard title="Gallery Items" value="--" color="#3b82f6" />
                <StatCard title="Video Clips" value="--" color="#a855f7" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="text-xl font-bold text-white mb-4">
                    {isSuperAdmin ? 'All Factions' : 'Your Factions'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accessibleFactions.map((faction, index) => (
                        <motion.div
                            key={faction.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                        >
                            <Link href={`/admin/faction/${faction.id}`}>
                                <div className="glass-card p-4 hover:border-white/20 transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${faction.gradientFrom}, ${faction.gradientTo})` }}
                                        >
                                            <span className="text-white font-bold text-lg">{faction.name.charAt(0)}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-semibold truncate">{faction.name}</h3>
                                            <p className="text-sm text-[var(--foreground-muted)] truncate">
                                                {faction.type === 'mc' ? 'Motorcycle Club' : faction.type}
                                            </p>
                                        </div>
                                        <svg className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-white transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
    return (
        <div className="glass-card p-6">
            <div className="w-10 h-10 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: `${color}20`, color }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
            <p className="text-sm text-[var(--foreground-muted)]">{title}</p>
        </div>
    );
}
