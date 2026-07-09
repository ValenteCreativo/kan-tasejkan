import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllEvents } from '@/actions';

export const metadata: Metadata = {
  title: 'Calendario — Mindfulverso',
  description: 'Próximos eventos, ceremonias, círculos y talleres en Mindfulverso.',
};

export default async function CalendarioPage() {
  const { data: events } = await getAllEvents(true);

  // Filter upcoming events
  const now = new Date();
  const upcomingEvents = events?.filter(
    (e) => new Date(e.startDate) >= now || (e.endDate && new Date(e.endDate) >= now)
  ) || [];

  const pastEvents = events?.filter(
    (e) => new Date(e.startDate) < now && (!e.endDate || new Date(e.endDate) < now)
  ) || [];

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Próximos encuentros
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Calendario
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Ceremonias, círculos, talleres y retiros próximos.
          </p>
        </div>

        {upcomingEvents.length === 0 ? (
          /* Empty state */
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--turquoise)]/10 mx-auto mb-6 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[var(--turquoise)] opacity-40" />
            </div>
            <p className="text-sm font-light text-[var(--muted)]">
              Próximamente se publicarán los eventos del mes.
            </p>
            <p className="text-xs font-light text-[var(--subtle)] mt-2">
              Los eventos se administran desde el panel de admin.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6">
                {/* Date badge */}
                <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 flex flex-col items-center justify-center">
                  <span className="text-2xl font-[200] text-[var(--accent)]">
                    {new Date(event.startDate).getDate()}
                  </span>
                  <span className="text-[10px] font-[400] uppercase tracking-wider text-[var(--muted)]">
                    {new Date(event.startDate).toLocaleDateString('es-MX', { month: 'short' })}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-[400] uppercase tracking-wider text-[var(--turquoise)]">
                      {event.category}
                    </span>
                    {event.modality && (
                      <>
                        <span className="text-[#E8E5F0]">·</span>
                        <span className="text-[10px] font-[300] uppercase tracking-wider text-[var(--muted)]">
                          {event.modality}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-[300] tracking-wider text-[var(--text-dark)] mb-2">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm font-[300] text-[var(--muted)] leading-relaxed mb-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-xs font-[300] text-[var(--muted)]">
                    {event.location && <span>📍 {event.location}</span>}
                    {event.price && <span>💰 ${event.price}</span>}
                    {event.capacity && <span>👥 {event.capacity} lugares</span>}
                    <span>
                      🕐 {new Date(event.startDate).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Image */}
                {event.coverImageUrl && (
                  <div className="relative w-full md:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={event.coverImageUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Past events section */}
        {pastEvents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-extralight tracking-[0.2em] uppercase text-[var(--muted)] mb-8 text-center">
              Eventos pasados
            </h2>
            <div className="space-y-4 opacity-60">
              {pastEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="glass-card p-4 flex items-center gap-4">
                  <span className="text-xs font-[300] text-[var(--muted)] w-24">
                    {new Date(event.startDate).toLocaleDateString('es-MX')}
                  </span>
                  <span className="text-sm font-[300] text-[var(--text-dark)]">{event.title}</span>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--turquoise)] ml-auto">{event.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
