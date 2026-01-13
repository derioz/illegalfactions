'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

    return (
        <section
            ref={ref}
            className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Animated background */}
            <motion.div className="hero-bg" style={{ y, scale }}>
                {/* Dark gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#12121a] to-[#1a0a0a]" />

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.4) 0%, transparent 70%)',
                    }}
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '100px 100px',
                    }}
                />
            </motion.div>

            {/* Overlay gradient */}
            <div className="hero-overlay" />

            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.02]">
                <motion.div
                    className="absolute left-0 right-0 h-[2px] bg-white"
                    animate={{
                        y: ['-100vh', '100vh'],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                style={{ opacity }}
            >
                {/* Pre-title badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white/70 mb-8">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Los Santos Underground
                    </span>
                </motion.div>

                {/* Main title */}
                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    <span className="block gradient-text">ILLEGAL</span>
                    <span className="block text-white mt-2">FACTIONS</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                >
                    Where loyalty is earned in blood, and respect is the only currency that
                    matters. Choose your faction. Write your legacy.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <motion.button
                        className="btn-cinematic min-w-[200px]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Explore Factions
                    </motion.button>
                    <motion.button
                        className="btn-outline min-w-[200px]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Apply Now
                    </motion.button>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2 text-white/40"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-white/5" />
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-white/5" />
        </section>
    );
}
