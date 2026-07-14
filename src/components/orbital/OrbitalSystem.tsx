'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Sistema orbital de Kan-Tasejkan.
 * Desktop/Tablet: Logo centrado con etiquetas en círculo alrededor.
 * Mobile: Logo arriba + grid de etiquetas debajo.
 */

interface NavItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: string;
  angle: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'quienes-somos', label: 'Quiénes Somos', description: 'Nuestra historia y comunidad.', href: '/quienes-somos', icon: 'people', angle: 0 },
  { id: 'servicios', label: 'Servicios', description: 'Hospedaje, restaurant, aventura, balneario y camping.', href: '/servicios', icon: 'mountain', angle: 60 },
  { id: 'talleres', label: 'Talleres', description: 'Aprende de nuestra cultura ancestral.', href: '/talleres', icon: 'hands', angle: 120 },
  { id: 'experiencias', label: 'Experiencias', description: 'Gastronómica, rituales, bodas tradicionales.', href: '/experiencias', icon: 'fire', angle: 180 },
  { id: 'precios', label: 'Precios', description: 'Tarifas y promociones.', href: '/precios', icon: 'star', angle: 240 },
  { id: 'premios', label: 'Premios', description: 'Reconocimientos a nuestro trabajo.', href: '/premios', icon: 'star', angle: 300 },
];

// Icon map
function getIcon(iconName: string) {
  switch (iconName) {
    case 'people': return <IconPeople />;
    case 'mountain': return <IconMountain />;
    case 'hands': return <IconHands />;
    case 'fire': return <IconFire />;
    case 'star': return <IconStar />;
    default: return <IconLeaf />;
  }
}

export default function OrbitalSystem() {
  const [logoSize, setLogoSize] = useState(320);
  const [orbitRadius, setOrbitRadius] = useState(280);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w >= 1280) { setLogoSize(380); setOrbitRadius(320); setIsMobile(false); }
      else if (w >= 1024) { setLogoSize(320); setOrbitRadius(280); setIsMobile(false); }
      else if (w >= 768) { setLogoSize(260); setOrbitRadius(240); setIsMobile(false); }
      else { setLogoSize(200); setOrbitRadius(0); setIsMobile(true); }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }

  // ─── MOBILE LAYOUT ───
  if (isMobile) {
    return (
      <div className="flex flex-col items-center w-full px-4 gap-6">
        {/* Logo */}
        <div className="relative" style={{ width: logoSize, height: logoSize }}>
          <Image
            src="/logo-nobg.png"
            alt="Kan-Tasejkan Logo"
            width={logoSize}
            height={logoSize}
            className="w-full h-full object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Grid of nav items */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-2">
                {getIcon(item.icon)}
              </div>
              <span className="text-[14px] font-[600] tracking-[0.02em] uppercase text-white leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ─── DESKTOP/TABLET LAYOUT ───
  const totalSize = orbitRadius * 2 + 160;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: totalSize, height: totalSize }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
    >
      {/* Logo (center) */}
      <motion.div
        className="absolute"
        style={{
          width: logoSize,
          height: logoSize,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={{
          rotateX: mousePos.y * -1.5,
          rotateY: mousePos.x * 1.5,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      >
        <Image
          src="/logo-nobg.png"
          alt="Kan-Tasejkan Logo"
          width={logoSize}
          height={logoSize}
          className="w-full h-full object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* Navigation labels in a circle */}
      {NAV_ITEMS.map((item) => {
        const angleRad = ((item.angle - 90) * Math.PI) / 180;
        const x = totalSize / 2 + orbitRadius * Math.cos(angleRad);
        const y = totalSize / 2 + orbitRadius * Math.sin(angleRad);

        return (
          <Link
            key={item.id}
            href={item.href}
            className="absolute flex flex-col items-center text-center group"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
              width: '160px',
            }}
          >
            <motion.div
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-2 group-hover:bg-white/30 group-hover:border-white/50 group-hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              {getIcon(item.icon)}
            </motion.div>
            <span className="text-[14px] md:text-[16px] lg:text-[18px] font-[600] tracking-[0.02em] uppercase text-white group-hover:text-white transition-colors leading-tight drop-shadow-lg">
              {item.label}
            </span>
            <span className="text-[11px] md:text-[12px] lg:text-[13px] font-[300] text-white/80 mt-1 leading-tight hidden lg:block drop-shadow-md">
              {item.description}
            </span>
          </Link>
        );
      })}

      {/* Floating particles (firefly-like) */}
      {[
        { angle: 30, dist: 0.5, s: 4, delay: 0, dur: 5 },
        { angle: 120, dist: 0.45, s: 3, delay: 1.2, dur: 6 },
        { angle: 200, dist: 0.55, s: 5, delay: 0.5, dur: 7 },
        { angle: 280, dist: 0.4, s: 3, delay: 2, dur: 5.5 },
        { angle: 350, dist: 0.6, s: 4, delay: 1.8, dur: 6.5 },
      ].map((p, i) => {
        const rad = ((p.angle - 90) * Math.PI) / 180;
        const px = totalSize / 2 + orbitRadius * p.dist * Math.cos(rad);
        const py = totalSize / 2 + orbitRadius * p.dist * Math.sin(rad);
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.s,
              height: p.s,
              left: px,
              top: py,
              transform: 'translate(-50%, -50%)',
              background: '#D4A853',
              boxShadow: '0 0 8px rgba(212,168,83,0.6)',
            }}
            animate={{ y: [0, -8, 0], opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

// ─── Icons (white for dark backgrounds) ───
function IconPeople() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="19" cy="7" r="3"/><path d="M21 21v-2a3 3 0 00-2-2.83"/></svg>; }
function IconMountain() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 16H2L8 3z"/></svg>; }
function IconHands() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V4a2 2 0 114 0v3m0 0V3a2 2 0 114 0v4m0 0V5a2 2 0 114 0v7c0 4-3 7-7 7h-1c-4 0-7-3-7-7V7a2 2 0 114 0v4"/></svg>; }
function IconFire() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c.5 2.5 2 4.5 2 7a4 4 0 11-8 0c0-2.5 2-4.5 2-7 1 1.5 2.5 3 4 3s3-1.5 4-3z"/><path d="M12 22c-4 0-7-3-7-7 0-2 1-4 3-6 .5 2 2 3 4 3s3.5-1 4-3c2 2 3 4 3 6 0 4-3 7-7 7z"/></svg>; }
function IconStar() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function IconLeaf() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 009.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>; }
