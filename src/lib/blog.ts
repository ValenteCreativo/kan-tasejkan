import { supabase } from './supabase';
import type { BlogPost } from '../types';

export const blogService = {
  async getAll(published?: boolean) {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (published !== undefined) {
      query = query.eq('published', published);
    }

    return query;
  },

  async getBySlug(slug: string) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
  },

  async create(post: any) {
    return supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();
  },

  async update(id: string, post: any) {
    return supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
