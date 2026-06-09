'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Eye, EyeOff, Star, GripVertical } from 'lucide-react';
import type { Artwork } from '../../types';
import { artworkService } from '../../lib/services';

interface ArtworkListProps {
  artworks: Artwork[];
  onDelete: (id: string) => void;
}

export default function ArtworkList({ artworks, onDelete }: ArtworkListProps) {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-16 glass-minimal rounded-lg">
        <p className="text-[#8b7d7b] font-light text-sm">
          No pieces yet. Add your first work using the form.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quick stats */}
      <div className="flex gap-4 mb-4 text-xs text-[#8b7d7b]">
        <span>{artworks.length} {artworks.length === 1 ? 'piece' : 'pieces'}</span>
        <span>·</span>
        <span>{artworks.filter(a => a.available).length} available</span>
        <span>·</span>
        <span>{artworks.filter(a => a.featured).length} featured</span>
      </div>

      {artworks.map((artwork) => (
        <ArtworkRow key={artwork.id} artwork={artwork} onDelete={onDelete} />
      ))}
    </div>
  );
}

function ArtworkRow({ artwork, onDelete }: { artwork: Artwork; onDelete: (id: string) => void }) {
  const [toggling, setToggling] = useState(false);
  const [available, setAvailable] = useState(artwork.available ?? true);
  const [featured, setFeatured] = useState(artwork.featured ?? false);

  const toggleAvailable = async () => {
    setToggling(true);
    try {
      const newVal = !available;
      await artworkService.update(artwork.id, { available: newVal });
      setAvailable(newVal);
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  const toggleFeatured = async () => {
    setToggling(true);
    try {
      const newVal = !featured;
      await artworkService.update(artwork.id, { featured: newVal });
      setFeatured(newVal);
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  return (
    <div className="glass-minimal rounded-lg p-4 flex items-center gap-4 group hover-lift">
      {/* Drag handle (visual only for now) */}
      <GripVertical size={14} className="text-[#2a2a2a] group-hover:text-[#555] flex-shrink-0 cursor-grab" />

      {/* Thumbnail */}
      <div className="w-14 h-14 relative rounded overflow-hidden flex-shrink-0 bg-[#0a0a0a]">
        <Image
          src={artwork.thumbnailUrl || artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-light text-white truncate">{artwork.title}</h3>
          {featured && (
            <Star size={11} className="text-[#D4AF37] flex-shrink-0" fill="#D4AF37" />
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#8b7d7b]">
          <span className="uppercase tracking-wider">{artwork.category}</span>
          {artwork.medium && <><span>·</span><span>{artwork.medium}</span></>}
          {artwork.year && <><span>·</span><span>{artwork.year}</span></>}
        </div>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right mr-2">
        {artwork.price ? (
          <span className="text-sm text-[#8a1c1c] font-light">${Number(artwork.price).toFixed(0)}</span>
        ) : (
          <span className="text-[10px] text-[#555]">No price</span>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Toggle availability */}
        <button
          onClick={toggleAvailable}
          disabled={toggling}
          title={available ? 'Mark as sold' : 'Mark as available'}
          className={`p-1.5 rounded transition-colors ${
            available
              ? 'text-green-500 hover:bg-green-900/20'
              : 'text-[#555] hover:bg-[#1a1a1a]'
          }`}
        >
          {available ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>

        {/* Toggle featured */}
        <button
          onClick={toggleFeatured}
          disabled={toggling}
          title={featured ? 'Remove from featured' : 'Feature this piece'}
          className={`p-1.5 rounded transition-colors ${
            featured
              ? 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
              : 'text-[#555] hover:bg-[#1a1a1a]'
          }`}
        >
          <Star size={14} fill={featured ? '#D4AF37' : 'none'} />
        </button>

        {/* Delete */}
        <button
          onClick={() => {
            if (confirm(`Delete "${artwork.title}"? This cannot be undone.`)) {
              onDelete(artwork.id);
            }
          }}
          className="p-1.5 rounded text-[#555] hover:text-red-400 hover:bg-red-900/10 transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
