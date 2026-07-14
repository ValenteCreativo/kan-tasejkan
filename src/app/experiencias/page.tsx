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

const FALLBACK = [
  { id: 'gastronomica', title: 'Experiencia Gastronómica', description: 'Sumérgete en la cocina tradicional náhuatl. Desde la recolección de ingredientes en el campo hasta la preparación y degustación de platillos ancestrales.', section: 'experiencia-gastronomica' },
  { id: 'rituales', title: 'Rituales', description: 'Participa en ceremonias y rituales de nuestra tradición náhuatl. Temazcal, ceremonias de agradecimiento a la tierra y celebraciones según el calendario sagrado.', section: 'rituales' },
  { id: 'bodas', title: 'Bodas Tradicionales', description: 'Celebra tu unión con una ceremonia tradicional indígena en un entorno natural mágico. Nuestros guías espirituales conducen la ceremonia respetando las tradiciones ancestrales.', section: 'bodas' },
];

export default function ExperienciasPage() {
  const [experiencias, setExperiencias] = useState<{ id: string; title: string; description: string | null; section: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices(true).then(({ data }) => {
      const items = ((data as ServiceItem[]) || []).filter(s => s.category === 'Experiencias');
      if (items.length > 0) {
        setExperiencias(items.map(i => ({
          ...i,
          section: i.title.toLowerCase().replace(/[^a-z]+/g, '-'),
        })));
      } else {
        setExperiencias(FALLBACK);
      }
      setLoading(false);
    }).catch(() => {
      setExperiencias(FALLBACK);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection title="Experiencias Turísticas Comunitarias" subtitle="Vive la cultura indígena de manera auténtica" />
        <div className="flex justify-center py-16"><div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" /></div>
        <Footer />
      </>
    );
  }

  const tabs = experiencias.map((exp) => ({
    id: exp.id,
    label: exp.title.length > 18 ? exp.title.slice(0, 18) + '…' : exp.title,
    content: (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] text-center mb-6">{exp.title}</h2>
        {exp.description && (
          <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-10">{exp.description}</p>
        )}
        <SectionGallery section={exp.section} columns={3} showEmpty />
      </div>
    ),
  }));

  return (
    <>
      <HeroSection title="Experiencias Turísticas Comunitarias" subtitle="Vive la cultura indígena de manera auténtica y transformadora" />
      <section className="content-container py-12 md:py-20">
        {tabs.length > 0 ? <Tabs tabs={tabs} /> : (
          <div className="text-center py-8">
            <SectionGallery section="experiencias" columns={3} showEmpty />
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
