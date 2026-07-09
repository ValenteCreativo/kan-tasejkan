'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import OrbitalSystem from '../components/orbital/OrbitalSystem';

const CosmicIntro = dynamic(() => import('../components/orbital/CosmicIntro'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />,
});

export default function Home() {
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ['start start', 'end start'],
  });

  const cosmicOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <>
      {/* ─── Cosmic Universe Intro (first viewport, fixed behind) ─── */}
      <div ref={introRef} className="h-screen relative z-0">
        <motion.div className="fixed inset-0 z-0" style={{ opacity: cosmicOpacity }}>
          <CosmicIntro />
        </motion.div>
      </div>

      {/* ─── Mindfulverso Main (scrolls over the universe, stays) ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-between z-10">
        {/* Background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, #F0ECF5 0%, #FAF8F2 30%, #FAF8F2 70%, #EDE9F3 100%)',
        }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1/3" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(61,48,102,0.05) 0%, transparent 70%)',
          }} />
          <div className="absolute bottom-0 left-0 w-full h-1/3" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(61,48,102,0.03) 0%, transparent 70%)',
          }} />
        </div>

        {/* Header */}
        <motion.header
          className="relative z-20 pt-6 md:pt-8 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h1 className="text-[22px] md:text-[28px] lg:text-[34px] font-[300] tracking-[0.5em] uppercase text-[#24202F]">
            Mindfulverso
          </h1>
          <p className="mt-1.5 text-[11px] md:text-[13px] font-[300] tracking-[0.3em] text-[#49B6D6]">
            Bienestar Universal
          </p>
        </motion.header>

        {/* Orbital system */}
        <motion.div
          className="relative z-10 flex-1 w-full flex items-center justify-center py-6"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <OrbitalSystem />
        </motion.div>

        {/* Footer */}
      </section>
    </>
  );
}
