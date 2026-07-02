// ═══════════════════════════════════════════════════════════
// Public Page — Server Load
// ═══════════════════════════════════════════════════════════
// Fetches editable content from DB, falls back to defaults.

import type { PageServerLoad } from './$types';
import { getAllContent } from '$lib/server/db/queries/content';
import { getLatestBlogPosts } from '$lib/server/db/queries/blog';
import {
	defaultPillars,
	defaultAbout,
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
	AboutContent,
	ReferencesContent,
	BlogContent,
	AngebotContent,
	TestimonialsContent,
	MetricsContent,
	PartnersContent,
	FaqContent
} from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const [allContent, latestPosts] = await Promise.all([
		getAllContent(),
		getLatestBlogPosts(3)
	]);

	return {
		pillars: (allContent.pillars as PillarsContent) ?? defaultPillars,
		// Merge mit Defaults, damit ältere DB-Einträge ohne title/socials nicht crashen
		about: { ...defaultAbout, ...((allContent.about as Partial<AboutContent>) ?? {}) },
		references: (allContent.references as ReferencesContent) ?? defaultReferences,
		blog: (allContent.blog as BlogContent) ?? defaultBlog,
		angebot: (allContent.angebot as AngebotContent) ?? defaultAngebot,
		testimonials: (allContent.testimonials as TestimonialsContent) ?? defaultTestimonials,
		metrics: (allContent.metrics as MetricsContent) ?? defaultMetrics,
		partners: (allContent.partners as PartnersContent) ?? defaultPartners,
		faq: (allContent.faq as FaqContent) ?? defaultFaq,
		latestPosts
	};
};
