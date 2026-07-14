'use client';

import { useEffect, useState } from 'react';
import HeroSection from '../../components/ui/HeroSection';
import Footer from '../../components/ui/Footer';
import SectionGallery from '../../components/ui/SectionGallery';
import { getAllServices } from '@/actions';

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  price: string | null;
  isPublished: boolean | null;
};

export default function PreciosPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllServices(true).then(({ data }) => {
      setServices((data as ServiceItem[]) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Group by category
  const grouped: Record<string, ServiceItem[]> = {};
  services.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <>
      <HeroSection
        title="Precios y Promociones"
        subtitle="Consulta nuestras tarifas y paquetes especiales"
      />

      <section className="content-container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* WhatsApp CTA */}
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

          {/* Prices from DB */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <p className="text-center text-sm text-[#8B8B8B] py-8">Precios próximamente</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="glass-card p-6">
                  <h3 className="text-base font-[600] text-[#1B4332] mb-4 uppercase tracking-wider">{category}</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#E0DDD5] last:border-0">
                        <span className="text-sm text-[#1A1A1A]">{item.title}</span>
                        <span className="text-sm font-[500] text-[#D4A853]">
                          {item.price ? `$${item.price}` : 'Consultar'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Promo flyers */}
          <div className="mt-12">
            <h2 className="text-xl font-[300] text-[#1B4332] mb-6 text-center">Promociones</h2>
            <SectionGallery section="precios" columns={2} showEmpty />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
