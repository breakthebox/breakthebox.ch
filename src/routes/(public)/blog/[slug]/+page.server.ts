import type { PageServerLoad } from './$types';
import { getBlogPostBySlug } from '$lib/server/db/queries/blog';
import { renderMarkdownBlock } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';
import type { PageMeta } from '$lib/types/seo';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getBlogPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Blogpost nicht gefunden.');
	}

	const renderedContent = renderMarkdownBlock(post.content);

	// Blogposts nutzen ihr eigenes Beitragsbild als OG-Image (Fallback: Standard-OG-Bild im Layout).
	const meta: PageMeta = {
		title: post.metaTitle || post.title,
		description: post.metaDescription || post.excerpt || '',
		image: post.ogImage || post.headerImage || null,
		type: 'article',
		article: {
			publishedTime: post.publishDate ? new Date(post.publishDate).toISOString() : undefined,
			modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
			tags: post.tags
		}
	};

	return {
		post,
		renderedContent,
		meta
	};
};
