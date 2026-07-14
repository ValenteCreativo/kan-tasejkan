'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import { ChevronRight, LogOut, Settings, Plus, Minus, X, Loader2 } from 'lucide-react';
import { getAllServices, createService, deleteService } from '@/actions';

type User = { email: string; isAdmin: boolean };
type ServiceItem = { id: string; title: string; slug: string; category: string; description: string | null; price: string | null; isPublished: boolean | null };

const FIXED_SECTIONS = {
  'Servicios': [
    { label: 'Hospedaje', href: '/admin/galeria?seccion=hospedaje' },
    { label: 'Restaurante', href: '/admin/galeria?seccion=restaurant' },
    { label: 'Aventura', href: '/admin/galeria?seccion=aventura' },
    { label: 'Balneario', href: '/admin/galeria?seccion=balneario' },
    { label: 'Camping', href: '/admin/galeria?seccion=camping' },
  ],
  'Otros': [
    { label: 'Quiénes Somos', href: '/admin/galeria?seccion=comunidad' },
    { label: 'Premios', href: '/admin/galeria?seccion=premios' },
    { label: 'Precios y Promos', href: '/admin/galeria?seccion=precios' },
    { label: 'Paisajes', href: '/admin/galeria?seccion=paisajes' },
  ],
};

const DYNAMIC_CATEGORIES = [
  { key: 'Talleres', label: 'Talleres' },
  { key: 'Experiencias', label: 'Experiencias' },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupCategory, setPopupCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    const parsed = JSON.parse(storedUser) as User;
    if (!parsed.isAdmin || parsed.email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      router.push('/login'); return;
    }
    setUser(parsed);
    setLoading(false);
    loadServices();
  }, [router]);

  async function loadServices() {
    const { data } = await getAllServices();
    setServices((data as ServiceItem[]) || []);
  }

  async function handleLogout() {
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  function openAddPopup(category: string) {
    setPopupCategory(category);
    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setShowPopup(true);
  }

  async function handleAdd() {
    if (!newTitle.trim()) return;
    setAdding(true);
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();
    await createService({
      title: newTitle.trim(),
      slug,
      category: popupCategory,
      description: newDesc.trim() || null,
      shortDescription: null,
      price: newPrice.trim() || null,
      isPublished: true,
      orderIndex: 0,
    });
    setAdding(false);
    setShowPopup(false);
    loadServices();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    await deleteService(id);
    loadServices();
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
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10">
            <LogOut size={14} /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 md:px-8">
        <p className="text-xs text-[#8B8B8B] mt-6 mb-2 px-1">
          Toca una sección para editar texto y fotos
        </p>

        {/* Fixed sections */}
        {Object.entries(FIXED_SECTIONS).map(([group, items]) => (
          <div key={group} className="mt-5">
            <p className="text-xs font-[600] tracking-[0.12em] uppercase text-[#D4A853] mb-2 px-1">{group}</p>
            <div className="space-y-2">
              {items.map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-[#E0DDD5] active:bg-[#F5F0E8] transition-colors">
                  <span className="text-sm font-[500] text-[#1A1A1A] flex-1">{item.label}</span>
                  <ChevronRight size={14} className="text-[#8B8B8B]" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Dynamic categories (Talleres, Experiencias) */}
        {DYNAMIC_CATEGORIES.map(({ key, label }) => {
          const categoryItems = services.filter(s => s.category === key);
          return (
            <div key={key} className="mt-5">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-[600] tracking-[0.12em] uppercase text-[#D4A853]">{label}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openAddPopup(key)}
                    className="w-7 h-7 rounded-full bg-[#1B4332] flex items-center justify-center active:bg-[#2D6A4F]"
                  >
                    <Plus size={14} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {categoryItems.length === 0 && (
                  <p className="text-xs text-[#8B8B8B] px-4 py-3 bg-white rounded-xl border border-[#E0DDD5]">
                    No hay {label.toLowerCase()} todavía. Toca + para agregar.
                  </p>
                )}
                {categoryItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-white rounded-xl border border-[#E0DDD5] overflow-hidden">
                    <Link
                      href={`/admin/galeria?seccion=${item.slug}`}
                      className="flex-1 p-3.5 active:bg-[#F5F0E8]"
                    >
                      <p className="text-sm font-[500] text-[#1A1A1A]">{item.title}</p>
                      {item.price && <p className="text-xs text-[#D4A853] mt-0.5">${item.price}</p>}
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="w-10 h-full flex items-center justify-center border-l border-[#E0DDD5] active:bg-red-50"
                    >
                      <Minus size={14} className="text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Config */}
        <div className="mt-8">
          <Link href="/admin/configuracion" className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-[#E0DDD5] active:bg-[#F5F0E8]">
            <Settings size={16} className="text-[#4A4A4A]" />
            <span className="text-sm font-[500] text-[#1A1A1A] flex-1">Configuración del sitio</span>
            <ChevronRight size={14} className="text-[#8B8B8B]" />
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#8B8B8B] mt-8">{user.email}</p>
      </div>

      {/* Add popup */}
      {showPopup && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-end md:items-center justify-center p-4" onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-[600] text-[#1A1A1A]">Agregar {popupCategory === 'Talleres' ? 'Taller' : 'Experiencia'}</h3>
              <button onClick={() => setShowPopup(false)} className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                <X size={16} className="text-[#4A4A4A]" />
              </button>
            </div>

            <div>
              <label className="text-xs font-[500] text-[#4A4A4A] block mb-1">Nombre *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-3 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none"
                placeholder="Ej: Taller de Temazcal"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs font-[500] text-[#4A4A4A] block mb-1">Descripción</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none resize-y"
                placeholder="Describe brevemente..."
              />
            </div>

            <div>
              <label className="text-xs font-[500] text-[#4A4A4A] block mb-1">Precio (opcional)</label>
              <input
                type="text"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full px-3 py-3 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none"
                placeholder="Ej: 250"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={adding || !newTitle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-3.5 text-sm font-[500] active:bg-[#2D6A4F] disabled:opacity-50"
            >
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Guardar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
