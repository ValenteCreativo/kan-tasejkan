import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllServices } from '@/actions';

export const metadata: Metadata = {
  title: 'Servicios — Mindfulverso',
  description: 'Terapias, ceremonias y procesos de transformación. Psicoterapia, Mindfulness, Access Bars, Ceremonias, Círculos, Diplomado, Talleres y Retiros.',
};

const FALLBACK_SERVICES = [
  { title: 'Psicoterapia', slug: 'psicoterapia', description: 'Acompañamiento terapéutico individual para tu proceso personal.', color: 'var(--purple-deep)' },
  { title: 'Mindfulness', slug: 'mindfulness', description: 'Prácticas de atención plena para vivir con mayor presencia.', color: 'var(--turquoise)' },
  { title: 'Access Bars', slug: 'access-bars', description: 'Técnica energética para liberar limitaciones y expandir posibilidades.', color: 'var(--accent-tertiary)' },
  { title: 'Ceremonias', slug: 'ceremonias', description: 'Cacao, luna llena, sound healing y experiencias transformadoras.', color: 'var(--purple-deep)' },
  { title: 'Círculos', slug: 'circulos', description: 'Espacios sagrados de encuentro, escucha y conexión.', color: 'var(--turquoise)' },
  { title: 'Diplomado', slug: 'diplomado', description: 'Formación profesional en Mindfulness y Habilidades Socioemocionales.', color: 'var(--accent-tertiary)' },
  { title: 'Talleres', slug: 'talleres', description: 'Experiencias prácticas para empresas y profesionales.', color: 'var(--purple-deep)' },
  { title: 'Retiros', slug: 'retiros', description: 'Inmersiones de bienestar en Valle de Bravo, Playa y Amatlán.', color: 'var(--turquoise)' },
];

const CATEGORY_COLORS: Record<string, string> = {
  'Psicoterapia': 'var(--purple-deep)',
  'Mindfulness': 'var(--turquoise)',
  'Access Bars': 'var(--accent-tertiary)',
  'Ceremonias': 'var(--purple-deep)',
  'Círculos': 'var(--turquoise)',
  'Diplomado': 'var(--accent-tertiary)',
  'Talleres': 'var(--purple-deep)',
  'Retiros': 'var(--turquoise)',
};

export default async function ServiciosPage() {
  const { data: dbServices } = await getAllServices(true);

  const hasDbServices = dbServices && dbServices.length > 0;

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Mindfulverso
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Servicios
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Terapias, ceremonias y procesos de transformación para tu bienestar integral.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {hasDbServices
            ? dbServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/servicios/${service.slug}`}
                  className="glass-card p-8 group"
                >
                  {service.coverImageUrl ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-5">
                      <Image
                        src={service.coverImageUrl}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full mb-5 opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: CATEGORY_COLORS[service.category] || 'var(--purple-deep)' }}
                    />
                  )}
                  <h3 className="text-lg font-light tracking-wider uppercase text-[var(--text-dark)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm font-light text-[var(--muted)] leading-relaxed">
                    {service.shortDescription || service.description?.substring(0, 100) || ''}
                  </p>
                  {service.priceNote && (
                    <p className="text-xs font-light text-[var(--accent)] mt-3">{service.priceNote}</p>
                  )}
                </Link>
              ))
            : FALLBACK_SERVICES.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicios/${service.slug}`}
                  className="glass-card p-8 group"
                >
                  <div
                    className="w-10 h-10 rounded-full mb-5 opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ background: service.color }}
                  />
                  <h3 className="text-lg font-light tracking-wider uppercase text-[var(--text-dark)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm font-light text-[var(--muted)] leading-relaxed">
                    {service.description}
                  </p>
                </Link>
              ))}
        </div>
      </div>
    </main>
  );
}
