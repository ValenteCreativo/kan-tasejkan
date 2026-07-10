'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { blogService } from '../../lib/blog';
import type { BlogPost } from '../../types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const { data, error } = await blogService.getAll(true);
      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-20" style={{ background: 'var(--white-warm)' }}>
      <div className="content-container max-w-4xl">

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-xs font-light tracking-[0.3em] uppercase text-[var(--muted)] mb-3">
              Reflexiones
            </p>
            <h1 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] uppercase text-[var(--text-dark)] mb-4">
              Blog
            </h1>
            <p className="text-sm font-light text-[var(--muted)] max-w-lg mx-auto">
              Artículos, reflexiones y herramientas para tu camino de bienestar.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted)] font-light">Próximamente compartiremos contenido aquí.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-full md:w-40 h-40 relative overflow-hidden rounded-lg bg-[var(--accent)]/5">
                      {post.coverImageUrl ? (
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[var(--accent)] opacity-40" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] text-[var(--accent)] tracking-widest uppercase font-medium">
                          {new Date(post.createdAt!).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>

                      <h2 className="text-xl font-light tracking-wide text-[var(--text-dark)] group-hover:text-[var(--accent)] transition-colors mb-2">
                        {post.title}
                      </h2>

                      <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 font-light">
                        {post.excerpt || 'Leer artículo completo...'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
