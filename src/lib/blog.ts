import { db, blogPosts, type BlogPost, type NewBlogPost } from '../db';
import { eq, desc } from 'drizzle-orm';

export const blogService = {
  async getAll(published?: boolean) {
    try {
      if (published !== undefined) {
        const data = await db.select().from(blogPosts).where(eq(blogPosts.published, published)).orderBy(desc(blogPosts.createdAt));
        return { data, error: null };
      }
      const data = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getBySlug(slug: string) {
    try {
      const [data] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getById(id: string) {
    try {
      const [data] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return { data: data || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async create(post: NewBlogPost) {
    try {
      const [data] = await db.insert(blogPosts).values(post).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async update(id: string, post: Partial<NewBlogPost>) {
    try {
      const [data] = await db.update(blogPosts).set({ ...post, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async delete(id: string) {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
