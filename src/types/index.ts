// Re-export types from Drizzle schema
export type { User, NewUser, Category, NewCategory, Artwork, NewArtwork, BlogPost, NewBlogPost } from '../db/schema';

// Form data types for frontend
export interface ArtworkFormData {
  title: string;
  description: string;
  category: string;
  year?: number;
  medium?: string;
  technique?: string;
  dimensions?: string;
  price?: number;
  available: boolean;
  featured: boolean;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  published: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
