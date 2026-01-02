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
  deleteCategory
} from '../actions';
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

  // Upload image to storage (placeholder - will use Vercel Blob later)
  async uploadImage(file: File, path: string) {
    // TODO: Implement with Vercel Blob
    console.warn('Image upload not yet implemented - use Vercel Blob');
    return { data: null, error: new Error('Image upload not implemented') };
  },

  // Get public URL for image (placeholder)
  getPublicUrl(path: string) {
    // TODO: Implement with Vercel Blob
    return { data: { publicUrl: path } };
  },

  // Delete image from storage (placeholder)
  async deleteImage(path: string) {
    // TODO: Implement with Vercel Blob
    console.warn('Image deletion not yet implemented - use Vercel Blob');
    return { error: null };
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
