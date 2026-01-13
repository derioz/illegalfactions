'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { factions } from '@/lib/factions';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFactionsOpen, setIsFactionsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFactionsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Group factions by type
    const factionsByType = {
        classified: factions.filter(f => f.type === 'classified'),
        mc: factions.filter(f => f.type === 'mc'),
        gang: factions.filter(f => f.type === 'gang'),
        racing: factions.filter(f => f.type === 'racing'),
        mafia: factions.filter(f => f.type === 'mafia'),
        yakuza: factions.filter(f => f.type === 'yakuza'),
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'py-3 glass !border-0'
                    : 'py-5 bg-gradient-to-b from-black/80 to-transparent'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            className="w-10 h-10 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Image
                                src="/vital-logo.png"
                                alt="Vital RP"
                                width={40}
                                height={40}
                                className="drop-shadow-lg"
                            />
                        </motion.div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                                Illegal Factions
                            </span>
                            <span className="block text-[10px] text-white/40 tracking-widest uppercase">
                                Vital RP
                            </span>
                        </div>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/">Home</NavLink>

                        {/* Factions Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsFactionsOpen(!isFactionsOpen)}
                                className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
                            >
                                Factions
                                <motion.svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    animate={{ rotate: isFactionsOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </motion.svg>
                                <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                            </button>

                            <AnimatePresence>
                                {isFactionsOpen && (
                                    <motion.div
                                        className="absolute top-full left-0 mt-2 w-[480px] glass rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Classified */}
                                                <div className="col-span-2">
                                                    <div className="text-[10px] uppercase tracking-widest text-red-500 mb-2 font-bold">
                                                        Classified
                                                    </div>
                                                    {factionsByType.classified.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                </div>

                                                {/* MCs */}
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                                        Motorcycle Clubs
                                                    </div>
                                                    {factionsByType.mc.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                </div>

                                                {/* Racing */}
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                                        Racing Crews
                                                    </div>
                                                    {factionsByType.racing.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                </div>

                                                {/* Gangs */}
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                                        Gangs
                                                    </div>
                                                    {factionsByType.gang.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                </div>

                                                {/* Organizations */}
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                                                        Organizations
                                                    </div>
                                                    {factionsByType.mafia.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                    {factionsByType.yakuza.map(faction => (
                                                        <FactionDropdownItem key={faction.id} faction={faction} onClick={() => setIsFactionsOpen(false)} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* View All Link */}
                                            <div className="mt-4 pt-4 border-t border-white/10">
                                                <Link
                                                    href="/#factions"
                                                    onClick={() => setIsFactionsOpen(false)}
                                                    className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                                                >
                                                    View All Factions
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <NavLink href="/about">About</NavLink>
                    </div>

                    {/* CTA buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/admin">
                            <motion.button
                                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Admin
                            </motion.button>
                        </Link>
                        <motion.a
                            href="https://discord.gg/vitalrp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white text-sm font-medium hover:bg-[#4752C4] transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            Discord
                        </motion.a>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <motion.div
                            className="w-6 h-5 flex flex-col justify-between"
                            animate={isMobileMenuOpen ? 'open' : 'closed'}
                        >
                            <motion.span
                                className="w-full h-0.5 bg-white origin-left"
                                variants={{
                                    closed: { rotate: 0 },
                                    open: { rotate: 45 },
                                }}
                            />
                            <motion.span
                                className="w-full h-0.5 bg-white"
                                variants={{
                                    closed: { opacity: 1 },
                                    open: { opacity: 0 },
                                }}
                            />
                            <motion.span
                                className="w-full h-0.5 bg-white origin-left"
                                variants={{
                                    closed: { rotate: 0 },
                                    open: { rotate: -45 },
                                }}
                            />
                        </motion.div>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            className="absolute top-20 left-4 right-4 glass rounded-2xl p-6 max-h-[70vh] overflow-y-auto"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col gap-2">
                                <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                    Home
                                </MobileNavLink>

                                {/* Factions section in mobile */}
                                <div className="py-2">
                                    <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Factions</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {factions.slice(0, 6).map(faction => (
                                            <Link
                                                key={faction.id}
                                                href={`/${faction.id}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: faction.primaryColor }}
                                                />
                                                <span className="text-sm text-white/80 truncate">{faction.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href="/#factions"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-center text-sm text-red-400 mt-3 py-2"
                                    >
                                        View All →
                                    </Link>
                                </div>

                                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                                    About
                                </MobileNavLink>
                                <MobileNavLink href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                    Admin Portal
                                </MobileNavLink>
                                <div className="pt-4 border-t border-white/10">
                                    <a
                                        href="https://discord.gg/vitalrp"
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#5865F2] text-white font-medium"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                        </svg>
                                        Join Discord
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
        >
            {children}
            <span className="absolute -bottom-1 left-4 right-4 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </Link>
    );
}

function FactionDropdownItem({ faction, onClick }: { faction: typeof factions[0]; onClick: () => void }) {
    return (
        <Link
            href={`/${faction.id}`}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group"
        >
            <span
                className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-transparent"
                style={{ backgroundColor: faction.primaryColor, boxShadow: `0 0 8px ${faction.primaryColor}40` }}
            />
            <span className="text-sm text-white/70 group-hover:text-white transition-colors">{faction.name}</span>
        </Link>
    );
}

function MobileNavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block text-lg font-medium text-white/80 hover:text-white py-3 px-2 rounded-lg hover:bg-white/5 transition-colors"
        >
            {children}
        </Link>
    );
}
