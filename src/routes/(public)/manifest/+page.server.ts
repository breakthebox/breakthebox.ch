// ═══════════════════════════════════════════════════════════
// Manifest — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getAllContent } from '$lib/server/db/queries/content';
import {
	defaultManifest,
	normalizeAbout,
	defaultExperiments,
	normalizeExperiments
} from '$lib/server/content-defaults';
import type { ManifestContent } from '$lib/types/content';

const VR_PATTERN = /verwaltungsrä|vizepräsident|aufsichts|präsident|\bvr\b|gremium/i;

export const load: PageServerLoad = async () => {
	const all = await getAllContent();

	const manifest: ManifestContent = { ...defaultManifest, ...((all.manifest as Partial<ManifestContent>) ?? {}) };
	const about = normalizeAbout(all.about);
	const experiments = normalizeExperiments(all.experiments ?? defaultExperiments);

	// Beweis-Spalten
	const platforms = experiments.platforms.slice(0, 3);
	const vrRolesFiltered = about.roles.filter((r) => VR_PATTERN.test(r.title));
	const vrRoles = vrRolesFiltered.length > 0 ? vrRolesFiltered : about.roles;

	return {
		manifest,
		platforms,
		vrRoles,
		qualifications: about.qualifications
	};
};
