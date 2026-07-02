import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultReferenceProjects } from '$lib/server/content-defaults';
import type { ReferenceProjectsContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ReferenceProjectsContent>('referenzprojekte');
	return {
		content: { ...defaultReferenceProjects, ...((raw as Partial<ReferenceProjectsContent>) ?? {}) }
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
			const content = JSON.parse(json) as ReferenceProjectsContent;

			if (!Array.isArray(content.items)) {
				return fail(400, { error: 'Ungültige Daten.' });
			}
			for (const item of content.items) {
				if (!item.title || !item.description) {
					return fail(400, {
						error: 'Jedes Referenzprojekt braucht einen Titel und eine Beschreibung.'
					});
				}
			}

			await saveSectionContent('referenzprojekte', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
