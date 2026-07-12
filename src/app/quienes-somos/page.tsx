'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import SectionGallery from '../../components/ui/SectionGallery';

export default function QuienesSomosPage() {
  return (
    <>
      <HeroSection
        title="Quiénes Somos"
        subtitle="Somos una comunidad indígena comprometida con el turismo sustentable y la preservación de nuestra cultura ancestral"
      />

      <section className="content-container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Historia */}
          <div className="mb-16">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Nuestra Historia</span>
            <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332] mt-2 mb-5">Kan-Tasejkan</h2>
            <div className="space-y-4 text-[#4A4A4A] leading-relaxed">
              <p>
                Kan-Tasejkan, que en nuestra lengua náhuatl significa &ldquo;Lugar de Sombras&rdquo;, es un espacio ecoturístico ubicado en el corazón de la Sierra de Zongolica, Veracruz.
              </p>
              <p>
                Nuestro proyecto nace del deseo de compartir la riqueza natural y cultural de nuestra comunidad con visitantes de todo el mundo, generando desarrollo económico local de manera sustentable.
              </p>
              <p>
                Trabajamos con orgullo por preservar nuestras tradiciones ancestrales, nuestra lengua, nuestra gastronomía y nuestros rituales.
              </p>
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Misión</span>
              <p className="text-[#4A4A4A] leading-relaxed mt-4">
                Ofrecer experiencias turísticas comunitarias que honren nuestra identidad cultural, protejan nuestro entorno natural y generen bienestar para nuestra comunidad.
              </p>
            </div>
            <div className="glass-card p-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Visión</span>
              <p className="text-[#4A4A4A] leading-relaxed mt-4">
                Ser un referente del ecoturismo indígena en México, demostrando que es posible generar desarrollo sin sacrificar nuestra identidad cultural ni nuestro entorno natural.
              </p>
            </div>
          </div>

          {/* Galería de comunidad */}
          <h3 className="text-xl font-[300] text-[#1B4332] mb-6">Nuestra Comunidad</h3>
          <SectionGallery section="comunidad" columns={3} showEmpty />
        </div>
      </section>

      <Footer />
    </>
  );
}
