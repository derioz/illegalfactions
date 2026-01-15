'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Faction } from '@/lib/factions';
import { LoreSection } from './LoreSection';
import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';

export function LosSantosMobPage({ faction }: { faction: Faction }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Parallax transforms
    const heroY = useTransform(heroProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(heroProgress, [0, 0.6], [1, 0]);
    const smokeY = useTransform(heroProgress, [0, 1], [0, -100]);
    const textY = useTransform(heroProgress, [0, 1], [0, 80]);

    // Mouse parallax for hero
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 15,
                y: (e.clientY / window.innerHeight - 0.5) * 15
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Color palette from logo
    const colors = {
        smoke: '#8b7355',      // Smoky brown
        tan: '#c4a574',        // Muted tan/gold
        charcoal: '#1a1816',   // Dark charcoal
        black: '#0d0c0b',      // Near black
        warmBlack: '#151312',  // Warm black
    };

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
                
                .mob-serif {
                    font-family: 'Cormorant Garamond', serif;
                }
                
                .mob-display {
                    font-family: 'Oswald', sans-serif;
                }
                
                .mob-body {
                    font-family: 'Inter', sans-serif;
                }

                /* Smoke drift animation */
                @keyframes smoke-drift {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    50% { transform: translateY(-30px) translateX(20px); opacity: 0.5; }
                }

                .smoke-layer-1 { animation: smoke-drift 20s ease-in-out infinite; }
                .smoke-layer-2 { animation: smoke-drift 25s ease-in-out infinite reverse; animation-delay: -8s; }
                .smoke-layer-3 { animation: smoke-drift 30s ease-in-out infinite; animation-delay: -15s; }

                /* Vignette */
                .noir-vignette {
                    box-shadow: inset 0 0 250px 80px rgba(0,0,0,0.85);
                }

                /* Grain texture */
                .grain-overlay {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                }
            `}</style>

            <div ref={containerRef} className="min-h-screen bg-[#0d0c0b] text-[#e8e4df] selection:bg-[#8b7355] selection:text-black overflow-x-hidden">

                {/* GRAIN OVERLAY */}
                <div className="fixed inset-0 pointer-events-none z-[100] grain-overlay opacity-[0.025] mix-blend-overlay" />

                {/* VIGNETTE */}
                <div className="fixed inset-0 pointer-events-none z-[99] noir-vignette" />

                {/* AMBIENT SMOKE */}
                <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
                    <motion.div style={{ y: smokeY }} className="absolute inset-0">
                        <div className="smoke-layer-1 absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#8b7355]/15 via-[#1a1816]/30 to-transparent" />
                        <div className="smoke-layer-2 absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#0d0c0b]/50 via-[#8b7355]/5 to-transparent" />
                        <div className="smoke-layer-3 absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#c4a574]/5 via-transparent to-transparent" />
                    </motion.div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* HERO SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

                    {/* Parallax Background */}
                    <motion.div
                        style={{ y: heroY, opacity: heroOpacity }}
                        className="absolute inset-0 z-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] via-[#0d0c0b] to-[#0d0c0b]" />

                        {/* Radial glow following mouse */}
                        <div
                            className="absolute inset-0 opacity-20 transition-all duration-1000"
                            style={{
                                background: `radial-gradient(ellipse at ${50 + mousePosition.x * 0.3}% ${45 + mousePosition.y * 0.3}%, #8b7355 0%, transparent 50%)`
                            }}
                        />
                    </motion.div>

                    {/* Hero Content */}
                    <motion.div
                        style={{ y: textY }}
                        className="relative z-10 flex flex-col items-center max-w-5xl text-center px-8"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative group mb-6"
                            style={{
                                x: mousePosition.x * 0.3,
                                y: mousePosition.y * 0.3
                            }}
                        >
                            <div className="absolute inset-0 blur-3xl opacity-30 bg-[#8b7355]/30 scale-125" />

                            <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] filter drop-shadow-[0_0_60px_rgba(139,115,85,0.3)]">
                                <Image
                                    src="/factions/los-santos-mob-logo.png"
                                    alt="Los Santos Mob"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 1 }}
                        >
                            <h1 className="mob-display text-5xl md:text-8xl text-white leading-none tracking-wide mb-3">
                                LOS SANTOS <span className="text-[#c4a574]">MOB</span>
                            </h1>
                            <div className="flex items-center justify-center gap-6">
                                <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#8b7355]/60" />
                                <span className="mob-serif text-lg md:text-2xl text-[#c4a574]/80 italic tracking-wide">
                                    Business Over Bloodshed
                                </span>
                                <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#8b7355]/60" />
                            </div>
                        </motion.div>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="absolute bottom-8"
                        >
                            <motion.div
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                                className="w-px h-16 bg-gradient-to-b from-[#c4a574]/60 to-transparent"
                            />
                        </motion.div>
                    </motion.div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* MAIN LORE - WHO WE ARE */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-32 overflow-hidden">
                    <motion.div
                        style={{ x: useTransform(scrollYProgress, [0.05, 0.2], [100, -100]) }}
                        className="absolute top-20 -left-20 text-[12rem] md:text-[18rem] mob-display text-white/[0.02] select-none pointer-events-none leading-none"
                    >
                        MOB
                    </motion.div>

                    <div className="max-w-5xl mx-auto px-8 relative z-10">
                        {/* Main Identity */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-20"
                        >
                            <span className="mob-body text-[#8b7355] text-xs tracking-[0.4em] uppercase block mb-4">
                                Who We Are
                            </span>
                            <h2 className="mob-serif text-4xl md:text-6xl text-white italic mb-8 leading-tight">
                                A Modern, <span className="text-[#c4a574]">High-End</span> Hybrid Mafia
                            </h2>
                            <p className="mob-body text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                                The L.S. Mob blends traditional organized-crime structure with a modern mindset, prioritizing business, discretion, and long-term profit over loud street presence.
                            </p>
                        </motion.div>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-3 gap-6 mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#151312] border border-white/5 p-8"
                            >
                                <span className="mob-display text-[#c4a574] text-sm tracking-wider block mb-3">TERRITORY</span>
                                <h3 className="mob-serif text-2xl text-white mb-3">La Puerta</h3>
                                <p className="mob-body text-white/50 text-sm leading-relaxed">
                                    Los Santos Recycling Center serves as headquarters. Publicly, a waste management and vehicle salvage business. Privately, an illegal chop shop.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#151312] border border-white/5 p-8"
                            >
                                <span className="mob-display text-[#c4a574] text-sm tracking-wider block mb-3">STYLE</span>
                                <h3 className="mob-serif text-2xl text-white mb-3">Luxury Fashion</h3>
                                <p className="mob-body text-white/50 text-sm leading-relaxed">
                                    Tailored suits, designer wear, high-end hip-hop style. Quality jeans, expensive shoes, and luxury watches.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="bg-[#151312] border border-white/5 p-8"
                            >
                                <span className="mob-display text-[#c4a574] text-sm tracking-wider block mb-3">IDENTIFIER</span>
                                <h3 className="mob-serif text-2xl text-white mb-3">Black Bandana</h3>
                                <p className="mob-body text-white/50 text-sm leading-relaxed">
                                    Temporary identifier. Custom mask and custom tie in development.
                                </p>
                            </motion.div>
                        </div>

                        {/* Philosophy */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#8b7355]/30" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#8b7355]/30" />

                            <div className="bg-[#151312]/80 p-10 md:p-16 text-center">
                                <p className="mob-serif text-xl md:text-3xl text-white/80 italic leading-relaxed mb-6">
                                    "The L.S. Mob avoids unnecessary violence, preferring leverage, planning, and business pressure to resolve conflicts."
                                </p>
                                <p className="mob-display text-sm text-[#8b7355] tracking-[0.3em]">
                                    VIOLENCE IS USED ONLY WHEN REQUIRED AND HANDLED IN A CONTROLLED MANNER.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* CHRONICLES HEADER */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-16 bg-gradient-to-b from-[#0d0c0b] via-[#151312] to-[#0d0c0b]">
                    <div className="max-w-5xl mx-auto px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="mob-display text-[#8b7355]/60 text-xs tracking-[0.5em] uppercase">
                                From The Streets
                            </span>
                            <h2 className="mob-serif text-5xl md:text-7xl text-white/10 italic mt-2">
                                Chronicles
                            </h2>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* THE NIGHT BEFORE - STORY CHAPTER 1 */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-24 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <span className="mob-body text-[#8b7355] text-xs tracking-[0.4em] uppercase block mb-3">
                                Chapter I
                            </span>
                            <h2 className="mob-serif text-4xl md:text-6xl text-white italic mb-4">
                                The Night <span className="text-[#c4a574]">Before</span>
                            </h2>
                            <div className="w-20 h-px bg-[#8b7355]/60" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="bg-[#151312] border-l-2 border-[#8b7355]/40 p-8 md:p-10">
                                <p className="mob-body text-white/70 text-lg leading-relaxed mb-6">
                                    The night before had been chaotic. Tyler and Nic had robbed Kye for a heavy, unintentionally lighting a spark with some of the old heads. Nobody panicked over it—it wasn't personal, and everyone knew it could be smoothed over easily.
                                </p>
                                <p className="mob-serif text-xl text-[#c4a574] italic">
                                    Still, word traveled, and people remembered.
                                </p>
                            </div>

                            <div className="bg-[#151312]/50 p-8 md:p-10">
                                <p className="mob-body text-white/60 leading-relaxed mb-6">
                                    A new day broke, and it was busy from the jump. Patrick had just returned to town after serving time overseas, back on familiar streets after a long stretch behind bars. Chris Gates was celebrating his birthday that night, with Jay's coming the very next day.
                                </p>
                                <p className="mob-body text-white/80 leading-relaxed">
                                    Spirits were high. Business was moving clean, money was flowing, and plans were lining up the way they were supposed to.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* THE MOB - IDENTITY QUOTE */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-20 bg-[#0a0908]">
                    <div className="max-w-5xl mx-auto px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-center py-12"
                        >
                            <p className="mob-serif text-2xl md:text-3xl text-white/70 italic leading-relaxed max-w-3xl mx-auto mb-6">
                                "The MOB was quietly growing, stacking numbers with known, money driven shooters. Guys with reputations."
                            </p>
                            <p className="mob-display text-base md:text-lg text-[#8b7355] tracking-wider">
                                GUYS WHO DIDN'T TALK MUCH, BUT EVERYONE KNEW THEY'D STAND SHOULDER TO SHOULDER WHEN IT MATTERED.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* EMPIRE NIGHTCLUB - THE PARTY */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-32 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-12"
                        >
                            <span className="mob-body text-[#8b7355] text-xs tracking-[0.4em] uppercase block mb-3">
                                Chapter II
                            </span>
                            <h2 className="mob-serif text-4xl md:text-6xl text-white italic mb-4">
                                Empire <span className="text-[#c4a574]">Nightclub</span>
                            </h2>
                            <div className="w-20 h-px bg-[#8b7355]/60" />
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#151312] p-8"
                            >
                                <p className="mob-body text-white/70 leading-relaxed mb-6">
                                    The party went down at Empire Nightclub, Chris's place. Strong drinks, loud music, and the kind of energy that makes you forget tomorrow exists.
                                </p>
                                <p className="mob-body text-white/50 text-sm leading-relaxed">
                                    Some of the boys left with women, others stayed back counting blessings and watching faces.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#151312] border border-[#8b7355]/20 p-8"
                            >
                                <p className="mob-body text-white/60 leading-relaxed mb-6">
                                    As the night wore on, a low tension crept in. The robbery from the night before lingered in the air. Nothing had happened yet, but everyone felt it—that sense that something might.
                                </p>
                                <p className="mob-serif text-xl text-[#c4a574] italic">
                                    Still, no one looked worried.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* GRAPESEED - THE FIELDS */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-32 bg-[#0a0908] overflow-hidden">
                    <motion.div
                        style={{ x: useTransform(scrollYProgress, [0.3, 0.5], [-100, 100]) }}
                        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b7355]/30 to-transparent"
                    />

                    <div className="max-w-5xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="mob-body text-[#8b7355] text-xs tracking-[0.4em] uppercase block mb-3">
                                Chapter III
                            </span>
                            <h2 className="mob-display text-5xl md:text-7xl text-white mb-4">
                                GRAPESEED
                            </h2>
                            <p className="mob-serif text-lg text-white/50 italic">
                                Word was floating around about pot fields up north
                            </p>
                        </motion.div>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#151312]/80 p-8 md:p-12"
                            >
                                <p className="mob-body text-white/70 leading-relaxed mb-6">
                                    Keshawn, Tyler, Nic, and Patrick head up toward Grapeseed, driving around back roads with no real destination. Eventually they come across a field full of bud, unoccupied and ready to be harvested.
                                </p>
                                <p className="mob-body text-white/50 leading-relaxed">
                                    No bikes, no people, no signs of anyone around. They decide to take advantage of the opportunity and start pulling buds plant by plant, keeping things quiet and moving carefully.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#151312] border-l-4 border-[#8b7355] p-8 md:p-12"
                            >
                                <p className="mob-body text-white/60 leading-relaxed mb-4">
                                    Partway through, they start hearing motorcycles moving around the area. At that point, nobody knows if they've been seen or not.
                                </p>
                                <p className="mob-display text-2xl text-[#c4a574] tracking-wide">
                                    Iron Reapers MC rolls in.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* THE CONFRONTATION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-32 overflow-hidden">
                    <div className="max-w-4xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="bg-[#151312] p-8 md:p-10">
                                <p className="mob-body text-white/70 leading-relaxed mb-6">
                                    Things escalate fast. There's confusion on both sides, words are exchanged, and shots end up getting fired. A few from the Mob get hit, and a few of the Reapers do too.
                                </p>
                                <p className="mob-body text-white/50 leading-relaxed">
                                    It all stems from a misunderstanding—the Iron Reapers thought the L.S. Mob was coming north to tax them, which wasn't the case at all.
                                </p>
                            </div>

                            <div className="bg-[#151312]/50 p-8 md:p-10">
                                <p className="mob-body text-white/60 leading-relaxed mb-6">
                                    Both groups pull back, but without realizing the mistake, they run into each other again. This time the Iron Reapers attempt to tax the Mob instead. More shots are fired.
                                </p>
                                <p className="mob-serif text-xl text-[#c4a574] italic">
                                    This time the Mob holds their ground and comes out on top.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* SANDY AIRFIELD - THE RESOLUTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-32 bg-gradient-to-b from-[#0d0c0b] via-[#151312] to-[#0d0c0b]">
                    <div className="max-w-5xl mx-auto px-8 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="mob-body text-[#8b7355] text-xs tracking-[0.4em] uppercase block mb-3">
                                Chapter IV
                            </span>
                            <h2 className="mob-serif text-4xl md:text-6xl text-white italic mb-2">
                                Sandy <span className="text-[#c4a574]">Airfield</span>
                            </h2>
                            <p className="mob-display text-sm text-white/40 tracking-[0.3em]">
                                END OF THE RUNWAY • 8 PM
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[#8b7355]/40" />
                            <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#8b7355]/40" />

                            <div className="bg-[#151312] p-10 md:p-16">
                                <div className="space-y-8 mob-body text-white/60 leading-relaxed">
                                    <p>
                                        Jameson reaches out to Ragnar from the MC. Neither of them fully understands how things escalated the way they did, so they agree it's best to slow things down and talk it out.
                                    </p>
                                    <p>
                                        Both groups show up and keep things civil. Once everyone talks it through, it becomes clear there was never any real beef—just crossed lines and bad assumptions.
                                    </p>
                                    <p className="text-white/80">
                                        Both sides agree that nobody was trying to start a war and that <span className="text-[#c4a574]">business makes more sense than bloodshed.</span>
                                    </p>
                                </div>

                                <div className="mt-12 pt-8 border-t border-[#8b7355]/20">
                                    <p className="mob-body text-white/50 text-sm leading-relaxed mb-4">
                                        The Iron Reapers offer to help source weapons and drugs for the Mob to move into the city. The Mob agrees they'll use the MC when they need product moved across the state.
                                    </p>
                                    <p className="mob-serif text-lg text-[#c4a574] italic">
                                        Hands are shaken, numbers are exchanged, and both sides go their separate ways. No ongoing issues, just a lesson learned the hard way.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* LORE SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="lore" className="relative py-32 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8 relative z-10">
                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            <div className="md:sticky md:top-32 w-full md:w-1/3">
                                <span className="mob-body text-[#8b7355]/80 text-xs tracking-[0.4em] uppercase mb-3 block">
                                    Archives
                                </span>
                                <h2 className="mob-serif text-5xl md:text-6xl text-white italic mb-4">
                                    The <span className="text-[#c4a574]">Family</span>
                                </h2>
                                <div className="w-16 h-px bg-[#8b7355]/60 mb-6" />
                                <p className="mob-body text-sm text-white/40 leading-relaxed">
                                    Blood in, blood out. The old ways still hold.
                                </p>
                            </div>

                            <div className="w-full md:w-2/3">
                                <div className="relative">
                                    <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8b7355]/30 to-transparent" />
                                    <LoreSection faction={faction} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* ROSTER SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="roster" className="relative py-32 bg-[#0a0908] border-y border-white/[0.03]">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex flex-col items-center mb-20">
                            <span className="mob-body text-[#8b7355]/80 text-xs tracking-[0.4em] uppercase mb-3">
                                Made Men
                            </span>
                            <h2 className="mob-display text-5xl md:text-7xl text-white">
                                THE <span className="text-[#c4a574]">FAMILY</span>
                            </h2>
                        </div>
                        <RosterSection faction={faction} />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* GALLERY SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="gallery" className="relative py-32">
                    <div className="relative z-10 max-w-[1400px] mx-auto px-8">
                        <div className="mb-20 flex items-baseline gap-6">
                            <h2 className="mob-display text-5xl md:text-7xl text-white/10 uppercase">
                                THE VAULT
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#8b7355]/30 to-transparent" />
                        </div>
                        <GallerySection faction={faction} />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* FOOTER */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <footer className="relative min-h-[70vh] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8b7355]/10 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-3xl"
                    >
                        <Image
                            src="/factions/los-santos-mob-logo.png"
                            alt="Los Santos Mob"
                            width={180}
                            height={180}
                            className="mx-auto mb-12 opacity-20 filter grayscale"
                        />

                        <p className="mob-serif text-3xl md:text-5xl text-white/80 mb-6 italic leading-tight">
                            Business makes more sense than bloodshed.
                        </p>

                        <p className="mob-display text-lg text-[#8b7355]/60 tracking-[0.2em] mb-12">
                            LOS SANTOS MOB
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mob-body text-xs text-[#c4a574] border border-[#8b7355]/30 px-10 py-4 bg-black/30 backdrop-blur transition-all uppercase tracking-[0.2em] hover:bg-[#8b7355] hover:text-black hover:border-transparent"
                        >
                            Return to Top
                        </motion.button>
                    </motion.div>
                </footer>
            </div>
        </>
    );
}
