'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnDark, setIsOnDark] = useState(false);
  const pathname = usePathname();

  // Hide nav on admin pages
  if (pathname?.startsWith('/admin') || pathname === '/login') return null;

  // Detect if we're scrolled in the cosmic intro (dark background)
  useEffect(() => {
    function handleScroll() {
      const isHome = pathname === '/';
      setIsOnDark(isHome && window.scrollY < window.innerHeight * 0.7);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const textColor = isOnDark ? 'text-white' : 'text-[#24202F]';
  const iconColor = isOnDark ? 'text-white' : 'text-[#24202F]';

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/calendario', label: 'Calendario' },
    { href: '/cursos', label: 'Cursos' },
    { href: '/tienda', label: 'Tienda' },
    { href: '/blog', label: 'Blog' },
    { href: '/testimonios', label: 'Testimonios' },
    { href: '/contacto', label: 'Contacto' },
    { href: '/reservar', label: 'Reservar' },
  ];

  return (
    <>
      {/* ── Minimal top bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-5 md:py-6 px-5 md:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className={`text-[11px] md:text-xs font-light tracking-[0.35em] uppercase transition-colors duration-500 ${textColor}`}>
              Mindfulverso
            </span>
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`relative z-10 w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-500 ${isOnDark ? 'hover:bg-white/10' : 'hover:bg-[#4B3A78]/5'}`}
            aria-label="Abrir menú"
          >
            <Menu size={18} strokeWidth={1.2} className={`transition-colors duration-500 ${iconColor}`} />
          </button>
        </div>
      </nav>

      {/* ── Full-screen overlay menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FAF8F2]"
          >
            {/* Subtle background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-[#4B3A78]/[0.02] blur-[80px]" />
              <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full bg-[#48AFC3]/[0.03] blur-[60px]" />
            </div>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 md:top-6 md:right-8 w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#4B3A78]/5 transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={18} strokeWidth={1.2} className="text-[#24202F]" />
            </button>

            {/* Logo at top */}
            <div className="absolute top-5 left-5 md:top-6 md:left-8">
              <span className="text-[11px] font-light tracking-[0.35em] uppercase text-[#6B6580]">
                Mindfulverso
              </span>
            </div>

            {/* Nav links */}
            <nav className="relative z-10 flex flex-col items-center gap-4 md:gap-5">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative text-lg md:text-xl font-extralight tracking-[0.2em] uppercase transition-colors duration-300 ${
                      pathname === item.href
                        ? 'text-[#4B3A78]'
                        : 'text-[#24202F] hover:text-[#4B3A78]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-6 md:bottom-8 flex flex-col items-center gap-3"
            >
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#B9B8CA] to-transparent opacity-40" />
              <span className="text-[10px] font-light tracking-[0.3em] text-[#B9B8CA] uppercase">
                Bienestar Universal
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
