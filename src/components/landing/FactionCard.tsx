'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Faction } from '@/lib/factions';

interface FactionCardProps {
    faction: Faction;
    index: number;
}

export function FactionCard({ faction, index }: FactionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
            }}
        >
            <Link href={`/${faction.id}`}>
                <motion.div
                    className="faction-card group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        background: `linear-gradient(135deg, ${faction.gradientFrom} 0%, ${faction.gradientTo} 100%)`,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `radial-gradient(circle at 50% 50%, ${faction.primaryColor}40 0%, transparent 50%)`,
                            }}
                        />
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${faction.primaryColor}30 0%, transparent 70%)`,
                        }}
                    />

                    {/* Content container */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                        {/* Faction type badge */}
                        <motion.div
                            className="mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                        >
                            <span
                                className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                                style={{
                                    background: `${faction.primaryColor}30`,
                                    color: faction.primaryColor,
                                    border: `1px solid ${faction.primaryColor}50`,
                                }}
                            >
                                {faction.type === 'mc' ? 'Motorcycle Club' : faction.type}
                            </span>
                        </motion.div>

                        {/* Faction name */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                            {faction.name}
                        </h3>

                        {/* Tagline */}
                        <p
                            className="text-sm font-medium opacity-80 mb-4"
                            style={{ color: faction.accentColor === '#0a0a0a' || faction.accentColor === '#1a1a1a' || faction.accentColor === '#18181b' || faction.accentColor === '#0f0f0f' ? '#fff' : faction.accentColor }}
                        >
                            {faction.tagline}
                        </p>

                        {/* Description preview */}
                        <p className="text-sm text-white/60 line-clamp-2 group-hover:text-white/80 transition-colors duration-300">
                            {faction.description}
                        </p>

                        {/* Enter arrow */}
                        <motion.div
                            className="mt-4 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors duration-300"
                            initial={{ x: 0 }}
                            whileHover={{ x: 10 }}
                        >
                            <span className="text-sm font-medium">Enter Territory</span>
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Corner accent */}
                    <div
                        className="absolute top-0 right-0 w-32 h-32 opacity-30"
                        style={{
                            background: `linear-gradient(135deg, ${faction.primaryColor} 0%, transparent 70%)`,
                        }}
                    />

                    {/* Bottom border glow on hover */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(90deg, transparent, ${faction.primaryColor}, transparent)`,
                            boxShadow: `0 0 20px ${faction.primaryColor}`,
                        }}
                    />
                </motion.div>
            </Link>
        </motion.div>
    );
}
