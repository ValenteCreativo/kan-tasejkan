'use client';

import { useEffect, useState } from 'react';
import { Home, UtensilsCrossed, Mountain, Waves, Tent } from 'lucide-react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';
import SectionGallery from '../../components/ui/SectionGallery';
import BackButton from '../../components/ui/BackButton';
import { getSiteSettings } from '@/actions';

const servicios = [
  {
    id: 'hospedaje',
    label: 'Hospedaje',
    title: 'Hospedaje en Cabañas',
    section: 'hospedaje',
    settingKey: 'hospedaje_texto',
    description: 'Cabañas rústicas y acogedoras integradas al entorno natural. Despierta con el sonido de la naturaleza y el aroma del bosque.',
    icon: Home,
    features: ['Cabañas familiares', 'Vistas al bosque', 'Agua caliente', 'Chimenea'],
  },
  {
    id: 'restaurant',
    label: 'Restaurante',
    title: 'Restaurante',
    section: 'restaurant',
    settingKey: 'restaurant_texto',
    description: 'Gastronomía regional e indígena preparada con ingredientes locales y técnicas ancestrales. Sabores auténticos de la Sierra Sur de Veracruz.',
    icon: UtensilsCrossed,
    features: ['Comida regional', 'Ingredientes orgánicos', 'Recetas ancestrales', 'Café de altura'],
  },
  {
    id: 'aventura',
    label: 'Aventura',
    title: 'Deportes de Aventura',
    section: 'aventura',
    settingKey: 'aventura_texto',
    description: 'Tirolesas, rappel, senderismo y más actividades para los amantes de la adrenalina en un entorno natural incomparable.',
    icon: Mountain,
    features: ['Tirolesa', 'Rappel', 'Senderismo', 'Ciclismo de montaña'],
  },
  {
    id: 'balneario',
    label: 'Balneario',
    title: 'Balneario',
    section: 'balneario',
    settingKey: 'balneario_texto',
    description: 'Albercas y pozas naturales rodeadas de vegetación exuberante. Un oasis de frescura.',
    icon: Waves,
    features: ['Pozas naturales', 'Alberca', 'Área de descanso', 'Toboganes'],
  },
  {
    id: 'camping',
    label: 'Camping',
    title: 'Camping',
    section: 'camping',
    settingKey: 'camping_texto',
    description: 'Áreas de acampado equipadas para dormir bajo las estrellas en la sierra veracruzana.',
    icon: Tent,
    features: ['Zona de fogatas', 'Sanitarios', 'Área equipada', 'Noches de estrellas'],
  },
];

function ServicioContent({ servicio, textos }: { servicio: typeof servicios[number]; textos: Record<string, string> }) {
  const Icon = servicio.icon;
  const descripcion = textos[servicio.settingKey] || servicio.description;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
          <Icon size={24} className="text-[#1B4332]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332]">{servicio.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <p className="text-[#4A4A4A] leading-relaxed text-lg font-light">
            {descripcion}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#4A4A4A] font-[500] block mb-3">Características</span>
          <div className="flex flex-wrap gap-2">
            {servicio.features.map((f) => (
              <span key={f} className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#52B788]/10 text-[#2D6A4F] font-[500]">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <SectionGallery section={servicio.section} columns={3} showEmpty />
    </div>
  );
}

export default function ServiciosPage() {
  const [textos, setTextos] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    getSiteSettings().then(({ data }) => {
      setTextos(data || {});
    }).catch(() => {
      setTextos({});
    });
  }, []);

  if (textos === null) {
    return (
      <>
        <HeroSection title="Servicios" subtitle="Todo lo que necesitas para una estancia inolvidable rodeado de naturaleza" />
        <div className="flex justify-center py-16">
          <div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" />
        </div>
      </>
    );
  }

  const tabs = servicios.map((s) => ({
    id: s.id,
    label: s.label,
    content: <ServicioContent servicio={s} textos={textos} />,
  }));

  return (
    <>
      <HeroSection title="Servicios" subtitle="Todo lo que necesitas para una estancia inolvidable rodeado de naturaleza" />
      <BackButton />
      <section className="content-container py-12 md:py-20">
        <Tabs tabs={tabs} />
      </section>
      <div className="pb-16 md:pb-24" />
      <Footer />
    </>
  );
}
