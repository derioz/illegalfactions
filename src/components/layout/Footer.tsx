'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { factions } from '@/lib/factions';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative py-16 px-4 md:px-8 bg-[var(--background-secondary)] border-t border-white/5">
            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand column */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <Image
                                src="/vital-logo.png"
                                alt="Vital RP"
                                width={40}
                                height={40}
                                className="drop-shadow-lg"
                            />
                            <div>
                                <span className="text-lg font-bold text-white">Illegal Factions</span>
                                <span className="block text-[10px] text-white/40 tracking-widest uppercase">Vital RP</span>
                            </div>
                        </Link>
                        <p className="text-sm text-[var(--foreground-muted)] mb-6">
                            The premier illegal faction roleplay experience on FiveM. Where
                            legends are born and empires fall.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon href="#" icon="discord" />
                            <SocialIcon href="#" icon="youtube" />
                            <SocialIcon href="#" icon="twitch" />
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <FooterLink href="/#factions">All Factions</FooterLink>
                            <FooterLink href="/gallery">Gallery</FooterLink>
                            <FooterLink href="/clips">Video Clips</FooterLink>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/admin">Admin Portal</FooterLink>
                        </ul>
                    </div>

                    {/* Factions column 1 */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            Factions
                        </h4>
                        <ul className="space-y-3">
                            {factions.slice(0, 6).map((faction) => (
                                <FooterLink key={faction.id} href={`/${faction.id}`}>
                                    {faction.name}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Factions column 2 */}
                    <div>
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                            &nbsp;
                        </h4>
                        <ul className="space-y-3">
                            {factions.slice(6).map((faction) => (
                                <FooterLink key={faction.id} href={`/${faction.id}`}>
                                    {faction.name}
                                </FooterLink>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--foreground-muted)]">
                        © {currentYear} Illegal Factions. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                        A{' '}
                        <a href="https://vitalrp.net" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-400 transition-colors">
                            Vital RP
                        </a>{' '}
                        Experience
                    </p>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm text-[var(--foreground-muted)] hover:text-white transition-colors"
            >
                {children}
            </Link>
        </li>
    );
}

function SocialIcon({ href, icon }: { href: string; icon: 'discord' | 'youtube' | 'twitch' }) {
    const icons = {
        discord: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
        ),
        youtube: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
        twitch: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
            </svg>
        ),
    };

    return (
        <motion.a
            href={href}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--foreground-muted)] hover:text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            {icons[icon]}
        </motion.a>
    );
}
