import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultExperimentierraum, mergeContent } from '$lib/server/content-defaults';
import type { ExperimentierraumContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ExperimentierraumContent>('experimentierraum');
	return {
		content: mergeContent(defaultExperimentierraum, raw)
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
			const content = JSON.parse(json) as ExperimentierraumContent;

			if (!content.hero || !content.bench || !content.transfer) {
				return fail(400, { error: 'Ungültige Daten — Grundstruktur fehlt.' });
			}
			if (!content.hero.title?.trim()) {
				return fail(400, { error: 'Der Hero braucht einen Titel.' });
			}
			for (const exp of content.bench.items ?? []) {
				if (!exp.name?.trim()) {
					return fail(400, { error: 'Jedes Experiment braucht einen Namen.' });
				}
			}

			await saveSectionContent('experimentierraum', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
