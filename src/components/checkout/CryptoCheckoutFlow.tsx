'use client';

import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import {
  getTokenAddress,
  getTxExplorerUrl,
  parseStablecoinAmount,
  ERC20_ABI,
  CHAIN_NAMES,
} from '../../lib/crypto';
import { encodeFunctionData, createPublicClient, http } from 'viem';
import { base, polygon, arbitrum, mainnet, baseSepolia, sepolia } from 'viem/chains';
import { Loader2, ExternalLink, CheckCircle, AlertCircle, Wallet } from 'lucide-react';
import type { TokenType } from './PaymentSelector';

const CHAIN_CONFIG = {
  1: mainnet,
  8453: base,
  137: polygon,
  42161: arbitrum,
  84532: baseSepolia,
  11155111: sepolia,
} as const;

interface CryptoCheckoutFlowProps {
  artworkId: string;
  artworkTitle: string;
  amountUsd: number;
  chainId: number;
  token: TokenType;
  onSuccess: (txHash: string, orderId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

type PaymentStatus = 'idle' | 'connecting' | 'creating-order' | 'awaiting-signature' | 'pending' | 'confirming' | 'success' | 'error';

export default function CryptoCheckoutFlow({
  artworkId,
  artworkTitle,
  amountUsd,
  chainId,
  token,
  onSuccess,
  onError,
  onBack,
}: CryptoCheckoutFlowProps) {
  const { isConnected, address, connect, getActiveWallet } = useWallet();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tokenAddress = getTokenAddress(chainId, token);
  const chainConfig = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];

  const createOrder = async () => {
    const response = await fetch('/api/checkout-crypto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artworkId,
        chainId,
        tokenAddress,
        amountUsd,
        buyerAddress: address,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create order');
    }

    return response.json();
  };

  const executePayment = async () => {
    if (!isConnected || !address) {
      setStatus('connecting');
      connect();
      return;
    }

    if (!tokenAddress) {
      setError(`${token} not available on ${CHAIN_NAMES[chainId]}`);
      setStatus('error');
      return;
    }

    try {
      setError(null);
      setStatus('creating-order');

      // Create order in backend
      const orderData = await createOrder();
      setOrderId(orderData.orderId);

      const recipientAddress = orderData.recipientAddress;
      if (!recipientAddress) {
        throw new Error('Recipient wallet not configured');
      }

      setStatus('awaiting-signature');

      // Get active wallet
      const wallet = getActiveWallet();
      if (!wallet) {
        throw new Error('No wallet connected. Please reconnect your wallet.');
      }

      // Switch to correct chain if needed
      try {
        await wallet.switchChain(chainId);
      } catch (switchError: any) {
        console.error('Chain switch error:', switchError);
        throw new Error(`Please switch to ${CHAIN_NAMES[chainId]} in your wallet`);
      }

      // Get provider from wallet
      const provider = await wallet.getEthereumProvider();

      // Encode transfer data
      const amount = parseStablecoinAmount(amountUsd);
      const data = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amount],
      });

      // Send transaction
      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenAddress,
          data,
        }],
      });

      setTxHash(hash as string);
      setStatus('pending');

      // Wait for confirmation
      setStatus('confirming');

      const publicClient = createPublicClient({
        chain: chainConfig,
        transport: http(),
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash as `0x${string}`,
        confirmations: 1,
      });

      if (receipt.status === 'success') {
        // Verify transaction on backend
        await fetch('/api/verify-tx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderData.orderId,
            txHash: hash,
            chainId,
          }),
        });

        setStatus('success');
        onSuccess(hash as string, orderData.orderId);
      } else {
        throw new Error('Transaction failed on blockchain');
      }
    } catch (err: any) {
      console.error('Payment error:', err);

      // Better error messages
      let errorMessage = 'Payment failed';
      if (err?.message) {
        if (err.message.includes('rejected')) {
          errorMessage = 'Transaction rejected by user';
        } else if (err.message.includes('insufficient')) {
          errorMessage = `Insufficient ${token} balance`;
        } else if (err.message.includes('gas')) {
          errorMessage = 'Insufficient gas for transaction';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setStatus('error');
      onError(errorMessage);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'connecting':
        return 'Connecting wallet...';
      case 'creating-order':
        return 'Creating order...';
      case 'awaiting-signature':
        return 'Please confirm the transaction in your wallet';
      case 'pending':
        return 'Transaction submitted, waiting for confirmation...';
      case 'confirming':
        return 'Confirming transaction on blockchain...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return error || 'Payment failed';
      default:
        return null;
    }
  };

  const isProcessing = ['connecting', 'creating-order', 'awaiting-signature', 'pending', 'confirming'].includes(status);

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="p-4 border border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="text-xs text-[#606060] uppercase tracking-wider mb-2">
          Payment Details
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#808080]">Artwork</span>
            <span className="text-[#e5e5e5]">{artworkTitle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#808080]">Network</span>
            <span className="text-[#e5e5e5]">{CHAIN_NAMES[chainId]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#808080]">Amount</span>
            <span className="text-[#e5e5e5] font-medium">{amountUsd.toFixed(2)} {token}</span>
          </div>
          {address && (
            <div className="flex justify-between text-sm pt-2 border-t border-[#1a1a1a]">
              <span className="text-[#808080]">Your Wallet</span>
              <span className="text-[#8a1c1c] font-mono text-xs">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Status Display */}
      {status !== 'idle' && status !== 'success' && (
        <div className={`
          p-4 border flex items-center gap-3
          ${status === 'error' ? 'border-red-900/50 bg-red-900/10' : 'border-[#8a1c1c]/50 bg-[#8a1c1c]/10'}
        `}>
          {isProcessing && <Loader2 className="w-5 h-5 text-[#8a1c1c] animate-spin" />}
          {status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-[#e5e5e5]'}`}>
            {getStatusMessage()}
          </span>
        </div>
      )}

      {/* Success State */}
      {status === 'success' && txHash && (
        <div className="p-4 border border-green-900/50 bg-green-900/10">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-400">Payment successful!</span>
          </div>
          <a
            href={getTxExplorerUrl(chainId, txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#8a1c1c] hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            View transaction on explorer
          </a>
        </div>
      )}

      {/* Action Button */}
      {status !== 'success' && (
        <button
          onClick={executePayment}
          disabled={isProcessing}
          className={`
            w-full py-4 flex items-center justify-center gap-2
            border border-[#8a1c1c] bg-[#8a1c1c]/10
            text-[#e5e5e5] uppercase tracking-wider text-sm
            transition-all duration-300
            ${isProcessing
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#8a1c1c]/20 cursor-pointer'}
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet to Pay
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              Pay {amountUsd.toFixed(2)} {token}
            </>
          )}
        </button>
      )}

      {/* Back Button */}
      {status !== 'success' && (
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="w-full text-xs text-[#606060] hover:text-[#e5e5e5] transition-colors disabled:opacity-50"
        >
          ← Back to payment options
        </button>
      )}

      {/* Error Retry */}
      {status === 'error' && (
        <button
          onClick={() => {
            setStatus('idle');
            setError(null);
          }}
          className="w-full py-2 text-xs text-[#8a1c1c] hover:text-[#e5e5e5] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
