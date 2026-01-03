'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import type { Artwork } from '../../types';

interface ArtworkListProps {
  artworks: Artwork[];
  onDelete: (id: string) => void;
}

export default function ArtworkList({ artworks, onDelete }: ArtworkListProps) {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-12 glass-blood rounded-lg">
        <p className="text-gray-400">No artworks yet. Add your first piece above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <div key={artwork.id} className="glass-blood rounded-lg overflow-hidden sacred-border hover-glow">
          <div className="aspect-square relative">
            <Image
              src={artwork.thumbnailUrl || artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
            />
            {artwork.featured && (
              <div className="absolute top-2 right-2 px-3 py-1 bg-[#D4AF37] text-black text-xs font-bold rounded-full">
                FEATURED
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-white mb-1">{artwork.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{artwork.category}</p>
            {artwork.technique && (
              <p className="text-xs text-gray-500 mb-2 italic">Technique: {artwork.technique}</p>
            )}
            <p className="text-sm text-gray-300 line-clamp-2 mb-3">{artwork.description}</p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this artwork?')) {
                    onDelete(artwork.id);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-900/50 hover:bg-red-900 text-white rounded-lg
                         transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
