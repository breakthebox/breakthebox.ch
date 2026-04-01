import type { PageServerLoad, Actions } from './$types';
import {
	getBlogPostById,
	createBlogPost,
	updateBlogPost,
	isSlugUnique,
	getBlogPostViewCount
} from '$lib/server/db/queries/blog';
import { generateSlug } from '$lib/utils/slug';
import { fail, redirect } from '@sveltejs/kit';
import type { BlogContentBlocks } from '$lib/types/content';

export const load: PageServerLoad = async ({ params }) => {
	if (params.id === 'new') {
		return { post: null, isNew: true, viewCount: 0 };
	}

	const post = await getBlogPostById(params.id);
	if (!post) {
		throw redirect(303, '/admin/blog');
	}

	const viewCount = await getBlogPostViewCount(params.id);

	return { post, isNew: false, viewCount };
};

export const actions: Actions = {
	save: async ({ request, locals, params }) => {
		if (!locals.user || locals.user.role !== 'admin') {
			return fail(403, { error: 'Zugriff verweigert.' });
		}

		const formData = await request.formData();
		const title = (formData.get('title') as string)?.trim();
		const content = (formData.get('content') as string) ?? '';
		const contentBlocksRaw = formData.get('contentBlocks') as string;
		const excerpt = (formData.get('excerpt') as string)?.trim() || null;
		const headerImage = (formData.get('headerImage') as string)?.trim() || null;
		const tagsRaw = (formData.get('tags') as string)?.trim() ?? '';
		const status = (formData.get('status') as string) ?? 'draft';
		const publishDateStr = formData.get('publishDate') as string;
		const metaTitle = (formData.get('metaTitle') as string)?.trim() || null;
		const metaDescription = (formData.get('metaDescription') as string)?.trim() || null;
		const ogImage = (formData.get('ogImage') as string)?.trim() || null;
		const seoScoreRaw = formData.get('seoScore') as string;
		let slug = (formData.get('slug') as string)?.trim() || '';

		if (!title) {
			return fail(400, { error: 'Titel ist erforderlich.' });
		}

		// Parse content blocks
		let contentBlocks: BlogContentBlocks | null = null;
		if (contentBlocksRaw) {
			try {
				contentBlocks = JSON.parse(contentBlocksRaw) as BlogContentBlocks;
			} catch {
				// Ignore parse errors, keep null
			}
		}

		// Generate plain text content from blocks for search/fallback
		let plainContent = content;
		if (contentBlocks?.blocks?.length) {
			plainContent = contentBlocks.blocks
				.map((block) => {
					const data = block.data as Record<string, unknown>;
					switch (block.type) {
						case 'paragraph':
						case 'header':
						case 'quote':
							return ((data.text as string) ?? '').replace(/<[^>]*>/g, '');
						case 'list': {
							const items = data.items as string[];
							return items?.map((i) => i.replace(/<[^>]*>/g, '')).join('\n') ?? '';
						}
						case 'code':
							return (data.code as string) ?? '';
						default:
							return '';
					}
				})
				.filter(Boolean)
				.join('\n\n');
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
			slug = `${slug}-${Date.now().toString(36)}`;
		}

		// Parse tags
		const tags = tagsRaw
			? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
			: [];

		// Parse publish date
		const publishDate = publishDateStr ? new Date(publishDateStr) : null;

		if (status === 'scheduled' && !publishDate) {
			return fail(400, { error: 'Geplante Posts brauchen ein Veröffentlichungsdatum.' });
		}

		const seoScore = seoScoreRaw ? parseInt(seoScoreRaw, 10) : null;

		const postData = {
			title,
			slug,
			content: plainContent,
			contentBlocks,
			excerpt,
			headerImage,
			tags,
			status: status as 'draft' | 'published' | 'scheduled',
			publishDate: status === 'published' && !publishDate ? new Date() : publishDate,
			metaTitle,
			metaDescription,
			ogImage,
			seoScore: seoScore && !isNaN(seoScore) ? seoScore : null,
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
