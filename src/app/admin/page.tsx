'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { artworkService } from '../../lib/services';
import { blogService } from '../../lib/blog';
import ArtworkForm from '../../components/admin/ArtworkForm';
import ArtworkList from '../../components/admin/ArtworkList';
import SalesDashboard from '../../components/admin/SalesDashboard';
import { WHITELISTED_EMAIL } from '../../lib/constants';
import type { Artwork, ArtworkFormData, BlogPost, User } from '../../types';

export default function AdminPage() {
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<'artworks' | 'tattoos' | 'blog' | 'sales'>('artworks');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(storedUser) as User & { walletAddress?: string };
    if (!parsed.isAdmin || parsed.email.toLowerCase() !== WHITELISTED_EMAIL.toLowerCase()) {
      router.push('/login');
      return;
    }
    setUser(parsed);
    loadData();
  }, [router]);

  async function loadData() {
    try {
      const [artworksRes, blogsRes] = await Promise.all([
        artworkService.getAll(),
        blogService.getAll(),
      ]);
      setArtworks(artworksRes.data || []);
      setBlogs(blogsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleArtworkSubmit(formData: ArtworkFormData, file: File | null) {
    if (!file) {
      alert('Please select an image');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await artworkService.uploadImage(file, fileName);
      if (uploadError) throw uploadError;

      const imageUrl = uploadData?.publicUrl || '';

      const { error } = await artworkService.create({
        ...formData,
        price: formData.price?.toString(),
        imageUrl,
        thumbnailUrl: imageUrl,
        orderIndex: artworks.length,
      });

      if (error) throw error;
      alert('Artwork added successfully!');
      loadData();
    } catch (error) {
      console.error('Error adding artwork:', error);
      alert('Error adding artwork. Please try again.');
    }
  }

  async function handleArtworkDelete(id: string) {
    try {
      const { error } = await artworkService.delete(id);
      if (error) throw error;
      alert('Artwork deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Error deleting artwork. Please try again.');
    }
  }

  async function handleBlogDelete(id: string) {
    try {
      const { error } = await blogService.delete(id);
      if (error) throw error;
      alert('Blog post deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post. Please try again.');
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/login');
  }

  if (loading || !user) {
    return (
      <main className="min-h-screen pt-32 flex items-center justify-center sacred-minimal">
        <div className="sacred-dot animate-subtle-glow" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 sacred-minimal">
      <div className="content-container max-w-7xl">
        <div className="mb-12">
          <div className="flex justify-center gap-2 mb-8">
            <div className="sacred-dot animate-subtle-glow" />
            <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '1s' }} />
            <div className="sacred-dot animate-subtle-glow" style={{ animationDelay: '2s' }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-2 text-center tracking-wider">Studio</h1>
          <p className="text-center text-[#8b7d7b] font-light mb-4">Welcome back, {user.email}</p>
          <div className="text-center">
            <button onClick={handleLogout} className="text-xs elegant-text subtle-accent">
              Sign Out
            </button>
          </div>
          <div className="divider my-8" />
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setTab('artworks')}
            className={`px-6 py-2 elegant-text text-xs transition-all duration-300 rounded ${tab === 'artworks'
              ? 'minimal-border bg-[#8b7d7b]/10'
              : 'border border-transparent hover:border-[#8b7d7b]/20'
              }`}
          >
            Artworks
          </button>
          <button
            onClick={() => setTab('tattoos')}
            className={`px-6 py-2 elegant-text text-xs transition-all duration-300 rounded ${tab === 'tattoos'
              ? 'minimal-border bg-[#8b7d7b]/10'
              : 'border border-transparent hover:border-[#8b7d7b]/20'
              }`}
          >
            Tattoos
          </button>
          <button
            onClick={() => setTab('blog')}
            className={`px-6 py-2 elegant-text text-xs transition-all duration-300 rounded ${tab === 'blog'
              ? 'minimal-border bg-[#8b7d7b]/10'
              : 'border border-transparent hover:border-[#8b7d7b]/20'
              }`}
          >
            Journal
          </button>
          <button
            onClick={() => setTab('sales')}
            className={`px-6 py-2 elegant-text text-xs transition-all duration-300 rounded ${tab === 'sales'
              ? 'minimal-border bg-[#8b7d7b]/10'
              : 'border border-transparent hover:border-[#8b7d7b]/20'
              }`}
          >
            Sales
          </button>
        </div>

        {tab === 'artworks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-minimal p-6 rounded-lg sticky top-24">
                <h2 className="elegant-text text-sm mb-6">Add New Artwork</h2>
                <ArtworkForm onSubmit={handleArtworkSubmit} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="elegant-text text-sm mb-6">Your Collection</h2>
              <ArtworkList
                artworks={artworks.filter(a => a.category !== 'tattoo')}
                onDelete={handleArtworkDelete}
              />
            </div>
          </div>
        )}

        {tab === 'tattoos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-minimal p-6 rounded-lg sticky top-24">
                <h2 className="elegant-text text-sm mb-6">Add New Tattoo</h2>
                <ArtworkForm onSubmit={handleArtworkSubmit} defaultCategory="tattoo" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="elegant-text text-sm mb-6">Tattoo Works</h2>
              <ArtworkList
                artworks={artworks.filter(a => a.category === 'tattoo')}
                onDelete={handleArtworkDelete}
              />
            </div>
          </div>
        )}

        {tab === 'blog' && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <Link href="/admin/blog/new" className="btn-elegant">
                Create New Post
              </Link>
            </div>
            <div className="space-y-4">
              {blogs.length === 0 ? (
                <div className="text-center py-12 glass-minimal rounded-lg">
                  <p className="text-[#8b7d7b] font-light">
                    No journal entries yet. Create your first post.
                  </p>
                </div>
              ) : (
                blogs.map((post) => (
                  <div
                    key={post.id}
                    className="glass-minimal p-6 rounded-lg flex items-center justify-between hover-lift"
                  >
                    <div>
                      <h3 className="text-lg font-light mb-1">{post.title}</h3>
                      <p className="text-sm text-[#8b7d7b] font-light">
                        {post.published ? 'Published' : 'Draft'} ·{' '}
                        {new Date(post.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/admin/blog/${post.id}`} className="btn-elegant text-xs px-4 py-2">
                        Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm('Delete this post?')) handleBlogDelete(post.id);
                        }}
                        className="px-4 py-2 border border-[#4a3434] text-[#4a3434] hover:bg-[#4a3434]/10 rounded elegant-text text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'sales' && (
          <div className="max-w-6xl mx-auto">
            <SalesDashboard adminEmail={user.email} />
          </div>
        )}
      </div>
    </main>
  );
}
