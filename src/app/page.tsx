'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FactionMenu } from '@/components/layout/FactionMenu';
import { factions as staticFactions } from '@/lib/factions';

export default function Home() {
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-cycle background images
  useEffect(() => {
    const timer = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % staticFactions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeImage = staticFactions[backgroundIndex]?.featuredImage || staticFactions[0]?.logo;

  return (
    <main className="relative h-screen bg-black overflow-hidden flex flex-col items-center justify-center">

      {/* AMBIENT BACKGROUND LAYER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundIndex}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-neutral-900/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />

          <div
            className="absolute inset-0 bg-cover bg-center grayscale-[50%] brightness-[0.4]"
            style={{ backgroundImage: `url('${activeImage}')` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* GRID OVERLAY */}
      <div className="absolute inset-0 z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

      {/* CENTERED NEUTRAL CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center space-y-12 max-w-4xl px-6">

        {/* BRAND IDENTITY */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-orange-500 font-mono text-xs md:text-sm tracking-[0.5em] uppercase pl-2">
              Vital Roleplay
            </span>
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none">
              Illegal<br />Factions
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-white/40 text-sm md:text-lg font-medium max-w-lg mx-auto leading-relaxed tracking-wide"
          >
            The official roster and documentation for verified criminal entities, gangs, and organizations within Los Santos.
          </motion.p>
        </div>

        {/* PRIMARY ACTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group relative px-10 py-4 bg-white text-black hover:bg-orange-600 hover:text-white transition-all duration-500 rounded-lg overflow-hidden"
          >
            <span className="relative z-10 font-black uppercase tracking-[0.2em] text-xs">
              Access Roster
            </span>
          </button>
        </motion.div>

      </div>

      {/* FOOTER LABEL */}
      <div className="absolute bottom-8 z-20 text-[10px] text-white/20 font-mono uppercase tracking-widest">
        Secure Database // V16.0.0
      </div>

      <FactionMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </main>
  );
}
