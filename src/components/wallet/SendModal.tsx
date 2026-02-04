'use client';

import { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import {
    CHAIN_NAMES,
    SUPPORTED_CHAIN_IDS,
    DEFAULT_CHAIN_ID,
    getTokenAddress,
    parseStablecoinAmount,
    getTxExplorerUrl,
    ERC20_ABI,
} from '../../lib/crypto';
import { encodeFunctionData, createPublicClient, http, parseEther, formatEther } from 'viem';
import { base, polygon, arbitrum, mainnet, baseSepolia, sepolia } from 'viem/chains';
import { X, Loader2, ExternalLink, CheckCircle, AlertCircle, Send, Wallet } from 'lucide-react';

const CHAIN_CONFIG = {
    1: mainnet,
    8453: base,
    137: polygon,
    42161: arbitrum,
    84532: baseSepolia,
    11155111: sepolia,
} as const;

type TokenOption = 'ETH' | 'USDC' | 'USDT';

interface SendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SendModal({ isOpen, onClose }: SendModalProps) {
    const { address, getActiveWallet } = useWallet();
    const [selectedChain, setSelectedChain] = useState(DEFAULT_CHAIN_ID);
    const [selectedToken, setSelectedToken] = useState<TokenOption>('ETH');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'confirming' | 'success' | 'error'>('idle');
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const isValidAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);
    const isValidAmount = (amt: string) => !isNaN(parseFloat(amt)) && parseFloat(amt) > 0;

    const handleSend = async () => {
        if (!address || !recipientAddress || !amount) return;

        if (!isValidAddress(recipientAddress)) {
            setError('Invalid recipient address');
            return;
        }

        if (!isValidAmount(amount)) {
            setError('Invalid amount');
            return;
        }

        try {
            setError(null);
            setStatus('sending');

            const wallet = getActiveWallet();
            if (!wallet) {
                throw new Error('No wallet connected');
            }

            // Switch chain if needed
            await wallet.switchChain(selectedChain);
            const provider = await wallet.getEthereumProvider();

            let hash: string;

            if (selectedToken === 'ETH') {
                // Send native ETH
                hash = await provider.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: address,
                        to: recipientAddress,
                        value: `0x${parseEther(amount).toString(16)}`,
                    }],
                }) as string;
            } else {
                // Send ERC20 token (USDC/USDT)
                const tokenAddress = getTokenAddress(selectedChain, selectedToken as 'USDC' | 'USDT');
                if (!tokenAddress) {
                    throw new Error(`${selectedToken} not available on ${CHAIN_NAMES[selectedChain]}`);
                }

                const tokenAmount = parseStablecoinAmount(parseFloat(amount));
                const data = encodeFunctionData({
                    abi: ERC20_ABI,
                    functionName: 'transfer',
                    args: [recipientAddress as `0x${string}`, tokenAmount],
                });

                hash = await provider.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: address,
                        to: tokenAddress,
                        data,
                    }],
                }) as string;
            }

            setTxHash(hash);
            setStatus('confirming');

            // Wait for confirmation
            const chainConfig = CHAIN_CONFIG[selectedChain as keyof typeof CHAIN_CONFIG];
            const publicClient = createPublicClient({
                chain: chainConfig,
                transport: http(),
            });

            await publicClient.waitForTransactionReceipt({
                hash: hash as `0x${string}`,
                confirmations: 1,
            });

            setStatus('success');
        } catch (err: any) {
            console.error('Send error:', err);
            let errorMessage = 'Transaction failed';
            if (err?.message?.includes('rejected')) {
                errorMessage = 'Transaction rejected';
            } else if (err?.message?.includes('insufficient')) {
                errorMessage = 'Insufficient balance';
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            setStatus('error');
        }
    };

    const resetForm = () => {
        setRecipientAddress('');
        setAmount('');
        setStatus('idle');
        setTxHash(null);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
                    <h2 className="text-sm uppercase tracking-widest text-[#e5e5e5]">Send Funds</h2>
                    <button
                        onClick={handleClose}
                        className="text-[#606060] hover:text-[#e5e5e5] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {status === 'success' && txHash ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                            <p className="text-[#e5e5e5]">Transaction Successful!</p>
                            <a
                                href={getTxExplorerUrl(selectedChain, txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm text-[#8a1c1c] hover:underline"
                            >
                                <ExternalLink size={14} />
                                View on Explorer
                            </a>
                            <button
                                onClick={handleClose}
                                className="w-full py-3 border border-[#1a1a1a] text-[#e5e5e5] hover:bg-[#1a1a1a] transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Network Selection */}
                            <div>
                                <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                                    Network
                                </label>
                                <select
                                    value={selectedChain}
                                    onChange={(e) => setSelectedChain(Number(e.target.value))}
                                    disabled={status !== 'idle'}
                                    className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-[#e5e5e5] text-sm focus:border-[#8a1c1c] outline-none"
                                >
                                    {SUPPORTED_CHAIN_IDS.map((chainId) => (
                                        <option key={chainId} value={chainId}>
                                            {CHAIN_NAMES[chainId]}
                                        </option>
                                    ))}
                                    <option value={84532}>Base Sepolia (Testnet)</option>
                                    <option value={11155111}>Sepolia (Testnet)</option>
                                </select>
                            </div>

                            {/* Token Selection */}
                            <div>
                                <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                                    Token
                                </label>
                                <div className="flex gap-2">
                                    {(['ETH', 'USDC', 'USDT'] as TokenOption[]).map((token) => (
                                        <button
                                            key={token}
                                            onClick={() => setSelectedToken(token)}
                                            disabled={status !== 'idle'}
                                            className={`
                                                flex-1 py-2 text-sm border transition-colors
                                                ${selectedToken === token
                                                    ? 'border-[#8a1c1c] bg-[#8a1c1c]/20 text-[#e5e5e5]'
                                                    : 'border-[#1a1a1a] text-[#606060] hover:text-[#e5e5e5]'
                                                }
                                                disabled:opacity-50
                                            `}
                                        >
                                            {token}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Recipient Address */}
                            <div>
                                <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="0x..."
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    disabled={status !== 'idle'}
                                    className="w-full bg-[#050505] border border-[#1a1a1a] p-3 text-[#e5e5e5] text-sm placeholder-[#404040] focus:border-[#8a1c1c] outline-none font-mono"
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-xs text-[#606060] uppercase tracking-wider mb-2">
                                    Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.000001"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={status !== 'idle'}
                                        className="w-full bg-[#050505] border border-[#1a1a1a] p-3 pr-16 text-[#e5e5e5] text-sm placeholder-[#404040] focus:border-[#8a1c1c] outline-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] text-sm">
                                        {selectedToken}
                                    </span>
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 border border-red-900/50 bg-red-900/10">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-red-400">{error}</span>
                                </div>
                            )}

                            {/* Status Display */}
                            {status !== 'idle' && status !== 'error' && (
                                <div className="flex items-center gap-2 p-3 border border-[#8a1c1c]/50 bg-[#8a1c1c]/10">
                                    <Loader2 className="w-4 h-4 text-[#8a1c1c] animate-spin" />
                                    <span className="text-sm text-[#e5e5e5]">
                                        {status === 'sending' ? 'Waiting for confirmation...' : 'Confirming on blockchain...'}
                                    </span>
                                </div>
                            )}

                            {/* Send Button */}
                            <button
                                onClick={handleSend}
                                disabled={status !== 'idle' || !recipientAddress || !amount}
                                className={`
                                    w-full py-4 flex items-center justify-center gap-2
                                    border border-[#8a1c1c] bg-[#8a1c1c]/10
                                    text-[#e5e5e5] uppercase tracking-wider text-sm
                                    transition-all duration-300
                                    ${status !== 'idle' || !recipientAddress || !amount
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'hover:bg-[#8a1c1c]/20 cursor-pointer'
                                    }
                                `}
                            >
                                {status !== 'idle' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send {selectedToken}
                                    </>
                                )}
                            </button>

                            {/* Retry on Error */}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
