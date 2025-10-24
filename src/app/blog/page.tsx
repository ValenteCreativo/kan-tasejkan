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
          <div className="mb-16 text-center">
            <div className="flex justify-center gap-2 mb-8">
              <div className="sacred-dot animate-subtle-glow" />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
              <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-4 tracking-wider">Journal</h1>
            <p className="text-lg text-[#8b7d7b] font-light">
              Channeled writings from the sacred studio
            </p>
            <div className="divider my-8" />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="sacred-dot animate-subtle-glow" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#8b7d7b] font-light">No entries yet. The journey begins soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Link href={`/blog/${post.slug}`} className="block card-minimal overflow-hidden group">
                    {post.cover_image_url && (
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image src={post.cover_image_url} alt={post.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-xl font-light mb-3 group-hover:text-[#8b7d7b] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm font-light text-[#8b7d7b] line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="mt-4 text-xs elegant-text text-[#8b7d7b]/50">
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
