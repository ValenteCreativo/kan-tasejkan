'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href = '/', label = 'Volver' }: BackButtonProps) {
  return (
    <div className="content-container pt-6">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm text-[#1B4332] hover:text-[#52B788] transition-colors font-[400]"
      >
        <ArrowLeft size={16} />
        <span>{label}</span>
      </Link>
    </div>
  );
}
