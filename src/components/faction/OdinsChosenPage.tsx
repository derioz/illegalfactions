'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Faction } from '@/lib/factions';
import { LoreSection } from './LoreSection';
import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';

export function OdinsChosenPage({ faction }: { faction: Faction }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const runeRotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=MedievalSharp&family=Eater&display=swap');
                
                .odin-font {
                    font-family: 'Cinzel Decorative', cursive;
                }
                
                .rune-font {
                    font-family: 'MedievalSharp', cursive;
                }

                .beast-font {
                    font-family: 'Eater', cursive;
                }

                .stone-texture {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
                }

                .parallax-bg {
                    background-attachment: fixed;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }
            `}</style>

            <div ref={containerRef} className="min-h-screen bg-[#050507] text-[#e5e7eb] selection:bg-[#d4af37] selection:text-black overflow-x-hidden">

                {/* PERSISTENT MYTHIC ELEMENTS */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1f]/10 to-[#050507]" />
                    <div className="absolute inset-0 opacity-[0.02] stone-texture" />

                    {/* Animated Runic Compass */}
                    <motion.div
                        style={{ rotate: runeRotation }}
                        className="absolute -right-64 -top-64 w-[800px] h-[800px] border-[40px] border-[#d4af37]/5 rounded-full flex items-center justify-center"
                    >
                        <div className="w-full h-full border-[1px] border-[#d4af37]/10 rounded-full animate-pulse" />
                    </motion.div>
                </div>

                {/* HERO SECTION: THE ALLFATHER'S GAZE */}
                <section className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
                    {/* Side Runes */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-10">
                        {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'].map((rune, i) => (
                            <span key={i} className="text-4xl text-[#d4af37]">{rune}</span>
                        ))}
                    </div>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-10">
                        {['ᚷ', 'ᚹ', 'ᚺ', 'ᚻ', 'ᛊ', 'ᛋ'].map((rune, i) => (
                            <span key={i} className="text-4xl text-[#d4af37]">{rune}</span>
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-5xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative group mb-12"
                        >
                            <div className="absolute top-[42%] left-[44%] w-4 h-4 bg-[#d4af37] rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse shadow-[0_0_20px_#d4af37]" />

                            <div className="relative w-80 h-80 md:w-[600px] md:h-[600px] filter drop-shadow-[0_0_40px_rgba(212,175,55,0.1)] group-hover:drop-shadow-[0_0_60px_rgba(212,175,55,0.25)] transition-all duration-1000">
                                <Image
                                    src="/factions/odins-chosen-logo.png"
                                    alt="Odin's Chosen MC"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h1 className="odin-font text-6xl md:text-9xl text-white mb-6 uppercase tracking-[-0.05em]">
                                ODIN&apos;S <span className="text-[#d4af37]">CHOSEN</span>
                            </h1>
                            <p className="rune-font text-lg md:text-2xl text-[#d4af37] tracking-[1em] mb-8 uppercase opacity-60">
                                {faction.tagline}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* THE SAGAS: A NEW LORE EXPERIENCE */}
                <section id="lore" className="relative py-32 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8 relative">
                        {/* Background Giant Text */}
                        <div className="absolute -top-20 -left-10 text-[20rem] odin-font text-white/[0.02] select-none pointer-events-none">SAGA</div>

                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            {/* Sticky Header */}
                            <div className="md:sticky md:top-32 w-full md:w-1/3">
                                <h2 className="odin-font text-6xl md:text-8xl text-white mb-4 italic leading-none">THE <br /><span className="text-[#d4af37]">SAGAS</span></h2>
                                <div className="w-20 h-1 bg-[#d4af37] mb-8" />
                                <p className="rune-font text-sm text-[#d4af37]/60 tracking-widest uppercase leading-relaxed">
                                    "WRITTEN IN BLOOD, ETCHED IN STEEL. OUR HISTORY IS NOT FOR THE WEAK."
                                </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="w-full md:w-2/3">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    className="relative"
                                >
                                    {/* Decorative Borders */}
                                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4af37]/40 to-transparent" />

                                    <div className="space-y-12">
                                        <LoreSection faction={faction} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE BROTHERHOOD: ROSTER */}
                <section id="roster" className="relative py-32 bg-[#08080a] border-y border-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex flex-col items-center mb-24">
                            <span className="beast-font text-[#d4af37] text-2xl mb-4">Einherjar</span>
                            <h2 className="odin-font text-6xl md:text-8xl text-white italic">The <span className="text-[#d4af37]">Brotherhood</span></h2>
                        </div>
                        <RosterSection faction={faction} />
                    </div>
                </section>

                {/* THE VAULT: GALLERY */}
                <section id="gallery" className="relative py-48 bg-stone-texture bg-fixed">
                    <div className="absolute inset-0 bg-[#050507]/90 z-0" />
                    <div className="relative z-10 max-w-[1400px] mx-auto px-8">
                        <div className="mb-24 flex items-baseline gap-8">
                            <h2 className="odin-font text-7xl md:text-9xl text-white opacity-10 uppercase">THE VAULT</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/40 to-transparent" />
                        </div>
                        <GallerySection faction={faction} />
                    </div>
                </section>

                {/* FINAL ASCENSION */}
                <footer className="relative h-screen flex flex-col items-center justify-center text-center p-8">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#d4af37]/20 to-transparent pointer-events-none" />

                    <motion.div
                        whileInView={{ y: [20, 0], opacity: [0, 1] }}
                        className="relative z-10"
                    >
                        <Image src="/factions/odins-chosen-logo.png" alt="Odin" width={200} height={200} className="mb-12 opacity-40 grayscale filter brightness-200" />
                        <h3 className="odin-font text-5xl md:text-7xl text-white mb-8">BLOOD IS <span className="text-[#d4af37]">THE ONLY</span> CURRENCY</h3>

                        <motion.button
                            whileHover={{ scale: 1.05, letterSpacing: "1em" }}
                            className="odin-font text-xs text-[#d4af37] border border-[#d4af37]/30 px-16 py-6 rounded-full bg-black/40 backdrop-blur-xl transition-all uppercase tracking-[0.5em] hover:bg-[#d4af37] hover:text-black hover:border-transparent"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            Return To Origin
                        </motion.button>
                    </motion.div>
                </footer>
            </div>
        </>
    );
}
