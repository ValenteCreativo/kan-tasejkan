import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cursos — Mindfulverso',
  description: 'Formaciones presenciales y grabadas en mindfulness, bienestar y desarrollo personal.',
};

export default function CursosPage() {
  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Formación
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Cursos
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Presenciales y grabados. Profundiza en tu práctica con formaciones guiadas.
          </p>
        </div>

        {/* Two categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="glass-card p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 mx-auto mb-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[var(--accent)] opacity-50" />
            </div>
            <h3 className="text-base font-light tracking-wider uppercase text-[var(--text-dark)] mb-2">
              Presenciales
            </h3>
            <p className="text-sm font-light text-[var(--muted)]">
              Experiencias en vivo con acompañamiento directo.
            </p>
          </div>

          <div className="glass-card p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--turquoise)]/10 mx-auto mb-5 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[var(--turquoise)] opacity-50" />
            </div>
            <h3 className="text-base font-light tracking-wider uppercase text-[var(--text-dark)] mb-2">
              Grabados
            </h3>
            <p className="text-sm font-light text-[var(--muted)]">
              A tu ritmo, desde cualquier lugar.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
