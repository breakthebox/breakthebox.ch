import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultPillars, resolveActiveTheme } from '$lib/server/content-defaults';
import type { PillarsContent, ThemeContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const [content, theme] = await Promise.all([
		getSectionContent<PillarsContent>('pillars'),
		getSectionContent<ThemeContent>('theme')
	]);
	// Bilder des aktiven Themes — Standard, falls im Pillar kein Override gesetzt ist.
	const themePillarImages = resolveActiveTheme(theme).pillarImages ?? {};
	return {
		content: content ?? defaultPillars,
		themePillarImages
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

			// Basic validation — Anzahl frei wählbar, mindestens einer
			if (!content.pillars || !Array.isArray(content.pillars) || content.pillars.length === 0) {
				return fail(400, { error: 'Mindestens ein Pillar wird benötigt.' });
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
