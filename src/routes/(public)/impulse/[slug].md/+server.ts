// ═══════════════════════════════════════════════════════════
// Beitrag als reines Markdown
// ═══════════════════════════════════════════════════════════
// LLM-Crawler extrahieren aus 100 KB HTML unzuverlässig. Diese Variante
// liefert denselben Beitrag als Klartext — verlinkt aus llms.txt und über
// <link rel="alternate"> auf der HTML-Seite.

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getBlogPostBySlug } from '$lib/server/db/queries/blog';
import { SITE_URL } from '$lib/config/site';

export const GET: RequestHandler = async ({ params }) => {
	const post = await getBlogPostBySlug(params.slug);

	// getBlogPostBySlug liefert nur veröffentlichte bzw. fällige Beiträge.
	if (!post) {
		throw error(404, 'Beitrag nicht gefunden.');
	}

	const date = post.publishDate ? new Date(post.publishDate).toISOString().slice(0, 10) : '';

	const head = [
		`# ${post.title}`,
		'',
		`URL: ${SITE_URL}/impulse/${post.slug}`,
		`Autorin: Brigitte Hulliger, Break the Box GmbH`,
		...(date ? [`Datum: ${date}`] : []),
		...(post.tags?.length ? [`Themen: ${post.tags.join(', ')}`] : []),
		...(post.excerpt ? ['', `> ${post.excerpt}`] : []),
		'',
		'---',
		''
	].join('\n');

	return new Response(head + post.content.trim() + '\n', {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
