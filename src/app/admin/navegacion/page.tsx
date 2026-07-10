'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, GripVertical, Pencil, Trash2, Eye, EyeOff, Save, X, Loader2 } from 'lucide-react';
import { getNavigationItems, createNavigationItem, updateNavigationItem, deleteNavigationItem, reorderNavigationItems } from '../../../actions';
import type { NavigationItem } from '../../../db/schema';

const ICON_OPTIONS = [
  { value: 'heart', label: '❤️ Corazón' },
  { value: 'flower', label: '🌸 Flor' },
  { value: 'mountain', label: '⛰️ Montaña' },
  { value: 'lotus', label: '🧘 Loto' },
  { value: 'person', label: '👤 Persona' },
  { value: 'mail', label: '✉️ Correo' },
  { value: 'chat', label: '💬 Chat' },
  { value: 'bag', label: '🛍️ Bolsa' },
  { value: 'calendar', label: '📅 Calendario' },
  { value: 'star', label: '⭐ Estrella' },
  { value: 'book', label: '📖 Libro' },
];

export default function NavegacionPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Form state
  const [form, setForm] = useState({ label: '', description: '', href: '', icon: 'flower', isVisible: true });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const { data } = await getNavigationItems();
      if (data) setItems(data);
    } catch (e) {
      console.error('Error loading nav items:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await createNavigationItem({
      label: form.label,
      description: form.description || null,
      href: form.href,
      icon: form.icon,
      isVisible: form.isVisible,
      orderIndex: items.length,
    });
    if (!error) {
      setShowNew(false);
      setForm({ label: '', description: '', href: '', icon: 'flower', isVisible: true });
      await loadItems();
    }
    setSaving(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    await updateNavigationItem(editingId, {
      label: form.label,
      description: form.description || null,
      href: form.href,
      icon: form.icon,
      isVisible: form.isVisible,
    });
    setEditingId(null);
    setForm({ label: '', description: '', href: '', icon: 'flower', isVisible: true });
    await loadItems();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este elemento de la navegación?')) return;
    await deleteNavigationItem(id);
    await loadItems();
  }

  async function handleToggleVisibility(item: NavigationItem) {
    await updateNavigationItem(item.id, { isVisible: !item.isVisible });
    await loadItems();
  }

  function startEdit(item: NavigationItem) {
    setEditingId(item.id);
    setShowNew(false);
    setForm({
      label: item.label,
      description: item.description || '',
      href: item.href,
      icon: item.icon,
      isVisible: item.isVisible ?? true,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowNew(false);
    setForm({ label: '', description: '', href: '', icon: 'flower', isVisible: true });
  }

  // Drag and drop reorder
  function handleDragStart(idx: number) {
    setDraggedIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newItems = [...items];
    const [dragged] = newItems.splice(draggedIdx, 1);
    newItems.splice(idx, 0, dragged);
    setItems(newItems);
    setDraggedIdx(idx);
  }

  async function handleDragEnd() {
    setDraggedIdx(null);
    const orderedIds = items.map(item => item.id);
    await reorderNavigationItems(orderedIds);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#4B3A78]" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-[13px] text-[#6B6580] hover:text-[#3D3066] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al panel
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Navegación Landing</h2>
            <p className="text-sm text-[#6B6580] font-[300] mt-1">Administra los botones del menú orbital de la página de inicio. Arrastra para reordenar.</p>
          </div>
          <button
            onClick={() => { setShowNew(true); setEditingId(null); setForm({ label: '', description: '', href: '', icon: 'flower', isVisible: true }); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>
        </div>

        {/* New/Edit form */}
        {(showNew || editingId) && (
          <form
            onSubmit={editingId ? handleUpdate : handleCreate}
            className="bg-white rounded-xl border border-[#49B6D6]/30 p-6 mb-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-[500] text-[#24202F] uppercase tracking-wider">
                {editingId ? 'Editar elemento' : 'Nuevo elemento'}
              </h3>
              <button type="button" onClick={cancelEdit} className="text-[#6B6580] hover:text-[#3D3066]">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Etiqueta</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
                  placeholder="Ej: Servicios"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78]"
                  required
                />
              </div>
              <div>
                <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Enlace (href)</label>
                <input
                  type="text"
                  value={form.href}
                  onChange={(e) => setForm(f => ({ ...f, href: e.target.value }))}
                  placeholder="Ej: /servicios"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Descripción</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Breve descripción que se muestra en desktop"
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-1">Ícono</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] focus:outline-none focus:border-[#4B3A78]"
                >
                  {ICON_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVisible}
                    onChange={(e) => setForm(f => ({ ...f, isVisible: e.target.checked }))}
                    className="w-4 h-4 rounded border-[#F0EEF5] text-[#4B3A78] focus:ring-[#4B3A78]"
                  />
                  <span className="text-[13px] text-[#24202F]">Visible en la landing</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {editingId ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </form>
        )}

        {/* Items list */}
        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#F0EEF5] p-12 text-center">
            <p className="text-[#6B6580] text-sm mb-4">No hay elementos de navegación. Agrega el primero.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-xl border border-[#F0EEF5] p-4 flex items-center gap-4 transition-all ${
                  draggedIdx === idx ? 'opacity-50 scale-[0.98]' : ''
                } ${!item.isVisible ? 'opacity-60' : ''}`}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-[#B9B8CA] hover:text-[#6B6580]">
                  <GripVertical size={16} />
                </div>

                {/* Icon preview */}
                <div className="w-9 h-9 rounded-full bg-[#F8F7FC] border border-[#E8E5F0] flex items-center justify-center text-sm">
                  {ICON_OPTIONS.find(o => o.value === item.icon)?.label.split(' ')[0] || '🔗'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-[500] text-[#24202F] truncate">{item.label}</p>
                  <p className="text-[11px] text-[#6B6580] truncate">{item.href} {item.description ? `— ${item.description}` : ''}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVisibility(item)}
                    className="p-2 rounded-lg hover:bg-[#F8F7FC] text-[#6B6580] hover:text-[#3D3066] transition-colors"
                    title={item.isVisible ? 'Ocultar' : 'Mostrar'}
                  >
                    {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-2 rounded-lg hover:bg-[#F8F7FC] text-[#6B6580] hover:text-[#3D3066] transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-[#6B6580] hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help text */}
        <p className="text-[11px] text-[#B9B8CA] mt-4 text-center">
          Arrastra los elementos para cambiar el orden en que aparecen en la landing page.
        </p>
      </div>
    </div>
  );
}
