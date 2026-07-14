'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, Image as ImageIcon, Video, Loader2, Camera, Save, Check } from 'lucide-react';
import { getAllMedia, createMedia, deleteMedia, uploadFile, getSiteSetting, updateSiteSettings, getServiceBySlug, updateService } from '@/actions';
import { useDropzone } from 'react-dropzone';

type MediaItem = {
  id: string;
  title: string | null;
  url: string;
  type: string;
  section: string;
  isPublished: boolean | null;
};

interface SectionEditorProps {
  section: string;
  sectionLabel: string;
  textKey: string;
  textFallback: string;
  serviceSlug?: string; // If this is a service, allows editing price
}

export default function SectionEditor({ section, sectionLabel, textKey, textFallback, serviceSlug }: SectionEditorProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);

  // Text editing
  const [text, setText] = useState(textFallback);
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSetting(textKey).then(({ data }) => {
      if (data) setText(data);
    }).catch(() => {});
    // Load price from service if it's a service slug
    if (serviceSlug) {
      getServiceBySlug(serviceSlug).then(({ data }) => {
        if (data?.price) setPrice(data.price);
        if (data?.description && !textFallback) setText(data.description);
      }).catch(() => {});
    }
  }, [textKey, serviceSlug, textFallback]);

  const loadMedia = useCallback(async () => {
    setLoading(true);
    const { data } = await getAllMedia(section);
    setItems((data as MediaItem[]) || []);
    setLoading(false);
  }, [section]);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  async function handleSaveText() {
    setSaving(true);
    setSaved(false);
    await updateSiteSettings({ [textKey]: text });
    // If it's a service, also update description and price in services table
    if (serviceSlug) {
      const { data } = await getServiceBySlug(serviceSlug);
      if (data) {
        await updateService(data.id, {
          description: text || null,
          price: price || null,
        });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const supported = acceptedFiles.filter(f => {
      const name = f.name.toLowerCase();
      if (name.endsWith('.heic') || name.endsWith('.heif')) {
        alert(`"${f.name}" está en formato HEIC. Envíatela por WhatsApp para convertirla a JPG.`);
        return false;
      }
      return true;
    });
    if (supported.length === 0) return;

    setUploading(true);
    setUploadTotal(supported.length);
    setUploadCount(0);
    let errors = 0;
    let success = 0;

    for (const file of supported) {
      try {
        const isVideo = file.type.startsWith('video/');
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const pathname = `media/${section}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pathname', pathname);

        const { url, error: uploadError } = await uploadFile(formData);
        if (uploadError || !url) { errors++; continue; }

        const { error: dbError } = await createMedia({
          title: file.name.replace(/\.[^.]+$/, ''),
          url,
          type: isVideo ? 'video' : 'image',
          section,
          isPublished: true,
        });
        if (dbError) { errors++; continue; }
        success++;
        setUploadCount((c) => c + 1);
      } catch { errors++; }
    }

    setUploading(false);
    if (errors > 0 && success === 0) {
      alert('No se pudieron subir. Intenta cerrar sesión y volver a entrar.');
    } else if (errors > 0) {
      alert(`${success} subidas, ${errors} fallaron.`);
    }
    loadMedia();
  }, [section, loadMedia]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: () => alert('Máximo 10 archivos a la vez.'),
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    maxFiles: 10,
    noClick: false,
    noKeyboard: true,
  });

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta foto?')) return;
    await deleteMedia(id);
    loadMedia();
  }

  return (
    <div className="space-y-6">
      {/* Text editor */}
      <div className="bg-white rounded-xl border border-[#E0DDD5] p-4">
        <label className="text-xs font-[600] uppercase tracking-wider text-[#4A4A4A] block mb-2">
          Texto de {sectionLabel}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm text-[#1A1A1A] focus:border-[#1B4332] focus:outline-none resize-y"
          placeholder={`Describe ${sectionLabel}...`}
        />
        {serviceSlug && (
          <div className="mt-3">
            <label className="text-xs font-[600] uppercase tracking-wider text-[#4A4A4A] block mb-1">
              Precio
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm text-[#1A1A1A] focus:border-[#1B4332] focus:outline-none"
              placeholder="Ej: 250 (dejar vacío para 'Consultar')"
            />
          </div>
        )}
        <button
          onClick={handleSaveText}
          disabled={saving}
          className="mt-3 flex items-center justify-center gap-2 w-full bg-[#1B4332] text-white rounded-lg py-3 text-sm font-[500] active:bg-[#2D6A4F] disabled:opacity-50"
        >
          {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> :
           saved ? <><Check size={14} /> Guardado</> :
           <><Save size={14} /> Guardar Texto</>}
        </button>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-[#52B788] bg-[#52B788]/5' : 'border-[#E0DDD5] bg-white active:bg-[#F5F0E8]'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-[#1B4332]" />
            <p className="text-sm text-[#1A1A1A] font-[500]">Subiendo {uploadCount} de {uploadTotal}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Camera size={24} className="text-[#1B4332]" />
            <p className="text-sm text-[#1A1A1A] font-[500]">Subir fotos de {sectionLabel}</p>
            <p className="text-xs text-[#8B8B8B]">Máximo 10 a la vez</p>
          </div>
        )}
      </div>

      {/* Photos grid */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-[#1B4332]" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-sm text-[#8B8B8B] py-4">No hay fotos en {sectionLabel}</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <div key={item.id} className="relative rounded-lg overflow-hidden border border-[#E0DDD5]">
              <div className="aspect-square relative bg-[#F5F0E8]">
                {item.type === 'image' ? (
                  <Image src={item.url} alt="" fill unoptimized className="object-cover" sizes="33vw" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <Video size={20} className="text-[#1B4332]" />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center"
              >
                <Trash2 size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
