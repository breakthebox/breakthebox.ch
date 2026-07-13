// ═══════════════════════════════════════════════════════════
// Experimentierraum — Server Load
// Redaktioneller Inhalt aus 'experimentierraum'.
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultExperimentierraum, mergeContent } from '$lib/server/content-defaults';
import type { ExperimentierraumContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ExperimentierraumContent>('experimentierraum');
	return {
		content: mergeContent(defaultExperimentierraum, raw)
	};
};
