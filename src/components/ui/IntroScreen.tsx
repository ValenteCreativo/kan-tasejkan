'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

/**
 * IntroScreen — plays once per session.
 * Shows intro.png with a brutal zoom-in then fades out to reveal the page.
 */
export default function IntroScreen() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    const seen = sessionStorage.getItem('intro_seen');
    if (seen) {
      setDone(true);
      return;
    }
    setVisible(true);
    // Lock body scroll while intro plays
    document.body.style.overflow = 'hidden';

    const dismiss = () => {
      document.body.style.overflow = '';
      setVisible(false);
      sessionStorage.setItem('intro_seen', '1');
      setTimeout(() => setDone(true), 950);
    };

    // After the animation completes, hide and mark as seen
    const timer = setTimeout(dismiss, 2800);

    // Also allow skip on click/tap
    window.addEventListener('click', dismiss, { once: true });
    window.addEventListener('touchstart', dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('click', dismiss);
      window.removeEventListener('touchstart', dismiss);
    };
  }, []);

  if (done) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#050505] flex items-center justify-center"
          // Prevent scroll while intro plays
          style={{ touchAction: 'none' }}
        >
          {/* The image — starts normal, zooms in brutally */}
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1, filter: 'brightness(0.7)' }}
            animate={{ scale: 1.35, filter: 'brightness(0.5)' }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/intro.png"
              alt="Martina Gorozo"
              fill
              priority
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>

          {/* Vignette overlay — deepens as zoom progresses */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.8, ease: 'easeIn' }}
            style={{
              background:
                'radial-gradient(ellipse at center, transparent 20%, rgba(5,5,5,0.7) 80%, #050505 100%)',
            }}
          />

          {/* Name — fades in late, fades out with the rest */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3 select-none"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
          >
            <div className="w-px h-10 bg-gradient-to-b from-transparent to-[#8a1c1c] opacity-70" />
            <span
              style={{ fontFamily: 'var(--font-cinzel), serif', letterSpacing: '0.5em' }}
              className="text-xs md:text-sm uppercase text-white/70 tracking-[0.5em]"
            >
              Martina Gorozo
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-[#8a1c1c] to-transparent opacity-70" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
