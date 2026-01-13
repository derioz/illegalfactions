'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Faction } from '@/lib/factions';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { COLLECTIONS, LoreEntry } from '@/lib/db-types';
import ReactMarkdown from 'react-markdown';

interface LoreSectionProps {
    faction: Faction;
}

// Fallback lore data
const fallbackLoreEntries: any[] = [];

export function LoreSection({ faction }: LoreSectionProps) {
    const [loreEntries, setLoreEntries] = useState(fallbackLoreEntries);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLore = async () => {
            try {
                const db = getFirebaseDb();
                if (!db) {
                    setLoading(false);
                    return;
                }

                const loreRef = collection(db, COLLECTIONS.FACTIONS, faction.id, 'lore');
                // Try to order by 'year' or 'order' if available, otherwise just fetch
                const loreSnap = await getDocs(loreRef);

                if (loreSnap.docs.length > 0) {
                    const dbLore = loreSnap.docs.map(d => {
                        const data = d.data();
                        return {
                            id: d.id,
                            title: data.title || 'Untitled',
                            content: data.content || '',
                            year: data.year || '',
                            eventDate: data.eventDate || null,
                            order: data.order || 0
                        };
                    });

                    // Sort by order/date
                    dbLore.sort((a, b) => a.order - b.order);

                    setLoreEntries(dbLore);
                }
            } catch (err) {
                console.error('Error loading lore:', err);
            }
            setLoading(false);
        };
        loadLore();
    }, [faction.id]);

    const [showAll, setShowAll] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Sort determines order (old -> new). slice(-5) gets the latest 5.
    // If we want newest FIRST, we would reverse. But timelines usually go Top(Old)->Bottom(New).
    // If the user wants "Latest 5", they likely mean the most recent events.
    // However, for a timeline, standard is usually Start->End.
    // Let's assume they want the Default view to be "Latest 5" (Recent History).

    const visibleEntries = showAll ? loreEntries : loreEntries.slice(-5);
    const hasHiddenEntries = loreEntries.length > 5;

    const isClassified = faction.type === 'classified';
    const fontClass = isClassified ? 'font-mono' : '';

    return (
        <section id="lore" className={`relative py-24 px-4 md:px-8 bg-neutral-950/20 backdrop-blur-sm ${fontClass}`}>
            {/* Background accent */}
            <div
                className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 blur-3xl"
                style={{
                    background: `radial-gradient(circle, ${faction.primaryColor}30 0%, transparent 70%)`,
                }}
            />

            <div className="relative max-w-5xl mx-auto">
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
                        {isClassified ? 'Historical Records' : 'Our Story'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {isClassified ? 'ARCHIVE' : 'The Lore'}
                    </h2>
                    <p className="mx-auto text-[var(--foreground-muted)] text-neutral-400">
                        {loading ? 'Recovering archives...' :
                            isClassified ? 'Documented timeline of events.' : 'Every faction has a story. This is ours.'}
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div
                        className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
                        style={{
                            background: `linear-gradient(180deg, transparent 0%, ${faction.primaryColor}40 10%, ${faction.primaryColor}40 90%, transparent 100%)`,
                        }}
                    />

                    {/* Lore entries */}
                    <div className="space-y-12">
                        {visibleEntries.map((entry, index) => (
                            <motion.div
                                key={entry.id}
                                className={`relative flex items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                {/* Timeline dot */}
                                <motion.div
                                    className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10"
                                    style={{
                                        background: faction.primaryColor,
                                        boxShadow: `0 0 20px ${faction.primaryColor}60`,
                                    }}
                                    whileInView={{
                                        scale: [1, 1.3, 1],
                                    }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                />

                                {/* Content card */}
                                <div
                                    className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] glass-card p-6 ${index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                                        }`}
                                >
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        {entry.year && (
                                            <span
                                                className="text-xs font-semibold px-2 py-1 rounded"
                                                style={{
                                                    background: `${faction.primaryColor}20`,
                                                    color: faction.primaryColor,
                                                }}
                                            >
                                                {entry.year}
                                            </span>
                                        )}
                                        {entry.eventDate && (
                                            <span className="text-xs text-[var(--foreground-muted)] font-mono">
                                                {new Date((entry.eventDate as any).seconds ? (entry.eventDate as any).seconds * 1000 : entry.eventDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{entry.title}</h3>
                                    <div className="text-[var(--foreground-muted)] leading-relaxed text-sm">
                                        <ReactMarkdown
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                h1: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                                h2: ({ node, ...props }) => <h4 className="text-base font-bold text-white mb-2 mt-3" {...props} />,
                                                h3: ({ node, ...props }) => <h5 className="text-sm font-bold text-white mb-1 mt-2" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-2 border-white/20 pl-3 italic my-3 text-white/70" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-[var(--primary)] hover:underline" {...props} />,
                                                img: ({ node, ...props }) => (
                                                    <img
                                                        className="rounded-lg my-4 max-h-[200px] object-cover cursor-zoom-in hover:opacity-90 transition-opacity border border-white/10"
                                                        onClick={() => setSelectedImage((props.src as string) || null)}
                                                        {...props}
                                                        alt={props.alt || ''}
                                                    />
                                                ),
                                            }}
                                        >
                                            {entry.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Image Lightbox */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 cursor-zoom-out"
                                onClick={() => setSelectedImage(null)}
                            >
                                <img src={selectedImage} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Show More/Less Button */}
                    {hasHiddenEntries && (
                        <motion.div
                            className="flex justify-center mt-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="px-6 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105"
                                style={{
                                    border: `1px solid ${faction.primaryColor}`,
                                    color: showAll ? '#fff' : faction.primaryColor,
                                    background: showAll ? faction.primaryColor : 'transparent',
                                    boxShadow: showAll ? `0 0 20px ${faction.primaryColor}40` : 'none',
                                }}
                            >
                                {showAll ? 'Show Recent Only' : 'Show Full History'}
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Call to action (only showing if not loading and no lore?) No, kept just in case */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-[var(--foreground-muted)] text-sm">
                        The story continues to be written...
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
