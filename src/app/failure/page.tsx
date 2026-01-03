'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function FailurePage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center text-[#e5e5e5]">
            <div className="text-center p-8 max-w-md">
                <div className="flex justify-center mb-6">
                    <XCircle size={64} className="text-red-500" />
                </div>
                <h1 className="text-3xl font-light uppercase tracking-widest mb-4">Payment Failed</h1>
                <p className="text-[#8b7d7b] mb-8 font-light">
                    There was an issue processing your payment. No charges were made.
                </p>
                <Link href="/" className="btn-ritual">
                    Return Home
                </Link>
            </div>
        </main>
    );
}
