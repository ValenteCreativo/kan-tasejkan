'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/admin');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center sacred-minimal">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }} className="w-full max-w-md p-8">
        <div className="glass-minimal p-12 rounded-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-6">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-3xl font-light tracking-wider mb-2">
              {isSignup ? 'Create Account' : 'Welcome'}
            </h1>
            <p className="text-sm text-[#8b7d7b] font-light">
              {isSignup ? 'Join the sacred space' : 'Enter the studio'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" className="w-full px-4 py-3 bg-transparent minimal-border rounded text-sm
                focus:outline-none focus:border-[#8b7d7b]/30 transition-colors" />
            </div>
            <div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" className="w-full px-4 py-3 bg-transparent minimal-border rounded text-sm
                focus:outline-none focus:border-[#8b7d7b]/30 transition-colors" />
            </div>

            {error && (
              <div className="text-sm text-[#4a3434] text-center">{error}</div>
            )}

            <button type="submit" disabled={loading} className="w-full btn-elegant">
              {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-[#8b7d7b] subtle-accent font-light">
              {isSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
