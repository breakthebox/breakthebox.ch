import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';
import { getPublishedBlogPosts } from '$lib/server/db/queries/blog';
import { PUBLIC_LOCALES, DEFAULT_LOCALE, HREFLANG, localizedPath } from '$lib/config/locales';

const SITE_URL = (env.PUBLIC_APP_URL || 'https://breakthebox.ch').replace(/\/$/, '');

const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
	{ path: '/', changefreq: 'weekly', priority: '1.0' },
	{ path: '/blog', changefreq: 'weekly', priority: '0.8' },
	{ path: '/impressum', changefreq: 'yearly', priority: '0.3' },
	{ path: '/datenschutz', changefreq: 'yearly', priority: '0.3' },
	{ path: '/agb', changefreq: 'yearly', priority: '0.3' }
];

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function buildAlternates(path: string): string {
	if (PUBLIC_LOCALES.length <= 1) return '';
	return PUBLIC_LOCALES.map(
		(loc) =>
			`\t\t<xhtml:link rel="alternate" hreflang="${HREFLANG[loc] ?? loc}" href="${escapeXml(SITE_URL + localizedPath(path, loc))}" />`
	).join('\n');
}

function buildUrlEntry(opts: {
	path: string;
	lastmod?: string;
	changefreq: string;
	priority: string;
}): string {
	const loc = escapeXml(SITE_URL + localizedPath(opts.path, DEFAULT_LOCALE));
	const alternates = buildAlternates(opts.path);
	return `\t<url>
\t\t<loc>${loc}</loc>${alternates ? '\n' + alternates : ''}${opts.lastmod ? `\n\t\t<lastmod>${opts.lastmod}</lastmod>` : ''}
\t\t<changefreq>${opts.changefreq}</changefreq>
\t\t<priority>${opts.priority}</priority>
\t</url>`;
}

export const GET: RequestHandler = async () => {
	const posts = await getPublishedBlogPosts();
	const entries: string[] = [];

	for (const route of STATIC_ROUTES) {
		entries.push(buildUrlEntry({ path: route.path, changefreq: route.changefreq, priority: route.priority }));
	}

	for (const post of posts) {
		const lastmodDate = (post.updatedAt ?? post.publishDate ?? post.createdAt) as Date | null;
		const lastmod = lastmodDate ? new Date(lastmodDate).toISOString() : undefined;
		entries.push(
			buildUrlEntry({
				path: `/blog/${post.slug}`,
				lastmod,
				changefreq: 'monthly',
				priority: '0.7'
			})
		);
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
