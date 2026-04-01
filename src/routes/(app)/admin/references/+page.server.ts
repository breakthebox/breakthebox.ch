import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultReferences } from '$lib/server/content-defaults';
import type { ReferencesContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<ReferencesContent>('references');
	return {
		content: content ?? defaultReferences
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
			const content = JSON.parse(json) as ReferencesContent;

			if (!content.clients || !Array.isArray(content.clients)) {
				return fail(400, { error: 'Ungültige Referenz-Daten.' });
			}

			// Re-index sort order
			content.clients.forEach((c, i) => c.sortOrder = i);

			await saveSectionContent('references', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
