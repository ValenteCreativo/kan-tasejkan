'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Home, UtensilsCrossed, Mountain, Waves, Tent, Flame, Heart, Award, Users, TreePine, Tag } from 'lucide-react';
import SectionEditor from '@/components/admin/SectionEditor';

const SECTIONS = [
  { value: 'hospedaje', label: 'Hospedaje', icon: Home, textKey: 'hospedaje_texto', fallback: 'Cabañas rústicas y acogedoras integradas al entorno natural. Despierta con el sonido de la naturaleza y el aroma del bosque.' },
  { value: 'restaurant', label: 'Restaurante', icon: UtensilsCrossed, textKey: 'restaurant_texto', fallback: 'Gastronomía regional e indígena preparada con ingredientes locales y técnicas ancestrales. Sabores auténticos de la Sierra Sur de Veracruz.' },
  { value: 'aventura', label: 'Aventura', icon: Mountain, textKey: 'aventura_texto', fallback: 'Tirolesas, rappel, senderismo y más actividades para los amantes de la adrenalina en un entorno natural incomparable.' },
  { value: 'balneario', label: 'Balneario', icon: Waves, textKey: 'balneario_texto', fallback: 'Albercas y pozas naturales rodeadas de vegetación exuberante. Un oasis de frescura.' },
  { value: 'camping', label: 'Camping', icon: Tent, textKey: 'camping_texto', fallback: 'Áreas de acampado equipadas para dormir bajo las estrellas en la sierra veracruzana.' },
  { value: 'talleres', label: 'Talleres', icon: Users, textKey: 'talleres_texto', fallback: 'Aprende de nuestra cultura ancestral con experiencias prácticas y vivenciales.' },
  { value: 'experiencia-gastronomica', label: 'Exp. Gastronómica', icon: Flame, textKey: 'gastronomica_texto', fallback: 'Sumérgete en la cocina tradicional náhuatl. Desde la recolección de ingredientes en el campo hasta la preparación y degustación de platillos ancestrales.' },
  { value: 'rituales', label: 'Rituales', icon: Heart, textKey: 'rituales_texto', fallback: 'Participa en ceremonias y rituales de nuestra tradición náhuatl. Temazcal, ceremonias de agradecimiento a la tierra y celebraciones según el calendario sagrado.' },
  { value: 'bodas', label: 'Bodas', icon: Heart, textKey: 'bodas_texto', fallback: 'Celebra tu unión con una ceremonia tradicional indígena en un entorno natural mágico. Nuestros guías espirituales conducen la ceremonia respetando las tradiciones ancestrales.' },
  { value: 'comunidad', label: 'Quiénes Somos', icon: Users, textKey: 'quienes_somos_texto', fallback: 'Somos una comunidad indígena comprometida con el turismo sustentable, la preservación de nuestra cultura y el cuidado de la tierra que nos ha sido heredada.' },
  { value: 'premios', label: 'Premios', icon: Award, textKey: 'premios_texto', fallback: 'Nuestro trabajo ha sido reconocido por diversas instituciones nacionales e internacionales que valoran el ecoturismo sustentable.' },
  { value: 'precios', label: 'Precios y Promos', icon: Tag, textKey: 'precios_texto', fallback: 'Consulta nuestras tarifas y paquetes especiales.' },
  { value: 'paisajes', label: 'Paisajes', icon: TreePine, textKey: 'paisajes_texto', fallback: 'La naturaleza que nos rodea en Tonalapan, Mecayapan.' },
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
