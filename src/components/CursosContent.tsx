'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Event } from '../db/schema';

interface Props {
  cursos: Event[];
}

export default function CursosContent({ cursos }: Props) {
  if (cursos.length === 0) {
    return (
      <div className="text-center">
        {/* Placeholder when no courses are published */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
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

        <p className="text-sm font-light text-[var(--muted)]">
          Próximamente publicaremos nuestros cursos y formaciones. ¡Mantente atenta!
        </p>
        <Link href="/contacto" className="inline-block mt-6 text-sm text-[var(--accent)] hover:underline">
          Contáctanos para más información →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {cursos.map((curso, index) => (
        <motion.div
          key={curso.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Link href={`/calendario`} className="glass-card overflow-hidden group block">
            {curso.coverImageUrl && (
              <div className="aspect-[16/9] relative overflow-hidden">
                <Image
                  src={curso.coverImageUrl}
                  alt={curso.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium tracking-wider uppercase text-[var(--accent)]">
                  {curso.category}
                </span>
                {curso.startDate && (
                  <>
                    <span className="text-[#B9B8CA]">·</span>
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date(curso.startDate).toLocaleDateString('es-MX', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </>
                )}
              </div>
              <h3 className="text-lg font-light text-[var(--text-dark)] group-hover:text-[var(--accent)] transition-colors mb-2">
                {curso.title}
              </h3>
              {curso.description && (
                <p className="text-sm font-light text-[var(--muted)] line-clamp-2">
                  {curso.description}
                </p>
              )}
              <div className="mt-4 flex items-center gap-4 text-xs text-[var(--muted)]">
                {curso.modality && <span>{curso.modality}</span>}
                {curso.price && <span className="font-medium text-[var(--text-dark)]">{curso.price}</span>}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
