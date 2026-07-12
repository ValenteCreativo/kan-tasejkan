'use client';

import { Award, Shield, Leaf, Star } from 'lucide-react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import SectionGallery from '../../components/ui/SectionGallery';

export default function PremiosPage() {
  return (
    <>
      <HeroSection title="Premios y Certificaciones" subtitle="Reconocimientos que avalan nuestro compromiso con la excelencia sustentable" />

      <section className="content-container py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[#4A4A4A] leading-relaxed mb-12 max-w-2xl mx-auto text-lg font-light">
            Nuestro trabajo ha sido reconocido por diversas instituciones nacionales e internacionales.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              { icon: Award, color: '#D4A853', title: 'Premios Turísticos', desc: 'Excelencia en turismo comunitario sustentable.' },
              { icon: Leaf, color: '#2D6A4F', title: 'Certificaciones Ambientales', desc: 'Prácticas de cuidado ambiental validadas.' },
              { icon: Shield, color: '#1B4332', title: 'Reconocimientos Culturales', desc: 'Preservación y difusión de la cultura indígena.' },
              { icon: Star, color: '#D4A853', title: 'Distintivos de Calidad', desc: 'Calidad y seguridad en servicios turísticos.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="glass-card p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-[500] text-[#1A1A1A] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#4A4A4A]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="text-xl font-[300] text-[#1B4332] mb-6">Galería de Reconocimientos</h3>
          <SectionGallery section="premios" columns={3} showEmpty />
        </div>
      </section>

      <Footer />
    </>
  );
}
