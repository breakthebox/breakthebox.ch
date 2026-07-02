import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultTestimonials } from '$lib/server/content-defaults';
import type { TestimonialsContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<TestimonialsContent>('testimonials');
	return {
		content: content ?? defaultTestimonials
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
			const content = JSON.parse(json) as TestimonialsContent;

			if (!content.items || !Array.isArray(content.items) || content.items.length === 0) {
				return fail(400, { error: 'Mindestens eine Stimme wird benötigt.' });
			}
			for (const item of content.items) {
				if (!item.quote || !item.author) {
					return fail(400, { error: 'Jede Stimme braucht ein Zitat und einen Namen.' });
				}
			}

			await saveSectionContent('testimonials', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
