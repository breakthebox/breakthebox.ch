import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultManifest } from '$lib/server/content-defaults';
import type { ManifestContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<ManifestContent>('manifest');
	return {
		content: { ...defaultManifest, ...(content ?? {}) }
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
			const content = JSON.parse(json) as ManifestContent;

			if (!content.theses || !Array.isArray(content.theses) || content.theses.length === 0) {
				return fail(400, { error: 'Mindestens eine These wird benötigt.' });
			}
			for (const thesis of content.theses) {
				if (!thesis.text || !thesis.text.trim()) {
					return fail(400, { error: 'Jede These braucht einen Text.' });
				}
			}

			await saveSectionContent('manifest', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
