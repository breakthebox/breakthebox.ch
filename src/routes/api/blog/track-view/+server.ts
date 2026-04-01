import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { blogPostViews } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import crypto from 'node:crypto';

/**
 * Track a blog post view. Rate-limited: max 1 view per session per post per day.
 * Session is derived from IP + User-Agent hash (no PII stored).
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const { postId } = (await request.json()) as { postId: string };

	if (!postId) {
		throw error(400, 'postId is required');
	}

	// Create anonymous session hash from IP + User-Agent
	const ip = getClientAddress();
	const ua = request.headers.get('user-agent') ?? '';
	const sessionHash = crypto
		.createHash('sha256')
		.update(`${ip}:${ua}:${new Date().toISOString().slice(0, 10)}`)
		.digest('hex')
		.slice(0, 16);

	// Check if already tracked today
	const existing = await db
		.select({ id: blogPostViews.id })
		.from(blogPostViews)
		.where(
			and(
				eq(blogPostViews.postId, postId),
				eq(blogPostViews.sessionHash, sessionHash),
				sql`${blogPostViews.viewedAt}::date = CURRENT_DATE`
			)
		)
		.limit(1);

	if (existing.length === 0) {
		await db.insert(blogPostViews).values({ postId, sessionHash });
	}

	return json({ ok: true });
};
