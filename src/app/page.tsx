'use client';

import { motion } from 'framer-motion';
import OrbitalSystem from '../components/orbital/OrbitalSystem';
import Footer from '../components/ui/Footer';

export default function Home() {
  return (
    <>
      {/* ─── Landing: Fondo natural + Logo + Menú orbital ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-between">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-kan.jpeg')" }}
        />
        {/* Dark overlay + vignette for legibility */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }} />

        {/* Header */}
        <motion.header
          className="relative z-20 pt-10 md:pt-8 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-base md:text-xl lg:text-2xl font-[300] tracking-[0.25em] text-white uppercase drop-shadow-lg">
            Lugar de Sombras · Ecoturismo Indígena
          </p>
        </motion.header>

        {/* Orbital system */}
        <motion.div
          className="relative z-10 flex-1 w-full flex items-center justify-center py-6"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <OrbitalSystem />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="relative z-10 pb-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] font-[300] tracking-[0.4em] uppercase text-white/60">
            Descubre
          </span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none" className="animate-bounce opacity-60">
            <path d="M7 2v14M2 12l5 5 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <Footer />
    </>
  );
}
