import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../actions';
import type { NewBlogPost } from '../db/schema';

export const blogService = {
  async getAll(published?: boolean) {
    return await getAllBlogPosts(published);
  },

  async getBySlug(slug: string) {
    return await getBlogPostBySlug(slug);
  },

  async getById(id: string) {
    return await getBlogPostById(id);
  },

  async create(post: NewBlogPost) {
    return await createBlogPost(post);
  },

  async update(id: string, post: Partial<NewBlogPost>) {
    return await updateBlogPost(id, post);
  },

  async delete(id: string) {
    return await deleteBlogPost(id);
  },

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
};
