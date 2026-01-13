'use client';

import { motion } from 'framer-motion';
import { Faction } from '@/lib/factions';

interface ClipsSectionProps {
    faction: Faction;
}

// Sample clips data - in production, this would come from Firebase
const sampleClips = [
    {
        id: '1',
        title: 'Epic Chase Scene',
        platform: 'youtube',
        thumbnail: null,
        videoId: 'dQw4w9WgXcQ',
    },
    {
        id: '2',
        title: 'Territory Takeover',
        platform: 'youtube',
        thumbnail: null,
        videoId: 'dQw4w9WgXcQ',
    },
    {
        id: '3',
        title: 'Initiation Ceremony',
        platform: 'youtube',
        thumbnail: null,
        videoId: 'dQw4w9WgXcQ',
    },
];

export function ClipsSection({ faction }: ClipsSectionProps) {
    const isClassified = faction.type === 'classified';
    const fontClass = isClassified ? 'font-mono' : '';

    return (
        <section
            id="clips"
            className={`relative py-24 px-4 md:px-8 bg-neutral-950/50 backdrop-blur-sm ${fontClass}`}
        >
            {/* Background accent */}
            <div
                className="absolute top-0 left-1/4 w-[600px] h-[600px] opacity-10 blur-3xl"
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
                        {isClassified ? 'Visual Evidence' : 'Watch & Learn'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {isClassified ? 'FOOTAGE' : 'Clips'}
                    </h2>
                    <p className="mx-auto text-[var(--foreground-muted)] text-neutral-400 max-w-2xl">
                        {isClassified ? 'Recovered surveillance data.' : 'Our most memorable moments caught on camera'}
                    </p>
                </motion.div>

                {/* Clips grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleClips.map((clip, index) => (
                        <motion.div
                            key={clip.id}
                            className="group relative"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <motion.div
                                className="glass-card overflow-hidden rounded-xl border border-white/5 bg-neutral-900/50"
                                whileHover={{ scale: 1.02, borderColor: faction.primaryColor }}
                                style={{
                                    border: `1px solid ${faction.primaryColor}10`
                                }}
                            >
                                {/* Video thumbnail */}
                                <div className="relative aspect-video overflow-hidden">
                                    {/* Placeholder gradient */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${faction.gradientFrom}90 0%, ${faction.gradientTo}90 100%)`,
                                        }}
                                    />

                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <motion.div
                                            className="w-16 h-16 rounded-full flex items-center justify-center"
                                            style={{
                                                background: faction.primaryColor,
                                                boxShadow: `0 0 30px ${faction.primaryColor}60`,
                                                color: isClassified ? '#000' : '#fff'
                                            }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <svg
                                                className="w-6 h-6 ml-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </motion.div>
                                    </div>

                                    {/* Platform badge */}
                                    <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 text-xs text-white font-medium backdrop-blur-md">
                                        {clip.platform === 'youtube' ? 'YouTube' : 'Twitch'}
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Clip info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-opacity-100 transition-colors">
                                        {clip.title}
                                    </h3>
                                    <p className="text-sm text-neutral-400 mt-1">
                                        {isClassified ? 'Decrypting...' : 'Click to watch'}
                                    </p>
                                </div>

                                {/* Bottom accent */}
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

                {/* View more */}
                <motion.div
                    className="text-center mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.button
                        className="px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95"
                        style={{
                            border: `1px solid ${faction.primaryColor}50`,
                            color: faction.primaryColor,
                            background: 'transparent'
                        }}
                        whileHover={{
                            scale: 1.05,
                            background: `${faction.primaryColor}10`,
                            boxShadow: `0 0 20px ${faction.primaryColor}20`
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isClassified ? '[ACCESS_ARCHIVES]' : 'View All Clips'}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
