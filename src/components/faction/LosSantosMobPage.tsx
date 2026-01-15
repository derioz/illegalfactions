'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import { Faction } from '@/lib/factions';
import { LoreSection } from './LoreSection';
import { RosterSection } from './RosterSection';
import { GallerySection } from './GallerySection';

// ═══════════════════════════════════════════════════════════════════
// ADVANCED ANIMATION COMPONENTS
// ═══════════════════════════════════════════════════════════════════

// Magnetic hover effect - elements follow cursor
function MagneticElement({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * strength);
        y.set((e.clientY - centerY) * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x, y }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
            {children}
        </motion.div>
    );
}

// Split text animation - each letter animates separately
function SplitText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    return (
        <span className={className}>
            {text.split('').map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.03,
                        ease: [0.215, 0.61, 0.355, 1]
                    }}
                    style={{ display: 'inline-block' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}

// 3D Tilt card effect
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        rotateY.set(((e.clientX - centerX) / rect.width) * 15);
        rotateX.set(((centerY - e.clientY) / rect.height) * 15);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: 1000
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {children}
            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, transparent 50%)',
                    opacity: isHovered ? 1 : 0
                }}
            />
        </motion.div>
    );
}

// Floating particles
function FloatingParticles() {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-[#8b7355]/20"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════

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

    // Smooth spring for scroll-based animations
    const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Parallax transforms
    const heroY = useTransform(heroProgress, [0, 1], [0, 250]);
    const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(heroProgress, [0, 0.5], [1, 0.9]);
    const heroBlur = useTransform(heroProgress, [0, 0.5], [0, 10]);

    // Mouse parallax
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Oswald:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
                
                .mob-serif { font-family: 'Cormorant Garamond', serif; }
                .mob-display { font-family: 'Oswald', sans-serif; }
                .mob-body { font-family: 'Inter', sans-serif; }

                /* Animated gradient border */
                @keyframes gradient-rotate {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                .gradient-border {
                    background: linear-gradient(90deg, #8b7355, #c4a574, #8b7355, #c4a574);
                    background-size: 300% 100%;
                    animation: gradient-rotate 8s ease infinite;
                }

                /* Smoke layers */
                @keyframes smoke-drift {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
                    50% { transform: translateY(-40px) translateX(30px) scale(1.05); opacity: 0.5; }
                }
                
                .smoke-1 { animation: smoke-drift 25s ease-in-out infinite; }
                .smoke-2 { animation: smoke-drift 30s ease-in-out infinite reverse; animation-delay: -10s; }
                .smoke-3 { animation: smoke-drift 35s ease-in-out infinite; animation-delay: -20s; }

                /* Vignette */
                .noir-vignette { box-shadow: inset 0 0 300px 100px rgba(0,0,0,0.9); }

                /* Text glow on hover */
                .text-glow:hover {
                    text-shadow: 0 0 40px rgba(196, 165, 116, 0.5);
                }

                /* Reveal line animation */
                @keyframes reveal-line {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
            `}</style>

            <div ref={containerRef} className="min-h-screen bg-[#0d0c0b] text-[#e8e4df] selection:bg-[#8b7355] selection:text-black overflow-x-hidden">

                {/* VIGNETTE */}
                <div className="fixed inset-0 pointer-events-none z-[99] noir-vignette" />

                {/* FLOATING PARTICLES */}
                <FloatingParticles />

                {/* AMBIENT SMOKE LAYERS */}
                <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
                    <div className="smoke-1 absolute bottom-0 left-0 right-0 h-[600px] bg-gradient-to-t from-[#8b7355]/20 via-[#1a1816]/30 to-transparent" />
                    <div className="smoke-2 absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#0d0c0b]/60 via-[#8b7355]/10 to-transparent" />
                    <div className="smoke-3 absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-[#c4a574]/10 via-transparent to-transparent" />
                </div>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* HERO SECTION - WITH 3D EFFECTS */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section ref={heroRef} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden">

                    <motion.div
                        style={{
                            y: heroY,
                            opacity: heroOpacity,
                            scale: heroScale,
                            filter: `blur(${heroBlur}px)`
                        }}
                        className="absolute inset-0 z-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1816] via-[#0d0c0b] to-[#0d0c0b]" />

                        {/* Mouse-reactive glow */}
                        <motion.div
                            className="absolute inset-0 opacity-25"
                            animate={{
                                background: `radial-gradient(ellipse at ${50 + mousePosition.x * 0.5}% ${45 + mousePosition.y * 0.5}%, #8b7355 0%, transparent 50%)`
                            }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        />
                    </motion.div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex flex-col items-center max-w-5xl text-center px-8">

                        {/* Logo with magnetic effect */}
                        <MagneticElement strength={0.1}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ duration: 1.5, ease: [0.215, 0.61, 0.355, 1] }}
                                className="relative mb-8"
                                style={{
                                    x: mousePosition.x * 0.5,
                                    y: mousePosition.y * 0.5
                                }}
                            >
                                <div className="absolute inset-0 blur-[80px] opacity-40 bg-[#8b7355] scale-150" />

                                <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] filter drop-shadow-[0_0_80px_rgba(139,115,85,0.4)]">
                                    <Image
                                        src="/factions/los-santos-mob-logo.png"
                                        alt="Los Santos Mob"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </MagneticElement>

                        {/* Title with split text animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <h1 className="mob-display text-5xl md:text-9xl text-white leading-none tracking-wide mb-4">
                                <SplitText text="LOS SANTOS" delay={0.8} />
                                <span className="text-[#c4a574] block">
                                    <SplitText text="MOB" delay={1.2} />
                                </span>
                            </h1>

                            <motion.div
                                className="flex items-center justify-center gap-8 mt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.8, duration: 0.8 }}
                            >
                                <motion.div
                                    className="h-px w-24 bg-gradient-to-r from-transparent to-[#8b7355]"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    style={{ originX: 0 }}
                                />
                                <span className="mob-serif text-lg md:text-2xl text-[#c4a574]/80 italic text-glow cursor-default">
                                    Business Over Bloodshed
                                </span>
                                <motion.div
                                    className="h-px w-24 bg-gradient-to-l from-transparent to-[#8b7355]"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    style={{ originX: 1 }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Scroll indicator with pulse */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }}
                            className="absolute bottom-16"
                        >
                            <motion.div
                                animate={{
                                    y: [0, 15, 0],
                                    opacity: [0.4, 1, 0.4]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex flex-col items-center gap-3"
                            >
                                <span className="mob-body text-[10px] text-[#c4a574]/50 uppercase tracking-[0.3em]">Scroll</span>
                                <div className="w-px h-12 bg-gradient-to-b from-[#c4a574] to-transparent" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* WHO WE ARE - MAIN LORE WITH 3D CARDS */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section className="relative py-40 overflow-hidden">
                    {/* Parallax background text */}
                    <motion.div
                        style={{ x: useTransform(smoothScroll, [0, 0.3], [200, -200]) }}
                        className="absolute top-20 -left-20 text-[15rem] md:text-[22rem] mob-display text-white/[0.015] select-none pointer-events-none leading-none whitespace-nowrap"
                    >
                        THE MOB
                    </motion.div>

                    <div className="max-w-6xl mx-auto px-8 relative z-10">
                        {/* Main Identity */}
                        <motion.div
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                            className="text-center mb-24"
                        >
                            <motion.span
                                className="mob-body text-[#8b7355] text-xs tracking-[0.5em] uppercase block mb-6"
                                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                                whileInView={{ opacity: 1, letterSpacing: '0.5em' }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                Who We Are
                            </motion.span>
                            <h2 className="mob-serif text-4xl md:text-7xl text-white italic mb-10 leading-tight">
                                A Modern, <span className="text-[#c4a574]">High-End</span>
                                <br />Hybrid Mafia
                            </h2>
                            <motion.p
                                className="mob-body text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                            >
                                The L.S. Mob blends traditional organized-crime structure with a modern mindset, prioritizing business, discretion, and long-term profit over loud street presence.
                            </motion.p>
                        </motion.div>

                        {/* 3D Tilt Info Cards */}
                        <div className="grid md:grid-cols-3 gap-8 mb-20">
                            {[
                                { label: 'TERRITORY', title: 'La Puerta', desc: 'Los Santos Recycling Center serves as headquarters. Publicly, a waste management and vehicle salvage business. Privately, an illegal chop shop.' },
                                { label: 'STYLE', title: 'Luxury Fashion', desc: 'Tailored suits, designer wear, high-end hip-hop style. Quality jeans, expensive shoes, and luxury watches.' },
                                { label: 'IDENTIFIER', title: 'Black Bandana', desc: 'Temporary identifier. Custom mask and custom tie in development.' }
                            ].map((card, i) => (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 60, rotateX: 15 }}
                                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.8, delay: i * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                                >
                                    <TiltCard className="relative bg-[#151312] border border-white/5 p-10 h-full overflow-hidden group cursor-pointer">
                                        {/* Animated gradient border on hover */}
                                        <motion.div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(139,115,85,0.1) 0%, transparent 50%, rgba(196,165,116,0.1) 100%)'
                                            }}
                                        />

                                        <span className="mob-display text-[#c4a574] text-sm tracking-wider block mb-4 relative z-10">{card.label}</span>
                                        <h3 className="mob-serif text-2xl md:text-3xl text-white mb-4 relative z-10 group-hover:text-[#c4a574] transition-colors duration-300">{card.title}</h3>
                                        <p className="mob-body text-white/40 text-sm leading-relaxed relative z-10 group-hover:text-white/60 transition-colors duration-300">
                                            {card.desc}
                                        </p>

                                        {/* Bottom accent line */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 h-[2px] gradient-border"
                                            initial={{ width: 0 }}
                                            whileHover={{ width: '100%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </div>

                        {/* Philosophy Quote with reveal animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 1 }}
                            className="relative"
                        >
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#8b7355]/30" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#8b7355]/30" />

                            <div className="bg-[#151312]/60 backdrop-blur-sm p-12 md:p-20 text-center">
                                <motion.p
                                    className="mob-serif text-2xl md:text-4xl text-white/80 italic leading-relaxed mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    "The L.S. Mob avoids unnecessary violence, preferring leverage, planning, and business pressure to resolve conflicts."
                                </motion.p>
                                <motion.p
                                    className="mob-display text-sm md:text-base text-[#8b7355] tracking-[0.3em]"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 }}
                                >
                                    VIOLENCE IS USED ONLY WHEN REQUIRED AND HANDLED IN A CONTROLLED MANNER.
                                </motion.p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* LORE SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="lore" className="relative py-32 overflow-hidden bg-[#0a0908]">
                    <motion.div
                        style={{ x: useTransform(smoothScroll, [0.3, 0.6], [-100, 100]) }}
                        className="absolute top-1/2 right-0 text-[12rem] md:text-[18rem] mob-display text-white/[0.01] select-none pointer-events-none leading-none"
                    >
                        FAMILY
                    </motion.div>

                    <div className="max-w-6xl mx-auto px-8 relative z-10">
                        <div className="flex flex-col md:flex-row gap-20 items-start">
                            <motion.div
                                className="md:sticky md:top-32 w-full md:w-1/3"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="mob-body text-[#8b7355]/80 text-xs tracking-[0.4em] uppercase mb-4 block">
                                    Archives
                                </span>
                                <h2 className="mob-serif text-5xl md:text-7xl text-white italic mb-6">
                                    The <span className="text-[#c4a574]">Family</span>
                                </h2>
                                <motion.div
                                    className="w-20 h-1 bg-[#8b7355] mb-8"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    style={{ originX: 0 }}
                                />
                                <p className="mob-body text-sm text-white/40 leading-relaxed">
                                    Blood in, blood out. The old ways still hold.
                                </p>
                            </motion.div>

                            <div className="w-full md:w-2/3">
                                <div className="relative">
                                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8b7355]/30 to-transparent" />
                                    <LoreSection faction={faction} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* ROSTER SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="roster" className="relative py-32 border-y border-white/[0.03]">
                    <div className="max-w-7xl mx-auto px-8">
                        <motion.div
                            className="flex flex-col items-center mb-24"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="mob-body text-[#8b7355]/80 text-xs tracking-[0.5em] uppercase mb-4">
                                Made Men
                            </span>
                            <h2 className="mob-display text-6xl md:text-8xl text-white">
                                THE <span className="text-[#c4a574]">FAMILY</span>
                            </h2>
                        </motion.div>
                        <RosterSection faction={faction} />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* GALLERY SECTION */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <section id="gallery" className="relative py-32 bg-[#0a0908]">
                    <div className="relative z-10 max-w-[1400px] mx-auto px-8">
                        <motion.div
                            className="mb-24 flex items-baseline gap-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="mob-display text-6xl md:text-8xl text-white/10 uppercase">
                                THE VAULT
                            </h2>
                            <motion.div
                                className="h-px flex-1 bg-gradient-to-r from-[#8b7355]/40 to-transparent"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5 }}
                                style={{ originX: 0 }}
                            />
                        </motion.div>
                        <GallerySection faction={faction} />
                    </div>
                </section>

                {/* ═══════════════════════════════════════════════════════════════════ */}
                {/* FOOTER */}
                {/* ═══════════════════════════════════════════════════════════════════ */}
                <footer className="relative min-h-[80vh] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#8b7355]/15 via-transparent to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1] }}
                        className="relative z-10 max-w-4xl"
                    >
                        <MagneticElement strength={0.05}>
                            <Image
                                src="/factions/los-santos-mob-logo.png"
                                alt="Los Santos Mob"
                                width={200}
                                height={200}
                                className="mx-auto mb-16 opacity-15 filter grayscale hover:grayscale-0 hover:opacity-30 transition-all duration-700"
                            />
                        </MagneticElement>

                        <motion.p
                            className="mob-serif text-3xl md:text-6xl text-white/80 mb-8 italic leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            Business makes more sense<br />than bloodshed.
                        </motion.p>

                        <motion.p
                            className="mob-display text-lg text-[#8b7355]/50 tracking-[0.3em] mb-16"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            LOS SANTOS MOB
                        </motion.p>

                        <MagneticElement strength={0.2}>
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,115,85,0.3)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="mob-body text-xs text-[#c4a574] border border-[#8b7355]/40 px-12 py-5 bg-black/40 backdrop-blur-sm transition-all uppercase tracking-[0.3em] hover:bg-[#8b7355] hover:text-black hover:border-transparent"
                            >
                                Return to Top
                            </motion.button>
                        </MagneticElement>
                    </motion.div>
                </footer>
            </div>
        </>
    );
}
