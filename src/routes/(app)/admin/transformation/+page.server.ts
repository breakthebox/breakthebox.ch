import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultTransformation } from '$lib/server/content-defaults';
import type { TransformationContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<TransformationContent>('transformation');
	return {
		content: { ...defaultTransformation, ...((raw as Partial<TransformationContent>) ?? {}) }
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
			const content = JSON.parse(json) as TransformationContent;

			// Validierung nur an der Systemgrenze: Grundstruktur + Pflichtfelder der Listen.
			if (!content.hero || !content.steps || !content.faq) {
				return fail(400, { error: 'Ungültige Daten — Grundstruktur fehlt.' });
			}
			if (!content.hero.title?.trim()) {
				return fail(400, { error: 'Der Hero braucht einen Titel.' });
			}
			for (const step of content.steps.items ?? []) {
				if (!step.title?.trim()) {
					return fail(400, { error: 'Jede Stufe braucht einen Titel.' });
				}
			}
			for (const item of content.faq.items ?? []) {
				if (!item.question?.trim() || !item.answer?.trim()) {
					return fail(400, { error: 'Jede FAQ braucht Frage und Antwort.' });
				}
			}

			await saveSectionContent('transformation', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
