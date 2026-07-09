import { Metadata } from 'next';
import Image from 'next/image';
import { getAllTeamMembers } from '@/actions';

export const metadata: Metadata = {
  title: 'Nosotros — Mindfulverso',
  description: 'Conoce la historia, filosofía y el equipo detrás de Mindfulverso. Un centro holístico dedicado al bienestar integral.',
};

export default async function NosotrosPage() {
  const { data: members } = await getAllTeamMembers(true);

  const hasMembers = members && members.length > 0;

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Mindfulverso
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Nosotros
          </h1>
        </div>

        {/* Content sections */}
        <div className="space-y-16">
          {/* Historia */}
          <section className="text-center">
            <h2 className="text-xl font-extralight tracking-[0.2em] uppercase text-[var(--accent)] mb-6">
              Historia
            </h2>
            <p className="text-base font-light text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
              Mindfulverso nació de la convicción de que el bienestar es un universo por explorar.
              Un espacio donde la psicoterapia, la meditación, las ceremonias y el trabajo corporal
              se encuentran para ofrecer caminos de transformación genuinos y profundos.
            </p>
          </section>

          {/* Filosofía */}
          <section className="text-center">
            <h2 className="text-xl font-extralight tracking-[0.2em] uppercase text-[var(--accent)] mb-6">
              Filosofía
            </h2>
            <p className="text-base font-light text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
              Creemos en un enfoque integrativo del bienestar: mente, cuerpo y espíritu como un todo.
              Cada persona tiene su propio ritmo y camino. Nosotros acompañamos ese proceso con
              respeto, ciencia y corazón.
            </p>
          </section>

          {/* Equipo */}
          <section className="text-center">
            <h2 className="text-xl font-extralight tracking-[0.2em] uppercase text-[var(--accent)] mb-6">
              Equipo
            </h2>

            {hasMembers ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {members.map((member) => (
                  <div key={member.id} className="glass-card p-8">
                    {/* Photo */}
                    {member.imageUrl ? (
                      <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-5">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-[var(--accent)]/10 mx-auto mb-5 flex items-center justify-center">
                        <span className="text-2xl font-[200] text-[var(--accent)]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-light tracking-wider text-[var(--text-dark)] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-4">
                      {member.role}
                    </p>

                    {member.bio && (
                      <p className="text-sm font-light text-[var(--muted)] leading-relaxed mb-4">
                        {member.bio}
                      </p>
                    )}

                    {/* Certifications */}
                    {member.certifications && (member.certifications as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        {(member.certifications as string[]).map((cert, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-[300] px-2 py-1 rounded-full bg-[var(--accent)]/5 text-[var(--accent)] border border-[var(--accent)]/10"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback — single card */
              <div className="glass-card p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 mx-auto mb-6 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-tertiary)] opacity-60" />
                </div>
                <h3 className="text-lg font-light tracking-wider text-[var(--text-dark)] mb-1">
                  Verónica
                </h3>
                <p className="text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-4">
                  Fundadora & Terapeuta
                </p>
                <p className="text-sm font-light text-[var(--muted)] leading-relaxed">
                  Psicoterapeuta, facilitadora de mindfulness y guía de ceremonias.
                  Con más de X años de experiencia acompañando procesos de transformación.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
