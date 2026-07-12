'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';

const talleres = [
  {
    id: 'tejido',
    label: 'Tejido',
    title: 'Tejido y Textiles Tradicionales',
    duration: '3 horas',
    description: 'Aprende las técnicas de tejido ancestrales de nuestra comunidad. Crea tu propia pieza usando telar de cintura y tintes naturales extraídos de plantas de la región.',
  },
  {
    id: 'medicina',
    label: 'Medicina Tradicional',
    title: 'Medicina Tradicional',
    duration: '2 horas',
    description: 'Conoce las plantas medicinales de la sierra y su uso en la medicina tradicional náhuatl. Un recorrido por el jardín botánico comunitario con nuestros curanderos.',
  },
  {
    id: 'nahuatl',
    label: 'Lengua Náhuatl',
    title: 'Lengua Náhuatl',
    duration: '1.5 horas',
    description: 'Introducción a la lengua náhuatl, una de las lenguas indígenas más habladas de México. Aprende palabras, frases y conoce nuestra cosmovisión a través del idioma.',
  },
  {
    id: 'cocina',
    label: 'Cocina Ancestral',
    title: 'Cocina Ancestral',
    duration: '4 horas',
    description: 'Prepara platillos tradicionales de la sierra: tamales de tesmole, tlayudas, atoles ceremoniales y más, con ingredientes cosechados de nuestra tierra.',
  },
  {
    id: 'artesanias',
    label: 'Artesanías',
    title: 'Elaboración de Artesanías',
    duration: '2.5 horas',
    description: 'Taller de elaboración de artesanías en barro, madera y fibras naturales con técnicas transmitidas por generaciones de manos artesanas.',
  },
  {
    id: 'cafe',
    label: 'Café de Altura',
    title: 'Café de Altura',
    duration: '2 horas',
    description: 'Conoce todo el proceso del café, desde la planta hasta la taza. Aprende a catar, tostar y preparar café cultivado en la sierra veracruzana por nuestra comunidad.',
  },
];

function TallerContent({ taller }: { taller: typeof talleres[number] }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-[#D4A853]/10 text-[#8B5E3C] font-[500] inline-block mb-3">
          Duración: {taller.duration}
        </span>
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332]">{taller.title}</h2>
      </div>

      {/* Main photo */}
      <div className="aspect-[16/7] rounded-2xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center mb-8 hover:border-[#52B788] transition-colors">
        <span className="text-sm text-[#8B8B8B] uppercase tracking-wider">Foto principal — {taller.title}</span>
      </div>

      {/* Description */}
      <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-10">
        {taller.description}
      </p>

      {/* Photo gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center hover:border-[#52B788] transition-colors cursor-pointer">
            <span className="text-xs text-[#8B8B8B] uppercase tracking-wider">Foto {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Video */}
      <div className="mt-8">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black/5 border border-[#E0DDD5] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
              <span className="text-lg">▶</span>
            </div>
            <span className="text-sm text-[#8B8B8B] uppercase tracking-wider">Video — {taller.title}</span>
          </div>
        </div>
      </div>
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
      <HeroSection
        title="Talleres"
        subtitle="Aprende de nuestra cultura ancestral con experiencias prácticas y vivenciales"
      />

      <section className="content-container py-16 md:py-24">
        <Tabs tabs={tabs} />
      </section>

      <Footer />
    </>
  );
}
