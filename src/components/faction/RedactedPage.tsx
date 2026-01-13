'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { COLLECTIONS, Member, LoreEntry } from '@/lib/db-types';
import { Faction } from '@/lib/factions';
import ReactMarkdown from 'react-markdown';
import { GallerySection } from './GallerySection';

export function RedactedPage({ faction }: { faction: Faction }) {
    const [members, setMembers] = useState<{ name: string; role: string; status: string }[]>([]);
    const [loreEntries, setLoreEntries] = useState<any[]>([]);
    const [loadingLore, setLoadingLore] = useState(true);
    const [showAllLore, setShowAllLore] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const db = getFirebaseDb();
                if (!db) {
                    setLoadingLore(false);
                    return;
                }

                // Load Lore
                const loreRef = collection(db, COLLECTIONS.FACTIONS, 'redacted', 'lore');
                const loreSnap = await getDocs(loreRef);

                if (loreSnap.docs.length > 0) {
                    const dbLore = loreSnap.docs.map(d => {
                        const data = d.data();
                        return {
                            id: d.id,
                            title: data.title || 'Untitled',
                            content: data.content || '',
                            year: data.year || '',
                            classification: 'Level 5 / Eyes Only',
                            order: data.order || 0,
                            eventDate: data.eventDate || null
                        };
                    });

                    // Sort by order
                    dbLore.sort((a, b) => a.order - b.order);
                    setLoreEntries(dbLore);
                }

                // Load Members
                const membersSnap = await getDocs(collection(db, COLLECTIONS.FACTIONS, 'redacted', 'members'));
                if (membersSnap.docs.length > 0) {
                    const dbMembers = membersSnap.docs.map(d => {
                        const data = d.data() as Member;
                        return {
                            name: data.name,
                            role: data.role,
                            status: 'ACTIVE',
                        };
                    });
                    setMembers(dbMembers);
                }
            } catch (err) {
                console.error('Error loading data:', err);
            }
            setLoadingLore(false);
        };
        loadData();
    }, []);

    const visibleLore = showAllLore ? loreEntries : loreEntries.slice(-5);
    const hasHiddenLore = loreEntries.length > 5;

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Hero Section - Classified Document Style */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-32">
                {/* Paper texture background */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
                    }}
                />

                {/* Scanlines overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    }}
                />

                {/* Red accent glow */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)',
                    }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    {/* Classification stamp */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="inline-block border-4 border-red-600 px-6 py-2 transform -rotate-3">
                            <span className="text-red-600 font-mono font-bold text-xl tracking-widest">
                                TOP SECRET
                            </span>
                        </div>
                    </motion.div>

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mb-8"
                    >
                        <Image
                            src="/factions/redacted-logo.png"
                            alt="REDACTED Logo"
                            width={200}
                            height={200}
                            className="mx-auto drop-shadow-2xl"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(220, 38, 38, 0.5))' }}
                        />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-4 font-mono"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <span className="text-white">[</span>
                        <span className="text-red-600">REDACTED</span>
                        <span className="text-white">]</span>
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        className="text-xl md:text-2xl text-zinc-400 font-mono mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        &quot;{faction.tagline || 'Chaos Is Inevitable. We Control It.'}&quot;
                    </motion.p>

                    {/* Faction Description */}
                    {faction.description && (
                        <motion.div
                            className="bg-red-900/10 border border-red-900/30 p-6 max-w-2xl mx-auto mb-8 text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            <h4 className="text-red-500 font-mono text-sm font-bold mb-2 tracking-wider">MISSION PROFILE</h4>
                            <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                                {faction.description}
                            </p>
                        </motion.div>
                    )}

                    {/* Classification info */}
                    <motion.div
                        className="inline-flex flex-col gap-1 text-xs font-mono text-zinc-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <span>CLASSIFICATION: LEVEL 5 / EYES ONLY</span>
                        <span>FIELD DIRECTOR: AGENT WILLIAMS</span>
                    </motion.div>
                </div>
            </section>

            {/* Dossier Section (Lore) */}
            <section className="py-24 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Document header */}
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block border-2 border-red-600/30 px-8 py-4 bg-zinc-900/50">
                            <h2 className="text-2xl font-mono font-bold text-white mb-2">
                                GANG INTELLIGENCE DOSSIER
                            </h2>
                            <p className="text-zinc-500 font-mono text-sm">
                                DOCUMENT ID: RDC-{new Date().getFullYear()}-001
                            </p>
                        </div>
                    </motion.div>

                    {/* Lore entries as classified documents */}
                    <div className="space-y-8">
                        {loadingLore ? (
                            <div className="text-center text-zinc-500 font-mono animate-pulse">
                                DECRYPTING FILES...
                            </div>
                        ) : visibleLore.length === 0 ? (
                            <div className="text-center text-zinc-500 font-mono">
                                NO INTELLIGENCE FOUND.
                            </div>
                        ) : (
                            visibleLore.map((section, index) => (
                                <motion.div
                                    key={section.id}
                                    className="relative"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {/* Paper card */}
                                    <div className="bg-zinc-900/80 border border-zinc-800 p-6 relative overflow-hidden">
                                        {/* Corner fold effect */}
                                        <div
                                            className="absolute top-0 right-0 w-8 h-8"
                                            style={{
                                                background: 'linear-gradient(135deg, #18181b 50%, #27272a 50%)',
                                            }}
                                        />

                                        {/* Section number */}
                                        <div className="absolute top-4 left-4 text-xs font-mono text-zinc-600">
                                            SEC. {index + 1}.0{section.year ? ` // ${section.year}` : ''}{section.eventDate ? ` // ${new Date(section.eventDate.seconds ? section.eventDate.seconds * 1000 : section.eventDate).toLocaleString()}` : ''}
                                        </div>

                                        {/* Content */}
                                        <div className="pt-6">
                                            <h3 className="text-lg font-mono font-bold text-red-600 mb-4 flex items-center gap-3">
                                                <span className="w-2 h-2 bg-red-600" />
                                                {section.title}
                                            </h3>
                                            <div className="text-zinc-300 font-mono text-sm leading-relaxed prose prose-invert prose-red max-w-none">
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                        h1: ({ node, ...props }) => <h3 className="text-lg font-bold text-red-500 mb-2 mt-4 uppercase tracking-widest" {...props} />,
                                                        h2: ({ node, ...props }) => <h4 className="text-base font-bold text-red-400 mb-2 mt-3 uppercase" {...props} />,
                                                        h3: ({ node, ...props }) => <h5 className="text-sm font-bold text-red-400 mb-1 mt-2 uppercase" {...props} />,
                                                        ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1 text-zinc-400" {...props} />,
                                                        ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-zinc-400" {...props} />,
                                                        blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-red-900/50 bg-red-900/5 pl-3 py-2 italic my-3 text-red-400/80" {...props} />,
                                                        a: ({ node, ...props }) => <a className="text-red-500 hover:text-red-400 underline decoration-dotted" {...props} />,
                                                        img: ({ node, ...props }) => (
                                                            <span className="relative group inline-block">
                                                                <img
                                                                    className="rounded-sm border border-red-900/30 grayscale hover:grayscale-0 transition-all duration-500 my-4 max-h-[150px] object-cover cursor-zoom-in"
                                                                    onClick={() => setSelectedImage((props.src as string) || null)}
                                                                    {...props}
                                                                    alt={props.alt || 'Classified Image'}
                                                                />
                                                                <span className="absolute top-0 right-0 bg-red-600 text-[10px] text-black font-bold px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    EVIDENCE
                                                                </span>
                                                            </span>
                                                        ),
                                                    }}
                                                >
                                                    {section.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Show More toggle */}
                    {hasHiddenLore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setShowAllLore(!showAllLore)}
                                className="font-mono text-xs text-red-600 border border-red-900/50 bg-red-900/10 px-4 py-2 hover:bg-red-900/20 transition-colors uppercase tracking-widest"
                            >
                                {showAllLore ? '[-] COLLAPSE DOSSIER' : '[+] ACCESS FULL ARCHIVES'}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Personnel Section - Now uses Firebase data */}
            <section className="py-24 px-4 md:px-8 bg-zinc-900/50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-block border-2 border-red-600/30 px-8 py-4 bg-black/50">
                            <h2 className="text-2xl font-mono font-bold text-white mb-2">
                                KNOWN PERSONNEL
                            </h2>
                            <p className="text-zinc-500 font-mono text-sm">
                                SURVEILLANCE STATUS: ACTIVE • {members.length} OPERATIVES
                            </p>
                        </div>
                    </motion.div>

                    {/* Personnel grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {members.map((member, index) => (
                            <motion.div
                                key={`${member.name}-${index}`}
                                className="bg-black/50 border border-zinc-800 p-4 font-mono"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-white font-bold">{member.name}</div>
                                        <div className="text-zinc-500 text-sm">{member.role}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-green-500">{member.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Redacted entries */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="bg-black/30 border border-zinc-800/50 p-4 font-mono"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-zinc-700 font-bold">████████ ████</div>
                                        <div className="text-zinc-800 text-sm">██████████</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                                        <span className="text-xs text-zinc-700">████</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <div className="border-t border-red-900/10">
                <GallerySection faction={faction} />
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Scanline overlay on lightbox */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)' }} />

                        <div className="relative">
                            <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] object-contain border-2 border-red-900/50" />
                            <div className="absolute top-4 right-4 text-red-600 font-mono text-xs bg-black px-2 py-1 border border-red-600">
                                TOP SECRET // EYES ONLY
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Warning footer */}
            <section className="py-12 px-4 border-t border-red-600/20">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.p
                        className="text-zinc-600 font-mono text-xs"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        ⚠️ UNAUTHORIZED ACCESS OR DISCLOSURE OF THIS DOCUMENT IS PUNISHABLE BY LAW ⚠️
                    </motion.p>
                </div>
            </section>
        </div>
    );
}
