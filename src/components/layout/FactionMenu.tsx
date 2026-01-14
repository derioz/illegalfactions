'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { factions as staticFactions, Faction } from '@/lib/factions';
import { COLLECTIONS } from '@/lib/db-types';

interface FactionMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FactionMenu({ isOpen, onClose }: FactionMenuProps) {
    const [factions, setFactions] = useState<Faction[]>(staticFactions);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isScrolled, setIsScrolled] = useState(false);

    // Group categories
    const categories = [
        { id: 'all', label: 'All Operations' },
        { id: 'classified', label: 'Classified' },
        { id: 'mc', label: 'Motorcycle Clubs' },
        { id: 'gang', label: 'Street Gangs' },
        { id: 'org', label: 'Organizations' },
    ];

    // FETCH DYNAMIC DATA ON OPEN
    useEffect(() => {
        if (!isOpen) return;

        const syncFactions = async () => {
            const db = getFirebaseDb();
            if (!db) return;

            try {
                const querySnapshot = await getDocs(collection(db, COLLECTIONS.FACTIONS));
                const dynamicData = querySnapshot.docs.reduce((acc, doc) => {
                    acc[doc.id] = doc.data();
                    return acc;
                }, {} as Record<string, any>);

                const merged = staticFactions.map(sf => {
                    const dynamic = dynamicData[sf.id] || {};
                    return {
                        ...sf,
                        ...dynamic,
                        // Fallback chain: Dynamic Hero -> Static Hero -> Dynamic Logo -> Static Logo
                        featuredImage: dynamic.featuredImage || sf.featuredImage || dynamic.logo || sf.logo
                    };
                });

                setFactions(merged);
            } catch (err) {
                console.error('Directory sync failed:', err);
            }
        };

        syncFactions();
    }, [isOpen]);

    const filteredFactions = selectedCategory === 'all'
        ? factions
        : factions.filter(f => {
            if (selectedCategory === 'org') return f.type === 'mafia' || f.type === 'yakuza';
            return f.type === selectedCategory;
        });

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle scroll within menu
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setIsScrolled(e.currentTarget.scrollTop > 20);
    };

    // Prevent scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsScrolled(false);
        } else {
            document.body.style.overflow = 'unset';
            setIsScrolled(false); // Reset on close
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div
                        key="faction-menu-overlay"
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    >
                        <motion.div
                            className="absolute top-0 right-0 bottom-0 w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* DRAWER HEADER */}
                            <div className="flex-none p-8 border-b border-white/5 bg-[#0a0a0a] z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold uppercase text-white tracking-tight">
                                        Entity Index
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* CATEGORY TABS */}
                                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border ${selectedCategory === cat.id
                                                ? 'bg-white text-black border-white'
                                                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white'
                                                }`}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* DRAWER CONTENT */}
                            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredFactions.map((faction, i) => (
                                        <motion.div
                                            key={faction.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Link
                                                href={`/${faction.id}`}
                                                onClick={onClose}
                                                className="group flex flex-col bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-lg overflow-hidden transition-all h-full"
                                            >
                                                <div className="relative aspect-[3/2] overflow-hidden">
                                                    <div
                                                        className={`absolute inset-0 bg-center transition-all duration-700 group-hover:scale-105 ${faction.featuredImage === faction.logo ? 'bg-[length:40%] bg-no-repeat' : 'bg-cover'}`}
                                                        style={{ backgroundImage: `url('${faction.featuredImage}')` }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                </div>

                                                <div className="p-4 flex flex-col flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[9px] font-mono text-white/40 uppercase bg-white/5 px-1.5 py-0.5 rounded">
                                                            {faction.type}
                                                        </span>
                                                        <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                                                            →
                                                        </span>
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-auto">
                                                        {faction.name}
                                                    </h3>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </>
    );
}
