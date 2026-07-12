import { Metadata } from 'next';
import Image from 'next/image';
import { getAllProducts } from '@/actions';

export const metadata: Metadata = {
  title: 'Tienda — Kan-Tasejkan',
  description: 'Artesanías y productos de la comunidad.',
};

export default async function TiendaPage() {
  const { data: products } = await getAllProducts(true);

  const hasProducts = products && products.length > 0;

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
            Objetos conscientes
          </p>
          <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
            Tienda
          </h1>
          <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
            Productos seleccionados para acompañar tu práctica y bienestar diario.
          </p>
        </div>

        {!hasProducts ? (
          /* Placeholder */
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-tertiary)]/10 mx-auto mb-6 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-tertiary)] opacity-40" />
            </div>
            <p className="text-sm font-light text-[var(--muted)]">
              Próximamente disponible.
            </p>
            <p className="text-xs font-light text-[var(--subtle)] mt-2">
              Los productos se gestionan desde el panel de administración.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="glass-card overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-square bg-[#F8F7FC]">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[var(--accent-tertiary)] opacity-20" />
                    </div>
                  )}
                  {product.compareAtPrice && (
                    <span className="absolute top-3 right-3 bg-[var(--accent)] text-white text-[10px] font-[400] px-2 py-1 rounded-full">
                      Oferta
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] font-[400] uppercase tracking-wider text-[var(--turquoise)] mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-base font-[300] text-[var(--text-dark)] mb-2 tracking-wide">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-xs font-[300] text-[var(--muted)] mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-[300] text-[var(--accent)]">${product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm font-[300] text-[var(--muted)] line-through">
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </div>
                  {product.stock !== null && product.stock <= 0 && (
                    <p className="text-[10px] font-[400] text-red-400 mt-2 uppercase tracking-wider">Agotado</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
