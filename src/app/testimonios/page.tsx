import { Metadata } from 'next';
import Image from 'next/image';
import { getAllTestimonials } from '@/actions';

export const metadata: Metadata = {
  title: 'Testimonios — Kan-Tasejkan',
  description: 'Experiencias de quienes visitaron Kan-Tasejkan.',
};

export default async function TestimoniosPage() {
  const { data: testimonials } = await getAllTestimonials(true);

  const hasTestimonials = testimonials && testimonials.length > 0;

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Experiencias
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Testimonios
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Palabras de quienes ya caminaron con nosotros.
          </p>
        </div>

        {!hasTestimonials ? (
          /* Placeholder */
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 mx-auto mb-6 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[var(--accent)] opacity-40" />
            </div>
            <p className="text-sm font-light text-[var(--muted)]">
              Los testimonios se publicarán próximamente.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="glass-card p-8">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  {testimonial.imageUrl ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-[300] text-[var(--accent)]">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    {/* Rating */}
                    {testimonial.rating && (
                      <div className="flex gap-0.5 mb-3">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-sm text-amber-400">★</span>
                        ))}
                        {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                          <span key={i} className="text-sm text-[#E8E5F0]">★</span>
                        ))}
                      </div>
                    )}

                    {/* Text */}
                    <p className="text-sm font-[300] text-[var(--muted)] leading-relaxed italic mb-4">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {/* Name */}
                    <p className="text-sm font-[400] text-[var(--text-dark)]">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
