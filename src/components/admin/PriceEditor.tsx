'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Check } from 'lucide-react';
import { getAllServices, updateService } from '@/actions';

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  price: string | null;
};

export default function PriceEditor() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAllServices().then(({ data }) => {
      const items = (data as ServiceItem[]) || [];
      setServices(items);
      const p: Record<string, string> = {};
      items.forEach(i => { p[i.id] = i.price || ''; });
      setPrices(p);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    for (const svc of services) {
      const newPrice = prices[svc.id] || '';
      if (newPrice !== (svc.price || '')) {
        await updateService(svc.id, { price: newPrice || null });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-[#1B4332]" /></div>;
  }

  // Group by category
  const grouped: Record<string, ServiceItem[]> = {};
  services.forEach(s => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <div className="space-y-6">
      <p className="text-xs text-[#8B8B8B]">Edita los precios. Se actualizan en la página de precios y en cada sección individual.</p>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="bg-white rounded-xl border border-[#E0DDD5] p-4">
          <h3 className="text-xs font-[600] uppercase tracking-wider text-[#D4A853] mb-3">{category}</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-sm text-[#1A1A1A] flex-1">{item.title}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[#8B8B8B]">$</span>
                  <input
                    type="text"
                    value={prices[item.id] || ''}
                    onChange={(e) => setPrices({ ...prices, [item.id]: e.target.value })}
                    className="w-24 px-2 py-1.5 bg-[#FAFAFA] border border-[#E0DDD5] rounded-lg text-sm text-right focus:border-[#1B4332] focus:outline-none"
                    placeholder="Consultar"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-[#1B4332] text-white rounded-xl py-3.5 text-sm font-[500] active:bg-[#2D6A4F] disabled:opacity-50 sticky bottom-4 shadow-lg"
      >
        {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> :
         saved ? <><Check size={14} /> Guardado</> :
         <><Save size={14} /> Guardar Precios</>}
      </button>
    </div>
  );
}
