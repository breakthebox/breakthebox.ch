import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultWalkTheTalk } from '$lib/server/content-defaults';
import type { WalkTheTalkContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const content = await getSectionContent<WalkTheTalkContent>('walkthetalk');
	return {
		content: content ?? defaultWalkTheTalk
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
			const content = JSON.parse(json) as WalkTheTalkContent;

			if (!content.platforms || !Array.isArray(content.platforms)) {
				return fail(400, { error: 'Plattformen müssen als Liste vorhanden sein.' });
			}

			for (const platform of content.platforms) {
				if (!platform.name || !platform.desc) {
					return fail(400, { error: 'Jede Plattform braucht einen Namen und eine Beschreibung.' });
				}
			}

			if (!content.missbizzy || !content.missbizzy.title || !content.missbizzy.desc) {
				return fail(400, { error: 'Miss Bizzy braucht einen Titel und eine Beschreibung.' });
			}

			await saveSectionContent('walkthetalk', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
