// ═══════════════════════════════════════════════════════════
// Verwaltungsrat — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultGovernance, mergeContent } from '$lib/server/content-defaults';
import type { GovernanceContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<GovernanceContent>('governance');
	return {
		content: mergeContent(defaultGovernance, raw)
	};
};
