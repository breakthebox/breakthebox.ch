// ═══════════════════════════════════════════════════════════
// Public Page — Server Load
// ═══════════════════════════════════════════════════════════
// Fetches editable content from DB, falls back to defaults.

import type { PageServerLoad } from './$types';
import { getAllContent } from '$lib/server/db/queries/content';
import {
	defaultPillars,
	normalizeAbout,
	defaultReferences,
	defaultAngebot,
	defaultTestimonials,
	defaultMetrics,
	defaultPartners,
	defaultKeynotes,
	defaultFaq,
	normalizeHero,
	resolveActiveHero,
	normalizeWelten,
	normalizeSections
} from '$lib/server/content-defaults';
import type {
	PillarsContent,
	ReferencesContent,
	AngebotContent,
	TestimonialsContent,
	MetricsContent,
	PartnersContent,
	KeynotesContent,
	FaqContent
} from '$lib/types/content';
import * as m from '$lib/paraglide/messages.js';
import type { PageMeta } from '$lib/types/seo';

// Startseite: eigener Titel statt `pageTitle()`, weil die Marke hier vorne steht.
const PAGE_TITLE = 'Brigitte Hulliger — IT-Strategie, Verwaltungsrat & KI | Break the Box';

export const load: PageServerLoad = async ({ parent }) => {
	const [parentData, allContent] = await Promise.all([parent(), getAllContent()]);

	const meta: PageMeta = { title: PAGE_TITLE, description: m.hero_subline() };

	// Merge mit Defaults, damit unvollständige/ältere DB-Einträge nicht crashen,
	// wenn die Public-Seite verschachtelte Felder (z.B. .items, .clients) dereferenziert.
	return {
		// Welcher Hero lädt, bestimmt das aktive Theme (heroPresetId).
		hero: resolveActiveHero(normalizeHero(allContent.hero), parentData.theme?.heroPresetId),
		sections: normalizeSections(allContent.sections),
		welten: normalizeWelten(allContent.welten),
		pillars: { ...defaultPillars, ...((allContent.pillars as Partial<PillarsContent>) ?? {}) },
		about: normalizeAbout(allContent.about),
		references: { ...defaultReferences, ...((allContent.references as Partial<ReferencesContent>) ?? {}) },
		angebot: { ...defaultAngebot, ...((allContent.angebot as Partial<AngebotContent>) ?? {}) },
		testimonials: { ...defaultTestimonials, ...((allContent.testimonials as Partial<TestimonialsContent>) ?? {}) },
		metrics: { ...defaultMetrics, ...((allContent.metrics as Partial<MetricsContent>) ?? {}) },
		partners: { ...defaultPartners, ...((allContent.partners as Partial<PartnersContent>) ?? {}) },
		keynotes: { ...defaultKeynotes, ...((allContent.keynotes as Partial<KeynotesContent>) ?? {}) },
		faq: { ...defaultFaq, ...((allContent.faq as Partial<FaqContent>) ?? {}) },
		theme: parentData.theme,
		meta
	};
};
