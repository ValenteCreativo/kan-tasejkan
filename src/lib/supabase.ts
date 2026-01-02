import {
  getAllArtworks,
  getArtworkById,
  getArtworksByCategory,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteFile
} from '../actions';
import { upload } from '@vercel/blob/client';
import type { NewArtwork, NewCategory } from '../db/schema';

// Helper functions for artwork operations
export const artworkService = {
  // Get all artworks
  async getAll(featured?: boolean) {
    return await getAllArtworks(featured);
  },

  // Get artwork by ID
  async getById(id: string) {
    return await getArtworkById(id);
  },

  // Get artworks by category
  async getByCategory(category: string) {
    return await getArtworksByCategory(category);
  },

  // Create new artwork
  async create(artwork: NewArtwork) {
    return await createArtwork(artwork);
  },

  // Update artwork
  async update(id: string, artwork: Partial<NewArtwork>) {
    return await updateArtwork(id, artwork);
  },

  // Delete artwork
  async delete(id: string) {
    return await deleteArtwork(id);
  },

  // Upload image to storage (Vercel Blob Client-Side)
  async uploadImage(file: File, path: string) {
    try {
      const newBlob = await upload(path, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      return { data: { publicUrl: newBlob.url }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get public URL for image (Vercel Blob returns full URL on upload)
  getPublicUrl(path: string) {
    return { data: { publicUrl: path } };
  },

  // Delete image from storage
  async deleteImage(path: string) {
    const { error } = await deleteFile(path);
    return { error };
  },
};

// Category service
export const categoryService = {
  async getAll() {
    return await getAllCategories();
  },

  async create(category: NewCategory) {
    return await createCategory(category);
  },

  async update(id: string, category: Partial<NewCategory>) {
    return await updateCategory(id, category);
  },

  async delete(id: string) {
    return await deleteCategory(id);
  },
};
