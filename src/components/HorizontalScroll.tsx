'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

interface HorizontalScrollProps {
  children: React.ReactNode;
  className?: string;
}

// Progress thresholds
const ENTRY_SNAP_START  = 0.005;  // show entry bar
const ENTRY_SNAP_END    = 0.02;   // hide entry bar
const EXIT_LOCK_FROM    = 0.82;   // panels done traveling — lock starts
const EXIT_UNLOCK_AT    = 0.97;   // hold complete → release scroll + click

export default function HorizontalScroll({ children, className = '' }: HorizontalScrollProps) {
  const targetRef  = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);  // raw value readable in event handlers

  const { scrollYProgress } = useScroll({ target: targetRef });

  // Horizontal movement: panels travel over 0%–82% of the scroll range.
  // The remaining 18% = Journal stays locked in place (buffer/hold).
  const x = useTransform(scrollYProgress, [0, 0.82], ['0%', '-66.66%']);

  // ── UI states ──
  const [entryBar,   setEntryBar]   = useState(false);
  const [hasSnapped, setHasSnapped] = useState(false);
  const [exitFlash,  setExitFlash]  = useState(false);  // the "click" flash
  const [exitLocked, setExitLocked] = useState(false);  // true = blocking downward scroll

  // Haptic
  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([12]);
    }
  }, []);

  // Sync progress to ref
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;

    // ── Entry snap ──
    if (v > ENTRY_SNAP_START && v < ENTRY_SNAP_END && !hasSnapped) {
      setHasSnapped(true);
      setEntryBar(true);
      triggerHaptic();
      setTimeout(() => setEntryBar(false), 280);
    }
    if (v < 0.003) setHasSnapped(false);

    // ── Exit lock range ──
    if (v >= EXIT_LOCK_FROM && v < EXIT_UNLOCK_AT) {
      setExitLocked(true);
    } else if (v >= EXIT_UNLOCK_AT) {
      // Fully done — fire the "click" once
      if (exitLocked) {
        setExitLocked(false);
        setExitFlash(true);
        triggerHaptic();
        setTimeout(() => setExitFlash(false), 350);
      }
    } else {
      setExitLocked(false);
    }
  });

  // ── TOPE 2: block downward wheel scroll while exit lock is active ──
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;          // scrolling up → never block
      if (!progressRef.current) return;

      const v = progressRef.current;
      if (v >= EXIT_LOCK_FROM && v < EXIT_UNLOCK_AT) {
        // Still traveling — block the vertical scroll so the
        // horizontal panels finish their journey first.
        e.preventDefault();

        // Keep feeding scroll so the horizontal keeps moving
        if (targetRef.current) {
          const maxScroll = targetRef.current.scrollHeight || 0;
          const nudge = Math.min(window.scrollY + e.deltaY * 0.5,
            (targetRef.current.offsetTop || 0) + maxScroll);
          window.scrollTo({ top: nudge, behavior: 'instant' });
        }
      }
    };

    // passive:false required for preventDefault to work
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  // ── Touch equivalent ──
  useEffect(() => {
    let lastY = 0;
    const onStart = (e: TouchEvent) => { lastY = e.touches[0].clientY; };
    const onMove  = (e: TouchEvent) => {
      const v = progressRef.current;
      const currentY = e.touches[0].clientY;
      const down = currentY < lastY;
      lastY = currentY;
      if (!down) return;
      if (v >= EXIT_LOCK_FROM && v < EXIT_UNLOCK_AT) e.preventDefault();
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove',  onMove,  { passive: false });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove',  onMove);
    };
  }, []);

  return (
    <section ref={targetRef} className={`relative h-[420vh] ${className}`}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        {/* Entry bar — top flash on first scroll */}
        <div className={`
          absolute top-0 left-0 right-0 h-px bg-[#8a1c1c] z-50
          transition-all duration-200 origin-left
          ${entryBar ? 'scale-x-100 opacity-90 shadow-[0_0_16px_rgba(138,28,28,0.6)]' : 'scale-x-0 opacity-0'}
        `} />

        {/* Exit "click" flash — bottom bar that slams in when unlocked */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-px bg-[#8a1c1c] z-50
          transition-all duration-180 origin-left
          ${exitFlash ? 'scale-x-100 opacity-100 shadow-[0_0_20px_rgba(138,28,28,0.7)]' : 'scale-x-0 opacity-0'}
        `} />

        {/* Exit lock indicator — thin red border while blocked */}
        <div className={`
          absolute inset-0 pointer-events-none z-40 border
          transition-all duration-300
          ${exitLocked ? 'border-[#8a1c1c]/15' : 'border-transparent'}
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
