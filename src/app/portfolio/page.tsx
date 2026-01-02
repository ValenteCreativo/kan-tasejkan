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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="mb-16 text-center">
            <div className="flex justify-center gap-2 mb-8">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-wider">Portfolio</h1>
            <p className="text-lg text-[#8b7d7b] font-light">Sacred markings channeled from beyond</p>
            <div className="divider my-8" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button key={category} onClick={() => setFilter(category)}
                className={`px-6 py-2 elegant-text text-xs transition-all duration-300 rounded ${filter === category ? 'minimal-border bg-[#8b7d7b]/10' : 'border border-transparent hover:border-[#8b7d7b]/20'}`}>
                {category}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="sacred-dot animate-subtle-glow" />
            </div>
          ) : filteredArtworks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8b7d7b] font-light">No pieces available in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtworks.map((artwork, index) => (
                <motion.div key={artwork.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} className="card-minimal overflow-hidden group hover-lift">
                  <div className="aspect-square relative">
                    <Image src={artwork.thumbnailUrl || artwork.imageUrl} alt={artwork.title} fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-lg font-light mb-2">{artwork.title}</h3>
                        <p className="text-sm text-[#8b7d7b] font-light line-clamp-2">{artwork.description}</p>
                        {artwork.year && <p className="text-xs elegant-text text-[#8b7d7b]/50 mt-2">{artwork.year}</p>}
                      </div>
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
