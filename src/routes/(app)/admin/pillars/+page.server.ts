import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultPillars } from '$lib/server/content-defaults';
import type { PillarsContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<PillarsContent>('pillars');
	return {
		content: content ?? defaultPillars
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
			const content = JSON.parse(json) as PillarsContent;

			// Basic validation
			if (!content.pillars || !Array.isArray(content.pillars) || content.pillars.length !== 4) {
				return fail(400, { error: 'Ungültige Pillar-Daten.' });
			}

			for (const pillar of content.pillars) {
				if (!pillar.title || !pillar.desc) {
					return fail(400, { error: 'Jeder Pillar braucht einen Titel und eine Beschreibung.' });
				}
			}

			await saveSectionContent('pillars', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
