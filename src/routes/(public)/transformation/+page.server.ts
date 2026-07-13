// ═══════════════════════════════════════════════════════════
// Transformation — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultTransformation } from '$lib/server/content-defaults';
import type { TransformationContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<TransformationContent>('transformation');
	return {
		content: { ...defaultTransformation, ...((raw as Partial<TransformationContent>) ?? {}) }
	};
};
