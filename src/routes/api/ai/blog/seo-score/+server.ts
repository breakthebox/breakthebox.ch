import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { analyzeSeoScore } from '$lib/server/ai/blog-seo';
import type { BlogContentBlocks } from '$lib/types/content';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Nicht autorisiert');
	}

	const { title, blocks, metaTitle, metaDescription } = (await request.json()) as {
		title: string;
		blocks: BlogContentBlocks;
		metaTitle?: string;
		metaDescription?: string;
	};

	if (!title || !blocks?.blocks?.length) {
		throw error(400, 'Titel und Inhalt sind erforderlich');
	}

	const result = await analyzeSeoScore(title, blocks, metaTitle, metaDescription);

	if (!result) {
		throw error(503, 'KI-Service nicht verfügbar');
	}

	return json(result);
};
