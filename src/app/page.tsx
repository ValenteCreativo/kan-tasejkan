'use client';

import Link from 'next/link';
import FlowerOfLife from '../components/sacred-geometry/FlowerOfLife';
import Metatron from '../components/sacred-geometry/Metatron';
import SacredPattern from '../components/sacred-geometry/SacredPattern';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <SacredPattern />
      
      <div className="absolute top-20 left-10 opacity-20 animate-sacred-pulse">
        <FlowerOfLife size={300} animate={false} />
      </div>
      
      <div className="absolute bottom-20 right-10 opacity-10">
        <Metatron size={400} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <FlowerOfLife size={200} className="animate-sacred-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 embroidery-text">
            Martina
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sacred geometry meets contemporary art. Explore a collection where ancient symbolism 
            intertwines with modern expression.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/portfolio"
              className="group px-8 py-4 bg-[#8B0000] hover:bg-[#DC143C] text-white rounded-lg 
                       transition-all duration-300 flex items-center gap-2 sacred-border hover-glow">
              View Portfolio
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="glass-blood rounded-lg p-6 hover-glow">
              <div className="text-3xl font-bold text-[#DC143C] mb-2">Sacred</div>
              <p className="text-gray-300 text-sm">Ancient geometric patterns</p>
            </div>
            <div className="glass-blood rounded-lg p-6 hover-glow">
              <div className="text-3xl font-bold text-[#DC143C] mb-2">Art</div>
              <p className="text-gray-300 text-sm">Contemporary expression</p>
            </div>
            <div className="glass-blood rounded-lg p-6 hover-glow">
              <div className="text-3xl font-bold text-[#DC143C] mb-2">Soul</div>
              <p className="text-gray-300 text-sm">Spiritual embroidery</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
