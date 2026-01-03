'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { artworkService } from '../../lib/supabase';
import type { Artwork } from '../../types';

export default function PortfolioPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      const { data, error } = await artworkService.getAll();
      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['all', ...new Set(artworks.map(a => a.category))];
  const filteredArtworks = filter === 'all' ? artworks : artworks.filter(a => a.category === filter);

  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-7xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className="mb-24 text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-[0.2em] uppercase text-white">Portfolio</h1>
            <div className="w-px h-12 bg-gradient-to-b from-[#8a1c1c] to-transparent mx-auto mt-8 opacity-50" />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-20">
            {categories.map((category) => (
              <button key={category} onClick={() => setFilter(category)}
                className={`uppercase tracking-[0.2em] text-[10px] transition-all duration-500 pb-2 border-b ${filter === category ? 'text-[#8a1c1c] border-[#8a1c1c]' : 'text-[#404040] border-transparent hover:text-white'}`}>
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#404040] font-light italic">The archive is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 w-full">
              {filteredArtworks.map((artwork, index) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`group relative ${index % 2 !== 0 ? 'lg:translate-y-24' : ''} ${index % 3 === 2 ? 'lg:translate-y-12' : ''}`}
                >
                  {/* Image Container - Void Style */}
                  <div className="relative mb-6 overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-[-1px] w-[1px] bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />
                    <div className="absolute top-0 bottom-0 right-[-1px] w-[1px] bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-10" />

                    <div className="aspect-[3/4] relative bg-[#0a0a0a]">
                      <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-all duration-[1.5s] grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 scale-100 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>

                  {/* Minimal Metadata */}
                  <div className="flex flex-col items-center space-y-2">
                    <h3 className="text-xl font-light tracking-[0.2em] text-[#e5e5e5] uppercase group-hover:text-[#8a1c1c] transition-colors duration-500">{artwork.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 bg-[#404040]" />
                      <p className="text-[10px] text-[#8b7d7b] tracking-widest uppercase">{artwork.category}</p>
                      <span className="h-px w-8 bg-[#404040]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
