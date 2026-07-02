// ═══════════════════════════════════════════════════════════
// Experimentierraum — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultExperiments, normalizeExperiments } from '$lib/server/content-defaults';
import type { ExperimentsContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ExperimentsContent>('experiments');
	return {
		experiments: normalizeExperiments(raw ?? defaultExperiments)
	};
};
