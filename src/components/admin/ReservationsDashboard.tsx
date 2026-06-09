'use client';

import { useEffect, useState } from 'react';
import { WHITELISTED_EMAIL } from '../../lib/constants';

type Reservation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  instagram: string | null;
  sessionType: string;
  description: string;
  placement: string | null;
  sizeApprox: string | null;
  referenceImageUrl: string | null;
  additionalNotes: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  contacted: 'text-sky-400 border-sky-400/30 bg-sky-400/5',
  confirmed: 'text-green-400 border-green-400/30 bg-green-400/5',
  completed: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
};

const STATUSES = ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'];

interface Props {
  adminEmail: string;
}

export default function ReservationsDashboard({ adminEmail }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Reservation | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/reservations?${params.toString()}`, {
        headers: { 'x-admin-email': adminEmail },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setReservations(json.reservations || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminEmail,
        },
        body: JSON.stringify({ status, adminNotes }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, adminNotes: adminNotes ?? r.adminNotes } : r))
      );
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = reservations.filter((r) => r.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            className={`glass-minimal p-3 rounded-lg text-left border transition-all ${
              statusFilter === s ? 'border-[#8a1c1c]/50' : 'border-[#1a1a1a]'
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-[#8b7d7b] mb-1">{s}</p>
            <p className="text-xl text-[#e5e5e5] font-light">{counts[s] || 0}</p>
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-[#8b7d7b]">Loading reservations...</p>}
      {error && <p className="text-sm text-red-400">Error: {error}</p>}

      {!loading && reservations.length === 0 && (
        <div className="glass-minimal p-12 rounded-lg text-center">
          <p className="text-[#8b7d7b] font-light">No reservations yet.</p>
        </div>
      )}

      {/* Reservation List */}
      <div className="space-y-3">
        {reservations.map((r) => (
          <div
            key={r.id}
            className="glass-minimal p-5 rounded-lg flex flex-col md:flex-row md:items-center gap-4 hover-lift cursor-pointer"
            onClick={() => setSelected(r)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h3 className="text-[#e5e5e5] font-light">{r.name}</h3>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_COLORS[r.status] || ''}`}>
                  {r.status}
                </span>
                <span className="text-[10px] text-[#8b7d7b] uppercase tracking-widest">{r.sessionType}</span>
              </div>
              <p className="text-xs text-[#8b7d7b]">{r.email}{r.instagram && ` · @${r.instagram}`}</p>
              <p className="text-xs text-[#606060] mt-1 line-clamp-1">{r.description}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8b7d7b] flex-shrink-0">
              {r.preferredDate && <span>{r.preferredDate}</span>}
              <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              <select
                value={r.status}
                onChange={(e) => { e.stopPropagation(); updateStatus(r.id, e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border border-[#1a1a1a] rounded px-2 py-1 text-xs text-[#e5e5e5]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b0b0b]">{s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <div
            className="glass-minimal p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-[#8b7d7b] hover:text-white text-xs uppercase tracking-widest"
              onClick={() => setSelected(null)}
            >
              Close
            </button>

            <div className="flex items-center gap-3 mb-6">
              <h3 className="elegant-text text-sm">{selected.name}</h3>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_COLORS[selected.status] || ''}`}>
                {selected.status}
              </span>
            </div>

            <div className="space-y-4 text-sm">
              <Row label="Email" value={selected.email} />
              {selected.phone && <Row label="Phone" value={selected.phone} />}
              {selected.instagram && <Row label="Instagram" value={`@${selected.instagram}`} />}
              <Row label="Session Type" value={selected.sessionType} />
              <Row label="Description" value={selected.description} multiline />
              {selected.placement && <Row label="Placement" value={selected.placement} />}
              {selected.sizeApprox && <Row label="Size" value={selected.sizeApprox} />}
              {selected.preferredDate && <Row label="Preferred Date" value={`${selected.preferredDate}${selected.preferredTime ? ` · ${selected.preferredTime}` : ''}`} />}
              {selected.additionalNotes && <Row label="Notes" value={selected.additionalNotes} multiline />}
              {selected.referenceImageUrl && (
                <div>
                  <span className="text-[#8b7d7b] block mb-1">Reference Image</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.referenceImageUrl} alt="Reference" className="max-h-48 rounded border border-[#1a1a1a]" />
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <label className="elegant-text text-xs block mb-1">Admin Notes</label>
              <AdminNotesEditor
                reservationId={selected.id}
                initialNotes={selected.adminNotes || ''}
                adminEmail={adminEmail}
                onSave={(notes) => {
                  setSelected((prev) => prev ? { ...prev, adminNotes: notes } : null);
                  setReservations((prev) =>
                    prev.map((r) => r.id === selected.id ? { ...r, adminNotes: notes } : r)
                  );
                }}
              />
              <div className="flex gap-2 pt-2">
                <label className="text-xs text-[#8b7d7b]">Update Status:</label>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                  className="bg-transparent border border-[#1a1a1a] rounded px-2 py-1 text-xs text-[#e5e5e5] flex-1"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0b0b0b]">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <span className="text-[#8b7d7b] text-xs uppercase tracking-widest block mb-0.5">{label}</span>
      {multiline ? (
        <p className="text-[#e5e5e5] font-light leading-relaxed whitespace-pre-wrap">{value}</p>
      ) : (
        <span className="text-[#e5e5e5] font-light">{value}</span>
      )}
    </div>
  );
}

function AdminNotesEditor({
  reservationId,
  initialNotes,
  adminEmail,
  onSave,
}: {
  reservationId: string;
  initialNotes: string;
  adminEmail: string;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-email': adminEmail },
        body: JSON.stringify({ adminNotes: notes }),
      });
      if (!res.ok) throw new Error('Failed to save');
      onSave(notes);
    } catch {
      alert('Error saving notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 minimal-border rounded bg-transparent text-white text-sm font-light focus:border-[#8b7d7b] transition-colors resize-none"
        placeholder="Internal notes..."
      />
      <button
        onClick={save}
        disabled={saving}
        className="btn-elegant text-xs px-4 py-2"
      >
        {saving ? 'Saving...' : 'Save Notes'}
      </button>
    </div>
  );
}
