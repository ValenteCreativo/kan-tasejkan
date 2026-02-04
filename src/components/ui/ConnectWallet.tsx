'use client';

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { getAddressExplorerUrl, DEFAULT_CHAIN_ID } from '../../lib/crypto';
import { Wallet, LogOut, ExternalLink, Copy, Check, ChevronDown, Send, Plus } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for SendModal to avoid SSR issues
const SendModal = dynamic(() => import('../wallet/SendModal'), { ssr: false });

interface ConnectWalletProps {
  className?: string;
  compact?: boolean;
}

export default function ConnectWallet({ className = '', compact = false }: ConnectWalletProps) {
  const { isConnected, isLoading, formattedAddress, address, isAdmin, connect, disconnect, fundWallet } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnExplorer = () => {
    if (address) {
      window.open(getAddressExplorerUrl(DEFAULT_CHAIN_ID, address), '_blank');
    }
  };

  const handleFundWallet = () => {
    if (fundWallet) {
      fundWallet();
    }
    setIsOpen(false);
  };

  const handleSend = () => {
    setShowSendModal(true);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-4 py-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-[#8a1c1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className={`
          flex items-center gap-2 px-4 py-2
          border border-[#1a1a1a] hover:border-[#8a1c1c]
          bg-transparent hover:bg-[#8a1c1c]/10
          text-[#e5e5e5] text-sm font-cinzel
          transition-all duration-300
          ${className}
        `}
      >
        <Wallet className="w-4 h-4" />
        {!compact && <span>Connect</span>}
      </button>
    );
  }

  return (
    <>
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center gap-2 px-4 py-2
            border border-[#1a1a1a] hover:border-[#8a1c1c]
            bg-transparent hover:bg-[#8a1c1c]/10
            text-[#e5e5e5] text-sm font-cinzel
            transition-all duration-300
            ${isAdmin ? 'border-[#8a1c1c]/50' : ''}
          `}
        >
          <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-[#8a1c1c]' : 'bg-green-500'}`} />
          <span>{formattedAddress}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-[#1a1a1a] shadow-xl z-50">
            {isAdmin && (
              <div className="px-4 py-2 border-b border-[#1a1a1a]">
                <span className="text-xs text-[#8a1c1c] font-cinzel">ADMIN</span>
              </div>
            )}

            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </button>

            <button
              onClick={handleViewOnExplorer}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </button>

            <div className="border-t border-[#1a1a1a]">
              <button
                onClick={handleSend}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>

              {fundWallet && (
                <button
                  onClick={handleFundWallet}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Funds</span>
                </button>
              )}
            </div>

            <div className="border-t border-[#1a1a1a]">
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-[#8a1c1c] hover:bg-[#1a1a1a] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Send Modal */}
      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} />
    </>
  );
}
