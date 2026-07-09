'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createProduct, uploadFile } from '@/actions';

const CATEGORIES = ['Velas', 'Yoga', 'Cojines', 'Cuidado personal', 'Objetos conscientes', 'Otros'];

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function NuevoProductoPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [stock, setStock] = useState('0');
  const [isPublished, setIsPublished] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !category || !price) {
      alert('Completa al menos el título, categoría y precio.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';

      if (image) {
        const ext = image.name.split('.').pop();
        const pathname = `products/${slug}-${Date.now()}.${ext}`;
        const { url, error: uploadError } = await uploadFile(image, pathname);
        if (uploadError) throw new Error('Error subiendo imagen');
        imageUrl = url || '';
      }

      const { error } = await createProduct({
        title,
        slug,
        description: description || null,
        category,
        price,
        compareAtPrice: compareAtPrice || null,
        imageUrl: imageUrl || null,
        gallery: null,
        stock: parseInt(stock) || 0,
        isPublished,
        orderIndex: 0,
      });

      if (error) throw new Error(String(error));

      router.push('/admin/productos');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creando producto: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto p-8">
        <Link href="/admin/productos" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver a productos
        </Link>

        <h1 className="text-2xl font-[300] text-[#24202F] tracking-wide mb-8">Nuevo Producto</h1>

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

          {/* Price & Compare at Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Precio *</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350.00"
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Precio anterior</label>
              <input
                type="text"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="450.00"
                className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
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
              onClick={() => router.push('/admin/productos')}
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
              {submitting ? 'Guardando...' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
