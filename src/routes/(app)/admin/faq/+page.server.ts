import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultFaq } from '$lib/server/content-defaults';
import type { FaqContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<FaqContent>('faq');
	return {
		content: content ?? defaultFaq
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
			const content = JSON.parse(json) as FaqContent;

			if (!content.items || !Array.isArray(content.items) || content.items.length === 0) {
				return fail(400, { error: 'Mindestens eine Frage wird benötigt.' });
			}
			for (const item of content.items) {
				if (!item.question || !item.answer) {
					return fail(400, { error: 'Jede Frage braucht eine Frage und eine Antwort.' });
				}
			}

			await saveSectionContent('faq', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
