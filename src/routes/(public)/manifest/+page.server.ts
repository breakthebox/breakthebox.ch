// ═══════════════════════════════════════════════════════════
// Manifest — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getAllContent } from '$lib/server/db/queries/content';
import {
	defaultManifest,
	normalizeAbout,
	defaultExperimentierraum,
	mergeContent
} from '$lib/server/content-defaults';
import type { ManifestContent, ExperimentierraumContent } from '$lib/types/content';

const VR_PATTERN = /verwaltungsrä|vizepräsident|aufsichts|präsident|\bvr\b|gremium/i;

/** Zufällige Auswahl ohne Wiederholung (Fisher-Yates auf einer Kopie). */
function pickRandom<T>(items: T[], count: number): T[] {
	const pool = [...items];
	for (let i = pool.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[pool[i], pool[j]] = [pool[j], pool[i]];
	}
	return pool.slice(0, count);
}

export const load: PageServerLoad = async () => {
	const all = await getAllContent();

	const manifest: ManifestContent = { ...defaultManifest, ...((all.manifest as Partial<ManifestContent>) ?? {}) };
	const about = normalizeAbout(all.about);
	const experimentierraum = mergeContent<ExperimentierraumContent>(
		defaultExperimentierraum,
		all.experimentierraum
	);

	// Beweis-Spalten — drei wechselnde Experimente aus dem Experimentierraum
	const platforms = pickRandom(experimentierraum.bench.items, 3);
	const vrRolesFiltered = about.roles.filter((r) => VR_PATTERN.test(r.title));
	const vrRoles = vrRolesFiltered.length > 0 ? vrRolesFiltered : about.roles;

	return {
		manifest,
		platforms,
		vrRoles,
		qualifications: about.qualifications
	};
};
