'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-8xl font-black gradient-text-accent mb-4">404</h1>
                    <h2 className="text-2xl font-bold text-white mb-4">Territory Not Found</h2>
                    <p className="text-[var(--foreground-muted)] mb-8 max-w-md mx-auto">
                        This area doesn&apos;t exist in our records. Perhaps it&apos;s been... redacted.
                    </p>
                    <Link href="/">
                        <motion.button
                            className="btn-cinematic"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Return to Safety
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
