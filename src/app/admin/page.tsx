'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import { LogOut, Plus, Minus, X, Loader2, Settings, Home, UtensilsCrossed, Mountain, Waves, Tent, Flame, Heart, Award, Users, TreePine, Tag, Star, Book, Map, Music, Camera, Coffee, Leaf, Sun } from 'lucide-react';
import { getNavigationItems, createNavigationItem, deleteNavigationItem, getAllServices, createService, deleteService } from '@/actions';

type User = { email: string; isAdmin: boolean };
type NavItem = { id: string; label: string; href: string; icon: string; isVisible: boolean | null; orderIndex: number | null };
type ServiceItem = { id: string; title: string; slug: string; category: string; description: string | null; price: string | null; isPublished: boolean | null };

const ICON_OPTIONS = [
  { value: 'home', label: 'Casa', Icon: Home },
  { value: 'mountain', label: 'Montaña', Icon: Mountain },
  { value: 'waves', label: 'Agua', Icon: Waves },
  { value: 'tent', label: 'Camping', Icon: Tent },
  { value: 'flame', label: 'Fuego', Icon: Flame },
  { value: 'heart', label: 'Corazón', Icon: Heart },
  { value: 'award', label: 'Premio', Icon: Award },
  { value: 'users', label: 'Personas', Icon: Users },
  { value: 'tree', label: 'Árbol', Icon: TreePine },
  { value: 'tag', label: 'Precio', Icon: Tag },
  { value: 'star', label: 'Estrella', Icon: Star },
  { value: 'utensils', label: 'Comida', Icon: UtensilsCrossed },
  { value: 'book', label: 'Libro', Icon: Book },
  { value: 'map', label: 'Mapa', Icon: Map },
  { value: 'music', label: 'Música', Icon: Music },
  { value: 'camera', label: 'Cámara', Icon: Camera },
  { value: 'coffee', label: 'Café', Icon: Coffee },
  { value: 'leaf', label: 'Hoja', Icon: Leaf },
  { value: 'sun', label: 'Sol', Icon: Sun },
];

