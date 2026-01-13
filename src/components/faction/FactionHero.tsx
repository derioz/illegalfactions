'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { Faction } from '@/lib/factions';

interface FactionHeroProps {
    faction: Faction;
}

export function FactionHero({ faction }: FactionHeroProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32"
        >
            {/* Animated background */}
            <motion.div className="absolute inset-0" style={{ y }}>
                {/* Faction-themed gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${faction.gradientFrom} 0%, ${faction.gradientTo} 50%, var(--background) 100%)`,
                    }}
                />

                {/* Animated accent orbs */}
                <motion.div
                    className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${faction.primaryColor}40 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <motion.div
                    className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${faction.accentColor}40 0%, transparent 70%)`,
                    }}
                    animate={{
                        x: [0, -20, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>

            {/* Overlay gradient for readability */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(180deg, rgba(10, 10, 12, 0.3) 0%, rgba(10, 10, 12, 0.7) 70%, var(--background) 100%)',
                }}
            />

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                style={{ opacity }}
            >
                {/* Back button */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Factions
                    </Link>
                </motion.div>

                {/* Faction type badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6"
                        style={{
                            background: `${faction.primaryColor}20`,
                            color: faction.primaryColor,
                            border: `1px solid ${faction.primaryColor}40`,
                        }}
                    >
                        {faction.type === 'mc' ? 'Motorcycle Club' : faction.type}
                    </span>
                </motion.div>

                {/* Faction name */}
                <motion.h1
                    className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                    <span className="text-white">{faction.name}</span>
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="text-xl md:text-2xl font-medium mb-8"
                    style={{ color: faction.primaryColor }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    &ldquo;{faction.tagline}&rdquo;
                </motion.p>

                {/* Description */}
                <motion.p
                    className="text-lg text-white/70 max-w-2xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    {faction.description}
                </motion.p>

                {/* Quick nav */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <QuickNavButton href="#lore" color={faction.primaryColor}>
                        Lore
                    </QuickNavButton>
                    <QuickNavButton href="#roster" color={faction.primaryColor}>
                        Roster
                    </QuickNavButton>
                    <QuickNavButton href="#gallery" color={faction.primaryColor}>
                        Gallery
                    </QuickNavButton>

                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2"
                    style={{ color: `${faction.primaryColor}80` }}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
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
        </section>
    );
}

function QuickNavButton({
    href,
    color,
    children,
}: {
    href: string;
    color: string;
    children: React.ReactNode;
}) {
    return (
        <motion.a
            href={href}
            className="px-5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
                background: `${color}15`,
                color: color,
                border: `1px solid ${color}30`,
            }}
            whileHover={{
                scale: 1.05,
                background: `${color}25`,
                borderColor: `${color}50`,
            }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.a>
    );
}
