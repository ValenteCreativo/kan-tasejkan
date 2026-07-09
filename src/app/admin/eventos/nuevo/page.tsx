'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createEvent, uploadFile } from '@/actions';

const CATEGORIES = ['Psicoterapia', 'Mindfulness', 'Access Bars', 'Ceremonias', 'Círculos', 'Diplomado', 'Talleres', 'Retiros'];
const MODALITIES = ['presencial', 'virtual', 'híbrido'];

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function NuevoEventoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [serviceId, setServiceId] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [modality, setModality] = useState(MODALITIES[0]);
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !startDate) {
      alert('Completa al menos el título, categoría y fecha de inicio.');
      return;
    }

    setSubmitting(true);
    try {
      let coverImageUrl = '';

      if (coverImage) {
        const ext = coverImage.name.split('.').pop();
        const pathname = `events/${slug}-${Date.now()}.${ext}`;
        const { url, error: uploadError } = await uploadFile(coverImage, pathname);
        if (uploadError) throw new Error('Error subiendo imagen');
        coverImageUrl = url || '';
      }

      const { error } = await createEvent({
        title,
        slug,
        category,
        serviceId: serviceId || null,
        description: description || null,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        location: location || null,
        modality: modality || null,
        capacity: capacity ? parseInt(capacity) : null,
        price: price || null,
        coverImageUrl: coverImageUrl || null,
        gallery: null,
        isPublished,
      });

      if (error) throw new Error(String(error));

      router.push('/admin/eventos');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creando evento: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto p-8">
        <Link href="/admin/eventos" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver a eventos
        </Link>

        <h1 className="text-2xl font-[300] text-[#24202F] tracking-wide mb-8">Nuevo Evento</h1>

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

          {/* Service ID (optional) */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">ID de servicio asociado (opcional)</label>
            <input
              type="text"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              placeholder="UUID del servicio (dejar vacío si no aplica)"
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors resize-y"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Fecha inicio *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Fecha fin</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Location & Modality */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
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

          {/* Capacity & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Capacidad</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Precio</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="500.00"
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

          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-[#4B3A78]"
            />
            <span className="text-sm text-[#6B6580] font-[300]">Publicar</span>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/eventos')}
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
              {submitting ? 'Guardando...' : 'Crear evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
