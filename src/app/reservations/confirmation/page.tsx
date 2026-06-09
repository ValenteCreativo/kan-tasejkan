'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function ReservationConfirmationPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center text-[#e5e5e5] pt-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center p-8 max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full border border-[#8a1c1c]/40 flex items-center justify-center">
                        <CheckCircle size={36} className="text-[#8a1c1c]" />
                    </div>
                </div>

                <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#8a1c1c] to-transparent mx-auto mb-8 opacity-50" />

                <h1 className="text-3xl font-light uppercase tracking-widest mb-4 text-[#e5e5e5]">
                    Request Received
                </h1>

                <p className="text-[#c8bfba] mb-4 font-light leading-relaxed">
                    Thank you for reaching out. Martina will review your request and get back to you within 2–3 business days.
                </p>

                <p className="text-[#9a9a9a] text-sm font-light">
                    Check your email for confirmation.
                </p>

                <div className="mt-12 flex flex-col gap-3">
                    <Link href="/portfolio" className="btn-ritual">
                        Explore Portfolio
                    </Link>
                    <Link href="/" className="text-xs text-[#606060] hover:text-[#e5e5e5] transition-colors">
                        Return Home
                    </Link>
                </div>
            </motion.div>
        </main>
    );
}
