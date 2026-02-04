'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import HorizontalScroll from '../components/HorizontalScroll';
import SectionHeader from '../components/ui/SectionHeader';
import { artworkService } from '../lib/services';
import { blogService } from '../lib/blog';
import type { Artwork, BlogPost } from '../types';
import { Instagram, Mail, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [digitalArt, setDigitalArt] = useState<Artwork[]>([]);
  const [tattoos, setTattoos] = useState<Artwork[]>([]);
  const [journal, setJournal] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Fade Logic - Delayed to prevent instant disappearance
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [200, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [200, 500], [1, 0.95]);

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
          style={{ opacity: heroOpacity, scale: heroScale }}
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
        {/* RAISED ALIGNMENT: pt-16 md:pt-24 */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* RED BOLD LABEL - SMALLER (text-sm) */}
          <div className="absolute top-12 left-12 text-sm font-bold uppercase tracking-[0.2em] text-[#8a1c1c] opacity-100 shadow-sm">Page 01 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Digital Art" subtitle="Portfolio" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK - MASKED BACKGROUND */}
              <Link href="/portfolio" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">View Gallery</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {digitalArt.length > 0 ? digitalArt.map((art) => (
                  <div key={art.id} className="group relative">
                    {/* LINK TO DETAIL PAGE */}
                    <Link href={`/portfolio/${art.id}`} className="block relative z-0">
                      {/* Smaller Image Container */}
                      <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700 border border-transparent group-hover:border-[#1a1a1a] z-0 group-hover:z-[60]">
                        {art.imageUrl ? (
                          <Image src={art.imageUrl} alt={art.title} fill className="object-cover group-hover:opacity-100 transition-opacity" />
                        ) : <div className="w-full h-full bg-[#111]" />}

                        {/* Quick Shop Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-end">
                          <span className="text-[#8a1c1c] text-xs font-bold tracking-widest">${art.price || 50}</span>
                        </div>
                      </div>

                      {/* Minimal Details */}
                      <div className="space-y-1">
                        <h4 className="text-[10px] uppercase tracking-widest text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors truncate">{art.title}</h4>
                        <p className="text-[10px] text-[#404040] line-clamp-2 leading-relaxed h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {art.description || "Limited edition print. Signed by the artist."}
                        </p>
                      </div>
                    </Link>

                    {/* Add to Cart Button (Floating) - Links to detail for now */}
                    <Link href={`/portfolio/${art.id}`} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-[#050505] border border-[#1a1a1a] rounded-full text-[#8b7d7b] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#8a1c1c] hover:text-white hover:border-[#8a1c1c] z-20">
                      <ShoppingBag size={14} strokeWidth={1.5} />
                    </Link>
                  </div>
                )) : <p className="text-xs text-[#404040]">Archive Empty.</p>}
              </div>
            )}

            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/portfolio" className="btn-ritual">View Gallery</Link>
            </div>
          </div>
        </div>

        {/* Panel 2: Ink Rituals (Tattoos) */}
        {/* RAISED ALIGNMENT */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* RED BOLD LABEL - SMALLER (text-sm) */}
          <div className="absolute top-12 left-12 text-sm font-bold uppercase tracking-[0.2em] text-[#8a1c1c] opacity-100 shadow-sm">Page 02 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Tattoos" subtitle="Ink Art" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK - MASKED BACKGROUND */}
              <Link href="/tattoos" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">View Full Portfolio</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {tattoos.length > 0 ? tattoos.map((art) => (
                  <Link href={`/portfolio/${art.id}`} key={art.id} className="group block relative">
                    {/* Smaller Image Container */}
                    <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700 border border-transparent group-hover:border-[#1a1a1a] z-0 group-hover:z-[60]">
                      {art.imageUrl ? (
                        <Image src={art.imageUrl} alt={art.title} fill className="object-cover group-hover:opacity-100 transition-opacity" />
                      ) : <div className="w-full h-full bg-[#111]" />}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[10px] uppercase tracking-widest text-center group-hover:text-[#8a1c1c] transition-colors">{art.title}</h4>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-4 border border-dashed border-[#1a1a1a] p-12 text-center w-full min-h-[300px] flex items-center justify-center">
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
        {/* RAISED ALIGNMENT */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          {/* RED BOLD LABEL - SMALLER (text-sm) */}
          <div className="absolute top-12 left-12 text-sm font-bold uppercase tracking-[0.2em] text-[#8a1c1c] opacity-100 shadow-sm">Page 03 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Journal" subtitle="Recent Transmission" align="left" className="mb-0 my-0" />
              {/* VIEW MORE LINK - MASKED BACKGROUND */}
              <Link href="/blog" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="text-xs tracking-widest uppercase text-[#8b7d7b] group-hover:text-white transition-colors font-bold">Read All Entries</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>

            {/* REFACTORED JOURNAL LIST: Vertical Stack, Small Images */}
            <div className="flex flex-col space-y-8 w-full max-w-4xl">
              {journal.length > 0 ? journal.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group flex gap-8 items-start hover:bg-[#0a0a0a] p-4 -mx-4 rounded-sm transition-colors duration-500">

                  {/* IMAGE: Very Small Museum Frame (20x24 approx) */}
                  <div className="flex-shrink-0 w-20 h-24 bg-[#0a0a0a] relative overflow-hidden border border-[#1a1a1a] group-hover:border-[#8a1c1c] transition-colors duration-500">
                    {post.coverImageUrl ? (
                      <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#111]">
                        <div className="w-1 h-1 bg-[#8a1c1c] rounded-full opacity-50" />
                      </div>
                    )}
                  </div>

                  {/* TEXT CONTENT: Dominant */}
                  <div className="flex flex-col space-y-2">
                    <span className="text-[9px] text-[#8a1c1c] tracking-widest uppercase">{new Date(post.createdAt!).toLocaleDateString()}</span>
                    <h3 className="text-lg font-light text-[#e5e5e5] group-hover:text-white transition-colors">{post.title}</h3>
                    <p className="text-xs text-[#8b7d7b] leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100 max-w-xl">
                      {post.excerpt || 'Read more...'}
                    </p>
                  </div>

                  {/* ARROW: Right aligned */}
                  <div className="ml-auto flex items-center h-24 text-[#404040] group-hover:text-[#8a1c1c] transition-colors">
                    →
                  </div>
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

          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white">Contact</h2>

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
