'use client';

import { useEffect, useState } from 'react';
import { artworkService } from '../../lib/supabase';
import ArtworkCard from '../../components/ui/ArtworkCard';
import FlowerOfLife from '../../components/sacred-geometry/FlowerOfLife';
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
  const filteredArtworks = filter === 'all'
    ? artworks
    : artworks.filter(a => a.category === filter);

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FlowerOfLife size={120} className="animate-sacred-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 embroidery-text">Portfolio</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the sacred geometry collection
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 sacred-border
                ${filter === category
                  ? 'bg-[#8B0000] text-white'
                  : 'bg-transparent text-gray-300 hover:text-white hover-glow'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <FlowerOfLife size={150} className="animate-sacred-pulse" />
          </div>
        ) : filteredArtworks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">No artworks available yet.</p>
            <p className="text-gray-500 mt-2">Check back soon for new pieces.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, index) => (
              <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
