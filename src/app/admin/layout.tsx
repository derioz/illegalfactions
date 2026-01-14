'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { factions } from '@/lib/factions';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, userRole, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && !pathname?.startsWith('/admin/login')) {
            router.push('/admin/login');
        }
    }, [user, loading, router, pathname]);

    // Show login page without layout
    if (pathname?.startsWith('/admin/login')) {
        return <>{children}</>;
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[var(--foreground-muted)]">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return null;
    }

    const isSuperAdmin = userRole?.isSuperAdmin || false;

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--background-secondary)] border-r border-white/5 flex flex-col fixed h-screen">
                {/* Logo */}
                <div className="p-6 border-b border-white/5 bg-black/20">
                    <div className="flex flex-col gap-4">
                        <Link href="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <span className="text-white font-black text-lg">IF</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black uppercase tracking-wider text-white">Management</span>
                                {isSuperAdmin && (
                                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none mt-1">Super Authority</span>
                                )}
                            </div>
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest w-fit"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Website
                        </Link>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        <NavItem href="/admin" icon="dashboard" active={pathname === '/admin'}>
                            Dashboard
                        </NavItem>
                    </div>

                    {/* Factions */}
                    <div className="mt-8">
                        <h3 className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                            All Factions
                        </h3>
                        <div className="space-y-0.5 max-h-[50vh] overflow-y-auto pr-1">
                            {factions.map((faction) => (
                                <NavItem
                                    key={faction.id}
                                    href={`/admin/faction/${faction.id}`}
                                    icon="faction"
                                    active={pathname === `/admin/faction/${faction.id}`}
                                    color={faction.primaryColor}
                                >
                                    {faction.name}
                                </NavItem>
                            ))}
                        </div>
                    </div>

                    {/* System section - visible to all */}
                    <div className="mt-8">
                        <h3 className="px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-3">
                            System
                        </h3>
                        <div className="space-y-0.5">
                            {isSuperAdmin && (
                                <NavItem
                                    href="/admin/users"
                                    icon="users"
                                    active={pathname === '/admin/users'}
                                >
                                    User Management
                                </NavItem>
                            )}
                            <NavItem
                                href="/admin/settings"
                                icon="settings"
                                active={pathname === '/admin/settings'}
                            >
                                Settings
                            </NavItem>
                        </div>
                    </div>
                </nav>

                {/* User section */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                                {user.email?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

function NavItem({
    href,
    icon,
    active,
    color,
    children,
}: {
    href: string;
    icon: string;
    active: boolean;
    color?: string;
    children: React.ReactNode;
}) {
    const icons: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
        faction: (
            <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color || 'var(--accent-primary)' }}
            />
        ),
        users: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        settings: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    };

    return (
        <Link href={href}>
            <motion.div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${active
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--foreground-muted)] hover:text-white hover:bg-white/5'
                    }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
            >
                {icons[icon]}
                <span className="text-sm font-medium truncate">{children}</span>
            </motion.div>
        </Link>
    );
}

function SignOutButton() {
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    return (
        <motion.button
            onClick={handleSignOut}
            className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--foreground-muted)] hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
        >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
        </motion.button>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    );
}
