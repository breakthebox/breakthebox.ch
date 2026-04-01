// ═══════════════════════════════════════════════════════════
// Blog Queries — CRUD for blog_posts table
// ═══════════════════════════════════════════════════════════

import { eq, and, lte, or, desc, ne, sql } from 'drizzle-orm';
import { db } from '../index';
import { blogPosts } from '../schema';

export type BlogPostRow = typeof blogPosts.$inferSelect;
export type BlogPostInsert = typeof blogPosts.$inferInsert;

/**
 * Get all blog posts (admin listing). Ordered by createdAt DESC.
 */
export async function getAllBlogPosts(): Promise<BlogPostRow[]> {
	return db
		.select()
		.from(blogPosts)
		.orderBy(desc(blogPosts.createdAt));
}

/**
 * Get published blog posts (public listing).
 * Includes scheduled posts whose publishDate has passed.
 */
export async function getPublishedBlogPosts(limit?: number): Promise<BlogPostRow[]> {
	const now = new Date();
	const query = db
		.select()
		.from(blogPosts)
		.where(
			or(
				eq(blogPosts.status, 'published'),
				and(
					eq(blogPosts.status, 'scheduled'),
					lte(blogPosts.publishDate, now)
				)
			)
		)
		.orderBy(desc(blogPosts.publishDate));

	if (limit) {
		return query.limit(limit);
	}
	return query;
}

/**
 * Get latest published posts for homepage cards.
 */
export async function getLatestBlogPosts(limit: number): Promise<BlogPostRow[]> {
	return getPublishedBlogPosts(limit);
}

/**
 * Get a single post by slug (public detail page).
 * Only returns published/scheduled-and-due posts.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
	const now = new Date();
	const rows = await db
		.select()
		.from(blogPosts)
		.where(
			and(
				eq(blogPosts.slug, slug),
				or(
					eq(blogPosts.status, 'published'),
					and(
						eq(blogPosts.status, 'scheduled'),
						lte(blogPosts.publishDate, now)
					)
				)
			)
		)
		.limit(1);

	return rows[0] ?? null;
}

/**
 * Get a single post by ID (admin editor).
 */
export async function getBlogPostById(id: string): Promise<BlogPostRow | null> {
	const rows = await db
		.select()
		.from(blogPosts)
		.where(eq(blogPosts.id, id))
		.limit(1);

	return rows[0] ?? null;
}

/**
 * Create a new blog post.
 */
export async function createBlogPost(data: BlogPostInsert): Promise<BlogPostRow> {
	const rows = await db.insert(blogPosts).values(data).returning();
	return rows[0];
}

/**
 * Update an existing blog post.
 */
export async function updateBlogPost(
	id: string,
	data: Partial<Omit<BlogPostInsert, 'id'>>
): Promise<BlogPostRow | null> {
	const rows = await db
		.update(blogPosts)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(blogPosts.id, id))
		.returning();

	return rows[0] ?? null;
}

/**
 * Delete a blog post.
 */
export async function deleteBlogPost(id: string): Promise<void> {
	await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

/**
 * Check if a slug is unique (optionally excluding a specific post ID).
 */
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
	const conditions = [eq(blogPosts.slug, slug)];
	if (excludeId) {
		conditions.push(ne(blogPosts.id, excludeId));
	}

	const rows = await db
		.select({ id: blogPosts.id })
		.from(blogPosts)
		.where(and(...conditions))
		.limit(1);

	return rows.length === 0;
}
