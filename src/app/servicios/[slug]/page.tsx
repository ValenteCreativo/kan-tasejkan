import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getServiceBySlug } from '@/actions';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: service } = await getServiceBySlug(slug);
  if (!service) return { title: 'Servicio no encontrado — Kan-Tasejkan' };
  return {
    title: `${service.title} — Kan-Tasejkan`,
    description: service.shortDescription || service.description?.substring(0, 160) || '',
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: service } = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const benefits = service.benefits as string[] | null;
  const gallery = service.gallery as string[] | null;

  return (
    <main className="min-h-screen bg-[var(--white-warm)]">
      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] font-[300] tracking-[0.3em] uppercase text-[#49B6D6] mb-3">Servicios</p>
          <h1 className="text-3xl md:text-4xl font-[200] tracking-[0.15em] uppercase text-[#24202F] mb-4">{service.title}</h1>
          {service.shortDescription && (
            <p className="text-sm font-[300] text-[#6B6580] max-w-lg mx-auto leading-relaxed">
              {service.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Cover image */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        {service.coverImageUrl ? (
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden">
            <Image
              src={service.coverImageUrl}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[16/7] rounded-2xl bg-gradient-to-br from-[#4B3A78]/5 to-[#49B6D6]/5 border border-[#E8E5F0] flex items-center justify-center">
            <p className="text-xs text-[#B9B8CA]">Imagen de portada</p>
          </div>
        )}
      </section>

      {/* Content sections */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Info sidebar */}
          <div className="space-y-4">
            {service.modality && (
              <div className="glass-card p-5">
                <p className="text-[10px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Modalidad</p>
                <p className="text-sm text-[#24202F]">{service.modality}</p>
              </div>
            )}
            {service.duration && (
              <div className="glass-card p-5">
                <p className="text-[10px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Duración</p>
                <p className="text-sm text-[#24202F]">{service.duration}</p>
              </div>
            )}
            {service.location && (
              <div className="glass-card p-5">
                <p className="text-[10px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Ubicación</p>
                <p className="text-sm text-[#24202F]">{service.location}</p>
              </div>
            )}
            <div className="glass-card p-5">
              <p className="text-[10px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Inversión</p>
              <p className="text-lg font-[300] text-[#3D3066]">
                {service.price ? `$${service.price}` : service.priceNote || 'Consultar'}
              </p>
            </div>
            {service.bookingEnabled && (
              <Link href="/contacto" className="btn-mindful-filled w-full text-center block text-xs">
                Reservar sesión
              </Link>
            )}
          </div>

          {/* Main content */}
          <div className="md:col-span-2 space-y-10">
            {service.description && (
              <div>
                <h2 className="text-lg font-[300] tracking-wider uppercase text-[#3D3066] mb-4">Descripción</h2>
                <div className="text-sm font-[300] text-[#6B6580] leading-relaxed whitespace-pre-line">
                  {service.description}
                </div>
              </div>
            )}

            {benefits && benefits.length > 0 && (
              <div>
                <h2 className="text-lg font-[300] tracking-wider uppercase text-[#3D3066] mb-4">Beneficios</h2>
                <ul className="space-y-2">
                  {benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#6B6580] font-[300]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#49B6D6] mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.audience && (
              <div>
                <h2 className="text-lg font-[300] tracking-wider uppercase text-[#3D3066] mb-4">¿A quién va dirigido?</h2>
                <p className="text-sm font-[300] text-[#6B6580] leading-relaxed">
                  {service.audience}
                </p>
              </div>
            )}

            {service.videoUrl && (
              <div>
                <h2 className="text-lg font-[300] tracking-wider uppercase text-[#3D3066] mb-4">Video</h2>
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={service.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={service.title}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gallery */}
        {gallery && gallery.length > 0 && (
          <div>
            <h2 className="text-lg font-[300] tracking-wider uppercase text-[#3D3066] mb-4">Galería</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`${service.title} - imagen ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
