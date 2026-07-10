'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import { LayoutDashboard, Sparkles, Calendar, MessageSquare, Users, ShoppingBag, FileText, Star, Settings, LogOut, Navigation2 } from 'lucide-react';

type User = { email: string; isAdmin: boolean };

const ADMIN_SECTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { id: 'services', label: 'Servicios', icon: Sparkles, href: '/admin/servicios' },
  { id: 'events', label: 'Calendario', icon: Calendar, href: '/admin/eventos' },
  { id: 'reservations', label: 'Reservas', icon: MessageSquare, href: '/admin/reservas' },
  { id: 'products', label: 'Tienda', icon: ShoppingBag, href: '/admin/productos' },
  { id: 'blog', label: 'Blog', icon: FileText, href: '/admin/blog' },
  { id: 'testimonials', label: 'Testimonios', icon: Star, href: '/admin/testimonios' },
  { id: 'team', label: 'Equipo', icon: Users, href: '/admin/equipo' },
  { id: 'navigation', label: 'Navegación Landing', icon: Navigation2, href: '/admin/navegacion' },
  { id: 'settings', label: 'Configuración', icon: Settings, href: '/admin/configuracion' },
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
        <div className="w-2 h-2 rounded-full bg-[#4B3A78] animate-pulse" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#F0EEF5] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#F0EEF5]">
          <h1 className="text-sm font-[400] tracking-[0.3em] uppercase text-[#3D3066]">Mindfulverso</h1>
          <p className="text-[10px] font-[300] text-[#6B6580] mt-0.5">Panel de Administración</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === 'dashboard';
            return (
              <Link
                key={section.id}
                href={section.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-[400] transition-all ${
                  isActive
                    ? 'bg-[#4B3A78]/8 text-[#3D3066]'
                    : 'text-[#6B6580] hover:bg-[#F8F7FC] hover:text-[#3D3066]'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {section.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#F0EEF5]">
          <p className="text-[11px] text-[#6B6580] truncate mb-2">{user.email}</p>
          <button onClick={handleLogout} className="flex items-center gap-2 text-[11px] text-[#6B6580] hover:text-[#3D3066] transition-colors">
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Dashboard</h2>
            <p className="text-sm text-[#6B6580] font-[300] mt-1">Bienvenida, Verónica. Aquí puedes gestionar todo tu contenido.</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Servicios', value: '—', sub: 'publicados', color: '#4B3A78' },
              { label: 'Eventos', value: '—', sub: 'próximos', color: '#49B6D6' },
              { label: 'Reservas', value: '—', sub: 'pendientes', color: '#F4E96A' },
              { label: 'Testimonios', value: '—', sub: 'publicados', color: '#4B3A78' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-5 border border-[#F0EEF5]">
                <p className="text-[11px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">{stat.label}</p>
                <p className="text-3xl font-[200] text-[#24202F]">{stat.value}</p>
                <p className="text-[10px] text-[#B9B8CA] mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <h3 className="text-sm font-[500] text-[#24202F] tracking-wide mb-4 uppercase">Acciones rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Crear servicio', desc: 'Agrega un nuevo servicio con descripción, galería y precios.', href: '/admin/servicios/nuevo', icon: Sparkles },
              { label: 'Crear evento', desc: 'Programa una ceremonia, taller o retiro próximo.', href: '/admin/eventos/nuevo', icon: Calendar },
              { label: 'Nuevo post', desc: 'Escribe un artículo para el blog.', href: '/admin/blog/new', icon: FileText },
              { label: 'Agregar producto', desc: 'Añade un producto a la tienda.', href: '/admin/productos/nuevo', icon: ShoppingBag },
              { label: 'Agregar testimonio', desc: 'Publica una experiencia de un cliente.', href: '/admin/testimonios/nuevo', icon: Star },
              { label: 'Agregar miembro', desc: 'Añade un integrante al equipo.', href: '/admin/equipo/nuevo', icon: Users },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="bg-white rounded-xl p-5 border border-[#F0EEF5] hover:border-[#49B6D6] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F8F7FC] flex items-center justify-center group-hover:bg-[#49B6D6]/10 transition-colors">
                      <Icon size={15} strokeWidth={1.5} className="text-[#3D3066]" />
                    </div>
                    <span className="text-[13px] font-[500] text-[#24202F]">{action.label}</span>
                  </div>
                  <p className="text-[11px] text-[#6B6580] font-[300] leading-relaxed">{action.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
