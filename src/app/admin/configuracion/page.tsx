'use client';

import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al panel
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Configuración</h2>
          <p className="text-sm text-[#6B6580] font-[300] mt-1">Ajustes generales del sitio.</p>
        </div>

        {/* Settings form */}
        <div className="bg-white rounded-xl border border-[#F0EEF5] p-6 space-y-6">
          {/* Site name */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
              Nombre del sitio
            </label>
            <input
              type="text"
              placeholder="Mindfulverso"
              className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
              Descripción
            </label>
            <textarea
              rows={3}
              placeholder="Breve descripción del sitio..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors resize-none"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              placeholder="+54 9 11 1234-5678"
              className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
              Email de contacto
            </label>
            <input
              type="email"
              placeholder="contacto@mindfulverso.com"
              className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
            />
          </div>

          {/* Social media */}
          <div>
            <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
              Redes sociales
            </label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Instagram URL"
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
              />
              <input
                type="text"
                placeholder="Facebook URL"
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
              />
              <input
                type="text"
                placeholder="YouTube URL"
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
              />
            </div>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-[#F0EEF5]">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors">
              <Settings size={14} strokeWidth={1.5} />
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
