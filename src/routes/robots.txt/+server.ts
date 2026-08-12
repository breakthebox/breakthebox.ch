// ═══════════════════════════════════════════════════════════
// robots.txt
// ═══════════════════════════════════════════════════════════
// Als Route statt statischer Datei, damit Domain und Sitemap-URL aus derselben
// Konstante kommen wie Canonical, Sitemap und JSON-LD.
//
// Wichtig: robots.txt-Gruppen erben NICHT voneinander. Jede User-agent-Gruppe
// braucht ihre eigenen Disallow-Zeilen — sonst crawlen die namentlich
// genannten Bots auch /api/ und /auth/.

import type { RequestHandler } from './$types';
import { SITE_URL } from '$lib/config/site';

const DISALLOW = ['/api/', '/auth/', '/admin'];

/** Namentlich erlaubte KI- und Such-Crawler (GEO): explizit statt implizit. */
const AI_AGENTS = [
	'GPTBot', // OpenAI — Training
	'OAI-SearchBot', // OpenAI — Suchindex
	'ChatGPT-User', // OpenAI — Abruf während eines Chats
	'ClaudeBot', // Anthropic — Training
	'Claude-User', // Anthropic — Abruf während eines Chats
	'Claude-SearchBot', // Anthropic — Suchindex
	'PerplexityBot',
	'Perplexity-User',
	'Google-Extended', // Gemini / Vertex
	'Applebot-Extended',
	'Amazonbot',
	'meta-externalagent',
	'CCBot' // Common Crawl — Grundlage vieler Trainingskorpora
];

function group(agent: string): string {
	return [`User-agent: ${agent}`, 'Allow: /', ...DISALLOW.map((p) => `Disallow: ${p}`)].join('\n');
}

export const GET: RequestHandler = () => {
	const body = [
		group('*'),
		'',
		'# KI-/GEO-Crawler — ausdrücklich erlaubt',
		...AI_AGENTS.flatMap((a) => [group(a), '']),
		`Sitemap: ${SITE_URL}/sitemap.xml`,
		''
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
