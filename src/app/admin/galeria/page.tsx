'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Image as ImageIcon, Video, Loader2, Camera, Home, UtensilsCrossed, Mountain, Waves, Tent, Flame, Heart, Award, Users, TreePine } from 'lucide-react';
import { getAllMedia, createMedia, deleteMedia, uploadFile } from '@/actions';
import { useDropzone } from 'react-dropzone';

type MediaItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  section: string;
  isPublished: boolean | null;
};

const SECTIONS = [
  { value: 'hospedaje', label: 'Hospedaje', icon: Home },
  { value: 'restaurant', label: 'Restaurante', icon: UtensilsCrossed },
  { value: 'aventura', label: 'Aventura', icon: Mountain },
  { value: 'balneario', label: 'Balneario', icon: Waves },
  { value: 'camping', label: 'Camping', icon: Tent },
  { value: 'talleres', label: 'Talleres', icon: Users },
  { value: 'experiencia-gastronomica', label: 'Gastronómica', icon: Flame },
  { value: 'rituales', label: 'Rituales', icon: Heart },
  { value: 'bodas', label: 'Bodas', icon: Heart },
  { value: 'comunidad', label: 'Comunidad', icon: Users },
  { value: 'premios', label: 'Premios', icon: Award },
  { value: 'paisajes', label: 'Paisajes', icon: TreePine },
];

function GaleriaContent() {
  const searchParams = useSearchParams();
  const paramSection = searchParams.get('seccion') || '';

  const [activeSection, setActiveSection] = useState(paramSection);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  const loadMedia = useCallback(async () => {
    if (!activeSection) return;
    setLoading(true);
    const { data } = await getAllMedia(activeSection);
    setItems((data as MediaItem[]) || []);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!activeSection) {
      alert('Selecciona primero una sección');
      return;
    }
    setUploading(true);
    setUploadTotal(acceptedFiles.length);
    setUploadCount(0);

    for (const file of acceptedFiles) {
      try {
        const isVideo = file.type.startsWith('video/');
        const ext = file.name.split('.').pop();
        const pathname = `media/${activeSection}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('pathname', pathname);

        const { url, error: uploadError } = await uploadFile(formData);
        if (uploadError || !url) {
          alert(`Error subiendo ${file.name}: ${uploadError || 'sin URL'}`);
          continue;
        }

        await createMedia({
          title: file.name.replace(/\.[^.]+$/, ''),
          url,
          type: isVideo ? 'video' : 'image',
          section: activeSection,
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
  }, [activeSection, loadMedia]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    noClick: false,
    noKeyboard: true,
  });

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return;
    await deleteMedia(id);
    loadMedia();
  }

  // Si no hay sección seleccionada, mostrar selector
  if (!activeSection) {
    return (
      <div className="max-w-lg mx-auto px-5 md:px-8 mt-6">
        <p className="text-base font-[500] text-[#1A1A1A] mb-4 text-center">
          ¿A qué sección quieres subir fotos?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                onClick={() => setActiveSection(s.value)}
                className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors"
              >
                <Icon size={20} className="text-[#1B4332]" />
                <span className="text-xs font-[500] text-[#1A1A1A]">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const sectionLabel = SECTIONS.find(s => s.value === activeSection)?.label || activeSection;

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8">
      {/* Sección activa */}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-base font-[500] text-[#1A1A1A]">
          📁 {sectionLabel}
        </p>
        <button
          onClick={() => setActiveSection('')}
          className="text-xs text-[#1B4332] font-[500] px-3 py-1.5 rounded-full bg-[#1B4332]/5 active:bg-[#1B4332]/10"
        >
          Cambiar sección
        </button>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-6 ${
          isDragActive ? 'border-[#52B788] bg-[#52B788]/5' : 'border-[#E0DDD5] bg-white active:bg-[#F5F0E8]'
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
          </div>
        )}
      </div>

      {/* Fotos de esta sección */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#1B4332]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E0DDD5]">
          <ImageIcon size={36} className="mx-auto mb-3 text-[#8B8B8B]" />
          <p className="text-sm text-[#4A4A4A]">No hay fotos en {sectionLabel}</p>
          <p className="text-xs text-[#8B8B8B] mt-1">Usa el botón de arriba para subir</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-[#8B8B8B] mb-3">{items.length} foto{items.length !== 1 ? 's' : ''} en {sectionLabel}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item) => (
              <div key={item.id} className="relative bg-white rounded-xl border border-[#E0DDD5] overflow-hidden">
                <div className="aspect-square relative bg-[#F5F0E8]">
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={item.title || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <Video size={28} className="text-[#1B4332]" />
                    </div>
                  )}
                </div>
                <div className="p-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center active:bg-red-100"
                    title="Eliminar"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function GaleriaAdminPage() {
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
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#1B4332]" /></div>}>
        <GaleriaContent />
      </Suspense>
    </div>
  );
}
