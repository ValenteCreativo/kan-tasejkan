'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import BackButton from '../../components/ui/BackButton';
import { getSiteSettings } from '@/actions';

const DEFAULTS = {
  whatsapp_number: '+529241078457',
  whatsapp_message: 'Hola, me interesa conocer más sobre Kan-Tasejkan. ¿Podrían orientarme?',
  contact_email: 'contacto@kan-tasejkan.com',
  horario: 'Lun – Dom, 8:00 – 20:00 (WhatsApp)',
  direccion: 'Centro Ecoturístico Kan-Tasejkan\nTonalapan, Mecayapan, Sierra Sur de Veracruz',
  google_maps_url: 'https://maps.app.goo.gl/B1ts4V4fcXwNtTnh7',
};

export default function ContactoPage() {
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
    <>
      <HeroSection
        title="Contacto"
        subtitle="Estamos aquí para ayudarte a planear tu visita a Kan-Tasejkan"
      />
      <BackButton />

      {/* Content */}
      <section className="content-container py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-[300] text-[#1B4332] mb-6">Información de Contacto</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-sm font-[500] text-[#1A1A1A]">Ubicación</p>
                    <p className="text-sm text-[#4A4A4A] whitespace-pre-line">{s.direccion || DEFAULTS.direccion}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-sm font-[500] text-[#1A1A1A]">Teléfono / WhatsApp</p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A4A4A] hover:text-[#1B4332] transition-colors">
                      {s.whatsapp_number || DEFAULTS.whatsapp_number}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-sm font-[500] text-[#1A1A1A]">WhatsApp</p>
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A4A4A] hover:text-[#1B4332] transition-colors">Enviar mensaje</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-sm font-[500] text-[#1A1A1A]">Email</p>
                    <a href={`mailto:${s.contact_email || DEFAULTS.contact_email}`} className="text-sm text-[#4A4A4A] hover:text-[#1B4332] transition-colors">
                      {s.contact_email || DEFAULTS.contact_email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#D4A853]" />
                  </div>
                  <div>
                    <p className="text-sm font-[500] text-[#1A1A1A]">Horario de Atención</p>
                    <p className="text-sm text-[#4A4A4A]">{s.horario || DEFAULTS.horario}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="w-full h-56 rounded-xl overflow-hidden border border-[#E0DDD5]">
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
              className="text-xs text-[#2D6A4F] hover:text-[#1B4332] transition-colors inline-flex items-center gap-1"
            >
              Ver en Google Maps →
            </a>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-[300] text-[#1B4332] mb-6">Envíanos un Mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A4A4A] font-[500] mb-1.5 block">Nombre</label>
                <input type="text" className="admin-input" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A4A4A] font-[500] mb-1.5 block">Email</label>
                <input type="email" className="admin-input" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A4A4A] font-[500] mb-1.5 block">Teléfono</label>
                <input type="tel" className="admin-input" placeholder="+52 000 000 0000" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A4A4A] font-[500] mb-1.5 block">¿Qué te interesa?</label>
                <select className="admin-input">
                  <option value="">Selecciona una opción</option>
                  <option value="hospedaje">Hospedaje en cabañas</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="aventura">Deportes de aventura</option>
                  <option value="balneario">Balneario</option>
                  <option value="camping">Camping</option>
                  <option value="talleres">Talleres</option>
                  <option value="experiencias">Experiencias comunitarias</option>
                  <option value="bodas">Bodas tradicionales</option>
                  <option value="grupos">Grupos y eventos</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-[#4A4A4A] font-[500] mb-1.5 block">Mensaje</label>
                <textarea className="admin-input min-h-[120px] resize-y" placeholder="Cuéntanos sobre tu visita: fechas, número de personas, servicios de interés..." />
              </div>
              <button type="submit" className="btn-kan-filled w-full mt-2">
                Enviar Mensaje
              </button>
              <p className="text-[11px] text-[#8B8B8B] text-center mt-2">
                O escríbenos directo por WhatsApp para respuesta inmediata
              </p>
            </form>
          </div>
        </div>
      </section>

      <div className="pb-16 md:pb-24" />
      <Footer />
    </>
  );
}
