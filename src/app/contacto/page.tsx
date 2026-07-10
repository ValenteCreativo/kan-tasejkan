import { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import ContactOptions from '../../components/ContactOptions';

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

        {/* Contact options (WhatsApp + Email) */}
        <ContactOptions />

        {/* Contact form */}
        <ContactForm />
      </div>
    </main>
  );
}
