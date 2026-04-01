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
	defaultWalkTheTalk,
	defaultReferences,
	defaultBlog
} from '$lib/server/content-defaults';
import type {
	PillarsContent,
	AboutContent,
	WalkTheTalkContent,
	ReferencesContent,
	BlogContent
} from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const [allContent, latestPosts] = await Promise.all([
		getAllContent(),
		getLatestBlogPosts(3)
	]);

	return {
		pillars: (allContent.pillars as PillarsContent) ?? defaultPillars,
		about: (allContent.about as AboutContent) ?? defaultAbout,
		walkthetalk: (allContent.walkthetalk as WalkTheTalkContent) ?? defaultWalkTheTalk,
		references: (allContent.references as ReferencesContent) ?? defaultReferences,
		blog: (allContent.blog as BlogContent) ?? defaultBlog,
		latestPosts
	};
};
