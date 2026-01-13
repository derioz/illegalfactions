'use client';

import { motion } from 'framer-motion';
import { factions } from '@/lib/factions';
import { FactionCard } from './FactionCard';

export function FactionGrid() {
    return (
        <section className="relative py-24 px-4 md:px-8">
            {/* Section background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background-secondary)]/50 to-transparent" />

            <div className="relative max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.span
                        className="inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4"
                        style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(220, 38, 38, 0.3)',
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        Choose Your Allegiance
                    </motion.span>

                    <h2 className="section-title gradient-text mb-4">
                        The Underground
                    </h2>

                    <p className="section-subtitle mx-auto">
                        Twelve factions. Infinite stories. Each with their own code, their own
                        territory, and their own way of life. Where will your loyalty lie?
                    </p>
                </motion.div>

                {/* Faction grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {factions.map((faction, index) => (
                        <FactionCard key={faction.id} faction={faction} index={index} />
                    ))}
                </div>

                {/* Bottom accent */}
                <motion.div
                    className="mt-16 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="inline-flex items-center gap-4 text-[var(--foreground-muted)] text-sm">
                        <div className="w-12 h-px bg-gradient-to-r from-transparent to-[var(--foreground-muted)]" />
                        <span>More factions coming soon</span>
                        <div className="w-12 h-px bg-gradient-to-l from-transparent to-[var(--foreground-muted)]" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
