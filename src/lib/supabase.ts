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
  uploadFile,
  deleteFile
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

  // Upload image to storage (Vercel Blob)
  async uploadImage(file: File, path: string) {
    const { url, error } = await uploadFile(file, path);
    if (error) return { data: null, error };
    return { data: { publicUrl: url! }, error: null };
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