function getIconComponent(iconName: string) {
  const found = ICON_OPTIONS.find(i => i.value === iconName);
  if (found) return found.Icon;
  // fallback based on common names
  switch (iconName) {
    case 'people': return Users;
    case 'hands': return Leaf;
    case 'fire': return Flame;
    default: return Star;
  }
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);

  // Popup for adding bolita (page)
  const [showPagePopup, setShowPagePopup] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageIcon, setNewPageIcon] = useState('star');
  const [addingPage, setAddingPage] = useState(false);

  // Popup for adding tab (sub-item)
  const [showTabPopup, setShowTabPopup] = useState(false);
  const [tabCategory, setTabCategory] = useState('');
  const [newTabTitle, setNewTabTitle] = useState('');
  const [newTabDesc, setNewTabDesc] = useState('');
  const [newTabPrice, setNewTabPrice] = useState('');
  const [addingTab, setAddingTab] = useState(false);

  // Expanded bolita
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    const parsed = JSON.parse(storedUser) as User;
    if (!parsed.isAdmin || parsed.email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      router.push('/login'); return;
    }
    setUser(parsed);
    setLoading(false);
    loadData();
  }, [router]);

  async function loadData() {
    const [navRes, svcRes] = await Promise.all([getNavigationItems(), getAllServices()]);
    setNavItems((navRes.data as NavItem[]) || []);
    setServices((svcRes.data as ServiceItem[]) || []);
  }

  async function handleLogout() {
    localStorage.removeItem('user');
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  // Add bolita (page)
  async function handleAddPage() {
    if (!newPageTitle.trim()) return;
    setAddingPage(true);
    const href = '/' + newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await createNavigationItem({
      label: newPageTitle.trim(),
      href,
      icon: newPageIcon,
      description: '',
      orderIndex: navItems.length,
      isVisible: true,
    });
    setNewPageTitle('');
    setNewPageIcon('star');
    setShowPagePopup(false);
    setAddingPage(false);
    loadData();
  }

  async function handleDeletePage(id: string, label: string) {
    if (!confirm(`¿Eliminar la página "${label}" del menú?`)) return;
    await deleteNavigationItem(id);
    loadData();
  }

  // Add tab (sub-item)
  async function handleAddTab() {
    if (!newTabTitle.trim()) return;
    setAddingTab(true);
    const slug = newTabTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') + '-' + Date.now();
    await createService({
      title: newTabTitle.trim(),
      slug,
      category: tabCategory,
      description: newTabDesc.trim() || null,
      shortDescription: null,
      price: newTabPrice.trim() || null,
      isPublished: true,
      orderIndex: 0,
    });
    setNewTabTitle('');
    setNewTabDesc('');
    setNewTabPrice('');
    setShowTabPopup(false);
    setAddingTab(false);
    loadData();
  }

  async function handleDeleteTab(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"?`)) return;
    await deleteService(id);
    loadData();
  }

  function openTabPopup(category: string) {
    setTabCategory(category);
    setNewTabTitle('');
    setNewTabDesc('');
    setNewTabPrice('');
    setShowTabPopup(true);
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-3 h-3 rounded-full bg-[#1B4332] animate-pulse" />
      </main>
    );
  }

  // Map nav items to a "category" key for matching tabs
  function getCategoryKey(label: string) {
    return label;
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
        {/* Bolitas (pages) header */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <p className="text-xs font-[600] tracking-[0.12em] uppercase text-[#D4A853]">
            Páginas del sitio (bolitas)
          </p>
          <button
            onClick={() => setShowPagePopup(true)}
            className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center active:bg-[#2D6A4F]"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>

        {/* Bolitas grid */}
        <div className="grid grid-cols-2 gap-3">
          {navItems.filter(n => n.isVisible).map((nav) => {
            const tabs = services.filter(s => s.category === getCategoryKey(nav.label));
            const IconComp = getIconComponent(nav.icon);

            return (
              <button
                key={nav.id}
                onClick={() => setExpandedPage(expandedPage === nav.id ? null : nav.id)}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl border text-center transition-all ${
                  expandedPage === nav.id
                    ? 'bg-[#1B4332]/5 border-[#1B4332] shadow-sm'
                    : 'bg-white border-[#E0DDD5] active:bg-[#F5F0E8]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                  <IconComp size={20} className="text-[#1B4332]" />
                </div>
                <span className="text-xs font-[600] text-[#1A1A1A]">{nav.label}</span>
                <span className="text-[10px] text-[#8B8B8B]">{tabs.length} tab{tabs.length !== 1 ? 's' : ''}</span>
              </button>
            );
          })}
        </div>

        {/* Expanded panel for selected bolita */}
        {expandedPage && (() => {
          const nav = navItems.find(n => n.id === expandedPage);
          if (!nav) return null;
          const tabs = services.filter(s => s.category === getCategoryKey(nav.label));

          return (
            <div className="mt-4 bg-white rounded-2xl border border-[#1B4332] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-[600] text-[#1B4332]">{nav.label}</h3>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/galeria?seccion=${nav.href.replace('/', '')}`}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-[#1B4332]/8 text-[#1B4332] font-[500]"
                  >
                    ✏️ Editar página
                  </Link>
                  <button
                    onClick={() => handleDeletePage(nav.id, nav.label)}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-red-50 text-red-500 font-[500]"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Tabs dentro */}
              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center bg-[#FAFAFA] rounded-xl border border-[#E0DDD5] overflow-hidden">
                  <Link href={`/admin/galeria?seccion=${tab.slug}`} className="flex-1 p-3 active:bg-[#F5F0E8]">
                    <p className="text-xs font-[500] text-[#1A1A1A]">{tab.title}</p>
                    {tab.price && <p className="text-[10px] text-[#D4A853]">${tab.price}</p>}
                  </Link>
                  <button onClick={() => handleDeleteTab(tab.id, tab.title)} className="px-3 py-3 border-l border-[#E0DDD5] active:bg-red-50">
                    <Minus size={12} className="text-red-400" />
                  </button>
                </div>
              ))}

              {/* Add tab */}
              <button
                onClick={() => openTabPopup(getCategoryKey(nav.label))}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-[#D4A853] text-xs text-[#D4A853] font-[500] active:bg-[#D4A853]/5"
              >
                <Plus size={12} /> Agregar a {nav.label}
              </button>
            </div>
          );
        })()}

        {/* Config */}
        <div className="mt-6">
          <Link href="/admin/configuracion" className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-[#E0DDD5] active:bg-[#F5F0E8]">
            <Settings size={16} className="text-[#4A4A4A]" />
            <span className="text-sm font-[500] text-[#1A1A1A] flex-1">Configuración</span>
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#8B8B8B] mt-6">{user.email}</p>
      </div>

      {/* Popup: Add page (bolita) */}
      {showPagePopup && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-end md:items-center justify-center p-4" onClick={() => setShowPagePopup(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-[600] text-[#1A1A1A]">Nueva Página</h3>
              <button onClick={() => setShowPagePopup(false)} className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              className="w-full px-3 py-3 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none"
              placeholder="Nombre de la página"
              autoFocus
            />
            {/* Icon selector */}
            <div>
              <p className="text-xs font-[500] text-[#4A4A4A] mb-2">Ícono</p>
              <div className="grid grid-cols-5 gap-2">
                {ICON_OPTIONS.map(({ value, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setNewPageIcon(value)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      newPageIcon === value
                        ? 'bg-[#1B4332] text-white scale-110'
                        : 'bg-[#F5F0E8] text-[#4A4A4A] active:bg-[#E0DDD5]'
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddPage}
              disabled={addingPage || !newPageTitle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-3.5 text-sm font-[500] disabled:opacity-50"
            >
              {addingPage ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Crear página
            </button>
          </div>
        </div>
      )}

      {/* Popup: Add tab (sub-item) */}
      {showTabPopup && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-end md:items-center justify-center p-4" onClick={() => setShowTabPopup(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-[600] text-[#1A1A1A]">Agregar a {tabCategory}</h3>
              <button onClick={() => setShowTabPopup(false)} className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <input
              type="text"
              value={newTabTitle}
              onChange={(e) => setNewTabTitle(e.target.value)}
              className="w-full px-3 py-3 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none"
              placeholder="Nombre"
              autoFocus
            />
            <textarea
              value={newTabDesc}
              onChange={(e) => setNewTabDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none resize-y"
              placeholder="Descripción (opcional)"
            />
            <input
              type="text"
              value={newTabPrice}
              onChange={(e) => setNewTabPrice(e.target.value)}
              className="w-full px-3 py-3 bg-[#FAFAFA] border border-[#E0DDD5] rounded-xl text-sm focus:border-[#1B4332] focus:outline-none"
              placeholder="Precio (opcional, ej: 250)"
            />
            <button
              onClick={handleAddTab}
              disabled={addingTab || !newTabTitle.trim()}
              className="w-full flex items-center justify-center gap-2 bg-[#D4A853] text-white rounded-xl py-3.5 text-sm font-[500] disabled:opacity-50"
            >
              {addingTab ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Guardar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
