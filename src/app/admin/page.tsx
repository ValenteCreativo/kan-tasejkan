'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import {
  Image as ImageIcon,
  Sparkles,
  Calendar,
  MessageSquare,
  Users,
  Star,
  Settings,
  LogOut,
  Navigation2,
  Camera,
  ChevronRight,
} from 'lucide-react';

type User = { email: string; isAdmin: boolean };

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    const parsed = JSON.parse(storedUser) as User;
    if (!parsed.isAdmin || parsed.email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      router.push('/login'); return;
    }
    setUser(parsed);
    setLoading(false);
  }, [router]);

  async function handleLogout() {
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-8">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-5 py-6 md:px-8 md:py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-[400] tracking-[0.2em] uppercase">Kan-Tasejkan</h1>
            <p className="text-sm text-white/70 mt-0.5">Panel de Administración</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* CTA Principal: Subir fotos */}
        <Link
          href="/admin/galeria"
          className="block -mt-5 bg-[#D4A853] text-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Camera size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-[600] text-white">Subir Fotos y Videos</h2>
              <p className="text-sm text-white/80 mt-0.5">Sube desde tu teléfono las fotos de cada sección</p>
            </div>
            <ChevronRight size={24} className="text-white/70 shrink-0" />
          </div>
        </Link>

        {/* Secciones principales */}
        <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#4A4A4A] mt-8 mb-4 px-1">
          Gestionar Contenido
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Galería de Fotos', desc: 'Ver, organizar y eliminar fotos subidas', href: '/admin/galeria', icon: ImageIcon, color: '#1B4332' },
            { label: 'Servicios', desc: 'Hospedaje, restaurante, aventura, balneario, camping', href: '/admin/servicios', icon: Sparkles, color: '#2D6A4F' },
            { label: 'Eventos y Talleres', desc: 'Programar actividades y talleres', href: '/admin/eventos', icon: Calendar, color: '#52B788' },
            { label: 'Testimonios', desc: 'Lo que dicen los visitantes', href: '/admin/testimonios', icon: Star, color: '#D4A853' },
            { label: 'Equipo', desc: 'Miembros de la comunidad', href: '/admin/equipo', icon: Users, color: '#5C4033' },
            { label: 'Reservas', desc: 'Solicitudes de reservación', href: '/admin/reservas', icon: MessageSquare, color: '#8B5E3C' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 bg-white rounded-xl p-4 md:p-5 border border-[#E0DDD5] hover:border-[#52B788] active:bg-[#F5F0E8] transition-all"
              >
                <div
                  className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-[500] text-[#1A1A1A]">{item.label}</p>
                  <p className="text-xs text-[#8B8B8B] mt-0.5 truncate">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-[#8B8B8B] shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Configuración */}
        <h3 className="text-xs font-[600] tracking-[0.15em] uppercase text-[#4A4A4A] mt-8 mb-4 px-1">
          Configuración
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {[
            { label: 'Navegación del Inicio', desc: 'Editar los botones de la página principal', href: '/admin/navegacion', icon: Navigation2 },
            { label: 'Ajustes del Sitio', desc: 'Nombre, redes sociales, contacto', href: '/admin/configuracion', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 bg-white rounded-xl p-4 md:p-5 border border-[#E0DDD5] hover:border-[#52B788] active:bg-[#F5F0E8] transition-all"
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#F5F0E8]">
                  <Icon size={20} className="text-[#4A4A4A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-[500] text-[#1A1A1A]">{item.label}</p>
                  <p className="text-xs text-[#8B8B8B] mt-0.5 truncate">{item.desc}</p>
                </div>
                <ChevronRight size={18} className="text-[#8B8B8B] shrink-0" />
              </Link>
            );
          })}
        </div>

        {/* Info usuario */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[#8B8B8B]">{user.email}</p>
        </div>
      </div>
    </main>
  );
}
