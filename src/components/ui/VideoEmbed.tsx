'use client';

import { Play } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface VideoEmbedProps {
  src: string;
  poster?: string;
  title?: string;
  aspectRatio?: 'video' | 'wide' | 'square';
}

export default function VideoEmbed({ src, poster, title, aspectRatio = 'video' }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const aspectClass = aspectRatio === 'wide'
    ? 'aspect-[21/9]'
    : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-video';

  // YouTube/Vimeo detection
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');

  if (isYoutube || isVimeo) {
    const embedUrl = isYoutube
      ? src.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
      : src.replace('vimeo.com/', 'player.vimeo.com/video/');

    return (
      <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[#E0DDD5] shadow-lg`}>
        <iframe
          src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=0`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || 'Video'}
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border border-[#E0DDD5] shadow-lg bg-black`}>
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
        >
          {poster && (
            <Image src={poster} alt={title || 'Video'} fill className="object-cover" sizes="100vw" />
          )}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
          <div className="relative w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play size={32} className="text-[#1B4332] ml-1" fill="#1B4332" />
          </div>
          {title && (
            <span className="absolute bottom-6 left-6 text-white text-sm font-light tracking-wider">
              {title}
            </span>
          )}
        </button>
      ) : (
        <video
          src={src}
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-cover"
          poster={poster}
        />
      )}
    </div>
  );
}
