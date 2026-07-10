'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Facebook, Twitter, ArrowLeft } from 'lucide-react';
import { blogService } from '../../../lib/blog';
import type { BlogPost } from '../../../types';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      loadPost(params.slug as string);
    }
  }, [params.slug]);

  async function loadPost(slug: string) {
    try {
      const { data } = await blogService.getBySlug(slug);
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = post ? post.title : '';

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center" style={{ background: 'var(--white-warm)' }}>
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
        <div className="content-container text-center">
          <p className="text-[var(--muted)] font-light">Artículo no encontrado.</p>
          <Link href="/blog" className="text-sm text-[var(--accent)] mt-4 inline-block hover:underline">
            ← Volver al blog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <article className="content-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-light tracking-wider uppercase text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-8">
            <ArrowLeft size={14} />
            Volver al blog
          </Link>

          {post.coverImageUrl && (
            <div className="aspect-[21/9] relative overflow-hidden rounded-xl mb-10">
              <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extralight tracking-wide text-[var(--text-dark)] mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-between">
              <time className="text-xs font-light tracking-wider text-[var(--muted)]">
                {new Date(post.createdAt!).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <div className="flex gap-4">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors" aria-label="Compartir en Twitter">
                  <Twitter size={16} />
                </a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors" aria-label="Compartir en Facebook">
                  <Facebook size={16} />
                </a>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--muted)]/20 to-transparent my-8" />

          <div
            className="prose prose-neutral max-w-none prose-lg font-light leading-relaxed text-[var(--text-dark)]/80 prose-headings:font-light prose-headings:text-[var(--text-dark)] prose-a:text-[var(--accent)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </article>
    </main>
  );
}
