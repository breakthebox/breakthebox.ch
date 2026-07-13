// ═══════════════════════════════════════════════════════════
// Keynotes — Server Load
// Redaktioneller Inhalt aus 'keynotespage', Termine aus 'keynotes'.
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultKeynotesPage, defaultKeynotes, mergeContent } from '$lib/server/content-defaults';
import type { KeynotesPageContent, KeynotesContent } from '$lib/types/content';

export const load: PageServerLoad = async () => {
	const [page, events] = await Promise.all([
		getSectionContent<KeynotesPageContent>('keynotespage'),
		getSectionContent<KeynotesContent>('keynotes')
	]);
	return {
		content: mergeContent(defaultKeynotesPage, page),
		events: mergeContent(defaultKeynotes, events)
	};
};
