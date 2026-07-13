import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultKeynotesPage, mergeContent } from '$lib/server/content-defaults';
import type { KeynotesPageContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<KeynotesPageContent>('keynotespage');
	return {
		content: mergeContent(defaultKeynotesPage, raw)
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
			const content = JSON.parse(json) as KeynotesPageContent;

			if (!content.hero || !content.signature || !content.formats) {
				return fail(400, { error: 'Ungültige Daten — Grundstruktur fehlt.' });
			}
			if (!content.hero.title?.trim()) {
				return fail(400, { error: 'Der Hero braucht einen Titel.' });
			}
			for (const talk of content.signature.items ?? []) {
				if (!talk.title?.trim()) {
					return fail(400, { error: 'Jeder Signature-Talk braucht einen Titel.' });
				}
			}

			await saveSectionContent('keynotespage', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
