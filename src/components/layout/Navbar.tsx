'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FactionMenu } from './FactionMenu';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const isAdmin = pathname?.startsWith('/admin');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isAdmin) return null;

    return (
        <>
            {/* VITAL RP BRANDED LAYOUT */}
            <div className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-500 ${isScrolled ? 'p-4 md:p-6' : 'p-6 md:p-8'}`}>
                {/* Background Blur on Scroll */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-md border-b border-white/5 transition-all duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />

                <div className="relative w-full flex items-center justify-between">
                    {/* BRAND LOGO: MINIMAL */}
                    <div className="pointer-events-auto">
                        <Link href="/" className="flex items-center gap-3 group">
                            <span className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-orange-500 transition-colors">
                                Vital<span className="text-white/30 group-hover:text-orange-500/50">/Illegal</span>
                            </span>
                        </Link>
                    </div>

                    {/* NAVIGATION ACTIONS: TEXT ONLY */}
                    <div className="pointer-events-auto flex items-center gap-8">
                        <Link href="/admin" className="hidden md:block">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                Admin
                            </span>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="group flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">Index</span>
                            <span className="text-[10px] text-white/30 group-hover:text-orange-500/50 transition-colors font-mono">
                                [OPEN]
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* FULL SCREEN MENU */}
            <FactionMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
