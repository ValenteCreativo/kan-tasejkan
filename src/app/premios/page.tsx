import { Award, Shield, Leaf, Star } from 'lucide-react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';

export const metadata = {
  title: 'Premios y Certificaciones — Kan-Tasejkan',
  description: 'Reconocimientos y certificaciones que avalan nuestro compromiso con el ecoturismo sustentable y la preservación cultural indígena.',
};

export default function PremiosPage() {
  return (
    <>
      <HeroSection
        title="Premios y Certificaciones"
        subtitle="Reconocimientos que avalan nuestro compromiso con la excelencia sustentable y la preservación de nuestra cultura"
      />

      {/* Content */}
      <section className="content-container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Intro */}
          <p className="text-center text-[#4A4A4A] leading-relaxed mb-16 max-w-2xl mx-auto text-lg font-light">
            Nuestro trabajo ha sido reconocido por diversas instituciones nacionales e internacionales
            que valoran el ecoturismo sustentable, la preservación cultural y el desarrollo comunitario.
          </p>

          {/* Awards categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="glass-card p-8 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                <Award size={26} className="text-[#D4A853]" />
              </div>
              <div>
                <h3 className="text-base font-[500] text-[#1A1A1A] mb-2">Premios Turísticos</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Reconocimientos por excelencia en turismo comunitario sustentable otorgados por instituciones nacionales.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-[#52B788]/10 flex items-center justify-center shrink-0">
                <Leaf size={26} className="text-[#2D6A4F]" />
              </div>
              <div>
                <h3 className="text-base font-[500] text-[#1A1A1A] mb-2">Certificaciones Ambientales</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Certificaciones que validan nuestras prácticas de cuidado ambiental y manejo sustentable de recursos.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                <Shield size={26} className="text-[#1B4332]" />
              </div>
              <div>
                <h3 className="text-base font-[500] text-[#1A1A1A] mb-2">Reconocimientos Culturales</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Reconocimientos por la preservación y difusión de la cultura indígena náhuatl.
                </p>
              </div>
            </div>

            <div className="glass-card p-8 flex gap-5">
              <div className="w-14 h-14 rounded-full bg-[#D4A853]/10 flex items-center justify-center shrink-0">
                <Star size={26} className="text-[#D4A853]" />
              </div>
              <div>
                <h3 className="text-base font-[500] text-[#1A1A1A] mb-2">Distintivos de Calidad</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                  Distintivos que garantizan la calidad y seguridad de nuestros servicios turísticos.
                </p>
              </div>
            </div>
          </div>

          {/* Photo gallery of awards/events */}
          <div className="mb-16">
            <h3 className="text-xl font-[300] text-[#1B4332] mb-6 text-center">Momentos de Reconocimiento</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1B4332]/5 border border-[#E0DDD5] flex items-center justify-center hover:border-[#D4A853] transition-colors cursor-pointer">
                  <span className="text-xs text-[#8B8B8B] uppercase tracking-wider">Foto premio {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed awards list - placeholder for client content */}
          <div className="p-8 rounded-2xl bg-[#F5F0E8] border border-[#E0DDD5]">
            <h3 className="text-lg font-[400] text-[#1B4332] mb-4">Listado de Premios y Certificaciones</h3>
            <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">
              Esta sección se actualizará con el listado detallado de premios y certificaciones del cliente, incluyendo:
            </p>
            <ul className="space-y-2 text-sm text-[#4A4A4A]">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" /> Nombre del premio / certificación</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" /> Institución otorgante</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" /> Año de obtención</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" /> Descripción breve</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" /> Fotos del reconocimiento</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
