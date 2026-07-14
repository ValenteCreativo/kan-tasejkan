'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Save, Check, GripVertical } from 'lucide-react';
import { getAllServices, createService, updateService, deleteService } from '@/actions';
import SectionEditor from '@/components/admin/SectionEditor';

type ServiceItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  shortDescription: string | null;
  orderIndex: number | null;
  isPublished: boolean | null;
};

// Map de categorías del orbital a category en DB
const CATEGORY_MAP: Record<string, { label: string; dbCategory: string; mediaSection: string }> = {
  'talleres': { label: 'Talleres', dbCategory: 'Talleres', mediaSection: 'talleres' },
  'servicios': { label: 'Servicios', dbCategory: 'Hospedaje', mediaSection: 'hospedaje' },
  'experiencias': { label: 'Experiencias', dbCategory: 'Experiencias', mediaSection: 'experiencias' },
};

function SeccionesContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('cat') || 'talleres';
  const config = CATEGORY_MAP[categoria] || CATEGORY_MAP['talleres'];

  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadItems() {
    setLoading(true);
    const { data } = await getAllServices();
    const filtered = ((data as ServiceItem[]) || []).filter(
      (s) => s.category === config.dbCategory
    );
    setItems(filtered.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, [config.dbCategory]);

  async function handleAdd() {
    if (!newTitle.trim()) return;
    setAdding(true);
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await createService({
      title: newTitle.trim(),
      slug: `${slug}-${Date.now()}`,
      category: config.dbCategory,
      description: newDesc.trim() || null,
      shortDescription: null,
      isPublished: true,
      orderIndex: items.length,
    });
    setNewTitle('');
    setNewDesc('');
    setAdding(false);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este elemento?')) return;
    await deleteService(id);
    loadItems();
  }

  async function handleSaveEdit() {
    if (!editingId || !editTitle.trim()) return;
    setSaving(true);
    await updateService(editingId, {
      title: editTitle.trim(),
      description: editDesc.trim() || null,
    });
    setEditingId(null);
    setSaving(false);
    loadItems();
  }

  function startEdit(item: ServiceItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDesc(item.description || '');
  }

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 mt-6">
      <h2 className="text-lg font-[500] text-[#1A1A1A] mb-1">{config.label}</h2>
      <p className="text-xs text-[#8B8B8B] mb-6">Agrega, edita o elimina elementos</p>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin text-[#1B4332]" />
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {items.length === 0 && (
            <p className="text-sm text-[#8B8B8B] text-center py-6">No hay elementos. Agrega uno abajo.</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-[#E0DDD5] p-4">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm focus:border-[#1B4332] focus:outline-none"
                    placeholder="Título"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm focus:border-[#1B4332] focus:outline-none resize-y"
                    placeholder="Descripción..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-lg py-2.5 text-sm font-[500]"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2.5 bg-[#F5F0E8] text-[#4A4A4A] rounded-lg text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <button onClick={() => startEdit(item)} className="flex-1 text-left">
                    <p className="text-sm font-[500] text-[#1A1A1A]">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-[#8B8B8B] mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 active:bg-red-100"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="bg-white rounded-xl border-2 border-dashed border-[#E0DDD5] p-4 space-y-3">
        <p className="text-xs font-[600] uppercase tracking-wider text-[#4A4A4A]">Agregar nuevo</p>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm focus:border-[#1B4332] focus:outline-none"
          placeholder="Nombre (ej: Tejido tradicional)"
        />
        <textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm focus:border-[#1B4332] focus:outline-none resize-y"
          placeholder="Descripción (opcional)"
        />
        <button
          onClick={handleAdd}
          disabled={adding || !newTitle.trim()}
          className="w-full flex items-center justify-center gap-2 bg-[#D4A853] text-white rounded-lg py-3 text-sm font-[500] active:bg-[#b8923f] disabled:opacity-50"
        >
          {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar
        </button>
      </div>

      {/* Gallery for this category */}
      <div className="mt-8">
        <p className="text-xs font-[600] uppercase tracking-wider text-[#4A4A4A] mb-3">Fotos de {config.label}</p>
        <SectionEditor
          section={config.mediaSection}
          sectionLabel={config.label}
          textKey={`${categoria}_general_texto`}
          textFallback=""
        />
      </div>
    </div>
  );
}

export default function SeccionesAdminPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-8">
      <div className="bg-[#1B4332] text-white px-5 py-5 md:px-8 md:py-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-3">
            <ArrowLeft size={16} />
            Volver al panel
          </Link>
          <h1 className="text-lg md:text-xl font-[500]">Administrar Contenido</h1>
          <p className="text-sm text-white/70 mt-0.5">Agrega, edita o elimina elementos</p>
        </div>
      </div>

      <Suspense fallback={<div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-[#1B4332]" /></div>}>
        <SeccionesContent />
      </Suspense>
    </div>
  );
}
