'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center text-[#e5e5e5]">
            <div className="text-center p-8 max-w-md">
                <div className="flex justify-center mb-6">
                    <CheckCircle size={64} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-light uppercase tracking-widest mb-4">Payment Successful</h1>
                <p className="text-[#8b7d7b] mb-8 font-light">
                    Your acquisition has been confirmed. We will reach out to you shortly via email to coordinate delivery or appointment details.
                </p>
                <Link href="/" className="btn-ritual">
                    Return Home
                </Link>
            </div>
        </main>
    );
}
