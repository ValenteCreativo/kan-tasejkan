'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { artworkService } from '../../lib/services';
import { Upload, Instagram, Mail, Calendar, Ruler } from 'lucide-react';

type SessionType = 'tattoo' | 'consultation';
type SizeApprox = 'small' | 'medium' | 'large' | 'extra-large';

interface FormData {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  sessionType: SessionType;
  description: string;
  placement: string;
  sizeApprox: SizeApprox | '';
  additionalNotes: string;
  preferredDate: string;
  preferredTime: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  phone: '',
  instagram: '',
  sessionType: 'tattoo',
  description: '',
  placement: '',
  sizeApprox: '',
  additionalNotes: '',
  preferredDate: '',
  preferredTime: '',
};

export default function ReservationsPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const set = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setReferencePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) {
      setError('Name, email, and description are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let referenceImageUrl = '';

      // Upload reference image if provided
      if (referenceImage) {
        const ext = referenceImage.name.split('.').pop();
        const fileName = `ref-${Date.now()}.${ext}`;
        const { data, error: uploadError } = await artworkService.uploadImage(referenceImage, fileName);
        if (uploadError) throw uploadError;
        referenceImageUrl = data?.publicUrl || '';
      }

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, referenceImageUrl }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to submit');

      router.push('/reservations/confirmation');
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[#050505] text-[#e5e5e5]">
      <div className="content-container max-w-2xl">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent mx-auto mb-8 opacity-50" />
            <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] uppercase text-white mb-4">
              Reservations
            </h1>
            <p className="text-[#8b7d7b] text-sm tracking-widest uppercase">Tattoo · Consultation</p>
            <div className="w-px h-12 bg-gradient-to-b from-[#8a1c1c] to-transparent mx-auto mt-8 opacity-50" />
          </div>

          {/* Intro text */}
          <p className="text-[#8b7d7b] font-light leading-relaxed text-center mb-12 text-sm">
            Fill out the form below and Martina will get back to you within 2–3 business days to confirm availability and discuss your vision.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <StepDot active={step === 1} label="Contact" />
              <div className="w-16 h-px bg-[#1a1a1a]" />
              <StepDot active={step === 2} label="Session" />
            </div>

            {/* Step 1: Contact Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <Field label="Full Name *" id="name">
                  <input
                    id="name" type="text" required value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="ritual-input"
                    placeholder="Your name"
                  />
                </Field>

                <Field label="Email *" id="email">
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#404040]" />
                    <input
                      id="email" type="email" required value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className="ritual-input pl-10"
                      placeholder="your@email.com"
                    />
                  </div>
                </Field>

                <Field label="Phone" id="phone">
                  <input
                    id="phone" type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="ritual-input"
                    placeholder="+54 ..."
                  />
                </Field>

                <Field label="Instagram" id="instagram">
                  <div className="relative">
                    <Instagram size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#404040]" />
                    <input
                      id="instagram" type="text" value={form.instagram}
                      onChange={(e) => set('instagram', e.target.value)}
                      className="ritual-input pl-10"
                      placeholder="@yourhandle"
                    />
                  </div>
                </Field>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!form.name || !form.email}
                    className="w-full btn-ritual py-4 uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Session Details */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">

                {/* Session Type */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#404040] mb-3">Session Type *</label>
                  <div className="flex gap-3">
                    {(['tattoo', 'consultation'] as SessionType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set('sessionType', type)}
                        className={`flex-1 py-3 border text-sm tracking-widest uppercase transition-all duration-300 ${
                          form.sessionType === type
                            ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
                            : 'border-[#1a1a1a] text-[#606060] hover:border-[#2a2a2a]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Describe your idea *" id="description">
                  <textarea
                    id="description" required value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                    rows={4}
                    className="ritual-input resize-none"
                    placeholder="Tell Martina about your vision, references, symbols, feelings..."
                  />
                </Field>

                {form.sessionType === 'tattoo' && (
                  <>
                    <Field label="Body Placement" id="placement">
                      <input
                        id="placement" type="text" value={form.placement}
                        onChange={(e) => set('placement', e.target.value)}
                        className="ritual-input"
                        placeholder="e.g. forearm, ribcage, spine..."
                      />
                    </Field>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-[#404040] mb-3">
                        <Ruler size={12} className="inline mr-1" />
                        Approximate Size
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['small', 'medium', 'large', 'extra-large'] as SizeApprox[]).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => set('sizeApprox', size)}
                            className={`py-2 border text-[10px] tracking-widest uppercase transition-all duration-300 ${
                              form.sizeApprox === size
                                ? 'border-[#8a1c1c] bg-[#8a1c1c]/10 text-[#e5e5e5]'
                                : 'border-[#1a1a1a] text-[#606060] hover:border-[#2a2a2a]'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Reference Image */}
                <div>
                  <label className="block text-[9px] uppercase tracking-widest text-[#404040] mb-3">Reference Image (optional)</label>
                  <div className="border border-[#1a1a1a] p-4">
                    {referencePreview ? (
                      <div className="text-center space-y-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={referencePreview} alt="Reference" className="max-h-48 mx-auto rounded" />
                        <button
                          type="button"
                          onClick={() => { setReferenceImage(null); setReferencePreview(''); }}
                          className="text-xs text-[#8b7d7b] hover:text-white transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-3 py-6 text-[#404040] hover:text-[#8b7d7b] transition-colors">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        <Upload size={24} />
                        <span className="text-xs tracking-widest uppercase">Upload reference</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Preferred date */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Preferred Date" id="preferredDate">
                    <div className="relative">
                      <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#404040]" />
                      <input
                        id="preferredDate" type="date" value={form.preferredDate}
                        onChange={(e) => set('preferredDate', e.target.value)}
                        className="ritual-input pl-10"
                      />
                    </div>
                  </Field>
                  <Field label="Preferred Time" id="preferredTime">
                    <input
                      id="preferredTime" type="time" value={form.preferredTime}
                      onChange={(e) => set('preferredTime', e.target.value)}
                      className="ritual-input"
                    />
                  </Field>
                </div>

                <Field label="Additional Notes" id="additionalNotes">
                  <textarea
                    id="additionalNotes" value={form.additionalNotes}
                    onChange={(e) => set('additionalNotes', e.target.value)}
                    rows={2}
                    className="ritual-input resize-none"
                    placeholder="Anything else you'd like to share..."
                  />
                </Field>

                {error && (
                  <p className="text-sm text-red-400 text-center">{error}</p>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border border-[#1a1a1a] text-[#8b7d7b] hover:border-[#2a2a2a] transition-colors text-xs uppercase tracking-widest"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !form.description}
                    className="flex-1 btn-ritual py-4 uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </motion.div>
            )}

          </form>
        </motion.div>
      </div>
    </main>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[9px] uppercase tracking-widest text-[#404040] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function StepDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-2 h-2 rounded-full transition-colors ${active ? 'bg-[#8a1c1c]' : 'bg-[#1a1a1a]'}`} />
      <span className={`text-[9px] uppercase tracking-widest ${active ? 'text-[#8a1c1c]' : 'text-[#404040]'}`}>{label}</span>
    </div>
  );
}
