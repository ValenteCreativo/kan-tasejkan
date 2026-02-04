'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ExternalLink, Wallet } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const paymentType = searchParams.get('type');
    const orderId = searchParams.get('orderId');
    const txHash = searchParams.get('txHash');
    const chainId = searchParams.get('chainId');

    const isCrypto = paymentType === 'crypto';

    // Get block explorer URL
    const getExplorerUrl = (hash: string, chain: string | null) => {
        const explorers: Record<string, string> = {
            '1': 'https://etherscan.io',
            '8453': 'https://basescan.org',
            '137': 'https://polygonscan.com',
            '42161': 'https://arbiscan.io',
            '84532': 'https://sepolia.basescan.org',
            '11155111': 'https://sepolia.etherscan.io',
        };
        const explorer = explorers[chain || '8453'] || 'https://basescan.org';
        return `${explorer}/tx/${hash}`;
    };

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center text-[#e5e5e5] pt-24">
            <div className="text-center p-8 max-w-md">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={64} className="text-green-500" />
                </div>

                <h1 className="text-3xl font-light uppercase tracking-widest mb-4">
                    {isCrypto ? 'Payment Confirmed' : 'Payment Successful'}
                </h1>

                {isCrypto ? (
                    <div className="space-y-6">
                        <p className="text-[#8b7d7b] font-light">
                            Your crypto payment has been verified on-chain. Martina will contact you soon to arrange shipping for your new artwork.
                        </p>

                        {txHash && (
                            <div className="p-4 border border-[#1a1a1a] bg-[#0a0a0a] text-left">
                                <div className="text-[9px] uppercase tracking-widest text-[#404040] mb-2">
                                    Transaction Hash
                                </div>
                                <a
                                    href={getExplorerUrl(txHash, chainId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#8a1c1c] hover:underline text-sm break-all"
                                >
                                    <span>{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        )}

                        {orderId && (
                            <div className="p-4 border border-[#1a1a1a] bg-[#0a0a0a] text-left">
                                <div className="text-[9px] uppercase tracking-widest text-[#404040] mb-2">
                                    Order Reference
                                </div>
                                <span className="text-sm text-[#e5e5e5] font-mono">
                                    {orderId.slice(0, 8)}...
                                </span>
                            </div>
                        )}

                        <div className="p-4 border border-[#8a1c1c]/30 bg-[#8a1c1c]/5">
                            <div className="flex items-center gap-2 text-[#8a1c1c] mb-2">
                                <Wallet size={16} />
                                <span className="text-xs uppercase tracking-wider">NFT Certificate</span>
                            </div>
                            <p className="text-xs text-[#8b7d7b]">
                                Your certificate of authenticity NFT will be minted and sent to your wallet within 24-48 hours.
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-[#8b7d7b] mb-8 font-light">
                        Your acquisition has been confirmed. We will reach out to you shortly via email to coordinate delivery or appointment details.
                    </p>
                )}

                <div className="mt-8 flex flex-col gap-3">
                    <Link href="/portfolio" className="btn-ritual">
                        Continue Exploring
                    </Link>
                    <Link href="/" className="text-xs text-[#606060] hover:text-[#e5e5e5] transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse" />
            </main>
        }>
            <SuccessContent />
        </Suspense>
    );
}
