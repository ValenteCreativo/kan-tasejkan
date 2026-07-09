'use client';

import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';

export default function ReservasPage() {
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
            <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Reservas</h2>
            <p className="text-sm text-[#6B6580] font-[300] mt-1">Gestiona las reservas de tus clientes.</p>
          </div>
        </div>

        {/* Status badges legend */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-[500] bg-[#FFF3CD] text-[#856404]">Pendiente</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-[500] bg-[#D4EDDA] text-[#155724]">Confirmada</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-[500] bg-[#F8D7DA] text-[#721C24]">Cancelada</span>
        </div>

        {/* Table header */}
        <div className="bg-white rounded-xl border border-[#F0EEF5] overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-3 border-b border-[#F0EEF5] bg-[#F8F7FC]">
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Nombre</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Servicio</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Fecha</span>
            <span className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580]">Estado</span>
          </div>

          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-12 h-12 rounded-full bg-[#F8F7FC] flex items-center justify-center mb-4">
              <MessageSquare size={20} strokeWidth={1.5} className="text-[#6B6580]" />
            </div>
            <p className="text-[14px] text-[#24202F] font-[400] mb-1">No hay reservas aún</p>
            <p className="text-[12px] text-[#6B6580] font-[300]">Las reservas aparecerán aquí cuando los clientes agenden.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
