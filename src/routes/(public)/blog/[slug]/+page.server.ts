import type { PageServerLoad } from './$types';
import { getBlogPostBySlug } from '$lib/server/db/queries/blog';
import { renderMarkdownBlock } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const post = await getBlogPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Blogpost nicht gefunden.');
	}

	const renderedContent = renderMarkdownBlock(post.content);

	return {
		post,
		renderedContent
	};
};
