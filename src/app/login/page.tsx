'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '../../hooks/useWallet';
import { WHITELISTED_EMAIL } from '../../lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { address, isLoading: walletLoading } = useWallet();

  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // When Privy session is ready/authenticated, verify whitelist and persist admin flag
  useEffect(() => {
    const verify = async () => {
      if (!ready || !authenticated || !user) return;
      setIsChecking(true);
      setError(null);

      const emailAccount = user.linkedAccounts.find((account) => account.type === 'email');
      const email =
        emailAccount?.type === 'email'
          ? (emailAccount as { type: 'email'; address: string }).address
          : null;

      if (!email || email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
        setError('Solo el correo whitelisted puede acceder al panel.');
        await logout();
        setIsChecking(false);
        return;
      }

      if (!address && !walletLoading) {
        setError('Conecta o crea un wallet en Privy para continuar.');
        setIsChecking(false);
        return;
      }

      localStorage.setItem(
        'user',
        JSON.stringify({
          email,
          isAdmin: true,
          walletAddress: address,
        })
      );
      router.push('/admin');
    };

    verify();
  }, [ready, authenticated, user, address, walletLoading, logout, router]);

  const handleLogin = async () => {
    setError(null);
    await login();
  };

  return (
    <main className="min-h-screen flex items-center justify-center sacred-minimal">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-8"
      >
        <div className="glass-minimal p-12 rounded-lg">
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-6">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-3xl font-light tracking-wider mb-2">Acceso admin</h1>
            <p className="text-sm text-[#8b7d7b] font-light">
              Inicia con Privy usando el correo whitelisted.
            </p>
          </div>

          {error && <div className="text-sm text-[#4a3434] text-center mb-4">{error}</div>}

          <button
            onClick={handleLogin}
            disabled={!ready || walletLoading || isChecking}
            className="w-full btn-elegant"
          >
            {!ready || isChecking ? 'Verificando...' : authenticated ? 'Entrar' : 'Sign in with Privy'}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
