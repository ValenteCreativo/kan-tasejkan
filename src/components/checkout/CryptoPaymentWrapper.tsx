'use client';

import dynamic from 'next/dynamic';
import type { TokenType } from './PaymentSelector';

// Check if Privy is configured
const PRIVY_ENABLED = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

// Dynamically import CryptoPayment only when Privy is available
const CryptoPayment = dynamic(() => import('./CryptoPayment'), {
  ssr: false,
  loading: () => (
    <div className="p-8 border border-[#1a1a1a] text-center">
      <div className="w-6 h-6 border-2 border-[#8a1c1c] border-t-transparent rounded-full animate-spin mx-auto" />
    </div>
  ),
});

interface CryptoPaymentWrapperProps {
  artworkId: string;
  artworkTitle: string;
  amountUsd: number;
  chainId: number;
  token: TokenType;
  recipientAddress: string;
  onSuccess: (txHash: string, orderId: string) => void;
  onError: (error: string) => void;
}

export default function CryptoPaymentWrapper(props: CryptoPaymentWrapperProps) {
  // Don't render if Privy is not configured
  if (!PRIVY_ENABLED) {
    return (
      <div className="p-4 border border-red-900/50 bg-red-900/10 text-center">
        <p className="text-sm text-red-400">
          Crypto payments are not configured. Please use card payment.
        </p>
      </div>
    );
  }

  return <CryptoPayment {...props} />;
}
