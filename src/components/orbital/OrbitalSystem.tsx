'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

/**
 * Sistema orbital de Mindfulverso.
 * Desktop/Tablet: Logo centrado con etiquetas en círculo alrededor.
 * Mobile: Logo arriba + grid de etiquetas debajo.
 */

interface NavItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  angle: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nosotros', label: '¿Quiénes somos?', description: 'Conoce nuestra historia, propósito y equipo.', href: '/nosotros', icon: <IconHeart />, angle: 0 },
  { id: 'servicios', label: 'Servicios', description: 'Terapias, ceremonias y más para tu bienestar.', href: '/servicios', icon: <IconFlower />, angle: 40 },
  { id: 'retiros', label: 'Retiros', description: 'Experiencias transformadoras en lugares sagrados.', href: '/servicios/retiros', icon: <IconMountain />, angle: 80 },
  { id: 'cursos', label: 'Cursos', description: 'Formaciones para profundizar tu práctica.', href: '/cursos', icon: <IconLotus />, angle: 120 },
  { id: 'mindfulness', label: 'Mindfulness', description: 'Prácticas y entrenamientos para tu día a día.', href: '/servicios/mindfulness', icon: <IconPerson />, angle: 160 },
  { id: 'contacto', label: 'Contacto', description: 'Estamos aquí para acompañarte.', href: '/contacto', icon: <IconMail />, angle: 200 },
  { id: 'testimonios', label: 'Testimonios', description: 'Historias reales de transformación.', href: '/testimonios', icon: <IconChat />, angle: 240 },
  { id: 'tienda', label: 'Tienda', description: 'Productos conscientes para tu camino.', href: '/tienda', icon: <IconBag />, angle: 280 },
  { id: 'calendario', label: 'Calendario', description: 'Eventos, talleres y próximas fechas.', href: '/calendario', icon: <IconCalendar />, angle: 320 },
];

export default function OrbitalSystem() {
  const [logoSize, setLogoSize] = useState(380);
  const [orbitRadius, setOrbitRadius] = useState(300);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      if (w >= 1280) { setLogoSize(380); setOrbitRadius(330); setIsMobile(false); }
      else if (w >= 1024) { setLogoSize(320); setOrbitRadius(290); setIsMobile(false); }
      else if (w >= 768) { setLogoSize(260); setOrbitRadius(250); setIsMobile(false); }
      else { setLogoSize(180); setOrbitRadius(0); setIsMobile(true); }
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
            src="/isotipo.png"
            alt="Mindfulverso Logo"
            width={logoSize}
            height={logoSize}
            className="w-full h-full object-contain"
            priority
          />
        </div>

        {/* Grid of nav items */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-[#4B3A78]/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white/80 border border-[#E8E5F0] flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <span className="text-[11px] font-[500] tracking-[0.02em] uppercase text-[#24202F] leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // ─── DESKTOP/TABLET LAYOUT ───
  const totalSize = orbitRadius * 2 + 130;

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
          src="/isotipo.png"
          alt="Mindfulverso Logo"
          width={logoSize}
          height={logoSize}
          className="w-full h-full object-contain"
          priority
        />
        {/* Glow */}
        <div
          className="absolute rounded-full animate-pulse pointer-events-none"
          style={{
            width: logoSize * 0.2,
            height: logoSize * 0.2,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(245,239,160,0.2) 0%, transparent 70%)',
            filter: 'blur(6px)',
          }}
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
              width: '120px',
            }}
          >
            <motion.div
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E5F0] flex items-center justify-center mb-1.5 group-hover:border-[#49B6D6] group-hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.div>
            <span className="text-[11px] md:text-[13px] font-[600] tracking-[0.04em] uppercase text-[#24202F] group-hover:text-[#3D3066] transition-colors leading-tight">
              {item.label}
            </span>
            <span className="text-[9px] md:text-[10px] font-[300] text-[#6B6580] mt-0.5 leading-tight hidden lg:block">
              {item.description}
            </span>
          </Link>
        );
      })}

      {/* Floating particles */}
      {[
        { angle: 20, dist: 0.55, s: 5, delay: 0, dur: 5 },
        { angle: 110, dist: 0.5, s: 4, delay: 1.2, dur: 6 },
        { angle: 190, dist: 0.6, s: 5, delay: 0.5, dur: 7 },
        { angle: 270, dist: 0.45, s: 3, delay: 2, dur: 5.5 },
        { angle: 340, dist: 0.65, s: 4, delay: 1.8, dur: 6.5 },
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
              background: '#F5EFA0',
              boxShadow: '0 0 6px rgba(245,239,160,0.5)',
            }}
            animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
}

// ─── Icons ───
function IconFlower() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07-1.41 1.41M8.34 15.66l-1.41 1.41m12.14 0-1.41-1.41M8.34 8.34 6.93 6.93"/></svg>; }
function IconMountain() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 16H2L8 3z"/></svg>; }
function IconCalendar() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>; }
function IconLotus() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round"><path d="M12 3C7 3 3 7.5 3 12s4 9 9 9 9-4.5 9-9-4-9-9-9z"/><path d="M12 3c2 3 2 9 0 12m0-12c-2 3-2 9 0 12"/></svg>; }
function IconBag() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>; }
function IconPerson() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 00-16 0"/></svg>; }
function IconChat() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>; }
function IconMail() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>; }
function IconHeart() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D3066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>; }
