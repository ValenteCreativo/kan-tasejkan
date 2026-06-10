'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import HorizontalScroll from '../components/HorizontalScroll';
import SectionHeader from '../components/ui/SectionHeader';
import Carousel from '../components/ui/Carousel';
import { artworkService } from '../lib/services';
import { blogService } from '../lib/blog';
import type { Artwork, BlogPost } from '../types';
import { Instagram, Mail, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [digitalArt, setDigitalArt] = useState<Artwork[]>([]);
  const [tattoos, setTattoos]       = useState<Artwork[]>([]);
  const [journal, setJournal]       = useState<BlogPost[]>([]);
  const [loading, setLoading]       = useState(true);

  // ── PORTAL ──
  // A 250vh tall section. The sticky viewport locks in place
  // while the user scrolls. Animations complete by 70% progress,
  // giving a 30% "hold" buffer where the text is fully visible
  // and the image is fully gone — BEFORE the sticky releases.
  const portalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: portalRef,
    offset: ['start start', 'end end'],
  });

  // Image: zoom 1→5 over 0%–65%, fade out 25%–60%
  const imgScale    = useTransform(scrollYProgress, [0, 0.65],   [1, 5]);
  const imgOpacity  = useTransform(scrollYProgress, [0.25, 0.6], [1, 0]);

  // Vignette: appears 10%–50%
  const vigOpacity  = useTransform(scrollYProgress, [0.1, 0.5],  [0, 0.9]);

  // Scroll hint: disappears immediately
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06],   [1, 0]);

  // Text: appears 55%–70% — fully visible from 70% onwards
  const textOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const textY       = useTransform(scrollYProgress, [0.55, 0.7], [20, 0]);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const { data: allArt }   = await artworkService.getAll();
      const { data: allPosts } = await blogService.getAll(true);
      if (allArt) {
        setTattoos(allArt.filter(a =>  a.category.toLowerCase().includes('tattoo')).slice(0, 4));
        setDigitalArt(allArt.filter(a => !a.category.toLowerCase().includes('tattoo')).slice(0, 4));
      }
      if (allPosts) setJournal(allPosts.slice(0, 3));
    } catch (e) { console.error(e); }
    finally     { setLoading(false); }
  }

  return (
    <main className="bg-[#050505] text-[#e5e5e5]">

      {/* ═══════════════════════════════════════════════
          PORTAL — 250vh with sticky interior.
          The user scrolls naturally. Animations happen
          in the first 70%. Last 30% = text fully visible.
          Then the sticky releases and the page flows on.
          ═══════════════════════════════════════════════ */}
      <section ref={portalRef} className="relative h-[250vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ zIndex: 10 }}>

          {/* Black base */}
          <div className="absolute inset-0 bg-[#050505]" style={{ zIndex: 0 }} />

          {/* Portal image */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale: imgScale, opacity: imgOpacity, zIndex: 2 }}
          >
            <Image
              src="/intro.png"
              alt="Martina Gorozo"
              fill priority quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>

          {/* Radial vignette */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: vigOpacity, zIndex: 3 }}
          >
            <div className="w-full h-full" style={{
              background: 'radial-gradient(ellipse 55% 55% at center, transparent 0%, rgba(5,5,5,0.65) 55%, #050505 100%)',
            }} />
          </motion.div>

          {/* Scroll hint + Name — visible during the image, fades on first scroll */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
            style={{ opacity: hintOpacity, zIndex: 5 }}
          >
            {/* Name on the image */}
            <span
              className="text-2xl md:text-4xl uppercase text-white/80 tracking-[0.45em] mb-auto mt-[38vh]"
              style={{ fontFamily: 'var(--font-heading), serif', textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
            >
              Martina Gorozo
            </span>

            {/* Scroll indicator at bottom */}
            <div className="mb-10 flex flex-col items-center gap-2">
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-px h-10 bg-gradient-to-b from-[#8a1c1c] to-transparent"
              />
              <span
                className="text-[9px] uppercase tracking-[0.55em] text-[#c8bfba]"
                style={{ fontFamily: 'var(--font-heading), serif' }}
              >
                Scroll
              </span>
            </div>
          </motion.div>

          {/* Hero text — fades in after image is gone, holds until sticky releases */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
            style={{ opacity: textOpacity, y: textY, zIndex: 6 }}
          >
            {/* Upper sigil line */}
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent opacity-50 mb-10" />

            {/* Name — refined, elegant, branded */}
            <h1
              className="text-2xl md:text-4xl uppercase text-white/90 font-normal tracking-[0.45em] text-center"
              style={{ fontFamily: 'var(--font-heading), serif' }}
            >
              Martina Gorozo
            </h1>

            {/* Thin accent underline below the name */}
            <div className="w-24 h-px bg-[#8a1c1c] mt-5 mb-8 opacity-70" />

            {/* Subtitle — the channeled phrase, whispered */}
            <p
              className="text-sm md:text-lg font-light text-[#c8bfba]/80 tracking-[0.02em] leading-relaxed italic text-center max-w-lg"
              style={{ fontFamily: 'var(--font-body), serif' }}
            >
              Te acompaño en el camino de recordar tu esencia
              con herramientas de reconexión con el Ser.
            </p>

            {/* Lower sigil line */}
            <div className="w-px h-20 bg-gradient-to-b from-[#8a1c1c] via-transparent to-transparent opacity-50 mt-10" />

            {/* Scroll indicator — small, ethereal */}
            <div className="mt-8 flex flex-col items-center gap-1.5 pointer-events-none select-none opacity-60">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span
                  className="text-[8px] uppercase tracking-[0.6em] text-[#c8bfba]"
                  style={{ fontFamily: 'var(--font-heading), serif' }}
                >
                  ↓
                </span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          HORIZONTAL SCROLL — normal flow after portal
          ═══════════════════════════════════════════════ */}
      <HorizontalScroll className="bg-[#050505]">

        {/* Panel 1 — Digital Archive */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          <div className="absolute top-12 left-12 meta-label text-[#8a1c1c]">Page 01 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Digital Art" subtitle="Portfolio" align="left" className="mb-0 my-0" />
              <Link href="/portfolio" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="meta-label text-[#c8bfba] group-hover:text-white transition-colors">View Gallery</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>
            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <Carousel className="w-full">
                {digitalArt.length > 0 ? digitalArt.map((art) => (
                  <div key={art.id} className="group relative flex-shrink-0 w-52 md:w-60">
                    <Link href={`/portfolio/${art.id}`} className="block">
                      <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700 border border-transparent group-hover:border-[#1a1a1a]">
                        {art.imageUrl ? <Image src={art.imageUrl} alt={art.title} fill className="object-cover" /> : <div className="w-full h-full bg-[#111]" />}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                          <span className="price-label">${art.price || 50}</span>
                        </div>
                      </div>
                      <h4 className="meta-label text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors truncate">{art.title}</h4>
                    </Link>
                    <Link href={`/portfolio/${art.id}`} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-[#050505] border border-[#1a1a1a] rounded-full text-[#c8bfba] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#8a1c1c] hover:text-white hover:border-[#8a1c1c] z-20">
                      <ShoppingBag size={13} strokeWidth={1.5} />
                    </Link>
                  </div>
                )) : <p className="meta-label text-[#9a9a9a]">Archive Empty.</p>}
              </Carousel>
            )}
            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/portfolio" className="btn-ritual">View Gallery</Link>
            </div>
          </div>
        </div>

        {/* Panel 2 — Ink Rituals */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          <div className="absolute top-12 left-12 meta-label text-[#8a1c1c]">Page 02 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Tattoos" subtitle="Ink Art" align="left" className="mb-0 my-0" />
              <Link href="/tattoos" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="meta-label text-[#c8bfba] group-hover:text-white transition-colors">View Full Portfolio</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>
            {loading ? (
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow mx-auto" />
            ) : (
              <Carousel className="w-full">
                {tattoos.length > 0 ? tattoos.map((art) => (
                  <Link href={`/portfolio/${art.id}`} key={art.id} className="group block flex-shrink-0 w-52 md:w-60">
                    <div className="aspect-[3/4] bg-[#0a0a0a] relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-700 border border-transparent group-hover:border-[#1a1a1a]">
                      {art.imageUrl ? <Image src={art.imageUrl} alt={art.title} fill className="object-cover" /> : <div className="w-full h-full bg-[#111]" />}
                    </div>
                    <h4 className="meta-label text-center group-hover:text-[#8a1c1c] transition-colors">{art.title}</h4>
                  </Link>
                )) : (
                  <div className="w-full border border-dashed border-[#1a1a1a] p-12 text-center min-h-[300px] flex items-center justify-center">
                    <p className="meta-label text-[#9a9a9a]">No Ink Art Displayed</p>
                  </div>
                )}
              </Carousel>
            )}
            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/tattoos" className="btn-ritual">View All</Link>
            </div>
          </div>
        </div>

        {/* Panel 3 — Journal */}
        <div className="w-screen h-screen flex-shrink-0 flex items-start justify-center pt-16 md:pt-24 px-12 md:px-24 border-r border-[#1a1a1a]/50 relative bg-[#050505]">
          <div className="absolute top-12 left-12 meta-label text-[#8a1c1c]">Page 03 •</div>
          <div className="w-full max-w-6xl flex flex-col items-start h-full">
            <div className="w-full flex justify-between items-end mb-8 md:mb-12">
              <SectionHeader title="Journal" subtitle="Recent Transmission" align="left" className="mb-0 my-0" />
              <Link href="/blog" className="hidden md:flex items-center gap-2 group bg-[#050505] relative z-10 pl-4 py-1">
                <span className="meta-label text-[#c8bfba] group-hover:text-white transition-colors">Read All Entries</span>
                <span className="w-8 h-px bg-[#8a1c1c] group-hover:w-16 transition-all duration-500" />
              </Link>
            </div>
            <Carousel className="w-full">
              {journal.length > 0 ? journal.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group flex gap-6 items-start hover:bg-[#0a0a0a] p-4 rounded-sm transition-colors duration-500 flex-shrink-0 w-[360px] md:w-[420px]">
                  <div className="flex-shrink-0 w-20 h-24 bg-[#0a0a0a] relative overflow-hidden border border-[#1a1a1a] group-hover:border-[#8a1c1c] transition-colors duration-500">
                    {post.coverImageUrl
                      ? <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      : <div className="w-full h-full flex items-center justify-center bg-[#111]"><div className="w-1 h-1 bg-[#8a1c1c] rounded-full opacity-50" /></div>}
                  </div>
                  <div className="flex flex-col space-y-2 min-w-0">
                    <span className="eyebrow text-[#8a1c1c]">{new Date(post.createdAt!).toLocaleDateString()}</span>
                    <h3 style={{ fontFamily: 'var(--font-body), serif', fontSize: 'var(--text-title)', fontWeight: 300 }} className="text-[#e5e5e5] group-hover:text-white transition-colors truncate">{post.title}</h3>
                    <p className="text-xs text-[#c8bfba] leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100">{post.excerpt || 'Read more...'}</p>
                  </div>
                </Link>
              )) : <p className="meta-label text-[#9a9a9a]">The journal is silent.</p>}
            </Carousel>
            <div className="mt-12 md:hidden w-full flex justify-center">
              <Link href="/blog" className="btn-ritual">Read Journal</Link>
            </div>
          </div>
        </div>

      </HorizontalScroll>

      {/* Footer */}
      <footer className="py-32 bg-[#080808] relative border-t border-[#1a1a1a]">
        <div className="content-container flex flex-col items-center text-center space-y-12">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent mx-auto" />
          <h2 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white">Contact</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mt-8">
            <a href="https://www.instagram.com/martina_gorozo/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
              <div className="w-16 h-16 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:border-[#8a1c1c] transition-colors bg-[#050505]">
                <Instagram size={22} className="text-[#c8bfba] group-hover:text-[#8a1c1c] transition-colors" />
              </div>
              <span className="meta-label text-[#c8bfba] group-hover:text-white transition-colors">Instagram</span>
            </a>
            <a href="mailto:contact@martina.com" className="group flex flex-col items-center gap-4">
              <div className="w-16 h-16 border border-[#1a1a1a] rounded-full flex items-center justify-center group-hover:border-[#8a1c1c] transition-colors bg-[#050505]">
                <Mail size={22} className="text-[#c8bfba] group-hover:text-[#8a1c1c] transition-colors" />
              </div>
              <span className="meta-label text-[#c8bfba] group-hover:text-white transition-colors">Email</span>
            </a>
          </div>
          <nav className="flex flex-wrap justify-center gap-8 mt-12">
            {[['/', 'Home'], ['/portfolio', 'Portfolio'], ['/blog', 'Journal'], ['/reservations', 'Bookings'], ['/about', 'About']].map(([href, label]) => (
              <Link key={href} href={href} className="meta-label text-[#9a9a9a] hover:text-[#8a1c1c] transition-colors">{label}</Link>
            ))}
          </nav>
          <p className="meta-label text-[#555] mt-8">
            © {new Date().getFullYear()} Martina Gorozo. All Rights Reserved.
          </p>
        </div>
      </footer>

    </main>
  );
}
