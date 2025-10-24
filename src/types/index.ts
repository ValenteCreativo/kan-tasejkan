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
    };
  };
}
