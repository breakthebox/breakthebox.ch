import type { PageServerLoad, Actions } from './$types';
import {
	getBlogPostById,
	createBlogPost,
	updateBlogPost,
	isSlugUnique
} from '$lib/server/db/queries/blog';
import { generateSlug } from '$lib/utils/slug';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { post: null, isNew: true };
	}

	const post = await getBlogPostById(params.id);
	if (!post) {
		throw redirect(303, '/admin/blog');
	}

	return { post, isNew: false };
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Zugriff verweigert.' });
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const content = (formData.get('content') as string) ?? '';
		const excerpt = (formData.get('excerpt') as string)?.trim() || null;
		const headerImage = (formData.get('headerImage') as string)?.trim() || null;
		const tagsRaw = (formData.get('tags') as string)?.trim() ?? '';
		const status = (formData.get('status') as string) ?? 'draft';
		const publishDateStr = formData.get('publishDate') as string;
		const metaTitle = (formData.get('metaTitle') as string)?.trim() || null;
		const metaDescription = (formData.get('metaDescription') as string)?.trim() || null;
		const ogImage = (formData.get('ogImage') as string)?.trim() || null;
		let slug = (formData.get('slug') as string)?.trim() || '';

		if (!title) {
			return fail(400, { error: 'Titel ist erforderlich.' });
		}

		// Auto-generate slug from title if empty
		if (!slug) {
			slug = generateSlug(title);
		}

		// Ensure slug is URL-safe
		slug = generateSlug(slug.replace(/-/g, ' ')).length > 0
			? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$/g, '')
			: generateSlug(title);

		if (!slug) {
			return fail(400, { error: 'Slug konnte nicht generiert werden.' });
		}

		const isNew = params.id === 'new';
		const excludeId = isNew ? undefined : params.id;

		// Check slug uniqueness
		const unique = await isSlugUnique(slug, excludeId);
		if (!unique) {
			// Append timestamp to make unique
			slug = `${slug}-${Date.now().toString(36)}`;
		}

		// Parse tags
		const tags = tagsRaw
			? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
			: [];

		// Parse publish date
		const publishDate = publishDateStr ? new Date(publishDateStr) : null;

		// Validate scheduled status needs a publish date
		if (status === 'scheduled' && !publishDate) {
			return fail(400, { error: 'Geplante Posts brauchen ein Veröffentlichungsdatum.' });
		}

		const postData = {
			title,
			slug,
			content,
			excerpt,
			headerImage,
			tags,
			status: status as 'draft' | 'published' | 'scheduled',
			publishDate: status === 'published' && !publishDate ? new Date() : publishDate,
			metaTitle,
			metaDescription,
			ogImage,
			authorId: locals.user.id
		};

		if (isNew) {
			await createBlogPost(postData);
		} else {
			await updateBlogPost(params.id, postData);
		}

		throw redirect(303, '/admin/blog');
	}
};
