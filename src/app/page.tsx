'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import HorizontalScroll from '../components/HorizontalScroll';
import SectionHeader from '../components/ui/SectionHeader';
import { artworkService } from '../lib/supabase';
import { blogService } from '../lib/blog';
import type { Artwork, BlogPost } from '../types';
import { Instagram, Mail } from 'lucide-react';

export default function Home() {
  const [digitalArt, setDigitalArt] = useState<Artwork[]>([]);
  const [tattoos, setTattoos] = useState<Artwork[]>([]);
  const [journal, setJournal] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data: allArt } = await artworkService.getAll();
      const { data: allPosts } = await blogService.getAll(true);

      if (allArt) {
        setTattoos(allArt.filter(a => a.category.toLowerCase().includes('tattoo')).slice(0, 4));
        setDigitalArt(allArt.filter(a => !a.category.toLowerCase().includes('tattoo')).slice(0, 4));
      }

      if (allPosts) {
        setJournal(allPosts.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading grimoire data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#e5e5e5]">

      {/* 1. Hero Section (Entry Portal) - Gray Background like Footer */}
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#080808]">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,28,28,0.05),transparent_70%)] opacity-50 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-center px-4 max-w-3xl z-10"
        >
          {/* Copy Only */}
          <div className="mb-8 opacity-60">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent mx-auto" />
          </div>

          {/* NO QUOTES */}
          <p className="text-xl md:text-3xl font-light text-[#e5e5e5] tracking-[0.05em] leading-relaxed font-cormorant italic">
            Te acompaño en el camino de recordar tu esencia con herramientas de reconexión con el Ser.
          </p>

          <div className="mt-8 opacity-60">
            <div className="w-px h-16 bg-gradient-to-b from-[#8a1c1c] via-transparent to-transparent mx-auto" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#8b7d7b] mt-12"
          >
            Scroll to Open The Grimoire
          </motion.p>
        </motion.div>
      </section>

      {/* 2. The Horizontal Journey (3 Panels: Digital, Tattoo, Journal) - Black Background */}
      <HorizontalScroll className="bg-[#050505]">

        {/* Panel 1: Digital Archive */}
        <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* VISIBLE LABEL */}
          <div className="absolute top-12 left-12 text-xl font-bold uppercase tracking-[0.2em] text-[#e5e5e5] opacity-100 shadow-sm">Page 01 • Digital Art</div>
          <div className="w-full max-w-6xl flex flex-col items-start">
            <div className="w-full flex justify-between items-end mb-12">
              <SectionHeader title="Digital Art" subtitle="Portfolio" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK */}
              <Link href="/portfolio" className="hidden md:flex items-center gap-2 group">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">View Gallery</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                {digitalArt.length > 0 ? digitalArt.map((art) => (
                  <Link href="/portfolio" key={art.id} className="group block">
                    <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                      {art.imageUrl ? (
                        <Image src={art.imageUrl} alt={art.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : <div className="w-full h-full bg-[#111]" />}
                    </div>
                    <h4 className="text-xs uppercase tracking-widest text-center group-hover:text-[#8a1c1c] transition-colors">{art.title}</h4>
                  </Link>
                )) : <p className="text-xs text-[#404040]">Archive Empty.</p>}
              </div>
            )}

            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/portfolio" className="btn-ritual">View Gallery</Link>
            </div>
          </div>
        </div>

        {/* Panel 2: Ink Rituals (Tattoos) */}
        <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* VISIBLE LABEL */}
          <div className="absolute top-12 left-12 text-xl font-bold uppercase tracking-[0.2em] text-[#e5e5e5] opacity-100 shadow-sm">Page 02 • Tattoos</div>
          <div className="w-full max-w-6xl flex flex-col items-start">
            <div className="w-full flex justify-between items-end mb-12">
              <SectionHeader title="Tattoos" subtitle="Ink Art" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK -> /tattoos */}
              <Link href="/tattoos" className="hidden md:flex items-center gap-2 group">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">View Full Portfolio</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                {tattoos.length > 0 ? tattoos.map((art) => (
                  <Link href="/tattoos" key={art.id} className="group block">
                    <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700">
                      {art.imageUrl ? (
                        <Image src={art.imageUrl} alt={art.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : <div className="w-full h-full bg-[#111]" />}
                    </div>
                    <h4 className="text-xs uppercase tracking-widest text-center group-hover:text-[#8a1c1c] transition-colors">{art.title}</h4>
                  </Link>
                )) : (
                  <div className="col-span-4 border border-dashed border-[#1a1a1a] p-12 text-center w-full">
                    <p className="text-xs text-[#404040] tracking-widest uppercase">No Ink Art Displayed</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/tattoos" className="btn-ritual">View All</Link>
            </div>
          </div>
        </div>

        {/* Panel 3: The Journal */}
        <div className="w-screen h-screen flex-shrink-0 flex items-center justify-center px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* VISIBLE LABEL */}
          <div className="absolute top-12 left-12 text-xl font-bold uppercase tracking-[0.2em] text-[#e5e5e5] opacity-100 shadow-sm">Page 03 • The Journal</div>
          <div className="w-full max-w-6xl flex flex-col items-start">
            <div className="w-full flex justify-between items-end mb-12">
              <SectionHeader title="Journal" subtitle="Recent Transmission" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK */}
              <Link href="/blog" className="hidden md:flex items-center gap-2 group">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">Read All Entries</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
              {journal.length > 0 ? journal.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group block">
                  {/* Image for Blog Post */}
                  <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden mb-6 border border-[#1a1a1a] group-hover:border-[#8a1c1c] transition-colors duration-500">
                    {post.coverImageUrl ? (
                      <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#111]">
                        <div className="w-2 h-2 bg-[#8a1c1c] rounded-full opacity-50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                    <span className="absolute bottom-4 left-4 text-[10px] text-white tracking-widest">{new Date(post.createdAt!).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xl font-light mb-2 group-hover:text-[#8a1c1c] transition-colors">{post.title}</h3>
                  <p className="text-xs text-[#8b7d7b] leading-relaxed line-clamp-3">{post.excerpt || 'Read more...'}</p>
                </Link>
              )) : <p className="text-xs text-[#404040]">The journal is silent.</p>}
            </div>

            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/blog" className="btn-ritual">Read Journal</Link>
            </div>
          </div>
        </div>

      </HorizontalScroll>

      {/* 3. Footer / Contact (Vertical Scroll After Horizontal) - Gray Background */}
      <footer className="py-32 bg-[#080808] relative border-t border-[#1a1a1a]">
        <div className="content-container flex flex-col items-center text-center space-y-12">

          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent mx-auto" />

          <h2 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase text-white">Contact</h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mt-8">
            <a href="https://www.instagram.com/martina_gorozo/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
              <div className="w-16 h-16 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:border-[#8a1c1c] transition-colors bg-[#050505]">
                <Instagram size={24} className="text-[#8b7d7b] group-hover:text-[#8a1c1c] transition-colors" />
              </div>
              <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors">Instagram</span>
            </a>

            <a href="mailto:contact@martina.com" className="group flex flex-col items-center gap-4">
              <div className="w-16 h-16 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:border-[#8a1c1c] transition-colors bg-[#050505]">
                <Mail size={24} className="text-[#8b7d7b] group-hover:text-[#8a1c1c] transition-colors" />
              </div>
              <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors">Email</span>
            </a>
          </div>

          <nav className="flex gap-8 mt-12 text-[10px] tracking-widest uppercase text-[#404040]">
            <Link href="/" className="hover:text-[#8a1c1c] transition-colors">Home</Link>
            <Link href="/portfolio" className="hover:text-[#8a1c1c] transition-colors">Portfolio</Link>
            <Link href="/blog" className="hover:text-[#8a1c1c] transition-colors">Journal</Link>
            <Link href="/about" className="hover:text-[#8a1c1c] transition-colors">About</Link>
          </nav>

          <p className="text-[10px] text-[#2a2a2a] tracking-widest uppercase mt-8">
            © {new Date().getFullYear()} Martina Gorozo. All Rights Reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
