'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import SectionDivider from '../components/ui/SectionDivider';
import SectionHeader from '../components/ui/SectionHeader';
import { artworkService } from '../lib/supabase';
import type { Artwork } from '../types';

export default function Home() {
  const [recentArtworks, setRecentArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentWorks();
  }, []);

  async function loadRecentWorks() {
    try {
      // Fetch all and take the first 3 for the home display
      const { data } = await artworkService.getAll();
      if (data) {
        setRecentArtworks(data.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading home artworks:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden pt-32 pb-20">

      {/* Structural Vertical Thread (Left) */}
      <div className="fixed left-8 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8a1c1c]/20 to-transparent red-thread hidden md:block" />

      {/* Structural Vertical Thread (Right) */}
      <div className="fixed right-8 md:right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#8a1c1c]/20 to-transparent red-thread hidden md:block" />

      {/* Background Ambience - Minimal */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(138,28,28,0.1)_0%,transparent_70%)] animate-pulse-slow" />
      </div>

      <div className="content-container z-10 w-full">
        <div className="flex flex-col items-center text-center space-y-12">

          {/* Main Title - Static & Ceremonial */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <h1 className="text-6xl md:text-9xl font-light text-white uppercase tracking-[0.2em] md:tracking-[0.3em] mix-blend-difference">
              Mago
            </h1>
            <p className="text-sm md:text-base text-[#8b7d7b] tracking-[0.2em] uppercase mt-6 opacity-80 max-w-2xl mx-auto leading-loose">
              👁️ Te acompaño en el camino de recordar tu esencia con herramientas de reconexión con el Ser 👁️
            </p>
          </motion.div>

          {/* Section Divider Stitch */}
          <SectionDivider />

          <div className="h-16" /> {/* Spacer */}

          {/* Latest Works - Real Data */}
          <SectionHeader title="Recent Work" subtitle="Latest Creations" />

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
          ) : recentArtworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">
              {recentArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`group cursor-pointer ${index === 1 ? 'md:mt-12' : ''}`}
                >
                  <Link href="/portfolio">
                    <div className="aspect-[3/4] bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden mb-4">
                      {artwork.imageUrl ? (
                        <Image
                          src={artwork.imageUrl}
                          alt={artwork.title}
                          fill
                          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#8a1c1c] rounded-full opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#8a1c1c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                    <h4 className="text-sm tracking-[0.2em] text-[#e5e5e5] uppercase group-hover:text-[#8a1c1c] transition-colors">{artwork.title}</h4>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#404040] text-sm tracking-widest uppercase">No artworks found.</p>
            </div>
          )}

          <div className="h-20" />

          {/* Call to Actions - Standard */}
          <Link href="/portfolio" className="btn-ritual group">
            <span className="relative z-10">View Portfolio</span>
          </Link>

        </div>
      </div>

      {/* Footer Symbol */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2, duration: 2 }}
        className="fixed bottom-8 right-8 hidden md:flex flex-col items-center gap-4"
      >
        <div className="w-px h-12 bg-[#8a1c1c] opacity-50" />
        <span className="text-[10px] uppercase tracking-widest text-[#404040] rotate-180" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
      </motion.div>
    </main>
  );
}
