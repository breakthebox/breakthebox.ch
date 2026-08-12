import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { normalizeWelten } from '$lib/server/content-defaults';
import type { WeltenContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<WeltenContent>('welten');
	return {
		content: normalizeWelten(content)
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
			const content = normalizeWelten(JSON.parse(json));

			for (const [label, world] of [
				['Linke Welt', content.left],
				['Rechte Welt', content.right]
			] as const) {
				if (!world.title.trim()) {
					return fail(400, { error: `Der Titel darf nicht leer sein (${label}).` });
				}
			}

			await saveSectionContent('welten', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
