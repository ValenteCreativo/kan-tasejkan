'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Horizontal carousel with arrow navigation.
 * Scrolls by one "page" (container width) per click.
 * Shows arrows only when there's overflow.
 */
export default function Carousel({ children, className = '' }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkOverflow();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkOverflow, { passive: true });
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkOverflow);
      ro.disconnect();
    };
  }, []);

  // Re-check when children change (e.g. data loads)
  useEffect(() => {
    setTimeout(checkOverflow, 100);
  }, [children]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`relative group/carousel ${className}`}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Left arrow */}
      {canLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2
                     w-9 h-9 flex items-center justify-center
                     bg-[#050505]/90 border border-[#1a1a1a] rounded-full
                     text-[#c8bfba] hover:text-white hover:border-[#8a1c1c]
                     transition-all duration-300 z-30
                     opacity-0 group-hover/carousel:opacity-100"
          aria-label="Previous"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>
      )}

      {/* Right arrow */}
      {canRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2
                     w-9 h-9 flex items-center justify-center
                     bg-[#050505]/90 border border-[#1a1a1a] rounded-full
                     text-[#c8bfba] hover:text-white hover:border-[#8a1c1c]
                     transition-all duration-300 z-30
                     opacity-0 group-hover/carousel:opacity-100"
          aria-label="Next"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
