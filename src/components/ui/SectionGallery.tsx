'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublishedMedia } from '@/actions';

type MediaItem = {
  id: string;
  url: string;
  type: string;
  title: string | null;
};

interface SectionGalleryProps {
  section: string;
  columns?: 2 | 3 | 4;
  maxItems?: number;
  showEmpty?: boolean;
}

export default function SectionGallery({ section, columns = 3, maxItems, showEmpty = false }: SectionGalleryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getPublishedMedia(section).then(({ data }) => {
      let media = (data as MediaItem[]) || [];
      if (maxItems) media = media.slice(0, maxItems);
      setItems(media);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [section, maxItems]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-2 h-2 rounded-full bg-[#1B4332] animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    if (!showEmpty) return null;
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[#8B8B8B]">Próximamente: fotos de esta sección</p>
      </div>
    );
  }

  const colsClass = columns === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : columns === 4
      ? 'grid-cols-2 md:grid-cols-4'
      : 'grid-cols-2 md:grid-cols-3';

  function openLightbox(i: number) { setLightboxIndex(i); }
  function closeLightbox() { setLightboxIndex(null); }
  function prev() { if (lightboxIndex !== null) setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : items.length - 1); }
  function next() { if (lightboxIndex !== null) setLightboxIndex(lightboxIndex < items.length - 1 ? lightboxIndex + 1 : 0); }

  return (
    <>
      <div className={`grid ${colsClass} gap-3 md:gap-4`}>
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => openLightbox(i)}
            className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] hover:border-[#52B788] transition-all duration-300 cursor-pointer"
          >
            {item.type === 'image' ? (
              <Image
                src={item.url}
                alt={item.title || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play size={20} className="text-[#1B4332] ml-0.5" fill="#1B4332" />
                  </div>
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10">
              <X size={20} className="text-white" />
            </button>

            {/* Prev/Next */}
            {items.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10">
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10">
                  <ChevronRight size={20} className="text-white" />
                </button>
              </>
            )}

            {/* Content */}
            <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              {items[lightboxIndex].type === 'image' ? (
                <Image
                  src={items[lightboxIndex].url}
                  alt={items[lightboxIndex].title || ''}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <video
                  src={items[lightboxIndex].url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-lg"
                />
              )}
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs">
              {lightboxIndex + 1} / {items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
