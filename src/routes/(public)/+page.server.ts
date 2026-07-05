// ═══════════════════════════════════════════════════════════
// Public Page — Server Load
// ═══════════════════════════════════════════════════════════
// Fetches editable content from DB, falls back to defaults.

import type { PageServerLoad } from './$types';
import { getAllContent } from '$lib/server/db/queries/content';
import { getLatestBlogPosts } from '$lib/server/db/queries/blog';
import {
	defaultPillars,
	normalizeAbout,
	defaultReferences,
	defaultBlog,
	defaultAngebot,
	defaultTestimonials,
	defaultMetrics,
	defaultPartners,
	defaultFaq
} from '$lib/server/content-defaults';
import type {
	PillarsContent,
	ReferencesContent,
	BlogContent,
	AngebotContent,
	TestimonialsContent,
	MetricsContent,
	PartnersContent,
	FaqContent
} from '$lib/types/content';

export const load: PageServerLoad = async ({ parent }) => {
	const [parentData, allContent, latestPosts] = await Promise.all([
		parent(),
		getAllContent(),
		getLatestBlogPosts(3)
	]);

	// Merge mit Defaults, damit unvollständige/ältere DB-Einträge nicht crashen,
	// wenn die Public-Seite verschachtelte Felder (z.B. .items, .clients) dereferenziert.
	return {
		pillars: { ...defaultPillars, ...((allContent.pillars as Partial<PillarsContent>) ?? {}) },
		about: normalizeAbout(allContent.about),
		references: { ...defaultReferences, ...((allContent.references as Partial<ReferencesContent>) ?? {}) },
		blog: (allContent.blog as BlogContent) ?? defaultBlog,
		angebot: { ...defaultAngebot, ...((allContent.angebot as Partial<AngebotContent>) ?? {}) },
		testimonials: { ...defaultTestimonials, ...((allContent.testimonials as Partial<TestimonialsContent>) ?? {}) },
		metrics: { ...defaultMetrics, ...((allContent.metrics as Partial<MetricsContent>) ?? {}) },
		partners: { ...defaultPartners, ...((allContent.partners as Partial<PartnersContent>) ?? {}) },
		faq: { ...defaultFaq, ...((allContent.faq as Partial<FaqContent>) ?? {}) },
		theme: parentData.theme,
		latestPosts
	};
};
