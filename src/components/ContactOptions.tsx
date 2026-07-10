'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings } from '../actions';

export default function ContactOptions() {
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('contacto@mindfulverso.com');

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      if (data) {
        const number = data['whatsapp_number'] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+525555555555';
        setWhatsappUrl(`https://wa.me/${number.replace(/[^0-9]/g, '')}`);
        if (data['contact_email']) setContactEmail(data['contact_email']);
      } else {
        const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+525555555555';
        setWhatsappUrl(`https://wa.me/${number.replace(/[^0-9]/g, '')}`);
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="glass-card p-8 text-center group"
      >
        <div className="w-12 h-12 rounded-full bg-green-50 mx-auto mb-4 flex items-center justify-center group-hover:bg-green-100 transition-colors">
          <span className="text-xl">💬</span>
        </div>
        <h3 className="text-base font-light tracking-wider uppercase text-[var(--text-dark)] mb-2">
          WhatsApp
        </h3>
        <p className="text-sm font-light text-[var(--muted)]">
          Respuesta rápida y directa
        </p>
      </a>

      <a
        href={`mailto:${contactEmail}`}
        className="glass-card p-8 text-center group"
      >
        <div className="w-12 h-12 rounded-full bg-[var(--accent)]/5 mx-auto mb-4 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
          <span className="text-xl">✉️</span>
        </div>
        <h3 className="text-base font-light tracking-wider uppercase text-[var(--text-dark)] mb-2">
          Email
        </h3>
        <p className="text-sm font-light text-[var(--muted)]">
          {contactEmail}
        </p>
      </a>
    </div>
  );
}
