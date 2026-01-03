import { pgTable, uuid, varchar, text, integer, boolean, timestamp, decimal } from 'drizzle-orm/pg-core';

// Users table - Admin users with password hashes
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    isAdmin: boolean('is_admin').default(false),
    createdAt: timestamp('created_at').defaultNow(),
});

// Categories table - Artwork categories with ordering
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    description: text('description'),
    orderIndex: integer('order_index').default(0),
});

// Artworks table - Portfolio pieces with images, pricing, and metadata
export const artworks = pgTable('artworks', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    imageUrl: text('image_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    category: varchar('category', { length: 255 }).notNull(),
    year: integer('year'),
    medium: varchar('medium', { length: 255 }),
    technique: varchar('technique', { length: 255 }),
    dimensions: varchar('dimensions', { length: 255 }),
    price: decimal('price', { precision: 10, scale: 2 }),
    available: boolean('available').default(true),
    featured: boolean('featured').default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Blog posts table - Blog content with publishing workflow
export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique().notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    coverImageUrl: text('cover_image_url'),
    published: boolean('published').default(false),
    authorId: uuid('author_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    publishedAt: timestamp('published_at'),
});

// Type exports for use in application code
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
