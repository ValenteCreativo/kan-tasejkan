-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  year INTEGER,
  medium TEXT,
  dimensions TEXT,
  price DECIMAL(10, 2),
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- Note: Storage bucket should be created manually in Supabase Dashboard
-- Go to Storage > Create new bucket > Name: "artworks" > Public bucket: ON

-- Enable Row Level Security
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access for artworks
DO $$ BEGIN
  CREATE POLICY "Public can view artworks"
  ON artworks FOR SELECT
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can insert artworks
DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert artworks"
  ON artworks FOR INSERT
  WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can update artworks
DO $$ BEGIN
  CREATE POLICY "Authenticated users can update artworks"
  ON artworks FOR UPDATE
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can delete artworks
DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete artworks"
  ON artworks FOR DELETE
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Public read access for categories
DO $$ BEGIN
  CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can manage categories
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to artworks table
DO $$ BEGIN
  CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert default categories
INSERT INTO categories (name, slug, description, order_index)
VALUES
  ('Sacred Geometry', 'sacred-geometry', 'Artworks featuring sacred geometric patterns', 0),
  ('Abstract', 'abstract', 'Abstract contemporary pieces', 1),
  ('Embroidery', 'embroidery', 'Hand-embroidered artworks', 2),
  ('Mixed Media', 'mixed-media', 'Mixed media compositions', 3)
ON CONFLICT (name) DO NOTHING;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Users policies
DO $$ BEGIN
  CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Blog posts policies
DO $$ BEGIN
  CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (published = true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage posts"
  ON blog_posts FOR ALL
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Trigger for blog_posts updated_at
DO $$ BEGIN
  CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
