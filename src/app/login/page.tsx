'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { WHITELISTED_EMAIL, DEFAULT_ADMIN_PASSWORD } from '../../lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simple admin check — verifies email + password
    if (email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      setError('Acceso no autorizado.');
      setLoading(false);
      return;
    }

    // Check password (uses stored password from localStorage, or default)
    const storedPassword = localStorage.getItem('admin_password') || DEFAULT_ADMIN_PASSWORD;
    if (password !== storedPassword) {
      setError('Contraseña incorrecta.');
      setLoading(false);
      return;
    }
    localStorage.setItem(
      'user',
      JSON.stringify({ email, isAdmin: true })
    );
    router.push('/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--white-warm)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8"
      >
        <div className="glass-minimal p-12">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-6">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-2xl font-extralight tracking-[0.3em] uppercase mb-2 text-[var(--text-dark)]">
              Admin
            </h1>
            <p className="text-sm text-[var(--muted)] font-light">
              Panel de administración Mindfulverso
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 text-center mb-4 p-2 rounded bg-red-50">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@mindfulverso.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-light tracking-wider uppercase text-[var(--muted)] mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-mindful-filled mt-6"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
