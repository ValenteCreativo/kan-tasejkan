'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen sacred-minimal">
      <div className="content-container">
        <div className="min-h-screen flex flex-col items-center justify-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center max-w-3xl"
          >
            <div className="mb-8 flex justify-center gap-2">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>

            <h1 className="text-6xl md:text-8xl font-light mb-8 tracking-wider">
              Martina
            </h1>

            <p className="text-lg md:text-xl mb-12 font-light leading-relaxed text-[#8b7d7b]">
              Handpoke artist channeling sacred dimensions through ink and intention.
              <br />
              Each piece a portal, each line a whisper from beyond.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/portfolio"
                className="btn-elegant group flex items-center gap-2"
              >
                View Work
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={16}
                />
              </Link>
              <Link
                href="/about"
                className="btn-elegant"
              >
                Book Session
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl"
          >
            <div className="card-minimal p-8 text-center">
              <div className="elegant-text text-xs mb-4 text-[#8b7d7b]">Sacred Craft</div>
              <p className="text-sm font-light leading-relaxed opacity-70">
                Traditional handpoke techniques merged with channeled geometric wisdom
              </p>
            </div>
            <div className="card-minimal p-8 text-center">
              <div className="elegant-text text-xs mb-4 text-[#8b7d7b]">Divine Channel</div>
              <p className="text-sm font-light leading-relaxed opacity-70">
                Each design received from higher dimensions, translated to skin
              </p>
            </div>
            <div className="card-minimal p-8 text-center">
              <div className="elegant-text text-xs mb-4 text-[#8b7d7b]">Eternal Art</div>
              <p className="text-sm font-light leading-relaxed opacity-70">
                Permanent marks carrying frequency, protection, and transformation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
