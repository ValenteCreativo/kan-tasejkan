'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Progress zones (3 panels + 2 stops + hold at end):
 *   0.00 – 0.03  → Entry (snap bar)
 *   0.03 – 0.18  → Panel 1 visible (HOLD)
 *   0.18 – 0.28  → Travel from Panel 1 → Panel 2
 *   0.28 – 0.48  → Panel 2 visible (HOLD)
 *   0.48 – 0.58  → Travel from Panel 2 → Panel 3
 *   0.58 – 0.78  → Panel 3 visible (HOLD)
 *   0.78 – 0.95  → Exit buffer
 *   0.95 – 1.00  → Release to footer
 */

export default function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const targetRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({ target: targetRef });

  // Stepped transform with shorter holds
  const x = useTransform(
    scrollYProgress,
    [0,    0.03, 0.18,  0.28,      0.48,      0.58,      0.78,      1.0],
    ['0%', '0%', '0%', '-33.33%', '-33.33%', '-66.66%', '-66.66%', '-66.66%']
  );

  // ── UI states ──
  const [entryBar,   setEntryBar]   = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [exitFlash,  setExitFlash]  = useState(false);

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([12]);
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;

    // Entry snap
    if (v > 0.005 && v < 0.02 && !hasSnapped) {
      setHasSnapped(true);
      setEntryBar(true);
      triggerHaptic();
      setTimeout(() => setEntryBar(false), 280);
    }
    if (v < 0.003) setHasSnapped(false);

    // Exit click
    if (v >= 0.94 && !exitFlash) {
      setExitFlash(true);
      triggerHaptic();
      setTimeout(() => setExitFlash(false), 350);
    }
    if (v < 0.93) setExitFlash && setExitFlash(false);
  });

  return (
    <section ref={targetRef} className={`relative h-[400vh] ${className}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        {/* Entry bar flash */}
        <div className={`
          absolute top-0 left-0 right-0 h-px bg-[#8a1c1c] z-50
          transition-all duration-200 origin-left
          ${entryBar ? 'scale-x-100 opacity-90 shadow-[0_0_16px_rgba(138,28,28,0.6)]' : 'scale-x-0 opacity-0'}
        `} />

        {/* Exit click flash */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-px bg-[#8a1c1c] z-50
          transition-all duration-200 origin-left
          ${exitFlash ? 'scale-x-100 opacity-100 shadow-[0_0_20px_rgba(138,28,28,0.7)]' : 'scale-x-0 opacity-0'}
        `} />

        {/* Panels */}
        <motion.div
          style={{ x }}
          className="flex h-screen items-center w-[300vw]"
        >
          {children}
        </motion.div>

      </div>
    </section>
  );
}
