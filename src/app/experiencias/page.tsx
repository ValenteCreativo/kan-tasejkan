'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import Tabs from '../../components/ui/Tabs';
import SectionGallery from '../../components/ui/SectionGallery';

const experiencias = [
  {
    id: 'gastronomica',
    label: 'Gastronómica',
    title: 'Experiencia Gastronómica',
    subtitle: 'Sabores de la Sierra',
    section: 'experiencia-gastronomica',
    description: 'Sumérgete en la cocina tradicional náhuatl. Desde la recolección de ingredientes en el campo hasta la preparación y degustación de platillos ancestrales.',
    highlights: ['Recolección de ingredientes', 'Preparación en fogón', 'Platillos ceremoniales', 'Bebidas tradicionales', 'Sobremesa comunitaria'],
  },
  {
    id: 'rituales',
    label: 'Rituales',
    title: 'Rituales',
    subtitle: 'Conexión Ancestral',
    section: 'rituales',
    description: 'Participa en ceremonias y rituales de nuestra tradición náhuatl. Temazcal, ceremonias de agradecimiento a la tierra y celebraciones según el calendario sagrado.',
    highlights: ['Temazcal', 'Ceremonias de ofrenda', 'Rituales de purificación', 'Danzas ceremoniales', 'Cantos tradicionales'],
  },
  {
    id: 'bodas',
    label: 'Bodas Tradicionales',
    title: 'Bodas Tradicionales',
    subtitle: 'Unión Sagrada',
    section: 'bodas',
    description: 'Celebra tu unión con una ceremonia tradicional indígena en un entorno natural mágico. Nuestros guías espirituales conducen la ceremonia respetando las tradiciones ancestrales.',
    highlights: ['Ceremonia tradicional', 'Guía espiritual', 'Flores y ofrendas', 'Banquete tradicional', 'Música de la región'],
  },
];

function ExperienciaContent({ exp }: { exp: typeof experiencias[number] }) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4A853] font-[500]">{exp.subtitle}</span>
        <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] mt-2">{exp.title}</h2>
      </div>

      <p className="text-[#4A4A4A] leading-relaxed text-lg font-light max-w-3xl mx-auto text-center mb-6">{exp.description}</p>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {exp.highlights.map((h) => (
          <span key={h} className="text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#52B788]/10 text-[#2D6A4F] font-[500]">{h}</span>
        ))}
      </div>

      <SectionGallery section={exp.section} columns={3} showEmpty />
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
      <HeroSection title="Experiencias Turísticas Comunitarias" subtitle="Vive la cultura indígena de manera auténtica y transformadora" />
      <section className="content-container py-16 md:py-24">
        <Tabs tabs={tabs} />
      </section>
      <Footer />
    </>
  );
}
