export interface Artwork {
  id: string;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url?: string;
  category: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  price?: number;
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface ArtworkFormData {
  title: string;
  description: string;
  category: string;
  year?: number;
  medium?: string;
  dimensions?: string;
  price?: number;
  available: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order_index: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  is_admin: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  published: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Database {
  public: {
    Tables: {
      artworks: {
        Row: Artwork;
        Insert: Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Artwork, 'id' | 'created_at' | 'updated_at'>>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Omit<Category, 'id'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
