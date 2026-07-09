'use server';

import { db, artworks, categories, blogPosts, services, events, testimonials, teamMembers, products } from '../db';
import { eq, asc, desc } from 'drizzle-orm';
import { put, del } from '@vercel/blob';
import type { NewArtwork, NewCategory, NewBlogPost, NewService, NewEvent, NewTestimonial, NewTeamMember, NewProduct } from '../db/schema';

// --- Artwork Actions ---

export async function getAllArtworks(featured?: boolean) {
    try {
        if (featured !== undefined) {
            const data = await db.select().from(artworks).where(eq(artworks.featured, featured)).orderBy(asc(artworks.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(artworks).orderBy(asc(artworks.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getArtworkById(id: string) {
    try {
        const [data] = await db.select().from(artworks).where(eq(artworks.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getArtworksByCategory(category: string) {
    try {
        const data = await db.select().from(artworks).where(eq(artworks.category, category)).orderBy(asc(artworks.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createArtwork(artwork: NewArtwork) {
    try {
        const [data] = await db.insert(artworks).values(artwork).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function updateArtwork(id: string, artwork: Partial<NewArtwork>) {
    try {
        const [data] = await db.update(artworks).set({ ...artwork, updatedAt: new Date().toISOString() }).where(eq(artworks.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteArtwork(id: string) {
    try {
        await db.delete(artworks).where(eq(artworks.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- Category Actions ---

export async function getAllCategories() {
    try {
        const data = await db.select().from(categories).orderBy(asc(categories.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createCategory(category: NewCategory) {
    try {
        const [data] = await db.insert(categories).values(category).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function updateCategory(id: string, category: Partial<NewCategory>) {
    try {
        const [data] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- Blog Post Actions ---

export async function getAllBlogPosts(published?: boolean) {
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
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const [data] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getBlogPostById(id: string) {
    try {
        const [data] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createBlogPost(post: NewBlogPost) {
    try {
        const [data] = await db.insert(blogPosts).values(post).returning();
        return { data, error: null };
    } catch (error) {
        console.error('Create Blog Post Error:', error);
        return { data: null, error: (error as Error).message };
    }
}

export async function updateBlogPost(id: string, post: Partial<NewBlogPost>) {
    try {
        const [data] = await db.update(blogPosts).set({ ...post, updatedAt: new Date().toISOString() }).where(eq(blogPosts.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        return { error: null };
    } catch (error) {
        return { error };
    }
}

// --- File Storage Actions ---

export async function uploadFile(file: File, pathname: string) {
    try {
        const blob = await put(pathname, file, { access: 'public' });
        return { url: blob.url, error: null };
    } catch (error) {
        return { url: null, error };
    }
}

export async function deleteFile(url: string) {
    try {
        await del(url);
        return { error: null };
    } catch (error) {
        return { error };
    }
}


// --- Service Actions ---

export async function getAllServices(publishedOnly?: boolean) {
    try {
        if (publishedOnly) {
            const data = await db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(services).orderBy(asc(services.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getServiceBySlug(slug: string) {
    try {
        const [data] = await db.select().from(services).where(eq(services.slug, slug));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getServiceById(id: string) {
    try {
        const [data] = await db.select().from(services).where(eq(services.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createService(service: NewService) {
    try {
        const [data] = await db.insert(services).values(service).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function updateService(id: string, service: Partial<NewService>) {
    try {
        const [data] = await db.update(services).set({ ...service, updatedAt: new Date().toISOString() }).where(eq(services.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function deleteService(id: string) {
    try {
        await db.delete(services).where(eq(services.id, id));
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// --- Event Actions ---

export async function getAllEvents(publishedOnly?: boolean) {
    try {
        if (publishedOnly) {
            const data = await db.select().from(events)
                .where(eq(events.isPublished, true))
                .orderBy(asc(events.startDate));
            return { data, error: null };
        }
        const data = await db.select().from(events).orderBy(asc(events.startDate));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getUpcomingEvents() {
    try {
        const data = await db.select().from(events)
            .where(eq(events.isPublished, true))
            .orderBy(asc(events.startDate));
        // Filter upcoming in JS since gte with timestamps can be tricky across drivers
        const now = new Date();
        const upcoming = data.filter(e => new Date(e.startDate) >= now || (e.endDate && new Date(e.endDate) >= now));
        return { data: upcoming, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getEventBySlug(slug: string) {
    try {
        const [data] = await db.select().from(events).where(eq(events.slug, slug));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getEventById(id: string) {
    try {
        const [data] = await db.select().from(events).where(eq(events.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createEvent(event: NewEvent) {
    try {
        const [data] = await db.insert(events).values(event).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function updateEvent(id: string, event: Partial<NewEvent>) {
    try {
        const [data] = await db.update(events).set({ ...event, updatedAt: new Date().toISOString() }).where(eq(events.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.delete(events).where(eq(events.id, id));
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// --- Testimonial Actions ---

export async function getAllTestimonials(publishedOnly?: boolean) {
    try {
        if (publishedOnly) {
            const data = await db.select().from(testimonials).where(eq(testimonials.isPublished, true)).orderBy(asc(testimonials.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(testimonials).orderBy(asc(testimonials.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createTestimonial(testimonial: NewTestimonial) {
    try {
        const [data] = await db.insert(testimonials).values(testimonial).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function updateTestimonial(id: string, testimonial: Partial<NewTestimonial>) {
    try {
        const [data] = await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function deleteTestimonial(id: string) {
    try {
        await db.delete(testimonials).where(eq(testimonials.id, id));
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// --- Team Member Actions ---

export async function getAllTeamMembers(publishedOnly?: boolean) {
    try {
        if (publishedOnly) {
            const data = await db.select().from(teamMembers).where(eq(teamMembers.isPublished, true)).orderBy(asc(teamMembers.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(teamMembers).orderBy(asc(teamMembers.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createTeamMember(member: NewTeamMember) {
    try {
        const [data] = await db.insert(teamMembers).values(member).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function updateTeamMember(id: string, member: Partial<NewTeamMember>) {
    try {
        const [data] = await db.update(teamMembers).set(member).where(eq(teamMembers.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function deleteTeamMember(id: string) {
    try {
        await db.delete(teamMembers).where(eq(teamMembers.id, id));
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

// --- Product Actions ---

export async function getAllProducts(publishedOnly?: boolean) {
    try {
        if (publishedOnly) {
            const data = await db.select().from(products).where(eq(products.isPublished, true)).orderBy(asc(products.orderIndex));
            return { data, error: null };
        }
        const data = await db.select().from(products).orderBy(asc(products.orderIndex));
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const [data] = await db.select().from(products).where(eq(products.slug, slug));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function getProductById(id: string) {
    try {
        const [data] = await db.select().from(products).where(eq(products.id, id));
        return { data: data || null, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function createProduct(product: NewProduct) {
    try {
        const [data] = await db.insert(products).values(product).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function updateProduct(id: string, product: Partial<NewProduct>) {
    try {
        const [data] = await db.update(products).set({ ...product, updatedAt: new Date().toISOString() }).where(eq(products.id, id)).returning();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: (error as Error).message };
    }
}

export async function deleteProduct(id: string) {
    try {
        await db.delete(products).where(eq(products.id, id));
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
