'use client';

import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Plus } from 'lucide-react';

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto p-8">
        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al panel
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Productos</h2>
            <p className="text-sm text-[#6B6580] font-[300] mt-1">Administra los productos de tu tienda.</p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Agregar producto
          </Link>
        </div>

        {/* Table header */}
        <div className="bg-white rounded-xl border border-[#F0EEF5] overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-[#F0EEF5] bg-[#F8F7FC]">
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Título</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Categoría</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Precio</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Stock</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Estado</span>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-full bg-[#F8F7FC] flex items-center justify-center mb-4">
              <ShoppingBag size={20} strokeWidth={1.5} className="text-[#6B6580]" />
            </div>
            <p className="text-[14px] text-[#24202F] font-[400] mb-1">No hay productos aún</p>
            <p className="text-[12px] text-[#6B6580] font-[300] mb-5">Crea el primero para llenar tu tienda.</p>
            <Link
              href="/admin/productos/nuevo"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
              Agregar producto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
