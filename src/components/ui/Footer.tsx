'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import Link from 'next/link';
import { getSiteSettings } from '@/actions';

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.37 6.37 0 00-.82-.05A6.34 6.34 0 003.15 15.7a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.42a8.16 8.16 0 004.76 1.52V7.5a4.85 4.85 0 01-1-.81z"/>
    </svg>
  );
}

// Defaults (fallbacks if DB has no value yet)
const DEFAULTS = {
  site_name: 'Kan-Tasejkan',
  site_tagline: 'Lugar de Sombras · Ecoturismo Indígena',
  whatsapp_number: '+529241078457',
  whatsapp_message: 'Hola, me interesa conocer más sobre Kan-Tasejkan. ¿Podrían orientarme?',
  contact_email: 'contacto@kan-tasejkan.com',
  horario: 'Lun – Dom, 8:00 – 20:00 (WhatsApp)',
  facebook_url: 'https://facebook.com/kantasejkan',
  instagram_url: 'https://instagram.com/kantasejkan',
  tiktok_url: 'https://vt.tiktok.com/ZSXNr1XAr/',
  google_maps_url: 'https://maps.app.goo.gl/B1ts4V4fcXwNtTnh7',
  direccion: 'Centro Ecoturístico Kan-Tasejkan\nTonalapan, Mecayapan, Sierra Sur de Veracruz',
};

export default function Footer() {
  const [s, setS] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      if (data) setS(prev => ({ ...prev, ...data }));
    }).catch(() => {});
  }, []);

  const whatsappNum = (s.whatsapp_number || DEFAULTS.whatsapp_number).replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(s.whatsapp_message || DEFAULTS.whatsapp_message);
  const whatsappHref = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  return (
    <footer className="bg-[#1B4332]">
      <div className="content-container py-10 md:py-12">
        {/* Top: Logo + tagline */}
        <div className="text-center mb-8">
          <h2 className="text-base font-[400] tracking-[0.3em] uppercase text-white">
            {s.site_name || DEFAULTS.site_name}
          </h2>
          <p className="text-xs text-white/70 mt-1">
            {s.site_tagline || DEFAULTS.site_tagline}
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

          {/* Col 1: Ubicación + Mapa */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#D4A853] mb-4">
              Ubicación
            </h3>
            <div className="flex items-start gap-3 text-white text-sm leading-relaxed mb-4">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[#D4A853]" />
              <p className="whitespace-pre-line">{s.direccion || DEFAULTS.direccion}</p>
            </div>
            <div className="w-full h-28 rounded-lg overflow-hidden border border-white/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3800!2d-94.7981762!3d18.1466413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85e9f23c3f135f27%3A0x7d04ec0e92691050!2sCentro%20Ecotur%C3%ADstico%20Kan%20Tasejkan!5e0!3m2!1ses!2smx!4v1720000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Kan-Tasejkan"
              />
            </div>
            <a
              href={s.google_maps_url || DEFAULTS.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#D4A853] hover:text-white transition-colors mt-2 inline-block"
            >
              Ver en Google Maps →
            </a>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#D4A853] mb-4">
              Contacto
            </h3>
            <div className="space-y-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white text-sm hover:text-[#D4A853] transition-colors">
                <Phone size={15} className="text-[#D4A853] shrink-0" />
                Reservar / Contactar
              </a>
              <a href={`mailto:${s.contact_email || DEFAULTS.contact_email}`} className="flex items-center gap-3 text-white text-sm hover:text-[#D4A853] transition-colors">
                <Mail size={15} className="text-[#D4A853] shrink-0" />
                {s.contact_email || DEFAULTS.contact_email}
              </a>
              <div className="flex items-center gap-3 text-white text-sm">
                <Clock size={15} className="text-[#D4A853] shrink-0" />
                {s.horario || DEFAULTS.horario}
              </div>
            </div>
          </div>

          {/* Col 3: Redes Sociales */}
          <div>
            <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#D4A853] mb-4">
              Redes Sociales
            </h3>
            <div className="flex gap-3">
              {(s.facebook_url || DEFAULTS.facebook_url) && (
                <a
                  href={s.facebook_url || DEFAULTS.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} className="text-white" />
                </a>
              )}
              {(s.instagram_url || DEFAULTS.instagram_url) && (
                <a
                  href={s.instagram_url || DEFAULTS.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} className="text-white" />
                </a>
              )}
              {(s.tiktok_url || DEFAULTS.tiktok_url) && (
                <a
                  href={s.tiktok_url || DEFAULTS.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              )}
            </div>
          </div>

          {/* Col 4: Explorar */}
          <div>
            <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#D4A853] mb-4">
              Explorar
            </h3>
            <div className="flex flex-col gap-2">
              <Link href="/quienes-somos" className="text-white text-sm hover:text-[#D4A853] transition-colors">Quiénes Somos</Link>
              <Link href="/servicios" className="text-white text-sm hover:text-[#D4A853] transition-colors">Servicios</Link>
              <Link href="/experiencias" className="text-white text-sm hover:text-[#D4A853] transition-colors">Experiencias</Link>
              <Link href="/talleres" className="text-white text-sm hover:text-[#D4A853] transition-colors">Talleres</Link>
              <Link href="/precios" className="text-white text-sm hover:text-[#D4A853] transition-colors">Precios</Link>
              <Link href="/contacto" className="text-white text-sm hover:text-[#D4A853] transition-colors">Contacto</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-white/15 text-center">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} {s.site_name || DEFAULTS.site_name} · {s.site_tagline || DEFAULTS.site_tagline}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
