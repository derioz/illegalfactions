'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Faction } from '@/lib/factions';

import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';
import { LoreSection } from './LoreSection';

export function AngelsPage({ faction }: { faction: Faction }) {
    return (
        <>
            {/* Google Fonts for Angels style */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Rock+Salt&display=swap');
                
                .angels-heading {
                    font-family: 'Permanent Marker', cursive;
                }
                
                .angels-handwriting {
                    font-family: 'Rock Salt', cursive;
                }
            `}</style>

            <div className="min-h-screen bg-black text-white selection:bg-pink-600 selection:text-white overflow-x-hidden">

                {/* Grunge/Noise Texture Background */}
                <div
                    className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                    }}
                />

                {/* Pink Graffiti Splatter effects (CSS radial gradients mostly) */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-pink-600/20 blur-[100px] pointer-events-none z-0" />
                <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/40 blur-[120px] pointer-events-none z-0" />

                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 z-10">
                    <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto flex flex-col items-center">

                        {/* Logo Container with Glitch/Glow */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative w-80 h-80 md:w-[500px] md:h-[500px] mb-8"
                        >
                            <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-[80px] animate-pulse" />
                            <Image
                                src="/factions/angels-logo.png"
                                alt="Angels Gang"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                                priority
                            />
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            {/* Spray Paint Effect behind title */}
                            <div className="absolute -inset-10 bg-black/60 blur-xl -z-10 rounded-full" />

                            <h1 className="angels-heading text-7xl md:text-9xl text-white mb-4 relative z-10"
                                style={{
                                    textShadow: `4px 4px 0px ${faction.primaryColor}, 8px 8px 0px #000`
                                }}
                            >
                                ANGELS
                            </h1>

                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="angels-handwriting text-xl md:text-3xl text-pink-500 mt-4 -rotate-2"
                            >
                                "{faction.tagline}"
                            </motion.p>
                        </motion.div>

                        {/* Scroll Down Arrow */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-pink-500 text-4xl"
                            >
                                ↓
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Content Sections */}
                <div className="relative z-10 space-y-0">
                    {/* Sections connect seamlessly */}

                    {/* Lore Section with Pink Grunge Border */}
                    <div className="relative border-t-2 border-pink-900/30 bg-black/80 backdrop-blur-sm">
                        <LoreSection faction={faction} />
                    </div>

                    {/* Roster Section */}
                    <div className="relative border-t-2 border-pink-900/30 bg-neutral-900/50">
                        <RosterSection faction={faction} />
                    </div>

                    {/* Gallery Section */}
                    <div className="relative border-t-2 border-pink-900/30">
                        <GallerySection faction={faction} />
                    </div>
                </div>
            </div>
        </>
    );
}
