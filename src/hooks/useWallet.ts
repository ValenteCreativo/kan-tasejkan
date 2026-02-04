'use client';

import { usePrivy, useWallets, useFundWallet } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { formatAddress, isAdminEmail } from '../lib/crypto';

interface WalletState {
  isConnected: boolean;
  isLoading: boolean;
  address: string | null;
  formattedAddress: string | null;
  email: string | null;
  isAdmin: boolean;
  privyId: string | null;
}

export function useWallet() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const { fundWallet: privyFundWallet } = useFundWallet();

  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isLoading: true,
    address: null,
    formattedAddress: null,
    email: null,
    isAdmin: false,
    privyId: null,
  });

  // Sync wallet state when Privy state changes
  useEffect(() => {
    if (!ready) {
      setWalletState(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (!authenticated || !user) {
      setWalletState({
        isConnected: false,
        isLoading: false,
        address: null,
        formattedAddress: null,
        email: null,
        isAdmin: false,
        privyId: null,
      });
      return;
    }

    // Get email from linked accounts
    const emailAccount = user.linkedAccounts.find(
      (account) => account.type === 'email'
    );
    const email = emailAccount?.type === 'email' ? (emailAccount as { type: 'email'; address: string }).address : null;

    // Get wallet address - prefer embedded wallet, then external
    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    const externalWallet = wallets.find((w) => w.walletClientType !== 'privy');
    const primaryWallet = embeddedWallet || externalWallet;
    const address = primaryWallet?.address || null;

    setWalletState({
      isConnected: true,
      isLoading: false,
      address,
      formattedAddress: address ? formatAddress(address) : null,
      email,
      isAdmin: isAdminEmail(email),
      privyId: user.id,
    });

    // Sync with backend
    if (user.id) {
      syncUserWithBackend(user.id, address, email);
    }
  }, [ready, authenticated, user, wallets]);

  // Sync user data with our backend
  const syncUserWithBackend = async (
    privyId: string,
    walletAddress: string | null,
    email: string | null
  ) => {
    try {
      await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privyId, walletAddress, email }),
      });
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
    }
  };

  // Connect wallet (opens Privy modal)
  const connect = useCallback(() => {
    login();
  }, [login]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    await logout();
  }, [logout]);

  // Get the active wallet for signing transactions
  const getActiveWallet = useCallback(() => {
    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    const externalWallet = wallets.find((w) => w.walletClientType !== 'privy');
    return embeddedWallet || externalWallet || null;
  }, [wallets]);

  // Fund wallet (buy crypto with card) - only for embedded wallets
  const fundWallet = useCallback(() => {
    const embeddedWallet = wallets.find((w) => w.walletClientType === 'privy');
    if (embeddedWallet) {
      privyFundWallet({ address: embeddedWallet.address });
    }
  }, [wallets, privyFundWallet]);

  // Check if fund wallet is available (only for embedded wallets)
  const hasFundWallet = wallets.some((w) => w.walletClientType === 'privy');

  return {
    ...walletState,
    connect,
    disconnect,
    getActiveWallet,
    fundWallet: hasFundWallet ? fundWallet : null,
    wallets,
  };
}
