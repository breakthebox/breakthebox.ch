import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { normalizeHero } from '$lib/server/content-defaults';
import type { HeroContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<HeroContent>('hero');
	return {
		content: normalizeHero(content)
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
			const content = normalizeHero(JSON.parse(json));

			for (const p of content.presets) {
				if (!p.classic.titleLine1.trim() || !p.slider.titleLine1.trim()) {
					return fail(400, { error: `Die Headline darf nicht leer sein («${p.name}»).` });
				}
			}

			await saveSectionContent('hero', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
