'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Image as ImageIcon, Video, Loader2, Eye, EyeOff, Camera } from 'lucide-react';
import { getAllMedia, createMedia, deleteMedia, updateMedia, uploadFile } from '@/actions';
import { useDropzone } from 'react-dropzone';

type MediaItem = {
  id: string;
  title: string | null;
  url: string;
  thumbnailUrl: string | null;
  type: string;
  section: string;
  description: string | null;
  orderIndex: number | null;
  isPublished: boolean | null;
  createdAt: string | null;
};

const SECTIONS = [
  { value: 'general', label: 'General' },
  { value: 'hospedaje', label: 'Hospedaje' },
  { value: 'restaurant', label: 'Restaurante' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'balneario', label: 'Balneario' },
  { value: 'camping', label: 'Camping' },
  { value: 'talleres', label: 'Talleres' },
  { value: 'experiencia-gastronomica', label: 'Gastronómica' },
  { value: 'rituales', label: 'Rituales' },
  { value: 'bodas', label: 'Bodas' },
  { value: 'comunidad', label: 'Comunidad' },
  { value: 'premios', label: 'Premios' },
  { value: 'paisajes', label: 'Paisajes' },
];

export default function GaleriaAdminPage() {
  const searchParams = useSearchParams();
  const preselectedSection = searchParams.get('seccion') || '';

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [filterSection, setFilterSection] = useState(preselectedSection);
  const [uploadSection, setUploadSection] = useState(preselectedSection || 'general');

  const loadMedia = useCallback(async () => {
    setLoading(true);
    const { data } = await getAllMedia(filterSection || undefined);
    setItems((data as MediaItem[]) || []);
    setLoading(false);
  }, [filterSection]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadTotal(acceptedFiles.length);
    setUploadCount(0);

    for (const file of acceptedFiles) {
      try {
        const isVideo = file.type.startsWith('video/');
        const ext = file.name.split('.').pop();
        const pathname = `media/${uploadSection}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const { url, error: uploadError } = await uploadFile(file, pathname);
        if (uploadError || !url) {
          alert(`Error subiendo ${file.name}`);
          continue;
        }

        await createMedia({
          title: file.name.replace(/\.[^.]+$/, ''),
          url,
          type: isVideo ? 'video' : 'image',
          section: uploadSection,
          isPublished: true,
        });
        setUploadCount((c) => c + 1);
      } catch (err) {
        console.error('Upload error:', err);
        alert(`Error con ${file.name}`);
      }
    }
    setUploading(false);
    loadMedia();
  }, [uploadSection, loadMedia]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    multiple: true,
    noClick: false,
  });

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este archivo?')) return;
    await deleteMedia(id);
    loadMedia();
  }

  async function togglePublish(id: string, current: boolean | null) {
    await updateMedia(id, { isPublished: !current });
    loadMedia();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-5 py-5 md:px-8 md:py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
          <h1 className="text-lg md:text-xl font-[500]">Galería de Fotos y Videos</h1>
          <p className="text-sm text-white/70 mt-0.5">Sube las fotos desde tu teléfono</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Selección de sección */}
        <div className="mt-6 mb-4">
          <label className="text-xs font-[600] tracking-[0.1em] uppercase text-[#4A4A4A] block mb-2">¿A qué sección pertenecen las fotos?</label>
          <select
            value={uploadSection}
            onChange={(e) => setUploadSection(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-[#E0DDD5] rounded-xl text-base text-[#1A1A1A] focus:border-[#1B4332] focus:outline-none"
          >
            {SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Upload zone - grande y táctil */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-10 text-center cursor-pointer transition-colors mb-6 ${
            isDragActive ? 'border-[#52B788] bg-[#52B788]/5' : 'border-[#E0DDD5] bg-white hover:border-[#52B788] active:bg-[#F5F0E8]'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-[#1B4332]" />
              <p className="text-base text-[#1A1A1A] font-[500]">Subiendo {uploadCount} de {uploadTotal}...</p>
              <p className="text-sm text-[#8B8B8B]">No cierres esta página</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                <Camera size={28} className="text-[#1B4332]" />
              </div>
              <p className="text-base text-[#1A1A1A] font-[500]">
                Toca aquí para seleccionar fotos
              </p>
              <p className="text-sm text-[#8B8B8B]">
                Puedes seleccionar varias a la vez
              </p>
              <p className="text-xs text-[#8B8B8B] mt-1">JPG, PNG, WebP, MP4, MOV</p>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterSection('')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-[500] transition-colors ${
              filterSection === '' ? 'bg-[#1B4332] text-white' : 'bg-[#F5F0E8] text-[#4A4A4A]'
            }`}
          >
            Todas ({items.length})
          </button>
          {SECTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilterSection(s.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-[500] transition-colors ${
                filterSection === s.value ? 'bg-[#1B4332] text-white' : 'bg-[#F5F0E8] text-[#4A4A4A]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Media grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#1B4332]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E0DDD5]">
            <ImageIcon size={40} className="mx-auto mb-3 text-[#8B8B8B]" />
            <p className="text-base text-[#4A4A4A] font-[500]">No hay archivos aquí</p>
            <p className="text-sm text-[#8B8B8B] mt-1">Sube fotos con el botón de arriba</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative group bg-white rounded-xl border border-[#E0DDD5] overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-square relative bg-[#F5F0E8]">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.title || 'Media'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Video size={32} className="text-[#1B4332]" />
                    </div>
                  )}

                  {!item.isPublished && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-[500]">
                      Oculto
                    </div>
                  )}
                </div>

                {/* Actions - siempre visibles en móvil */}
                <div className="flex items-center justify-between p-2.5">
                  <span className="text-[10px] text-[#8B8B8B] uppercase tracking-wider truncate flex-1">
                    {SECTIONS.find(s => s.value === item.section)?.label || item.section}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => togglePublish(item.id, item.isPublished)}
                      className="w-8 h-8 rounded-lg bg-[#F5F0E8] flex items-center justify-center active:bg-[#E0DDD5] transition-colors"
                      title={item.isPublished ? 'Ocultar' : 'Mostrar'}
                    >
                      {item.isPublished ? <Eye size={14} className="text-[#2D6A4F]" /> : <EyeOff size={14} className="text-[#8B8B8B]" />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center active:bg-red-100 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
