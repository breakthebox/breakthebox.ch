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

export const load: PageServerLoad = async ({ parent }) => {
	const [parentData, allContent] = await Promise.all([parent(), getAllContent()]);

	// Merge mit Defaults, damit unvollständige/ältere DB-Einträge nicht crashen,
	// wenn die Public-Seite verschachtelte Felder (z.B. .items, .clients) dereferenziert.
	return {
		// Welcher Hero lädt, bestimmt das aktive Theme (heroPresetId).
		hero: resolveActiveHero(normalizeHero(allContent.hero), parentData.theme?.heroPresetId),
		sections: normalizeSections(allContent.sections),
		pillars: { ...defaultPillars, ...((allContent.pillars as Partial<PillarsContent>) ?? {}) },
		about: normalizeAbout(allContent.about),
		references: { ...defaultReferences, ...((allContent.references as Partial<ReferencesContent>) ?? {}) },
		angebot: { ...defaultAngebot, ...((allContent.angebot as Partial<AngebotContent>) ?? {}) },
		testimonials: { ...defaultTestimonials, ...((allContent.testimonials as Partial<TestimonialsContent>) ?? {}) },
		metrics: { ...defaultMetrics, ...((allContent.metrics as Partial<MetricsContent>) ?? {}) },
		partners: { ...defaultPartners, ...((allContent.partners as Partial<PartnersContent>) ?? {}) },
		keynotes: { ...defaultKeynotes, ...((allContent.keynotes as Partial<KeynotesContent>) ?? {}) },
		faq: { ...defaultFaq, ...((allContent.faq as Partial<FaqContent>) ?? {}) },
		theme: parentData.theme
	};
};
