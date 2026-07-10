// ═══════════════════════════════════════════════════════════
// Keynotes — Server Load (gleiche Quelle wie die Bühne-Sektion)
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultKeynotes } from '$lib/server/content-defaults';
import type { KeynotesContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<KeynotesContent>('keynotes');
	return {
		content: { ...defaultKeynotes, ...((raw as Partial<KeynotesContent>) ?? {}) }
	};
};
