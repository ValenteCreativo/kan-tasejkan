'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { artworkService } from '../../lib/services';
import type { Artwork } from '../../types';

export default function PortfolioPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'digital' | 'tattoo'>('all');

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      const { data } = await artworkService.getAll();
      setArtworks(data || []);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredArtworks = artworks.filter(art => {
    if (filter === 'all') return true;
    if (filter === 'tattoo') return art.category.toLowerCase().includes('tattoo');
    if (filter === 'digital') return !art.category.toLowerCase().includes('tattoo');
    return true;
  });

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#050505] text-[#e5e5e5]">
      <div className="content-container max-w-6xl">

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-24 text-center">
          <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-[0.2em] uppercase text-white">Portfolio</h1>
          <div className="w-px h-12 bg-gradient-to-b from-[#8a1c1c] to-transparent mx-auto mt-8 opacity-50" />

          {/* Filters */}
          <div className="flex justify-center gap-8 mt-12 text-[10px] tracking-[0.2em] uppercase text-[#404040]">
            <button onClick={() => setFilter('all')} className={`hover:text-[#8a1c1c] transition-colors ${filter === 'all' ? 'text-white' : ''}`}>All Works</button>
            <button onClick={() => setFilter('digital')} className={`hover:text-[#8a1c1c] transition-colors ${filter === 'digital' ? 'text-white' : ''}`}>Digital</button>
            <button onClick={() => setFilter('tattoo')} className={`hover:text-[#8a1c1c] transition-colors ${filter === 'tattoo' ? 'text-white' : ''}`}>Ink</button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
          </div>
        ) : (
          /* MUSEUM ARCHIVE LAYOUT: Small Images, Text Focus */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {filteredArtworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className="group"
              >
                <Link href={`/portfolio/${art.id}`} className="flex flex-col items-center">
                  {/* Museum Frame Image */}
                  <div className="relative w-48 h-64 mb-8 bg-[#0a0a0a] shadow-lg overflow-hidden border-[8px] border-[#111] group-hover:border-[#1a1a1a] transition-all duration-500 z-[60]">
                    {art.imageUrl ? (
                      <Image
                        src={art.imageUrl}
                        alt={art.title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 hover:scale-105 transform"
                      />
                    ) : <div className="w-full h-full bg-[#111]" />}
                  </div>

                  {/* Museum Label */}
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-cormorant italic text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors">{art.title}</h3>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#404040]">{art.medium || 'Mixed Media'}</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#8a1c1c] opacity-0 group-hover:opacity-100 transition-opacity">${art.price || 50}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
