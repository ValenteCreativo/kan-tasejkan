'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '@/actions';

const CONTENT_FIELDS = [
  { key: 'hospedaje_texto', label: 'Hospedaje — Descripción', page: 'Servicios' },
  { key: 'restaurant_texto', label: 'Restaurante — Descripción', page: 'Servicios' },
  { key: 'aventura_texto', label: 'Deportes de Aventura — Descripción', page: 'Servicios' },
  { key: 'balneario_texto', label: 'Balneario — Descripción', page: 'Servicios' },
  { key: 'camping_texto', label: 'Camping — Descripción', page: 'Servicios' },
  { key: 'quienes_somos_texto', label: 'Quiénes Somos — Historia', page: 'Quiénes Somos' },
  { key: 'mision_texto', label: 'Misión', page: 'Quiénes Somos' },
  { key: 'vision_texto', label: 'Visión', page: 'Quiénes Somos' },
  { key: 'gastronomica_texto', label: 'Experiencia Gastronómica', page: 'Experiencias' },
  { key: 'rituales_texto', label: 'Rituales', page: 'Experiencias' },
  { key: 'bodas_texto', label: 'Bodas Tradicionales', page: 'Experiencias' },
];

export default function ContenidoAdminPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      if (data) setValues(data);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const toSave: Record<string, string> = {};
    CONTENT_FIELDS.forEach(f => {
      if (values[f.key]) toSave[f.key] = values[f.key];
    });
    await updateSiteSettings(toSave);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 size={24} className="animate-spin text-[#1B4332]" />
      </div>
    );
  }

  // Group by page
  const grouped: Record<string, typeof CONTENT_FIELDS> = {};
  CONTENT_FIELDS.forEach(f => {
    if (!grouped[f.page]) grouped[f.page] = [];
    grouped[f.page].push(f);
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-5 py-5 md:px-8 md:py-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
          <h1 className="text-lg md:text-xl font-[500]">Editar Textos del Sitio</h1>
          <p className="text-sm text-white/70 mt-0.5">Cambia las descripciones de cada sección</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 md:px-8 mt-6">
        {Object.entries(grouped).map(([page, fields]) => (
          <div key={page} className="mb-8">
            <h2 className="text-sm font-[600] text-[#1B4332] uppercase tracking-wider mb-3">{page}</h2>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="bg-white rounded-xl border border-[#E0DDD5] p-4">
                  <label className="text-xs font-[500] text-[#4A4A4A] block mb-2">{field.label}</label>
                  <textarea
                    value={values[field.key] || ''}
                    onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm text-[#1A1A1A] focus:border-[#1B4332] focus:outline-none resize-y"
                    placeholder="Escribe aquí la descripción..."
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save button - fixed at bottom on mobile */}
        <div className="sticky bottom-4 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-4 font-[500] text-base active:bg-[#2D6A4F] disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <><Loader2 size={18} className="animate-spin" /> Guardando...</>
            ) : saved ? (
              <><Check size={18} /> Guardado</>
            ) : (
              <><Save size={18} /> Guardar Cambios</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
