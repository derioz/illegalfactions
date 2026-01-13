'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Faction } from '@/lib/factions';

import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';
import { LoreSection } from './LoreSection';

// Lore content from user
const mcLore = {
    manifesto: [
        {
            title: "THE ARRIVAL",
            content: "Steel thunder echoed down the back roads this week as the Pale Riders MC - Northside Chapter rolled into town. The rumble of heavy engines wasn't just noise—it was the sound of a new chapter laying claim to the open road. Boots hit pavement, tires gripped asphalt, and heads turned. We weren't trying to sneak in. That's not our style."
        },
        {
            title: "THE METHOD",
            content: "We've been watching the lay of the land, meeting faces, and taking slow, deliberate steps toward what we hope will become our new home. Whether we were posted up at a quiet corner bar or cruising past unfamiliar streets, one thing's for sure—the Pale Riders are here now, and we ride with intent."
        },
        {
            title: "THE STANDARD",
            content: "Church has already been held, prospects are getting their marching orders, and the hangarounds know the standard. We're not looking to start trouble—but we're not the type to be pushed around either. Respect gets respect, and we ride with honor, loyalty, and the weight of our patch behind every word we say."
        },
        {
            title: "THE CLAIM",
            content: "We didn't come for the spotlight. We came to ride, build, and claim our space—one mile, one deal, one earned name at a time. So if you see us on the road, give a nod—or give us space. Either way, we're rolling through."
        }
    ],
    brotherhood: {
        title: "TOGETHER WE STAND",
        content: [
            "This week the roar of engines were replaced by tense silence and the ever-present threat of the undead, but the code of brotherhood remains as strong as ever. When the world falls apart, what keeps us together isn't just shared patches on our backs, but the trust built from countless rides through storm and sunshine, hardship and celebration.",
            "In those quiet moments between the chaos, we remind ourselves that the brothers and sisters next to us are ready to stand their ground, no questions asked, because that's what it means to wear our colors. Even when the world outside is unrecognizable we will always Raise Hell! Praise Pale!"
        ],
        motto: "RAISE HELL! PRAISE PALE!"
    }
};

export function PaleRidersPage({ faction }: { faction: Faction }) {
    return (
        <>
            {/* Google Fonts for MC style */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&display=swap');
                
                .mc-heading {
                    font-family: 'Bebas Neue', 'Oswald', sans-serif;
                    letter-spacing: 0.05em;
                }
                
                .mc-text {
                    font-family: 'Oswald', sans-serif;
                }
            `}</style>

            <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white">

                {/* Leather texture background */}
                <div
                    className="fixed inset-0 z-0 opacity-30 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                        backgroundColor: '#1a1a1a'
                    }}
                />

                {/* Chrome stripe accents */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent z-40 pointer-events-none" />
                <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent z-40 pointer-events-none" />

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 z-10">
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950/90 to-black z-0" />

                    {/* Road/asphalt texture stripes */}
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />
                        <div className="absolute top-1/2 left-0 right-0 h-[200px] -translate-y-1/2"
                            style={{
                                background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 100px, rgba(255,255,255,0.1) 100px, rgba(255,255,255,0.1) 120px)',
                            }}
                        />
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8"
                        >
                            {/* Logo glow effect */}
                            <div className="absolute inset-0 bg-blue-600/30 rounded-full blur-[80px]" />
                            <Image
                                src="/factions/paleriders-logo.png"
                                alt="Pale Riders MC"
                                fill
                                className="object-contain drop-shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                                priority
                            />
                        </motion.div>

                        {/* Chrome divider */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-48 h-0.5 mx-auto mb-6 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                        />

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mc-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-wider text-white mb-2"
                            style={{ textShadow: '0 0 40px rgba(37,99,235,0.4)' }}
                        >
                            PALE RIDERS
                        </motion.h1>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="mc-heading text-2xl md:text-4xl text-blue-500 tracking-[0.3em] mb-8"
                        >
                            NORTHSIDE CHAPTER
                        </motion.h2>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="mc-text text-xl md:text-2xl text-neutral-400 uppercase tracking-widest"
                        >
                            {faction.tagline}
                        </motion.p>

                        {/* Faction Description */}
                        {faction.description && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                                className="mc-text text-lg text-neutral-500 max-w-2xl mx-auto mt-8 leading-relaxed"
                            >
                                {faction.description}
                            </motion.p>
                        )}

                        {/* MC badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="inline-block mt-10 px-6 py-3 border-2 border-blue-600 bg-blue-600/10"
                        >
                            <span className="mc-heading text-2xl text-blue-500 tracking-widest">1% MC</span>
                        </motion.div>
                    </div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    >
                        <span className="mc-text text-xs tracking-[0.4em] text-neutral-500 uppercase">Ride On</span>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-5 h-8 border-2 border-neutral-600 rounded-full flex justify-center"
                        >
                            <motion.div
                                className="w-1 h-2 bg-blue-500 rounded-full mt-1"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </motion.div>
                    </motion.div>
                </section>





                {/* Standard sections with theming */}
                <div className="relative z-10 bg-black">
                    <LoreSection faction={faction} />
                    <RosterSection faction={faction} />
                    <GallerySection faction={faction} />
                </div>


            </div>
        </>
    );
}
