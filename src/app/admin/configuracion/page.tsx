'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Lock, Save, Loader2, Globe, Phone, Mail, Share2, MapPin, Clock, MessageCircle } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../../actions';

const SETTING_GROUPS = [
  {
    title: 'Identidad del Sitio',
    icon: Globe,
    fields: [
      { key: 'site_name', label: 'Nombre del sitio', placeholder: 'Kan-Tasejkan', type: 'text' },
      { key: 'site_tagline', label: 'Tagline / Lema', placeholder: 'Lugar de Sombras · Ecoturismo Indígena', type: 'text' },
      { key: 'site_description', label: 'Descripción (SEO)', placeholder: 'Espacio ecoturístico indígena en la Sierra Sur de Veracruz...', type: 'textarea' },
    ],
  },
  {
    title: 'Contacto y WhatsApp',
    icon: Phone,
    fields: [
      { key: 'whatsapp_number', label: 'Número de WhatsApp (con código de país)', placeholder: '+529241078457', type: 'text' },
      { key: 'whatsapp_message', label: 'Mensaje pre-escrito de WhatsApp', placeholder: 'Hola, me interesa conocer más sobre Kan-Tasejkan. ¿Podrían orientarme?', type: 'textarea' },
      { key: 'contact_email', label: 'Email de contacto', placeholder: 'contacto@kan-tasejkan.com', type: 'email' },
    ],
  },
  {
    title: 'Horario y Ubicación',
    icon: Clock,
    fields: [
      { key: 'horario', label: 'Horario de atención', placeholder: 'Lun – Dom, 8:00 – 20:00 (WhatsApp)', type: 'text' },
      { key: 'direccion', label: 'Dirección', placeholder: 'Centro Ecoturístico Kan-Tasejkan\nTonalapan, Mecayapan, Sierra Sur de Veracruz', type: 'textarea' },
      { key: 'google_maps_url', label: 'Enlace de Google Maps', placeholder: 'https://maps.app.goo.gl/...', type: 'text' },
    ],
  },
  {
    title: 'Redes Sociales',
    icon: Share2,
    fields: [
      { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/kantasejkan', type: 'text' },
      { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/kantasejkan', type: 'text' },
      { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@kantasejkan', type: 'text' },
      { key: 'youtube_url', label: 'YouTube URL (opcional)', placeholder: 'https://youtube.com/@kantasejkan', type: 'text' },
    ],
  },
  {
    title: 'Personalización',
    icon: Settings,
    fields: [
      { key: 'landing_subtitle', label: 'Subtítulo de la landing (encima del menú)', placeholder: 'Lugar de Sombras · Ecoturismo Indígena', type: 'text' },
    ],
  },
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
        setSaveMsg({ type: 'success', text: '¡Configuración guardada! Los cambios se reflejan en el sitio.' });
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
        <Loader2 className="animate-spin text-[#1B4332]" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto p-8">
        {/* Back link */}
        <Link href="/admin" className="inline-flex items-center gap-2 text-[13px] text-[#4A4A4A] hover:text-[#1B4332] transition-colors mb-6">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Volver al panel
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-[300] text-[#1B4332] tracking-wide">Configuración del Sitio</h2>
          <p className="text-sm text-[#4A4A4A] font-[300] mt-1">
            Todos estos ajustes se reflejan en el sitio público (footer, contacto, landing, etc.)
          </p>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {SETTING_GROUPS.map(({ title, icon: Icon, fields }) => (
            <div key={title} className="bg-white rounded-xl border border-[#E0DDD5] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                  <Icon size={15} className="text-[#1B4332]" />
                </div>
                <h3 className="text-sm font-[600] text-[#1B4332] uppercase tracking-wider">{title}</h3>
              </div>

              <div className="space-y-4">
                {fields.map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#4A4A4A] mb-2">
                      {label}
                    </label>
                    {type === 'textarea' ? (
                      <textarea
                        rows={3}
                        placeholder={placeholder}
                        value={settings[key] || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#E0DDD5] text-[14px] text-[#1A1A1A] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#52B788] transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={settings[key] || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#E0DDD5] text-[14px] text-[#1A1A1A] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#52B788] transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {saveMsg && (
            <p className={`text-sm px-4 py-2 rounded-lg ${saveMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
              {saveMsg.text}
            </p>
          )}

          <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-xl border border-[#E0DDD5] p-4 shadow-lg">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] text-white text-[13px] font-[400] rounded-lg hover:bg-[#2D6A4F] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} strokeWidth={1.5} />}
              {saving ? 'Guardando...' : 'Guardar toda la configuración'}
            </button>
          </div>
        </form>

        {/* Password change section */}
        <form onSubmit={handleChangePassword} className="bg-white rounded-xl border border-[#E0DDD5] p-6 mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
              <Lock size={15} className="text-red-600" />
            </div>
            <h3 className="text-sm font-[600] text-[#1B4332] uppercase tracking-wider">Seguridad — Cambiar contraseña</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#4A4A4A] mb-2">
                Contraseña actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E0DDD5] text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#52B788] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#4A4A4A] mb-2">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E0DDD5] text-[14px] text-[#1A1A1A] placeholder:text-[#B9B8CA] focus:outline-none focus:border-[#52B788] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[12px] font-[500] uppercase tracking-wider text-[#4A4A4A] mb-2">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E0DDD5] text-[14px] text-[#1A1A1A] focus:outline-none focus:border-[#52B788] transition-colors"
                required
              />
            </div>

            {passwordMsg && (
              <p className={`text-sm px-4 py-2 rounded-lg ${passwordMsg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-[13px] font-[400] rounded-lg hover:bg-red-700 transition-colors"
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
