'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';

const experiencias = [
  {
    id: 'gastronomica',
    label: 'Gastronómica',
    title: 'Experiencia Gastronómica',
    subtitle: 'Sabores de la Sierra',
    description: 'Sumérgete en la cocina tradicional náhuatl. Desde la recolección de ingredientes en el campo hasta la preparación y degustación de platillos ancestrales. Incluye visita al mercado local, preparación comunitaria y comida ceremonial.',
    highlights: ['Recolección de ingredientes', 'Preparación en fogón', 'Platillos ceremoniales', 'Bebidas tradicionales', 'Sobremesa comunitaria'],
  },
  {
    id: 'rituales',
    label: 'Rituales',
    title: 'Rituales',
    subtitle: 'Conexión Ancestral',
    description: 'Participa en ceremonias y rituales de nuestra tradición náhuatl. Limpias, temazcal, ceremonias de agradecimiento a la tierra y celebraciones según el calendario sagrado. Una experiencia de transformación interior.',
    highlights: ['Temazcal', 'Ceremonias de ofrenda', 'Rituales de purificación', 'Danzas ceremoniales', 'Cantos tradicionales'],
  },
  {
    id: 'bodas',
    label: 'Bodas Tradicionales',
    title: 'Bodas Tradicionales',
    subtitle: 'Unión Sagrada',
    description: 'Celebra tu unión con una ceremonia tradicional indígena en un entorno natural mágico. Nuestros guías espirituales conducen la ceremonia respetando las tradiciones ancestrales, en un escenario único rodeado de naturaleza.',
    highlights: ['Ceremonia tradicional', 'Guía espiritual', 'Flores y ofrendas', 'Banquete tradicional', 'Música de la región'],
  },
];

function ExperienciaContent({ exp }: { exp: typeof experiencias[number] }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A853] font-[500]">
          {exp.subtitle}
        </span>
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] mt-2">{exp.title}</h2>
      </div>

      {/* Hero image */}
      <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center mb-8 hover:border-[#52B788] transition-colors">
        <span className="text-sm text-[#8B8B8B] uppercase tracking-wider">Foto principal — {exp.title}</span>
      </div>

      {/* Description + highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="md:col-span-2">
          <p className="text-[#4A4A4A] leading-relaxed text-lg font-light">
            {exp.description}
          </p>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#4A4A4A] font-[500] block mb-3">Incluye</span>
          {exp.highlights.map((h) => (
            <div key={h} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#52B788]" />
              <span className="text-sm text-[#4A4A4A]">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`${i === 0 ? 'md:col-span-2 md:row-span-2' : ''} aspect-square rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center hover:border-[#52B788] transition-colors cursor-pointer`}
          >
            <span className="text-xs text-[#8B8B8B] uppercase tracking-wider">Foto {i + 1}</span>
          </div>
        ))}
      </div>

      {/* Video */}
      <div className="mt-8">
        <div className="aspect-video rounded-2xl overflow-hidden bg-black/5 border border-[#E0DDD5] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
              <span className="text-xl">▶</span>
            </div>
            <span className="text-sm text-[#8B8B8B] uppercase tracking-wider">Video — {exp.title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExperienciasPage() {
  const tabs = experiencias.map((exp) => ({
    id: exp.id,
    label: exp.label,
    content: <ExperienciaContent exp={exp} />,
  }));

  return (
    <>
      <HeroSection
        title="Experiencias Turísticas Comunitarias"
        subtitle="Vive la cultura indígena de manera auténtica y transformadora"
      />

      <section className="content-container py-16 md:py-24">
        <Tabs tabs={tabs} />
      </section>

      <Footer />
    </>
  );
}
