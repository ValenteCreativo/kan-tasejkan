'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { base, polygon, arbitrum, mainnet, baseSepolia, sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // If Privy is not configured, render children without Privy wrapper
  // This allows the site to work in dev without Privy credentials
  if (!PRIVY_APP_ID) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: 'dark',
            accentColor: '#8a1c1c',
            logo: '/logo.png',
          },
          loginMethods: ['email', 'wallet'],
          embeddedWallets: {
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
          supportedChains: [base, polygon, arbitrum, mainnet, baseSepolia, sepolia],
          defaultChain: base,
        }}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
