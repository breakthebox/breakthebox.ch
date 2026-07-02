// ═══════════════════════════════════════════════════════════
// Referenzprojekte — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultReferenceProjects } from '$lib/server/content-defaults';
import type { ReferenceProjectsContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ReferenceProjectsContent>('referenzprojekte');
	return {
		content: { ...defaultReferenceProjects, ...((raw as Partial<ReferenceProjectsContent>) ?? {}) }
	};
};
