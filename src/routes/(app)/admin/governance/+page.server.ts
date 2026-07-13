import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultGovernance, mergeContent } from '$lib/server/content-defaults';
import type { GovernanceContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<GovernanceContent>('governance');
	return {
		content: mergeContent(defaultGovernance, raw)
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
			const content = JSON.parse(json) as GovernanceContent;

			// Validierung nur an der Systemgrenze: Grundstruktur + Pflichtfelder der Listen.
			if (!content.hero || !content.matrix || !content.mandates) {
				return fail(400, { error: 'Ungültige Daten — Grundstruktur fehlt.' });
			}
			if (!content.hero.title?.trim()) {
				return fail(400, { error: 'Der Hero braucht einen Titel.' });
			}
			for (const row of content.matrix.rows ?? []) {
				if (!row.label?.trim()) {
					return fail(400, { error: 'Jede Matrix-Zeile braucht ein Label.' });
				}
				const lvl = Number(row.level);
				if (!Number.isInteger(lvl) || lvl < 0 || lvl > 3) {
					return fail(400, { error: 'Abdeckung muss zwischen 0 und 3 liegen.' });
				}
			}
			for (const mandate of content.mandates.items ?? []) {
				if (!mandate.org?.trim()) {
					return fail(400, { error: 'Jedes Mandat braucht eine Organisation.' });
				}
			}

			await saveSectionContent('governance', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
