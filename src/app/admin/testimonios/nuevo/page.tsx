'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createTestimonial, uploadFile } from '@/actions';

export default function NuevoTestimonioPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [rating, setRating] = useState('5');
  const [isPublished, setIsPublished] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !text) {
      alert('Completa al menos el nombre y el texto.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';

      if (image) {
        const ext = image.name.split('.').pop();
        const pathname = `testimonials/${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;
        const { url, error: uploadError } = await uploadFile(image, pathname);
        if (uploadError) throw new Error('Error subiendo imagen');
        imageUrl = url || '';
      }

      const { error } = await createTestimonial({
        name,
        text,
        serviceId: serviceId || null,
        imageUrl: imageUrl || null,
        rating: parseInt(rating) || null,
        isPublished,
        orderIndex: 0,
      });

      if (error) throw new Error(String(error));

      router.push('/admin/testimonios');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creando testimonio: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto p-8">
        <Link href="/admin/testimonios" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver a testimonios
        </Link>

        <h1 className="text-2xl font-[300] text-[#24202F] tracking-wide mb-8">Nuevo Testimonio</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#F0EEF5] p-8 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Text */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Testimonio *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors resize-y"
              required
            />
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

          {/* Image */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Foto (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Calificación</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
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
              onClick={() => router.push('/admin/testimonios')}
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
              {submitting ? 'Guardando...' : 'Crear testimonio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
