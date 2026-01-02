'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Facebook, Twitter } from 'lucide-react';
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
      <main className="min-h-screen pt-32 flex items-center justify-center">
        <div className="sacred-dot animate-subtle-glow" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen pt-32 pb-16 sacred-minimal">
        <div className="content-container text-center">
          <p className="text-[#8b7d7b] font-light">Entry not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <article className="content-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {post.coverImageUrl && (
            <div className="aspect-[21/9] relative overflow-hidden rounded-lg mb-12">
              <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center justify-between">
              <time className="text-sm elegant-text text-[#8b7d7b]/50">
                {new Date(post.createdAt!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <div className="flex gap-4">
                <a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b7d7b] hover:text-white transition-colors"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b7d7b] hover:text-white transition-colors"
                >
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="divider my-8" />

          <div className="prose prose-invert max-w-none prose-lg">
            <div
              className="font-light leading-relaxed text-[#8b7d7b]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>
      </article>
    </main>
  );
}
