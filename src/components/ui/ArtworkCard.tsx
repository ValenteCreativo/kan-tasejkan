'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Artwork } from '../../types';

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

export default function ArtworkCard({ artwork, index }: ArtworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg sacred-border hover-glow"
    >
      <div className="aspect-square relative">
        <Image
          src={artwork.thumbnailUrl || artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-xl font-bold text-white mb-2">{artwork.title}</h3>
            <p className="text-gray-300 text-sm line-clamp-2">{artwork.description}</p>
            {artwork.year && <p className="text-[#D4AF37] text-sm mt-2">{artwork.year}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
