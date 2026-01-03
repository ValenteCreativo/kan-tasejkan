'use client';

import { Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="mb-12 text-center">
            <div className="flex justify-center gap-2 mb-8">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-wider">About</h1>
            <div className="divider my-8" />
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-lg font-light leading-relaxed text-[#8b7d7b]">
              I am Martina, a handpoke tattoo artist working at the intersection of ancient wisdom and contemporary art. Through deep meditation and conscious channeling, I receive sacred geometric patterns and symbols from higher dimensions.
            </p>
            <p className="text-lg font-light leading-relaxed text-[#8b7d7b]">
              Each tattoo is a unique collaboration between your energy, my hand, and the divine intelligence that flows through this work. The handpoke method creates a meditative, intimate experience where intention and artistry merge to create permanent marks of transformation.
            </p>
            <p className="text-lg font-light leading-relaxed text-[#8b7d7b]">
              My practice is rooted in respect for the body as a sacred vessel, and each piece is created with deep presence, care, and connection to something greater than ourselves.
            </p>
          </div>

          <div className="mt-16 glass-minimal p-12 rounded-lg">
            <h2 className="elegant-text text-sm mb-8 text-center">Book a Session</h2>
            <div className="space-y-6 max-w-md mx-auto">
              <a href="mailto:hola@martina.com" className="flex items-center justify-center gap-3 btn-elegant w-full">
                <Mail size={18} />hola@martina.com
              </a>
              <a href="https://instagram.com/martina" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 btn-elegant w-full">
                <Instagram size={18} />@martina
              </a>
            </div>
            <div className="mt-12 text-center">
              <p className="text-sm font-light text-[#8b7d7b] leading-relaxed">
                Sessions are held in a private, sacred space.<br />
                Please reach out with your vision, and we&apos;ll co-create something eternal.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
