import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { normalizeMenu } from '$lib/server/content-defaults';
import { MENU_TARGETS } from '$lib/config/menu-targets';
import type { MenuContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<MenuContent>('menu');
	// normalizeMenu(null) liefert die Standard-Navigation — so ist im Admin
	// sichtbar, was heute auf der Seite steht, bevor je etwas gespeichert wurde.
	return {
		content: normalizeMenu(raw),
		targets: MENU_TARGETS
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
			// normalize verwirft unbekannte Ziele und sichert IDs.
			const content = normalizeMenu(JSON.parse(json));
			await saveSectionContent('menu', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
