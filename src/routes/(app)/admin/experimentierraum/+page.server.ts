import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultExperiments, normalizeExperiments } from '$lib/server/content-defaults';
import type { ExperimentsContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ExperimentsContent>('experiments');
	return {
		content: normalizeExperiments(raw ?? defaultExperiments)
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
			const parsed = JSON.parse(json);

			if (!Array.isArray(parsed.platforms) || !Array.isArray(parsed.projects)) {
				return fail(400, { error: 'Ungültige Daten.' });
			}
			// Normalisieren (desc → Abschnitte-Array, leere Absätze entfernen)
			const content = normalizeExperiments(parsed);
			content.platforms = content.platforms.map((p) => ({
				...p,
				desc: p.desc.map((d) => d.trim()).filter(Boolean)
			}));

			for (const p of content.platforms) {
				if (!p.name) {
					return fail(400, { error: 'Jede Plattform braucht einen Namen.' });
				}
			}
			for (const p of content.projects) {
				if (!p.name || !p.desc) {
					return fail(400, { error: 'Jedes Projekt braucht einen Namen und eine Beschreibung.' });
				}
			}

			await saveSectionContent('experiments', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
