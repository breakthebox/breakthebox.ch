import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { normalizeMedia } from '$lib/server/content-defaults';
import type { MediaContent, ThemeContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const [media, theme] = await Promise.all([
		getSectionContent<MediaContent>('media'),
		getSectionContent<ThemeContent>('theme')
	]);
	return {
		content: normalizeMedia(media, theme)
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
			const content = normalizeMedia(JSON.parse(json));
			await saveSectionContent('media', content, locals.user?.id);

			// Hygiene: Theme-Zuweisungen auf gelöschte Bilder lösen, damit keine
			// toten Referenzen in Hero-/Pillar-Slots zurückbleiben.
			const theme = await getSectionContent<ThemeContent>('theme');
			if (theme) {
				const urls = new Set(content.library.map((i) => i.url));
				let changed = false;
				for (const t of theme.themes ?? []) {
					if (t.heroImage && !urls.has(t.heroImage)) {
						t.heroImage = '';
						changed = true;
					}
					for (const key of Object.keys(t.pillarImages ?? {})) {
						if (t.pillarImages![key] && !urls.has(t.pillarImages![key])) {
							t.pillarImages![key] = '';
							changed = true;
						}
					}
				}
				if (changed) await saveSectionContent('theme', theme, locals.user?.id);
			}

			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
