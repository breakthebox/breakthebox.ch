import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultAngebot } from '$lib/server/content-defaults';
import type { AngebotContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<AngebotContent>('angebot');
	return {
		content: content ?? defaultAngebot
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
			const content = JSON.parse(json) as AngebotContent;

			if (!content.items || !Array.isArray(content.items) || content.items.length === 0) {
				return fail(400, { error: 'Mindestens ein Angebot wird benötigt.' });
			}
			for (const item of content.items) {
				if (!item.title || !item.desc) {
					return fail(400, { error: 'Jedes Angebot braucht einen Titel und eine Beschreibung.' });
				}
			}

			await saveSectionContent('angebot', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
