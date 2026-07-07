import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { getPublishedBlogPosts } from '$lib/server/db/queries/blog';
import { defaultKeynotes } from '$lib/server/content-defaults';
import type { KeynotesContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const [content, posts] = await Promise.all([
		getSectionContent<KeynotesContent>('keynotes'),
		getPublishedBlogPosts()
	]);
	return {
		content: content ?? defaultKeynotes,
		// Nur was die Auswahl braucht — Slug (Wert) und Titel (Anzeige).
		blogPosts: posts.map((p) => ({ slug: p.slug, title: p.title }))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const json = formData.get('content');

		if (!json || typeof json !== 'string') {
			return fail(400, { error: 'Keine Daten erhalten.' });
		}

		try {
			const content = JSON.parse(json) as KeynotesContent;

			if (!content.items || !Array.isArray(content.items)) {
				return fail(400, { error: 'Ungültige Daten.' });
			}
			for (const item of content.items) {
				if (!item.title?.trim()) {
					return fail(400, { error: 'Jeder Auftritt braucht einen Titel.' });
				}
				if (!item.date?.trim()) {
					return fail(400, { error: 'Jeder Auftritt braucht ein Datum.' });
				}
				if (!Array.isArray(item.tags)) {
					return fail(400, { error: 'Ungültige Themen-Daten.' });
				}
			}

			await saveSectionContent('keynotes', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
