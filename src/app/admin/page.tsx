'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import {
  ChevronRight,
  LogOut,
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
  Tag,
  Settings,
} from 'lucide-react';

type User = { email: string; isAdmin: boolean };

const SECTIONS = {
  'Servicios': [
    { label: 'Hospedaje', section: 'hospedaje', icon: Home },
    { label: 'Restaurante', section: 'restaurant', icon: UtensilsCrossed },
    { label: 'Aventura', section: 'aventura', icon: Mountain },
    { label: 'Balneario', section: 'balneario', icon: Waves },
    { label: 'Camping', section: 'camping', icon: Tent },
  ],
  'Talleres': [
    { label: 'Talleres (general)', section: 'talleres', icon: Users },
  ],
  'Experiencias': [
    { label: 'Gastronómica', section: 'experiencia-gastronomica', icon: Flame },
    { label: 'Rituales', section: 'rituales', icon: Heart },
    { label: 'Bodas', section: 'bodas', icon: Heart },
  ],
  'Otros': [
    { label: 'Quiénes Somos', section: 'comunidad', icon: Users },
    { label: 'Premios', section: 'premios', icon: Award },
    { label: 'Precios y Promos', section: 'precios', icon: Tag },
    { label: 'Paisajes', section: 'paisajes', icon: TreePine },
  ],
};

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
        <p className="text-xs text-[#8B8B8B] mt-6 mb-2 px-1">
          Toca una sección para editar su texto y subir fotos
        </p>

        {Object.entries(SECTIONS).map(([group, items]) => (
          <div key={group} className="mt-5">
            <p className="text-xs font-[600] tracking-[0.12em] uppercase text-[#D4A853] mb-2 px-1">
              {group}
            </p>
            <div className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.section}
                    href={`/admin/galeria?seccion=${item.section}`}
                    className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#1B4332]/8 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#1B4332]" />
                    </div>
                    <span className="text-sm font-[500] text-[#1A1A1A] flex-1">{item.label}</span>
                    <ChevronRight size={14} className="text-[#8B8B8B]" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Configuración */}
        <div className="mt-8">
          <Link
            href="/admin/configuracion"
            className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F5F0E8] flex items-center justify-center shrink-0">
              <Settings size={16} className="text-[#4A4A4A]" />
            </div>
            <span className="text-sm font-[500] text-[#1A1A1A] flex-1">Configuración del sitio</span>
            <ChevronRight size={14} className="text-[#8B8B8B]" />
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#8B8B8B] mt-8">{user.email}</p>
      </div>
    </main>
  );
}
