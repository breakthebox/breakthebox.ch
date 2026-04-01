import type { PageServerLoad, Actions } from './$types';
import { getAllBlogPosts, deleteBlogPost, updateBlogPost, getBlogPostViewCounts } from '$lib/server/db/queries/blog';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const posts = await getAllBlogPosts();
	const postIds = posts.map((p) => p.id);
	const viewCounts = await getBlogPostViewCounts(postIds);
	return { posts, viewCounts };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Zugriff verweigert.' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;

		if (!postId) return fail(400, { error: 'Keine Post-ID.' });

		await deleteBlogPost(postId);
		return { success: true };
	},

	publish: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Zugriff verweigert.' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;

		if (!postId) return fail(400, { error: 'Keine Post-ID.' });

		await updateBlogPost(postId, { status: 'published', publishDate: new Date() });
		return { success: true };
	},

	unpublish: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Zugriff verweigert.' });
		}

		const formData = await request.formData();
		const postId = formData.get('postId') as string;

		if (!postId) return fail(400, { error: 'Keine Post-ID.' });

		await updateBlogPost(postId, { status: 'draft' });
		return { success: true };
	}
};
