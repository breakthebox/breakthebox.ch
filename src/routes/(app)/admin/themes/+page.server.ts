import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { defaultTheme, defaultPillars, normalizeHero } from '$lib/server/content-defaults';
import type { ThemeContent, PillarsContent, HeroContent } from '$lib/types/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const [theme, pillars, hero] = await Promise.all([
		getSectionContent<ThemeContent>('theme'),
		getSectionContent<PillarsContent>('pillars'),
		getSectionContent<HeroContent>('hero')
	]);

	// Pillars nur für die Bild-Zuweisung (Key + Titel).
	const pillarSlots = (pillars ?? defaultPillars).pillars.map((p) => ({
		key: p.key,
		title: p.title
	}));

	// Hero-Presets nur für die Auswahl (id + Name + Variante).
	const heroPresets = normalizeHero(hero).presets.map((p) => ({
		id: p.id,
		name: p.name,
		variant: p.variant
	}));

	return {
		content: theme ?? defaultTheme,
		pillarSlots,
		heroPresets
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
			const content = JSON.parse(json) as ThemeContent;

			if (!Array.isArray(content.themes) || content.themes.length === 0) {
				return fail(400, { error: 'Mindestens ein Theme wird benötigt.' });
			}
			for (const t of content.themes) {
				if (!t.id || !t.name?.trim()) {
					return fail(400, { error: 'Jedes Theme braucht einen Namen.' });
				}
			}
			// Aktives Theme muss existieren.
			if (!content.themes.some((t) => t.id === content.activeId)) {
				content.activeId = content.themes[0].id;
			}
			if (!Array.isArray(content.library)) content.library = [];

			await saveSectionContent('theme', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
