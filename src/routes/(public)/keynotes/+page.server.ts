// ═══════════════════════════════════════════════════════════
// Keynotes — Server Load
// Redaktioneller Inhalt aus 'keynotespage', Termine aus 'keynotes'.
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultKeynotesPage, defaultKeynotes, mergeContent } from '$lib/server/content-defaults';
import { pageTitle } from '$lib/config/site';
import type { KeynotesPageContent, KeynotesContent } from '$lib/types/content';
import type { PageMeta } from '$lib/types/seo';

const meta: PageMeta = {
	title: pageTitle('Keynotes & Lehre'),
	description:
		'Keynotes zu KI, Governance und digitaler Urteilskraft — ohne Hype, aus erster Hand. Formate, Auftritte und Speaker-Kit von Brigitte Hulliger.'
};

export const load: PageServerLoad = async () => {
	const [page, events] = await Promise.all([
		getSectionContent<KeynotesPageContent>('keynotespage'),
		getSectionContent<KeynotesContent>('keynotes')
	]);
	return {
		content: mergeContent(defaultKeynotesPage, page),
		events: mergeContent(defaultKeynotes, events),
		meta
	};
};
