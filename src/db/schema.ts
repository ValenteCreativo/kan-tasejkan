import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper for default random ID
const randomId = () => sql`(lower(hex(randomblob(16))))`;

// ═══════════════════════════════════════════
// CORE
// ═══════════════════════════════════════════

export const users = sqliteTable('users', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    name: text('name'),
    isAdmin: integer('is_admin', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// SERVICIOS
// ═══════════════════════════════════════════

export const services = sqliteTable('services', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    category: text('category').notNull(),
    shortDescription: text('short_description'),
    description: text('description'),
    benefits: text('benefits', { mode: 'json' }).$type<string[]>(),
    audience: text('audience'),
    duration: text('duration'),
    modality: text('modality'),
    location: text('location'),
    price: text('price'),
    priceNote: text('price_note'),
    coverImageUrl: text('cover_image_url'),
    gallery: text('gallery', { mode: 'json' }).$type<string[]>(),
    videoUrl: text('video_url'),
    bookingEnabled: integer('booking_enabled', { mode: 'boolean' }).default(true),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// EVENTOS
// ═══════════════════════════════════════════

export const events = sqliteTable('events', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    category: text('category').notNull(),
    serviceId: text('service_id').references(() => services.id),
    description: text('description'),
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    location: text('location'),
    modality: text('modality'),
    capacity: integer('capacity'),
    price: text('price'),
    coverImageUrl: text('cover_image_url'),
    gallery: text('gallery', { mode: 'json' }).$type<string[]>(),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// TESTIMONIOS
// ═══════════════════════════════════════════

export const testimonials = sqliteTable('testimonials', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    text: text('text').notNull(),
    serviceId: text('service_id').references(() => services.id),
    imageUrl: text('image_url'),
    rating: integer('rating'),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// EQUIPO
// ═══════════════════════════════════════════

export const teamMembers = sqliteTable('team_members', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    role: text('role').notNull(),
    bio: text('bio'),
    imageUrl: text('image_url'),
    certifications: text('certifications', { mode: 'json' }).$type<string[]>(),
    orderIndex: integer('order_index').default(0),
    isPublished: integer('is_published', { mode: 'boolean' }).default(true),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// PRODUCTOS
// ═══════════════════════════════════════════

export const products = sqliteTable('products', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    category: text('category').notNull(),
    price: text('price').notNull(),
    compareAtPrice: text('compare_at_price'),
    imageUrl: text('image_url'),
    gallery: text('gallery', { mode: 'json' }).$type<string[]>(),
    stock: integer('stock').default(0),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════

export const blogPosts = sqliteTable('blog_posts', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt'),
    coverImageUrl: text('cover_image_url'),
    published: integer('published', { mode: 'boolean' }).default(false),
    authorId: text('author_id').references(() => users.id),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
    publishedAt: text('published_at'),
});

// ═══════════════════════════════════════════
// RESERVAS
// ═══════════════════════════════════════════

export const reservations = sqliteTable('reservations', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    serviceId: text('service_id').references(() => services.id),
    eventId: text('event_id').references(() => events.id),
    type: text('type').notNull(),
    message: text('message'),
    preferredDate: text('preferred_date'),
    preferredTime: text('preferred_time'),
    attendeesCount: integer('attendees_count'),
    status: text('status').default('pending'),
    adminNotes: text('admin_notes'),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// LEGACY (artworks kept for gallery/media)
// ═══════════════════════════════════════════

export const artworks = sqliteTable('artworks', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    description: text('description'),
    imageUrl: text('image_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    category: text('category').notNull(),
    price: text('price'),
    available: integer('available', { mode: 'boolean' }).default(true),
    featured: integer('featured', { mode: 'boolean' }).default(false),
    orderIndex: integer('order_index').default(0),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

export const categories = sqliteTable('categories', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    orderIndex: integer('order_index').default(0),
});

// ═══════════════════════════════════════════
// CONFIGURACIÓN DEL SITIO
// ═══════════════════════════════════════════

export const siteSettings = sqliteTable('site_settings', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    key: text('key').unique().notNull(),
    value: text('value').notNull(),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// NAVEGACIÓN LANDING (Orbital)
// ═══════════════════════════════════════════

export const navigationItems = sqliteTable('navigation_items', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    label: text('label').notNull(),
    description: text('description'),
    href: text('href').notNull(),
    icon: text('icon').notNull().default('flower'),
    orderIndex: integer('order_index').default(0),
    isVisible: integer('is_visible', { mode: 'boolean' }).default(true),
    createdAt: text('created_at').default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
export type Artwork = typeof artworks.$inferSelect;
export type NewArtwork = typeof artworks.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
export type NavigationItem = typeof navigationItems.$inferSelect;
export type NewNavigationItem = typeof navigationItems.$inferInsert;
