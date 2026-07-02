import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultPartners } from '$lib/server/content-defaults';
import type { PartnersContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<PartnersContent>('partners');
	return {
		content: content ?? defaultPartners
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
			const content = JSON.parse(json) as PartnersContent;

			if (!content.items || !Array.isArray(content.items)) {
				return fail(400, { error: 'Ungültige Daten.' });
			}
			for (const partner of content.items) {
				if (!partner.name) {
					return fail(400, { error: 'Jeder Partner braucht einen Namen.' });
				}
				if (!Array.isArray(partner.persons)) {
					return fail(400, { error: 'Ungültige Personen-Daten.' });
				}
			}

			await saveSectionContent('partners', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
