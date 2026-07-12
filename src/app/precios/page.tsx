'use client';

import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import SectionGallery from '../../components/ui/SectionGallery';

const precios = [
  {
    categoria: 'Hospedaje',
    items: [
      { nombre: 'Cabaña familiar (4 personas)', precio: 'Consultar' },
      { nombre: 'Cabaña doble', precio: 'Consultar' },
      { nombre: 'Camping (por persona)', precio: 'Consultar' },
    ],
  },
  {
    categoria: 'Aventura',
    items: [
      { nombre: 'Tirolesa', precio: 'Consultar' },
      { nombre: 'Rappel', precio: 'Consultar' },
      { nombre: 'Senderismo guiado', precio: 'Consultar' },
    ],
  },
  {
    categoria: 'Balneario',
    items: [
      { nombre: 'Entrada general', precio: 'Consultar' },
      { nombre: 'Niños', precio: 'Consultar' },
    ],
  },
  {
    categoria: 'Talleres',
    items: [
      { nombre: 'Tejido tradicional', precio: 'Consultar' },
      { nombre: 'Cocina ancestral', precio: 'Consultar' },
      { nombre: 'Café de altura', precio: 'Consultar' },
      { nombre: 'Medicina tradicional', precio: 'Consultar' },
    ],
  },
  {
    categoria: 'Experiencias',
    items: [
      { nombre: 'Experiencia gastronómica', precio: 'Consultar' },
      { nombre: 'Ritual / Temazcal', precio: 'Consultar' },
      { nombre: 'Boda tradicional', precio: 'Consultar' },
    ],
  },
];

export default function PreciosPage() {
  return (
    <>
      <HeroSection
        title="Precios y Promociones"
        subtitle="Consulta nuestras tarifas y paquetes especiales"
      />

      <section className="content-container py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Aviso */}
          <div className="bg-[#D4A853]/10 border border-[#D4A853]/30 rounded-xl p-5 mb-10 text-center">
            <p className="text-sm text-[#5C4033] font-[500]">
              📞 Para reservaciones y precios actualizados contáctanos por WhatsApp
            </p>
            <a
              href="https://wa.me/529241078457"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 btn-kan-filled text-xs"
            >
              WhatsApp: 924 107 8457
            </a>
          </div>

          {/* Lista de precios */}
          <div className="space-y-8">
            {precios.map((cat) => (
              <div key={cat.categoria} className="glass-card p-6">
                <h3 className="text-base font-[600] text-[#1B4332] mb-4 uppercase tracking-wider">{cat.categoria}</h3>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <div key={item.nombre} className="flex items-center justify-between py-2 border-b border-[#E0DDD5] last:border-0">
                      <span className="text-sm text-[#1A1A1A]">{item.nombre}</span>
                      <span className="text-sm font-[500] text-[#D4A853]">{item.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Promociones */}
          <div className="mt-12">
            <h2 className="text-xl font-[300] text-[#1B4332] mb-6 text-center">Promociones</h2>
            <div className="bg-[#1B4332]/5 border border-[#E0DDD5] rounded-xl p-8 text-center">
              <p className="text-[#4A4A4A] text-sm">
                Próximamente: paquetes y promociones especiales.
                <br />Contáctanos para grupos y eventos.
              </p>
            </div>
          </div>

          {/* Galería de precios/promos si suben fotos */}
          <div className="mt-12">
            <SectionGallery section="general" columns={2} showEmpty={false} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
