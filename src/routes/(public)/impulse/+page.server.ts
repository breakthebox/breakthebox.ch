import type { PageServerLoad } from './$types';
import { getPublishedBlogPosts } from '$lib/server/db/queries/blog';
import * as m from '$lib/paraglide/messages.js';
import { pageTitle } from '$lib/config/site';
import type { PageMeta } from '$lib/types/seo';

export const load: PageServerLoad = async () => {
	const posts = await getPublishedBlogPosts();
	const meta: PageMeta = {
		title: pageTitle(m.blog_page_title()),
		description: m.blog_page_subtitle()
	};
	return { posts, meta };
};
