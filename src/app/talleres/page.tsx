'use client';

import { useEffect, useState } from 'react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';
import SectionGallery from '../../components/ui/SectionGallery';
import { getAllServices } from '@/actions';

type ServiceItem = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  isPublished: boolean | null;
};

// Hardcoded fallbacks si la DB está vacía
const FALLBACK_TALLERES = [
  { id: 'tejido', title: 'Tejido y Textiles Tradicionales', description: 'Aprende las técnicas de tejido ancestrales de nuestra comunidad. Crea tu propia pieza usando telar de cintura y tintes naturales.' },
  { id: 'medicina', title: 'Medicina Tradicional', description: 'Conoce las plantas medicinales de la sierra y su uso en la medicina tradicional náhuatl con nuestros curanderos.' },
  { id: 'cocina', title: 'Cocina Ancestral', description: 'Prepara platillos tradicionales de la sierra: tamales de tesmole, atoles ceremoniales y más.' },
  { id: 'cafe', title: 'Café de Altura', description: 'Del campo a la taza. Aprende a catar, tostar y preparar café de la sierra veracruzana.' },
];

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<{ id: string; title: string; description: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices(true).then(({ data }) => {
      const items = ((data as ServiceItem[]) || []).filter(s => s.category === 'Talleres');
      if (items.length > 0) {
        setTalleres(items);
      } else {
        setTalleres(FALLBACK_TALLERES);
      }
      setLoading(false);
    }).catch(() => {
      setTalleres(FALLBACK_TALLERES);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection title="Talleres" subtitle="Aprende de nuestra cultura ancestral" />
        <div className="flex justify-center py-16"><div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" /></div>
        <Footer />
      </>
    );
  }

  const tabs = talleres.map((t) => ({
    id: t.id,
    label: t.title.length > 15 ? t.title.slice(0, 15) + '…' : t.title,
    content: (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] text-center mb-6">{t.title}</h2>
        {t.description && (
          <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-10">{t.description}</p>
        )}
        <SectionGallery section="talleres" columns={3} showEmpty />
      </div>
    ),
  }));

  return (
    <>
      <HeroSection title="Talleres" subtitle="Aprende de nuestra cultura ancestral con experiencias prácticas y vivenciales" />
      <section className="content-container py-12 md:py-20">
        {tabs.length > 0 ? <Tabs tabs={tabs} /> : (
          <div className="text-center py-8">
            <SectionGallery section="talleres" columns={3} showEmpty />
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
