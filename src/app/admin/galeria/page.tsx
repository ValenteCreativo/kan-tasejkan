'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Home, UtensilsCrossed, Mountain, Waves, Tent, Flame, Heart, Award, Users, TreePine, Tag } from 'lucide-react';
import SectionEditor from '@/components/admin/SectionEditor';

const SECTIONS = [
  { value: 'hospedaje', label: 'Hospedaje', icon: Home, textKey: 'hospedaje_texto', fallback: 'Cabañas rústicas y acogedoras integradas al entorno natural.' },
  { value: 'restaurant', label: 'Restaurante', icon: UtensilsCrossed, textKey: 'restaurant_texto', fallback: 'Gastronomía regional e indígena con ingredientes locales.' },
  { value: 'aventura', label: 'Aventura', icon: Mountain, textKey: 'aventura_texto', fallback: 'Tirolesas, rappel, senderismo y más actividades de adrenalina.' },
  { value: 'balneario', label: 'Balneario', icon: Waves, textKey: 'balneario_texto', fallback: 'Albercas y pozas naturales rodeadas de vegetación.' },
  { value: 'camping', label: 'Camping', icon: Tent, textKey: 'camping_texto', fallback: 'Áreas de acampado bajo las estrellas.' },
  { value: 'talleres', label: 'Talleres', icon: Users, textKey: 'talleres_texto', fallback: 'Aprende de nuestra cultura ancestral.' },
  { value: 'experiencia-gastronomica', label: 'Exp. Gastronómica', icon: Flame, textKey: 'gastronomica_texto', fallback: 'Cocina tradicional náhuatl desde el campo hasta la mesa.' },
  { value: 'rituales', label: 'Rituales', icon: Heart, textKey: 'rituales_texto', fallback: 'Temazcal, ceremonias y rituales de nuestra tradición.' },
  { value: 'bodas', label: 'Bodas', icon: Heart, textKey: 'bodas_texto', fallback: 'Ceremonias tradicionales en un entorno natural mágico.' },
  { value: 'comunidad', label: 'Comunidad', icon: Users, textKey: 'quienes_somos_texto', fallback: 'Nuestra historia y comunidad.' },
  { value: 'premios', label: 'Premios', icon: Award, textKey: 'premios_texto', fallback: 'Reconocimientos a nuestro trabajo.' },
  { value: 'precios', label: 'Precios y Promos', icon: Tag, textKey: 'precios_texto', fallback: 'Tarifas y promociones especiales.' },
  { value: 'paisajes', label: 'Paisajes', icon: TreePine, textKey: 'paisajes_texto', fallback: 'La naturaleza que nos rodea.' },
];

function GaleriaContent() {
  const searchParams = useSearchParams();
  const paramSection = searchParams.get('seccion') || '';

  const current = SECTIONS.find(s => s.value === paramSection);

  // Si no hay sección, mostrar selector
  if (!current) {
    return (
      <div className="max-w-lg mx-auto px-5 md:px-8 mt-6">
        <p className="text-base font-[500] text-[#1A1A1A] mb-4 text-center">
          Selecciona una sección para editar
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.value}
                href={`/admin/galeria?seccion=${s.value}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors"
              >
                <Icon size={20} className="text-[#1B4332]" />
                <span className="text-xs font-[500] text-[#1A1A1A]">{s.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <current.icon size={20} className="text-[#1B4332]" />
          <h2 className="text-lg font-[500] text-[#1A1A1A]">{current.label}</h2>
        </div>
        <Link
          href="/admin/galeria"
          className="text-xs text-[#1B4332] font-[500] px-3 py-1.5 rounded-full bg-[#1B4332]/5"
        >
          Cambiar
        </Link>
      </div>

      <SectionEditor
        section={current.value}
        sectionLabel={current.label}
        textKey={current.textKey}
        textFallback={current.fallback}
      />
    </div>
  );
}

export default function GaleriaAdminPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-5 py-5 md:px-8 md:py-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
          <h1 className="text-lg md:text-xl font-[500]">Editar Sección</h1>
          <p className="text-sm text-white/70 mt-0.5">Cambia el texto y sube fotos</p>
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#1B4332]" /></div>}>
        <GaleriaContent />
      </Suspense>
    </div>
  );
}
