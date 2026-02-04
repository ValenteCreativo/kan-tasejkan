'use client';

import dynamic from 'next/dynamic';

// Check if Privy is configured
const PRIVY_ENABLED = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

// Dynamically import ConnectWallet only when Privy is available
const ConnectWallet = dynamic(() => import('./ConnectWallet'), {
  ssr: false,
  loading: () => null,
});

interface ConnectWalletWrapperProps {
  className?: string;
  compact?: boolean;
}

export default function ConnectWalletWrapper(props: ConnectWalletWrapperProps) {
  // Don't render anything if Privy is not configured
  if (!PRIVY_ENABLED) {
    return null;
  }

  return <ConnectWallet {...props} />;
}
