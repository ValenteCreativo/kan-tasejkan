'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createService, uploadFile } from '@/actions';

const CATEGORIES = ['Hospedaje', 'Restaurante', 'Aventura', 'Balneario', 'Camping', 'Talleres', 'Experiencias', 'Bodas'];
const MODALITIES = ['presencial', 'todo incluido', 'personalizado'];

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function NuevoServicioPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('');
  const [modality, setModality] = useState(MODALITIES[0]);
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category) {
      alert('Completa al menos el título y la categoría.');
      return;
    }

    setSubmitting(true);
    try {
      let coverImageUrl = '';

      if (coverImage) {
        const ext = coverImage.name.split('.').pop();
        const pathname = `services/${slug}-${Date.now()}.${ext}`;
        const { url, error: uploadError } = await uploadFile(coverImage, pathname);
        if (uploadError) throw new Error('Error subiendo imagen');
        coverImageUrl = url || '';
      }

      const benefitsArray = benefits
        .split(',')
        .map((b) => b.trim())
        .filter(Boolean);

      const { error } = await createService({
        title,
        slug,
        category,
        shortDescription: shortDescription || null,
        description: description || null,
        benefits: benefitsArray.length > 0 ? benefitsArray : null,
        audience: audience || null,
        duration: duration || null,
        modality: modality || null,
        location: location || null,
        price: price || null,
        priceNote: priceNote || null,
        coverImageUrl: coverImageUrl || null,
        gallery: null,
        videoUrl: videoUrl || null,
        bookingEnabled,
        isPublished,
        orderIndex: 0,
      });

      if (error) throw new Error(String(error));

      router.push('/admin/servicios');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creando servicio: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto p-8">
        <Link href="/admin/servicios" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver a servicios
        </Link>

        <h1 className="text-2xl font-[300] text-[#24202F] tracking-wide mb-8">Nuevo Servicio</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#F0EEF5] p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Categoría *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Descripción corta</label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Descripción completa</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors resize-y"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Beneficios (separados por coma)</label>
            <input
              type="text"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Reducción de estrés, Claridad mental, Bienestar emocional"
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">¿A quién va dirigido?</label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Duration & Modality */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Duración</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="60 minutos"
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Modalidad</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              >
                {MODALITIES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Ubicación</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Price & Price Note */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Precio</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500.00"
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Nota de precio</label>
              <input
                type="text"
                value={priceNote}
                onChange={(e) => setPriceNote(e.target.value)}
                placeholder="desde $X / consultar"
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Imagen de portada</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">URL de video (opcional)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bookingEnabled}
                onChange={(e) => setBookingEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#4B3A78]"
              />
              <span className="text-sm text-[#6B6580] font-[300]">Reservas habilitadas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 accent-[#4B3A78]"
              />
              <span className="text-sm text-[#6B6580] font-[300]">Publicar</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/servicios')}
              className="flex-1 px-6 py-3 border border-[#F0EEF5] text-[#6B6580] text-sm font-[300] rounded-lg hover:bg-[#F8F7FC] transition-colors"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#4B3A78] text-white text-sm font-[400] rounded-lg hover:bg-[#3D3066] transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Crear servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
