import { db, artworks, categories, type Artwork, type NewArtwork, type Category, type NewCategory } from '../db';
import { eq, asc } from 'drizzle-orm';

// Helper functions for artwork operations
export const artworkService = {
  // Get all artworks
  async getAll(featured?: boolean) {
    try {
      if (featured !== undefined) {
        const data = await db.select().from(artworks).where(eq(artworks.featured, featured)).orderBy(asc(artworks.orderIndex));
        return { data, error: null };
      }
      const data = await db.select().from(artworks).orderBy(asc(artworks.orderIndex));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get artwork by ID
  async getById(id: string) {
    try {
      const [data] = await db.select().from(artworks).where(eq(artworks.id, id));
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get artworks by category
  async getByCategory(category: string) {
    try {
      const data = await db.select().from(artworks).where(eq(artworks.category, category)).orderBy(asc(artworks.orderIndex));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Create new artwork
  async create(artwork: NewArtwork) {
    try {
      const [data] = await db.insert(artworks).values(artwork).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Update artwork
  async update(id: string, artwork: Partial<NewArtwork>) {
    try {
      const [data] = await db.update(artworks).set({ ...artwork, updatedAt: new Date() }).where(eq(artworks.id, id)).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete artwork
  async delete(id: string) {
    try {
      await db.delete(artworks).where(eq(artworks.id, id));
      return { error: null };
    } catch (error) {
      return { error };
    }
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
    try {
      const data = await db.select().from(categories).orderBy(asc(categories.orderIndex));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(category: NewCategory) {
    try {
      const [data] = await db.insert(categories).values(category).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, category: Partial<NewCategory>) {
    try {
      const [data] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      await db.delete(categories).where(eq(categories.id, id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
};
