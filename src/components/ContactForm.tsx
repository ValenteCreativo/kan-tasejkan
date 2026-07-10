'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Error al enviar el mensaje');
        setStatus('error');
        return;
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Open WhatsApp with the message in a new tab
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }
    } catch {
      setErrorMsg('Error de conexión. Intenta de nuevo.');
      setStatus('error');
    }
  }

  return (
    <div className="glass-card p-8 md:p-12">
      <h2 className="text-lg font-extralight tracking-wider uppercase text-[var(--text-dark)] mb-6 text-center">
        Envíanos un mensaje
      </h2>

      {status === 'success' && (
        <div className="text-sm text-green-700 text-center mb-6 p-3 rounded bg-green-50">
          ¡Mensaje enviado! Te redirigimos a WhatsApp para completar la comunicación.
        </div>
      )}

      {status === 'error' && (
        <div className="text-sm text-red-600 text-center mb-6 p-3 rounded bg-red-50">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
              Nombre
            </label>
            <input
              id="contact-name"
              type="text"
              className="ritual-input"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              className="ritual-input"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
            Asunto
          </label>
          <input
            id="contact-subject"
            type="text"
            className="ritual-input"
            placeholder="¿En qué podemos ayudarte?"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            className="ritual-input min-h-[120px] resize-y"
            placeholder="Cuéntanos más..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            required
          />
        </div>
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-mindful-filled"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </div>
      </form>
    </div>
  );
}
