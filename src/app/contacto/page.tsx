import { Metadata } from 'next';
import { WHATSAPP_URL } from '../../lib/constants';

export const metadata: Metadata = {
  title: 'Contacto — Mindfulverso',
  description: 'Contáctanos para agendar una sesión, resolver dudas o conocer más sobre nuestros servicios.',
};

export default function ContactoPage() {
  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Hablemos
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Contacto
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Estamos aquí para acompañarte. Escríbenos para agendar una sesión o resolver cualquier duda.
          </p>
        </div>

        {/* Contact options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a
            href={WHATSAPP_URL}
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
            href="mailto:contacto@mindfulverso.com"
            className="glass-card p-8 text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/5 mx-auto mb-4 flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
              <span className="text-xl">✉️</span>
            </div>
            <h3 className="text-base font-light tracking-wider uppercase text-[var(--text-dark)] mb-2">
              Email
            </h3>
            <p className="text-sm font-light text-[var(--muted)]">
              contacto@mindfulverso.com
            </p>
          </a>
        </div>

        {/* Contact form */}
        <div className="glass-card p-8 md:p-12">
          <h2 className="text-lg font-extralight tracking-wider uppercase text-[var(--text-dark)] mb-6 text-center">
            Envíanos un mensaje
          </h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                  Nombre
                </label>
                <input type="text" className="ritual-input" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                  Email
                </label>
                <input type="email" className="ritual-input" placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                Asunto
              </label>
              <input type="text" className="ritual-input" placeholder="¿En qué podemos ayudarte?" />
            </div>
            <div>
              <label className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                Mensaje
              </label>
              <textarea
                className="ritual-input min-h-[120px] resize-y"
                placeholder="Cuéntanos más..."
              />
            </div>
            <div className="text-center pt-2">
              <button type="submit" className="btn-mindful-filled">
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
