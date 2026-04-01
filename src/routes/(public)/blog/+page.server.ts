import type { PageServerLoad } from './$types';
import { getPublishedBlogPosts } from '$lib/server/db/queries/blog';

export const load: PageServerLoad = async () => {
	const posts = await getPublishedBlogPosts();
	return { posts };
};
