'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getSiteSettings } from '../../actions';

const SERVICE_TYPES = [
  'Sesión individual',
  'Ceremonia de Cacao',
  'Círculo de Luna Llena',
  'Sound Healing',
  'Mindfulness',
  'Access Bars',
  'Retiro',
  'Taller',
  'Diplomado',
  'Consulta / Otro',
];

export default function ReservarPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('#');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState(SERVICE_TYPES[0]);
  const [message, setMessage] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [attendees, setAttendees] = useState('1');

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      const number = data?.['whatsapp_number'] || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+525555555555';
      setWhatsappUrl(`https://wa.me/${number.replace(/[^0-9]/g, '')}`);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          type: 'individual',
          message: `Servicio: ${type}\n\n${message}`,
          preferredDate: preferredDate || undefined,
          preferredTime: preferredTime || undefined,
          attendeesCount: parseInt(attendees) || 1,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar');
      setSubmitted(true);
    } catch {
      alert('Hubo un error al enviar tu reserva. Intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--white-warm)' }}>
        <motion.div
          className="text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-[#49B6D6]/10 mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-[200] tracking-[0.2em] uppercase text-[#24202F] mb-3">
            ¡Reserva enviada!
          </h1>
          <p className="text-sm font-[300] text-[#6B6580] leading-relaxed mb-6">
            Recibimos tu solicitud. Te contactaremos en las próximas 24-48 horas para confirmar disponibilidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-mindful text-xs">
              Volver al inicio
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-mindful-filled text-xs">
              Escribir por WhatsApp
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 px-6" style={{ background: 'var(--white-warm)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-[300] tracking-[0.3em] uppercase text-[#49B6D6] mb-3">
            Agenda tu sesión
          </p>
          <h1 className="text-3xl md:text-4xl font-[200] tracking-[0.2em] uppercase text-[#24202F] mb-3">
            Reservar
          </h1>
          <p className="text-sm font-[300] text-[#6B6580] max-w-md mx-auto">
            Completa el formulario y nos pondremos en contacto contigo para confirmar tu reserva.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-[400] transition-all ${
                step >= s ? 'bg-[#4B3A78] text-white' : 'bg-[#F0EEF5] text-[#6B6580]'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`w-8 h-px transition-colors ${step > s ? 'bg-[#4B3A78]' : 'bg-[#E8E5F0]'}`} />}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10">
          {/* Step 1: Contact info */}
          {step === 1 && (
            <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-sm font-[400] tracking-wider uppercase text-[#3D3066] mb-4">Datos de contacto</h2>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ritual-input"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ritual-input"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="ritual-input"
                  placeholder="+52 55 1234 5678"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!name || !email}
                  className="w-full btn-mindful-filled disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Service selection */}
          {step === 2 && (
            <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-sm font-[400] tracking-wider uppercase text-[#3D3066] mb-4">Servicio y fecha</h2>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">¿Qué servicio te interesa? *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="ritual-input"
                >
                  {SERVICE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Fecha preferida</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="ritual-input"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Hora preferida</label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="ritual-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">Número de personas</label>
                <input
                  type="number"
                  min="1"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="ritual-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 btn-mindful">
                  ← Atrás
                </button>
                <button type="button" onClick={() => setStep(3)} className="flex-1 btn-mindful-filled">
                  Continuar →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Message + Submit */}
          {step === 3 && (
            <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-sm font-[400] tracking-wider uppercase text-[#3D3066] mb-4">Mensaje adicional</h2>

              <div>
                <label className="block text-[11px] font-[400] uppercase tracking-wider text-[#6B6580] mb-2">¿Algo que quieras comentarnos?</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="ritual-input resize-y"
                  placeholder="Cuéntanos más sobre lo que buscas, preguntas que tengas, o cualquier detalle relevante..."
                />
              </div>

              {/* Summary */}
              <div className="bg-[#F8F7FC] rounded-xl p-5 space-y-2">
                <p className="text-[10px] font-[500] uppercase tracking-wider text-[#6B6580] mb-3">Resumen</p>
                <div className="text-sm font-[300] text-[#24202F] space-y-1">
                  <p><span className="text-[#6B6580]">Nombre:</span> {name}</p>
                  <p><span className="text-[#6B6580]">Email:</span> {email}</p>
                  {phone && <p><span className="text-[#6B6580]">Teléfono:</span> {phone}</p>}
                  <p><span className="text-[#6B6580]">Servicio:</span> {type}</p>
                  {preferredDate && <p><span className="text-[#6B6580]">Fecha:</span> {preferredDate}</p>}
                  {preferredTime && <p><span className="text-[#6B6580]">Hora:</span> {preferredTime}</p>}
                  <p><span className="text-[#6B6580]">Personas:</span> {attendees}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 btn-mindful" disabled={submitting}>
                  ← Atrás
                </button>
                <button type="submit" className="flex-1 btn-mindful-filled disabled:opacity-50" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Enviar reserva'}
                </button>
              </div>
            </motion.div>
          )}
        </form>

        {/* Alternative */}
        <p className="text-center text-xs font-[300] text-[#B9B8CA] mt-8">
          ¿Prefieres escribirnos directamente?{' '}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-[#49B6D6] hover:underline">
            WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
