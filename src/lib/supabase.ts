import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for artwork operations
export const artworkService = {
  // Get all artworks
  async getAll(featured?: boolean) {
    let query = supabase
      .from('artworks')
      .select('*')
      .order('order_index', { ascending: true });

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    return query;
  },

  // Get artwork by ID
  async getById(id: string) {
    return supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Get artworks by category
  async getByCategory(category: string) {
    return supabase
      .from('artworks')
      .select('*')
      .eq('category', category)
      .order('order_index', { ascending: true });
  },

  // Create new artwork
  async create(artwork: any) {
    return supabase
      .from('artworks')
      .insert(artwork)
      .select()
      .single();
  },

  // Update artwork
  async update(id: string, artwork: any) {
    return supabase
      .from('artworks')
      .update(artwork)
      .eq('id', id)
      .select()
      .single();
  },

  // Delete artwork
  async delete(id: string) {
    return supabase
      .from('artworks')
      .delete()
      .eq('id', id);
  },

  // Upload image to storage
  async uploadImage(file: File, path: string) {
    return supabase.storage
      .from('artworks')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
  },

  // Get public URL for image
  getPublicUrl(path: string) {
    return supabase.storage
      .from('artworks')
      .getPublicUrl(path);
  },

  // Delete image from storage
  async deleteImage(path: string) {
    return supabase.storage
      .from('artworks')
      .remove([path]);
  },
};

// Category service
export const categoryService = {
  async getAll() {
    return supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });
  },

  async create(category: any) {
    return supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
  },

  async update(id: string, category: any) {
    return supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase
      .from('categories')
      .delete()
      .eq('id', id);
  },
};
