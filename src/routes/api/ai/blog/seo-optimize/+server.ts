import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { optimizeContentForSeo } from '$lib/server/ai/blog-seo';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user || locals.user.role !== 'admin') {
		throw error(403, 'Nicht autorisiert');
	}

	const { text, targetKeywords, language } = (await request.json()) as {
		text: string;
		targetKeywords?: string[];
		language?: string;
	};

	if (!text) {
		throw error(400, 'Text ist erforderlich');
	}

	const result = await optimizeContentForSeo(text, targetKeywords, language);

	if (!result) {
		throw error(503, 'KI-Service nicht verfügbar');
	}

	return json(result);
};
