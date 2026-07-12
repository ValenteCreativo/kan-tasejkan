'use client';

import Image from 'next/image';
import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  poster?: string;
}

interface MediaGridProps {
  items: MediaItem[];
  columns?: 2 | 3 | 4;
}

export default function MediaGrid({ items, columns = 3 }: MediaGridProps) {
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const colsClass = columns === 2
    ? 'grid-cols-1 md:grid-cols-2'
    : columns === 4
      ? 'grid-cols-2 md:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

  return (
    <>
      <div className={`grid ${colsClass} gap-3 md:gap-4`}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setLightbox(item)}
            className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] hover:border-[#52B788] transition-all duration-300 cursor-pointer"
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={item.alt || `Foto ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <>
                {item.poster ? (
                  <Image
                    src={item.poster}
                    alt={item.alt || `Video ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#1B4332]/10" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={22} className="text-[#1B4332] ml-1" fill="#1B4332" />
                  </div>
                </div>
              </>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-8"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={20} className="text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === 'image' ? (
                <div className="relative w-full h-[80vh]">
                  <Image
                    src={lightbox.src}
                    alt={lightbox.alt || 'Imagen'}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={lightbox.src}
                  controls
                  autoPlay
                  className="w-full max-h-[80vh] rounded-lg"
                  poster={lightbox.poster}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
