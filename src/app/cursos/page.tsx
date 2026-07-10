import { Metadata } from 'next';
import { getAllEvents } from '../../actions';
import CursosContent from '../../components/CursosContent';

export const metadata: Metadata = {
  title: 'Cursos — Mindfulverso',
  description: 'Formaciones presenciales y grabadas en mindfulness, bienestar y desarrollo personal.',
};

export default async function CursosPage() {
  const { data: allEvents } = await getAllEvents(true);
  const cursos = (allEvents || []).filter(e => 
    e.category.toLowerCase() === 'cursos' || e.category.toLowerCase() === 'diplomado'
  );

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

        <CursosContent cursos={cursos} />
      </div>
    </main>
  );
}
