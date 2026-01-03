'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { artworkService } from '../../../lib/supabase';
import type { Artwork } from '../../../types';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function ArtworkDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [artwork, setArtwork] = useState<Artwork | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadArtwork(params.id as string);
        }
    }, [params.id]);

    async function loadArtwork(id: string) {
        try {
            const { data } = await artworkService.getById(id);
            if (data) {
                setArtwork(data);
            } else {
                router.push('/portfolio');
            }
        } catch (error) {
            console.error('Error loading artwork:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
        );
    }

    if (!artwork) return null;

    return (
        <main className="min-h-screen bg-[#050505] text-[#e5e5e5] pt-32 pb-24">
            <div className="content-container max-w-6xl">

                {/* Back Navigation */}
                <Link href="/portfolio" className="inline-flex items-center gap-2 text-[#8b7d7b] hover:text-[#8a1c1c] transition-colors mb-12 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-[0.2em]">Return to Archive</span>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">

                    {/* Left: The Vizualisation (Museum Frame) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="w-full relative"
                    >
                        <div className="aspect-[3/4] md:aspect-[4/5] relative bg-[#0a0a0a] border-[16px] border-[#111] shadow-2xl">
                            {artwork.imageUrl ? (
                                <Image
                                    src={artwork.imageUrl}
                                    alt={artwork.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : <div className="w-full h-full bg-[#0a0a0a]" />}

                            {/* Lighting Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none mix-blend-overlay" />
                        </div>

                        {/* Shadow Reflection */}
                        <div className="absolute -bottom-16 left-8 right-8 h-4 bg-black/50 blur-2xl" />
                    </motion.div>


                    {/* Right: The Museum Label (Details) - CLEAN SANS SERIF */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col space-y-8 pt-8 md:pt-16"
                    >
                        {/* Header Info - NO ITALIC, NO CORMORANT */}
                        <div className="space-y-3 border-l-2 border-[#8a1c1c] pl-6">
                            <h1 className="text-3xl md:text-5xl font-light tracking-wide text-[#e5e5e5] uppercase">{artwork.title}</h1>
                            <p className="text-[#8b7d7b] text-xs tracking-[0.3em] uppercase">Martina Gorozo • {artwork.year || new Date().getFullYear()}</p>
                        </div>

                        {/* Technical Specs */}
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-[#1a1a1a]">
                            <div>
                                <span className="block text-[9px] uppercase tracking-widest text-[#404040] mb-1">Medium</span>
                                <span className="text-sm font-light text-[#e5e5e5]">{artwork.medium || 'Mixed Media'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] uppercase tracking-widest text-[#404040] mb-1">Dimensions</span>
                                <span className="text-sm font-light text-[#e5e5e5]">{artwork.dimensions || 'Variable'}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-invert">
                            <p className="text-[#8b7d7b] font-light leading-relaxed text-sm">{artwork.description || "A unique exploration of form and void, capturing the essence of the subconscious mind. This piece serves as a bridge between the seen and unseen, inviting the viewer to look inward."}</p>
                        </div>

                        {/* Acquisition */}
                        <div className="pt-8 mt-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-widest text-[#404040]">Valuation</span>
                                    <span className="text-2xl font-light text-[#8a1c1c]">${artwork.price || 50} USD</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[9px] uppercase tracking-widest ${artwork.available ? 'text-green-900/60' : 'text-red-900/60'}`}>
                                        {artwork.available ? 'Available' : 'Sold Out'}
                                    </span>
                                </div>
                            </div>

                            <button
                                disabled={!artwork.available}
                                className="w-full btn-ritual flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs py-4"
                            >
                                <ShoppingBag size={14} />
                                <span>{artwork.available ? 'Acquire Artwork' : 'Unavailable'}</span>
                            </button>
                        </div>

                    </motion.div>

                </div>
            </div>
        </main>
    );
}
