import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import { normalizeSections, normalizeAbout } from '$lib/server/content-defaults';
import type { SectionsContent } from '$lib/types/content';
import * as m from '$lib/paraglide/messages.js';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const [content, aboutRaw] = await Promise.all([
		getSectionContent<SectionsContent>('sections'),
		getSectionContent('about')
	]);
	const normalized = normalizeSections(content);

	// Aktuelle Standardtexte pro Sektion — leere Override-Felder werden damit
	// vorbefüllt, sodass im Admin sichtbar ist, was heute auf der Seite steht.
	const about = normalizeAbout(aboutRaw);
	const DEFAULT_TEXTS: Record<string, { kicker: string; title: string; subtitle: string }> = {
		angebot: { kicker: m.h_angebot_label(), title: m.h_angebot_title(), subtitle: m.h_angebot_sub() },
		logos: { kicker: m.h_strip(), title: '', subtitle: '' },
		pillars: { kicker: m.h_pillars_label(), title: m.h_pillars_title(), subtitle: m.h_pillars_sub() },
		tension: { kicker: '', title: m.h_tension_title(), subtitle: m.h_tension_p() },
		about: { kicker: m.section_about_label(), title: about.title, subtitle: '' },
		haltung: { kicker: m.h_leap_label(), title: m.h_leap_title(), subtitle: '' },
		buehne: { kicker: m.h_buehne_label(), title: m.h_buehne_title(), subtitle: m.h_buehne_sub() },
		netzwerk: { kicker: m.h_netzwerk_label(), title: m.h_netzwerk_title(), subtitle: m.h_netzwerk_sub() },
		stimmen: { kicker: m.h_stimmen_label(), title: m.h_stimmen_title(), subtitle: m.h_stimmen_sub() },
		impulse: {
			kicker: m.h_impulse_label(),
			title: m.h_impulse_title(),
			subtitle: `${m.h_impulse_l1()} ${m.h_impulse_l2()} ${m.h_impulse_l3()}`
		},
		faq: { kicker: m.section_faq_label(), title: m.section_faq_title(), subtitle: '' },
		kontakt: { kicker: '', title: m.h_contact_title(), subtitle: m.h_contact_text().trim() }
	};

	return {
		content: {
			sections: normalized.sections.map((s) => {
				const d = DEFAULT_TEXTS[s.key] ?? { kicker: '', title: '', subtitle: '' };
				return {
					...s,
					kicker: s.kicker || d.kicker,
					title: s.title || d.title,
					subtitle: s.subtitle || d.subtitle
				};
			})
		}
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
			// normalize stellt sicher: nur bekannte Keys, jede Sektion genau einmal.
			const content = normalizeSections(JSON.parse(json));
			await saveSectionContent('sections', content, locals.user?.id);
			return { success: true };
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.' });
		}
	}
};
