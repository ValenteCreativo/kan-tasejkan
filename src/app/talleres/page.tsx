'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';
import SectionGallery from '../../components/ui/SectionGallery';

const talleres = [
  { id: 'tejido', label: 'Tejido', title: 'Tejido y Textiles Tradicionales', duration: '3 horas', description: 'Aprende las técnicas de tejido ancestrales de nuestra comunidad. Crea tu propia pieza usando telar de cintura y tintes naturales.' },
  { id: 'medicina', label: 'Medicina', title: 'Medicina Tradicional', duration: '2 horas', description: 'Conoce las plantas medicinales de la sierra y su uso en la medicina tradicional náhuatl con nuestros curanderos.' },
  { id: 'nahuatl', label: 'Náhuatl', title: 'Lengua Náhuatl', duration: '1.5 horas', description: 'Introducción a la lengua náhuatl. Aprende palabras, frases y conoce nuestra cosmovisión a través del idioma.' },
  { id: 'cocina', label: 'Cocina', title: 'Cocina Ancestral', duration: '4 horas', description: 'Prepara platillos tradicionales de la sierra: tamales de tesmole, atoles ceremoniales y más.' },
  { id: 'artesanias', label: 'Artesanías', title: 'Elaboración de Artesanías', duration: '2.5 horas', description: 'Artesanías en barro, madera y fibras naturales con técnicas transmitidas por generaciones.' },
  { id: 'cafe', label: 'Café', title: 'Café de Altura', duration: '2 horas', description: 'Del campo a la taza. Aprende a catar, tostar y preparar café de la sierra veracruzana.' },
];

function TallerContent({ taller }: { taller: typeof talleres[number] }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-[#D4A853]/10 text-[#8B5E3C] font-[500] inline-block mb-3">
          Duración: {taller.duration}
        </span>
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332]">{taller.title}</h2>
      </div>

      <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-10">{taller.description}</p>

      <SectionGallery section="talleres" columns={3} showEmpty />
    </div>
  );
}

export default function TalleresPage() {
  const tabs = talleres.map((t) => ({
    id: t.id,
    label: t.label,
    content: <TallerContent taller={t} />,
  }));

  return (
    <>
      <HeroSection title="Talleres" subtitle="Aprende de nuestra cultura ancestral con experiencias prácticas y vivenciales" />
      <section className="content-container py-16 md:py-24">
        <Tabs tabs={tabs} />
      </section>
      <Footer />
    </>
  );
}
