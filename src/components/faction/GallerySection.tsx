'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Faction } from '@/lib/factions';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { COLLECTIONS, GalleryItem } from '@/lib/db-types';

interface GallerySectionProps {
    faction: Faction;
}

export function GallerySection({ faction }: GallerySectionProps) {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(9);

    useEffect(() => {
        const loadGallery = async () => {
            const db = getFirebaseDb();
            if (!db) return;
            try {
                // Fetch gallery items
                const snap = await getDocs(collection(db, COLLECTIONS.FACTIONS, faction.id, 'gallery'));
                const loaded = snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem));
                // Sort client side by new
                loaded.sort((a, b) => {
                    const da = a.uploadedAt ? new Date(a.uploadedAt) : new Date(0);
                    const db = b.uploadedAt ? new Date(b.uploadedAt) : new Date(0);
                    return db.getTime() - da.getTime();
                });
                setItems(loaded);
            } catch (err) {
                console.error('Error loading gallery:', err);
            }
            setLoading(false);
        };
        loadGallery();
    }, [faction.id]);

    // We always show the section even if empty, per user requirement
    // if (!loading && items.length === 0) return null;

    const visibleItems = items.slice(0, visibleCount);
    const hasMore = items.length > visibleCount;

    // Theme logic
    const isClassified = faction.type === 'classified';
    const fontClass = isClassified ? 'font-mono' : '';

    return (
        <section id="gallery" className={`relative py-24 px-4 md:px-8 bg-neutral-950/80 backdrop-blur-sm ${fontClass}`}>
            {/* Background accent */}
            <div
                className="absolute top-1/2 right-0 w-[500px] h-[500px] opacity-10 blur-3xl -translate-y-1/2 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${faction.primaryColor}20 0%, transparent 70%)`,
                }}
            />
            <div
                className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-10 blur-3xl translate-y-1/2 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${faction.gradientTo}30 0%, transparent 70%)`,
                }}
            />

            <div className="relative max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span
                        className="inline-block px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4"
                        style={{
                            background: `${faction.primaryColor}10`,
                            color: faction.primaryColor,
                            border: `1px solid ${faction.primaryColor}30`,
                            boxShadow: `0 0 20px ${faction.primaryColor}10`
                        }}
                    >
                        {isClassified ? 'Evidence Board' : 'Captured Moments'}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {isClassified ? 'SURVEILLANCE' : 'Gallery'}
                    </h2>
                    <p className="mx-auto text-[var(--foreground-muted)] max-w-2xl text-neutral-400">
                        {isClassified ? 'Intercepted visual data.' : 'A visual journey through our operations and events.'}
                    </p>
                </motion.div>

                {/* Gallery grid */}
                {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {visibleItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-neutral-900"
                                style={{
                                    border: `1px solid ${faction.primaryColor}20`
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => setSelectedItem(item)}
                                whileHover={{ y: -5, borderColor: faction.primaryColor }}
                            >
                                {/* Image */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.imageUrl}
                                    alt={item.title || 'Gallery Image'}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Content */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                    {item.tag && (
                                        <span
                                            className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider w-fit mb-2"
                                            style={{ background: faction.primaryColor, color: isClassified ? '#000' : '#fff' }}
                                        >
                                            {item.tag}
                                        </span>
                                    )}
                                    <h3 className="text-white font-bold text-lg leading-tight mb-1 group-hover:translate-x-1 transition-transform">
                                        {item.title || 'Untitled'}
                                    </h3>
                                    <p className="text-neutral-400 text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        {isClassified ? 'Click to inspect' : 'Click to expand'}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : !loading ? (
                    <motion.div
                        className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl bg-white/5 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-5xl mb-4 opacity-20">📸</div>
                        <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-widest">
                            {isClassified ? 'Archives Empty' : 'Coming Soon'}
                        </h3>
                        <p className="text-neutral-500 mt-2">
                            {isClassified ? 'No intelligence reports found for this sector.' : 'We are currently gathering media from our latest operations.'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-video rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="text-center">
                        <button
                            onClick={() => setVisibleCount(c => c + 9)}
                            className={`px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 ${fontClass}`}
                            style={{
                                background: `${faction.primaryColor}10`,
                                border: `1px solid ${faction.primaryColor}30`,
                                color: faction.primaryColor,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = `${faction.primaryColor}20`;
                                e.currentTarget.style.borderColor = faction.primaryColor;
                                e.currentTarget.style.boxShadow = `0 0 20px ${faction.primaryColor}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = `${faction.primaryColor}10`;
                                e.currentTarget.style.borderColor = `${faction.primaryColor}30`;
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {isClassified ? '[LOAD_MORE_DATA]' : 'Load More'}
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm ${fontClass}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <div
                            className="max-w-6xl w-full h-[90vh] flex flex-col md:flex-row gap-6 bg-neutral-900/90 rounded-2xl p-2 overflow-hidden shadow-2xl"
                            style={{ border: `1px solid ${faction.primaryColor}30`, boxShadow: `0 0 100px ${faction.primaryColor}10` }}
                            onClick={e => e.stopPropagation()}
                        >

                            {/* Image Area */}
                            <div className="flex-1 relative bg-black rounded-xl overflow-hidden flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedItem.imageUrl}
                                    alt={selectedItem.title || ''}
                                    className="max-w-full max-h-full object-contain"
                                />

                                <button
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                                    onClick={() => setSelectedItem(null)}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Info Area */}
                            <div className="w-full md:w-80 h-auto md:h-full bg-neutral-950/50 rounded-xl p-6 flex flex-col overflow-y-auto">
                                <div className="mb-6">
                                    {selectedItem.tag && (
                                        <span
                                            className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-3 inline-block"
                                            style={{ background: faction.primaryColor, color: isClassified ? '#000' : '#fff' }}
                                        >
                                            {selectedItem.tag}
                                        </span>
                                    )}
                                    <h3
                                        className="text-2xl font-bold text-white leading-tight"
                                        style={{ color: isClassified ? faction.primaryColor : '#fff' }}
                                    >
                                        {selectedItem.title || 'Untitled'}
                                    </h3>
                                    {selectedItem.uploadedAt && (
                                        <p className="text-xs text-neutral-500 mt-2">
                                            {isClassified ? 'LOGGED: ' : 'Posted on '}
                                            {new Date((selectedItem.uploadedAt as any).seconds ? (selectedItem.uploadedAt as any).seconds * 1000 : selectedItem.uploadedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                        {isClassified ? 'DATA_CONTENT' : 'Description'}
                                    </h4>
                                    <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedItem.desc || selectedItem.caption || 'No description provided.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                                        <span
                                            className={`w-2 h-2 rounded-full ${isClassified ? 'animate-pulse' : ''}`}
                                            style={{ background: faction.primaryColor }}
                                        />
                                        <span>{isClassified ? 'ENCRYPTED CONNECTION' : 'Authenticated Media'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
