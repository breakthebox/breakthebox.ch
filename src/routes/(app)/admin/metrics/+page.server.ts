import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultMetrics } from '$lib/server/content-defaults';
import type { MetricsContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<MetricsContent>('metrics');
	return {
		content: content ?? defaultMetrics
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
			const content = JSON.parse(json) as MetricsContent;

			if (!content.items || !Array.isArray(content.items) || content.items.length === 0) {
				return fail(400, { error: 'Mindestens eine Kennzahl wird benötigt.' });
			}
			for (const item of content.items) {
				if (!item.value || !item.label) {
					return fail(400, { error: 'Jede Kennzahl braucht einen Wert und ein Label.' });
				}
			}

			await saveSectionContent('metrics', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
