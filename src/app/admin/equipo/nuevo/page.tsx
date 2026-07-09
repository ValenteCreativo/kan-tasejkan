'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createTeamMember, uploadFile } from '@/actions';

export default function NuevoMiembroPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [certifications, setCertifications] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role) {
      alert('Completa al menos el nombre y el rol.');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = '';

      if (image) {
        const ext = image.name.split('.').pop();
        const pathname = `team/${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${ext}`;
        const { url, error: uploadError } = await uploadFile(image, pathname);
        if (uploadError) throw new Error('Error subiendo imagen');
        imageUrl = url || '';
      }

      const certsArray = certifications
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const { error } = await createTeamMember({
        name,
        role,
        bio: bio || null,
        imageUrl: imageUrl || null,
        certifications: certsArray.length > 0 ? certsArray : null,
        orderIndex: 0,
        isPublished,
      });

      if (error) throw new Error(String(error));

      router.push('/admin/equipo');
    } catch (error) {
      console.error('Error:', error);
      alert(`Error creando miembro: ${error}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-3xl mx-auto p-8">
        <Link href="/admin/equipo" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver a equipo
        </Link>

        <h1 className="text-2xl font-[300] text-[#24202F] tracking-wide mb-8">Nuevo Miembro del Equipo</h1>

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

          {/* Role */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Rol *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Terapeuta, Facilitadora, etc."
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Biografía</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors resize-y"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 bg-white border border-[#F0EEF5] rounded-lg text-[#24202F] text-sm font-[300] focus:border-[#4B3A78] focus:outline-none transition-colors"
            />
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">Certificaciones (separadas por coma)</label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="Mindfulness MBSR, Psicoterapeuta, Access Bars"
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
              onClick={() => router.push('/admin/equipo')}
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
              {submitting ? 'Guardando...' : 'Crear miembro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
