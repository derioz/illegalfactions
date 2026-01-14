'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Faction } from '@/lib/factions';
import { LoreSection } from './LoreSection';
import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';

export function MujouKaiPage({ faction }: { faction: Faction }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Gentle rotation for the enso circle
    const ensoRotation = useTransform(scrollYProgress, [0, 1], [0, 45]);
    const fadeIn = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600;700&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&display=swap');
                
                .mujo-serif {
                    font-family: 'Noto Serif JP', serif;
                }
                
                .mujo-sans {
                    font-family: 'Zen Kaku Gothic New', sans-serif;
                }

                /* Flowing sand texture */
                .sand-texture {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E");
                }

                /* Ink wash effect */
                .ink-wash {
                    background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.8) 100%);
                }

                /* Zen garden lines pattern */
                .zen-lines::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 60px,
                        rgba(212, 165, 116, 0.03) 60px,
                        rgba(212, 165, 116, 0.03) 61px
                    );
                }
            `}</style>

            <div ref={containerRef} className="min-h-screen bg-[#0a0908] text-[#e8e4df] selection:bg-[#d4a574] selection:text-black overflow-x-hidden">

                {/* PERSISTENT AMBIENT ELEMENTS */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908] via-[#12100e]/50 to-[#0a0908]" />
                    <div className="absolute inset-0 opacity-[0.015] sand-texture" />

                    {/* Floating Ensō Circle - Subtle Background Element */}
                    <motion.div
                        style={{ rotate: ensoRotation }}
                        className="absolute -right-96 top-1/4 w-[1000px] h-[1000px] opacity-[0.02]"
                    >
                        <div className="w-full h-full rounded-full border-[80px] border-[#d4a574]"
                            style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
                    </motion.div>
                </div>

                {/* HERO SECTION: THE PHILOSOPHY OF IMPERMANENCE */}
                <section className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">

                    {/* Vertical Japanese Text - Left */}
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="writing-mode-vertical text-[#d4a574]/10 text-2xl mujo-serif tracking-[0.5em]"
                            style={{ writingMode: 'vertical-rl' }}>
                            無常会
                        </div>
                    </div>

                    {/* Vertical Japanese Text - Right */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="text-[#d4a574]/10 text-sm mujo-sans tracking-[0.3em]"
                            style={{ writingMode: 'vertical-rl' }}>
                            DIRECTED DECAY
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center max-w-5xl text-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="relative group mb-16"
                        >
                            <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] filter drop-shadow-[0_0_60px_rgba(212,165,116,0.15)] group-hover:drop-shadow-[0_0_80px_rgba(212,165,116,0.3)] transition-all duration-1000">
                                <Image
                                    src="/factions/mujou-kai-logo.png"
                                    alt="Mujō-Kai"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 1 }}
                        >
                            <h1 className="mujo-serif text-5xl md:text-8xl text-white mb-4 tracking-[0.1em] font-light">
                                MUJŌ<span className="text-[#d4a574]">-</span>KAI
                            </h1>
                            <p className="mujo-sans text-base md:text-xl text-[#d4a574]/70 tracking-[0.4em] mb-8 uppercase font-light">
                                無常会
                            </p>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="mujo-serif text-lg md:text-2xl text-white/50 italic max-w-2xl leading-relaxed"
                        >
                            &ldquo;Nothing lasts. Not even you.&rdquo;
                        </motion.p>

                        {/* Scroll Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="absolute bottom-12 left-1/2 -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="w-px h-20 bg-gradient-to-b from-transparent via-[#d4a574]/40 to-transparent"
                            />
                        </motion.div>
                    </div>
                </section>

                {/* THE DOCTRINE: PHILOSOPHY SECTION */}
                <section className="relative py-32 overflow-hidden zen-lines">
                    <div className="max-w-6xl mx-auto px-8 relative">
                        {/* Faded Background Kanji */}
                        <div className="absolute -top-20 right-0 text-[25rem] mujo-serif text-white/[0.015] select-none pointer-events-none leading-none">
                            無
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1 }}
                            className="grid md:grid-cols-2 gap-16 items-start"
                        >
                            {/* Left: The Doctrine */}
                            <div className="relative">
                                <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-4 block">
                                    The Doctrine
                                </span>
                                <h2 className="mujo-serif text-5xl md:text-7xl text-white mb-8 font-light italic">
                                    Directed <span className="text-[#d4a574]">Decay</span>
                                </h2>
                                <div className="w-24 h-px bg-gradient-to-r from-[#d4a574] to-transparent mb-8" />

                                <div className="space-y-6 mujo-sans text-white/60 leading-relaxed">
                                    <p>
                                        The Mujō-Kai did not rise—it coalesced. Like ash settling after a fire,
                                        it formed a new, darker shape from the remnants of what was burned away.
                                    </p>
                                    <p>
                                        Its doctrine was not written in manifestos, but understood in silence:
                                        <span className="text-[#d4a574]"> Nothing lasts.</span> Not empires, not alliances, not enemies.
                                    </p>
                                    <p>
                                        Therefore, the only intelligent approach was to become the agent of that
                                        impermanence for others, while structuring oneself to flow with it.
                                    </p>
                                </div>
                            </div>

                            {/* Right: The Method */}
                            <div className="relative md:pt-24">
                                <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 backdrop-blur-sm">
                                    <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-6 block">
                                        Their Method
                                    </span>
                                    <p className="mujo-serif text-2xl text-white mb-6 italic">
                                        &ldquo;They would not build a static empire to be toppled.&rdquo;
                                    </p>
                                    <p className="mujo-sans text-white/50 text-sm leading-relaxed">
                                        They would become a directed current within the chaos of the city.
                                        They do not engage in reckless warfare. That is the resistance to change—a
                                        costly and fragile effort to make something last.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* THE STRUCTURE: FLOWING SAND */}
                <section className="relative py-32 bg-[#08070a] overflow-hidden">
                    <div className="absolute inset-0 ink-wash pointer-events-none" />

                    <div className="max-w-6xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-4 block">
                                Hierarchy
                            </span>
                            <h2 className="mujo-serif text-5xl md:text-7xl text-white font-light">
                                The Structure of <span className="text-[#d4a574] italic">Flowing Sand</span>
                            </h2>
                        </motion.div>

                        {/* Leadership Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "The Directors",
                                    names: "Henry Clum & Billie Stapleton",
                                    desc: "No longer front-line fighters. His power lies in perception. Her power lies in listening and guiding.",
                                    symbol: "導"
                                },
                                {
                                    title: "The Engine of Decay",
                                    names: "Bobby Clum",
                                    desc: "Henry's brother is the ruthless practitioner of mujō. If something needs to end—a rival, a partnership, or even a witness.",
                                    symbol: "滅"
                                },
                                {
                                    title: "The Protégé",
                                    names: "Nikos Clum",
                                    desc: "Henry's son, being trained by both philosophies of his father and uncle, to pick up the mantle and lead when his father can carry on no more.",
                                    symbol: "継"
                                },
                                {
                                    title: "The Flowing Council",
                                    names: "Jack, Monkey, Veronica & Others",
                                    desc: "Former members who understand territory not as property, but as a temporary condition—who see product, routes, and demand as shifting tides to be navigated.",
                                    symbol: "流"
                                }
                            ].map((leader, i) => (
                                <motion.div
                                    key={leader.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white/[0.02] border border-white/5 p-6 hover:bg-white/[0.04] hover:border-[#d4a574]/20 transition-all duration-500"
                                >
                                    {/* Kanji Symbol */}
                                    <div className="absolute -top-4 -right-2 text-6xl mujo-serif text-[#d4a574]/10 group-hover:text-[#d4a574]/20 transition-colors">
                                        {leader.symbol}
                                    </div>

                                    <span className="mujo-sans text-[#d4a574] text-xs tracking-[0.3em] uppercase block mb-2">
                                        {leader.title}
                                    </span>
                                    <h3 className="mujo-serif text-lg text-white mb-3 font-normal">
                                        {leader.names}
                                    </h3>
                                    <p className="mujo-sans text-white/40 text-sm leading-relaxed">
                                        {leader.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* KOI: THE SYMBOL */}
                <section className="relative py-32 overflow-hidden">
                    <div className="max-w-5xl mx-auto px-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative bg-gradient-to-br from-[#0d0c0a] to-[#0a0908] border border-[#d4a574]/10 p-12 md:p-20"
                        >
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#d4a574]/30" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#d4a574]/30" />

                            <div className="flex flex-col md:flex-row gap-12 items-center">
                                <div className="flex-1">
                                    <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-4 block">
                                        Their Base
                                    </span>
                                    <h3 className="mujo-serif text-4xl md:text-6xl text-white mb-6 italic font-light">
                                        Koi
                                    </h3>
                                    <p className="mujo-sans text-white/50 leading-relaxed mb-6">
                                        The perfect symbol: a place of surface tranquility and cultured reflection,
                                        beneath which dark, powerful shapes move with silent purpose.
                                    </p>
                                    <p className="mujo-sans text-white/40 text-sm leading-relaxed">
                                        The restaurant&apos;s profits are clean, but its private rooms are where futures
                                        are dissolved and reborn over steaming cups.
                                    </p>
                                </div>
                                <div className="w-48 h-48 relative opacity-60">
                                    <Image
                                        src="/factions/mujou-kai-logo.png"
                                        alt="Mujō-Kai"
                                        fill
                                        className="object-contain filter grayscale"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* LORE SECTION */}
                <section id="lore" className="relative py-32 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8 relative">
                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            {/* Sticky Header */}
                            <div className="md:sticky md:top-32 w-full md:w-1/3">
                                <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-4 block">
                                    Chronicles
                                </span>
                                <h2 className="mujo-serif text-5xl md:text-7xl text-white mb-4 font-light italic">
                                    The <span className="text-[#d4a574]">Wind</span>
                                </h2>
                                <div className="w-16 h-px bg-[#d4a574] mb-8" />
                                <p className="mujo-sans text-sm text-white/40 leading-relaxed">
                                    In a world of permanent temporariness, they have chosen to become the wind.
                                </p>
                            </div>

                            {/* Scrollable Content */}
                            <div className="w-full md:w-2/3">
                                <div className="relative">
                                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#d4a574]/20 to-transparent" />
                                    <LoreSection faction={faction} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ROSTER SECTION */}
                <section id="roster" className="relative py-32 bg-[#08070a] border-y border-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex flex-col items-center mb-24">
                            <span className="mujo-sans text-[#d4a574]/60 text-xs tracking-[0.5em] uppercase mb-4">
                                Members
                            </span>
                            <h2 className="mujo-serif text-5xl md:text-7xl text-white font-light italic">
                                The <span className="text-[#d4a574]">Current</span>
                            </h2>
                        </div>
                        <RosterSection faction={faction} />
                    </div>
                </section>

                {/* GALLERY SECTION */}
                <section id="gallery" className="relative py-32">
                    <div className="absolute inset-0 sand-texture opacity-[0.02]" />
                    <div className="relative z-10 max-w-[1400px] mx-auto px-8">
                        <div className="mb-24 flex items-baseline gap-8">
                            <h2 className="mujo-serif text-6xl md:text-8xl text-white/10 uppercase font-light">
                                Archives
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#d4a574]/20 to-transparent" />
                        </div>
                        <GallerySection faction={faction} />
                    </div>
                </section>

                {/* FINAL SECTION: THE WIND */}
                <footer className="relative h-screen flex flex-col items-center justify-center text-center p-8">
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#d4a574]/10 to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10"
                    >
                        <Image
                            src="/factions/mujou-kai-logo.png"
                            alt="Mujō-Kai"
                            width={180}
                            height={180}
                            className="mb-12 opacity-30 filter grayscale"
                        />

                        <p className="mujo-serif text-4xl md:text-6xl text-white mb-4 font-light italic max-w-3xl leading-tight">
                            They alone are prepared to grow something new,
                        </p>
                        <p className="mujo-serif text-3xl md:text-5xl text-[#d4a574]/80 mb-12 font-light italic">
                            knowing it too will one day pass.
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mujo-sans text-xs text-[#d4a574] border border-[#d4a574]/30 px-12 py-5 bg-black/40 backdrop-blur-xl transition-all uppercase tracking-[0.5em] hover:bg-[#d4a574] hover:text-black hover:border-transparent"
                        >
                            無常
                        </motion.button>
                    </motion.div>
                </footer>
            </div>
        </>
    );
}
