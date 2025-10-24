'use client';

import { useEffect, useState } from 'react';
import { artworkService } from '../../lib/supabase';
import ArtworkForm from '../../components/admin/ArtworkForm';
import ArtworkList from '../../components/admin/ArtworkList';
import FlowerOfLife from '../../components/sacred-geometry/FlowerOfLife';
import type { Artwork, ArtworkFormData } from '../../types';

export default function AdminPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      const { data, error } = await artworkService.getAll();
      if (error) throw error;
      setArtworks(data || []);
    } catch (error) {
      console.error('Error loading artworks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: ArtworkFormData, file: File | null) {
    if (!file) {
      alert('Please select an image');
      return;
    }

    try {
      // Upload image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await artworkService.uploadImage(file, fileName);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = artworkService.getPublicUrl(fileName);

      // Create artwork record
      const { data, error } = await artworkService.create({
        ...formData,
        image_url: urlData.publicUrl,
        thumbnail_url: urlData.publicUrl,
        order_index: artworks.length,
      });

      if (error) throw error;

      alert('Artwork added successfully!');
      loadArtworks();
    } catch (error) {
      console.error('Error adding artwork:', error);
      alert('Error adding artwork. Please try again.');
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await artworkService.delete(id);
      if (error) throw error;

      alert('Artwork deleted successfully!');
      loadArtworks();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      alert('Error deleting artwork. Please try again.');
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FlowerOfLife size={100} className="animate-sacred-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 embroidery-text">Admin Dashboard</h1>
          <p className="text-xl text-gray-300">Manage your sacred art collection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="glass-blood rounded-lg p-6 sacred-border sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Artwork</h2>
              <ArtworkForm onSubmit={handleSubmit} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Artworks</h2>
              <p className="text-gray-400">Manage and organize your collection</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <FlowerOfLife size={150} className="animate-sacred-pulse" />
              </div>
            ) : (
              <ArtworkList artworks={artworks} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
