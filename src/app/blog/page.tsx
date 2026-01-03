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
      const { data } = await blogService.getAll(true);
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>
          <div className="mb-24 text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-[0.2em] uppercase text-white">Journal</h1>
            <div className="w-px h-12 bg-gradient-to-b from-[#8a1c1c] to-transparent mx-auto mt-8 opacity-50" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-1 h-1 bg-[#8a1c1c] animate-pulse-slow" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#404040] font-light italic">The void is silent.</p>
            </div>
          ) : (
            <div className="space-y-24 max-w-4xl mx-auto relative px-4">

              {/* Timeline Thread */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#8a1c1c]/50 via-[#8a1c1c]/20 to-transparent dashed-thread hidden md:block" />

              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-8 md:gap-16 items-start ${index % 2 === 0 ? 'md:text-right md:flex-row-reverse' : 'md:text-left'}`}
                >
                  {/* Date Marker (Center) */}
                  <div className="absolute left-4 md:left-1/2 top-0 -translate-x-[5px] md:-translate-x-1/2 w-3 h-3 bg-[#050505] border border-[#8a1c1c] rotate-45 z-10 hidden md:block" />

                  {/* Content */}
                  <div className="flex-1 w-full group cursor-pointer">
                    <Link href={`/blog/${post.slug}`} className="block space-y-4">
                      <div className="overflow-hidden mb-4 relative aspect-[16/9] md:aspect-[21/9]">
                        {post.coverImageUrl && (
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] opacity-60 group-hover:opacity-100 scale-105 group-hover:scale-100"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs text-[#8a1c1c] tracking-[0.3em] font-mono">
                          {new Date(post.createdAt!).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light text-[#e5e5e5] group-hover:text-white transition-colors duration-500">
                          {post.title}
                        </h2>
                        <p className="text-[#8b7d7b] font-light leading-relaxed line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                          {post.excerpt || "No excerpt available for this sacred text..."}
                        </p>
                        <div className={`pt-4 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <span className="text-[10px] uppercase tracking-widest border-b border-[#8a1c1c] pb-1 text-[#e5e5e5]">Read Prophecy</span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Empty space for timeline balance */}
                  <div className="flex-1 hidden md:block" />
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
