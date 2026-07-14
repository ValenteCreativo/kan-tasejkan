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
  slug: string;
  description: string | null;
  price: string | null;
  category: string;
  isPublished: boolean | null;
};

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices(true).then(({ data }) => {
      const items = ((data as ServiceItem[]) || []).filter(s => s.category === 'Servicios');
      setServicios(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection title="Servicios" subtitle="Todo lo que necesitas para una estancia inolvidable" />
        <div className="flex justify-center py-16"><div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" /></div>
        <Footer />
      </>
    );
  }

  const tabs = servicios.map((s) => ({
    id: s.id,
    label: s.title.length > 15 ? s.title.slice(0, 15) + '…' : s.title,
    content: (
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] text-center mb-4">{s.title}</h2>
        {s.price && (
          <p className="text-center text-[#D4A853] font-[500] mb-4">${s.price}</p>
        )}
        {s.description && (
          <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-10">{s.description}</p>
        )}
        <SectionGallery section={s.slug} columns={3} showEmpty />
      </div>
    ),
  }));

  return (
    <>
      <HeroSection title="Servicios" subtitle="Todo lo que necesitas para una estancia inolvidable rodeado de naturaleza" />
      <section className="content-container py-12 md:py-20">
        {tabs.length > 0 ? <Tabs tabs={tabs} /> : (
          <div className="text-center py-8">
            <p className="text-sm text-[#8B8B8B]">Próximamente</p>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
