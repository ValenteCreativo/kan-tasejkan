'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectWalletWrapper from './ConnectWalletWrapper';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for monastic fading
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', sub: 'Inicio' },
    { href: '/portfolio', label: 'Portfolio', sub: 'Trabajos' },
    { href: '/tattoos', label: 'Tattoos', sub: 'Ink' },
    { href: '/blog', label: 'Journal', sub: 'Blog' },
    { href: '/about', label: 'About', sub: 'Conóceme' },
  ];

  return (
    <>
      {/* The Monastic Bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-4 mix-blend-difference' : 'py-8'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="content-container relative flex items-center justify-between">

          {/* Left Sigil (Optional/Hidden on desktop if centered) */}
          <div className="hidden md:block w-12" />

          {/* Central Totem - absolutely centered */}
          <Link
            href="/"
            className="group flex flex-col items-center absolute left-1/2 -translate-x-1/2"
            style={{ opacity: scrolled ? 0 : 1, pointerEvents: scrolled ? 'none' : 'auto', transition: 'opacity 0.5s ease, transform 0.4s ease' }}
          >
            <span className={`font-light tracking-[0.5em] uppercase transition-all duration-500 ${scrolled ? 'text-xs text-white' : 'text-xl text-white'}`}>
              Martina Gorozo
            </span>
            <span className={`h-px bg-[#8a1c1c] transition-all duration-700 ${scrolled ? 'w-0' : 'w-full mt-2 group-hover:w-1/2'}`} />
          </Link>

          {/* Right Side - Wallet + Menu */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Wallet Button - Hidden on scroll for cleaner look */}
            <div className={`hidden md:block transition-opacity duration-500 ${scrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <ConnectWalletWrapper compact={scrolled} />
            </div>

            {/* Menu Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="group flex items-center gap-3 text-white hover:text-[#8a1c1c] transition-colors"
            >
              <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Open
              </span>
              <div className="relative">
                <Menu size={24} strokeWidth={1} className="transition-transform duration-500 group-hover:rotate-90" />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* The Void Portal (Full Screen Menu) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
            className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 md:top-12 md:right-12 text-white/50 hover:text-[#8a1c1c] transition-colors group"
            >
              <div className="flex flex-col items-center gap-2">
                <X size={32} strokeWidth={0.5} className="transition-transform duration-500 group-hover:rotate-90" />
                <span className="text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
              </div>
            </button>

            {/* Menu Items */}
            <nav className="relative z-10 flex flex-col items-center space-y-12">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex flex-col items-center"
                  >
                    <span className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-[#e5e5e5] group-hover:text-[#8a1c1c] transition-colors duration-500">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#404040] tracking-[0.4em] uppercase mt-2 group-hover:tracking-[0.8em] transition-all duration-500">
                      {item.sub}
                    </span>

                    {/* Hover Thread */}
                    <span className="absolute -bottom-4 left-1/2 w-0 h-px bg-[#8a1c1c] group-hover:w-full group-hover:left-0 transition-all duration-500" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Wallet Connect in Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, delay: navItems.length * 0.1 + 0.1 }}
              className="mt-12 pt-8 border-t border-[#1a1a1a]"
            >
              <ConnectWalletWrapper />
            </motion.div>

            {/* Decorative Thread */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute left-12 top-0 w-px bg-gradient-to-b from-transparent via-[#8a1c1c]/30 to-transparent hidden md:block"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
