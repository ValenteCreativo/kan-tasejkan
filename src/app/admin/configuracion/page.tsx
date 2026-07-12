'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Lock, Save, Loader2 } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../../actions';

const SETTING_KEYS = [
  { key: 'site_name', label: 'Nombre del sitio', placeholder: 'Kan-Tasejkan', type: 'text' },
  { key: 'site_tagline', label: 'Tagline', placeholder: 'Lugar de Sombras', type: 'text' },
  { key: 'site_description', label: 'Descripción', placeholder: 'Espacio ecoturístico indígena en Veracruz...', type: 'textarea' },
  { key: 'whatsapp_number', label: 'WhatsApp (con código de país)', placeholder: '+525512345678', type: 'text' },
  { key: 'contact_email', label: 'Email de contacto', placeholder: 'contacto@kan-tasejkan.com', type: 'email' },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/kantasejkan', type: 'text' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/kantasejkan', type: 'text' },
  { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/@kantasejkan', type: 'text' },
  { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@kantasejkan', type: 'text' },
];

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const { data } = await getSiteSettings();
      if (data) setSettings(data);
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);

    try {
      const { error } = await updateSiteSettings(settings);
      if (error) {
        setSaveMsg({ type: 'error', text: typeof error === 'string' ? error : 'Error al guardar.' });
      } else {
        setSaveMsg({ type: 'success', text: '¡Configuración guardada!' });
      }
    } catch {
      setSaveMsg({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setSaving(false);
    }
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    fetch('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setPasswordMsg({ type: 'error', text: data.error || 'Error al cambiar contraseña.' });
        } else {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada!' });
        }
      })
      .catch(() => {
        setPasswordMsg({ type: 'error', text: 'Error de conexión.' });
      });
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
        <div className="mb-8">
          <h2 className="text-2xl font-[300] text-[#24202F] tracking-wide">Configuración</h2>
          <p className="text-sm text-[#6B6580] font-[300] mt-1">Ajustes generales del sitio.</p>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSaveSettings} className="bg-white rounded-xl border border-[#F0EEF5] p-6 space-y-6">
          {SETTING_KEYS.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  rows={3}
                  placeholder={placeholder}
                  value={settings[key] || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors resize-none"
                />
              ) : (
                <input
                  type={type}
                  placeholder={placeholder}
                  value={settings[key] || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
                />
              )}
            </div>
          ))}

          {saveMsg && (
            <p className={`text-sm ${saveMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
              {saveMsg.text}
            </p>
          )}

          <div className="pt-4 border-t border-[#F0EEF5]">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={1.5} />}
              {saving ? 'Guardando...' : 'Guardar configuración'}
            </button>
          </div>
        </form>

        {/* Password change section */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-[#F0EEF5] p-6 mt-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={16} strokeWidth={1.5} className="text-[#3D3066]" />
            <h3 className="text-sm font-[500] text-[#24202F] uppercase tracking-wider">Cambiar contraseña</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
                Contraseña actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] focus:outline-none focus:border-[#4B3A78] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#4B3A78] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#6B6580] mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#F0EEF5] text-[14px] text-[#24202F] focus:outline-none focus:border-[#4B3A78] transition-colors"
                required
              />
            </div>

            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4B3A78] text-white text-[13px] font-[400] rounded-lg hover:bg-[#3D3066] transition-colors"
            >
              <Lock size={14} strokeWidth={1.5} />
              Cambiar contraseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
