import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';

export const metadata = {
  title: 'Quiénes Somos — Kan-Tasejkan',
  description: 'Somos una comunidad indígena comprometida con el ecoturismo sustentable y la preservación de nuestra cultura ancestral en la Sierra de Zongolica, Veracruz.',
};

export default function QuienesSomosPage() {
  return (
    <>
      <HeroSection
        title="Quiénes Somos"
        subtitle="Somos una comunidad indígena comprometida con el turismo sustentable, la preservación de nuestra cultura y el cuidado de la tierra que nos ha sido heredada."
      />

      {/* Historia */}
      <section className="content-container py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-5">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Nuestra Historia</span>
              <h2 className="text-2xl md:text-3xl font-[200] text-[#1B4332]">Kan-Tasejkan</h2>
              <p className="text-[#4A4A4A] leading-relaxed">
                Kan-Tasejkan, que en nuestra lengua náhuatl significa &ldquo;Lugar de Sombras&rdquo;, es un espacio ecoturístico ubicado en el corazón de la Sierra de Zongolica, Veracruz.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed">
                Nuestro proyecto nace del deseo de compartir la riqueza natural y cultural de nuestra comunidad con visitantes de todo el mundo, generando desarrollo económico local de manera sustentable y responsable con el medio ambiente.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed">
                Trabajamos con orgullo por preservar nuestras tradiciones ancestrales, nuestra lengua, nuestra gastronomía y nuestros rituales.
              </p>
            </div>
            {/* Photo placeholder */}
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center">
              <span className="text-xs text-[#8B8B8B] uppercase tracking-wider text-center px-4">Foto comunidad</span>
            </div>
          </div>

          {/* Galería de la comunidad */}
          <div className="mb-20">
            <h3 className="text-xl font-[300] text-[#1B4332] mb-6 text-center">Nuestra Comunidad</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center hover:border-[#52B788] transition-colors">
                  <span className="text-xs text-[#8B8B8B] uppercase tracking-wider">Foto {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="glass-card p-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Misión</span>
              <p className="text-[#4A4A4A] leading-relaxed mt-4">
                Ofrecer experiencias turísticas comunitarias que honren nuestra identidad cultural, protejan nuestro entorno natural y generen bienestar para nuestra comunidad, manteniendo viva la herencia de nuestros ancestros para las generaciones futuras.
              </p>
            </div>
            <div className="glass-card p-8">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#D4A853] font-[500]">Visión</span>
              <p className="text-[#4A4A4A] leading-relaxed mt-4">
                Ser un referente del ecoturismo indígena en México, demostrando que es posible generar desarrollo económico sin sacrificar nuestra identidad cultural ni nuestro entorno natural.
              </p>
            </div>
          </div>

          {/* Equipo */}
          <div className="text-center">
            <h3 className="text-xl font-[300] text-[#1B4332] mb-8">Nuestro Equipo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-[#1B4332]/5 border-2 border-[#E0DDD5] flex items-center justify-center mb-3">
                    <span className="text-2xl text-[#1B4332]/30">👤</span>
                  </div>
                  <p className="text-sm font-[500] text-[#1A1A1A]">Nombre</p>
                  <p className="text-xs text-[#4A4A4A]">Rol</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
