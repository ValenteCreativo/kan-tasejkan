'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import {
  Camera,
  ChevronRight,
  LogOut,
  Image as ImageIcon,
  Home,
  UtensilsCrossed,
  Mountain,
  Waves,
  Tent,
  Flame,
  Heart,
  Award,
  Users,
  TreePine,
  Settings,
  Tag,
} from 'lucide-react';

type User = { email: string; isAdmin: boolean };

const GALLERY_SECTIONS = [
  { label: 'Hospedaje', section: 'hospedaje', icon: Home, color: '#1B4332' },
  { label: 'Restaurante', section: 'restaurant', icon: UtensilsCrossed, color: '#2D6A4F' },
  { label: 'Aventura', section: 'aventura', icon: Mountain, color: '#52B788' },
  { label: 'Balneario', section: 'balneario', icon: Waves, color: '#1B4332' },
  { label: 'Camping', section: 'camping', icon: Tent, color: '#5C4033' },
  { label: 'Talleres', section: 'talleres', icon: Users, color: '#8B5E3C' },
  { label: 'Gastronómica', section: 'experiencia-gastronomica', icon: Flame, color: '#D4A853' },
  { label: 'Rituales', section: 'rituales', icon: Heart, color: '#5C4033' },
  { label: 'Bodas', section: 'bodas', icon: Heart, color: '#D4A853' },
  { label: 'Comunidad', section: 'comunidad', icon: Users, color: '#2D6A4F' },
  { label: 'Premios', section: 'premios', icon: Award, color: '#D4A853' },
  { label: 'Precios y Promos', section: 'precios', icon: Tag, color: '#D4A853' },
  { label: 'Paisajes', section: 'paisajes', icon: TreePine, color: '#1B4332' },
];

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
    <main className="min-h-screen bg-[#FAFAFA] pb-10">
      {/* Header */}
      <div className="bg-[#1B4332] text-white px-5 py-6 md:px-8">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-[500] tracking-[0.15em] uppercase">Kan-Tasejkan</h1>
            <p className="text-xs text-white/70 mt-0.5">Administración</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 md:px-8">
        {/* Secciones */}
        <p className="text-xs font-[600] tracking-[0.12em] uppercase text-[#4A4A4A] mt-6 mb-3 px-1">
          Editar secciones
        </p>
        <p className="text-xs text-[#8B8B8B] mb-4 px-1">
          Toca una sección para editar su texto y subir fotos
        </p>

        <div className="grid grid-cols-2 gap-3">
          {GALLERY_SECTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.section}
                href={`/admin/galeria?seccion=${item.section}`}
                className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors text-center"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon size={18} style={{ color: item.color }} />
                </div>
                <span className="text-xs font-[500] text-[#1A1A1A]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Ver galería completa */}
        <Link
          href="/admin/galeria"
          className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors mt-4"
        >
          <div className="flex items-center gap-3">
            <ImageIcon size={18} className="text-[#1B4332]" />
            <span className="text-sm font-[500] text-[#1A1A1A]">Ver todas las fotos subidas</span>
          </div>
          <ChevronRight size={16} className="text-[#8B8B8B]" />
        </Link>

        {/* Configuración */}
        <Link
          href="/admin/configuracion"
          className="flex items-center justify-between bg-white rounded-xl p-4 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors mt-3"
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-[#4A4A4A]" />
            <span className="text-sm font-[500] text-[#1A1A1A]">Configuración del sitio</span>
          </div>
          <ChevronRight size={16} className="text-[#8B8B8B]" />
        </Link>

        {/* Info */}
        <p className="text-center text-[10px] text-[#8B8B8B] mt-8">{user.email}</p>
      </div>
    </main>
  );
}
