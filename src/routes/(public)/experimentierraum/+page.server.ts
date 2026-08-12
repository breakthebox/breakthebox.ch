// ═══════════════════════════════════════════════════════════
// Experimentierraum — Server Load
// Redaktioneller Inhalt aus 'experimentierraum'.
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultExperimentierraum, mergeContent } from '$lib/server/content-defaults';
import { pageTitle } from '$lib/config/site';
import type { ExperimentierraumContent } from '$lib/types/content';
import type { PageMeta } from '$lib/types/seo';

const meta: PageMeta = {
	title: pageTitle('Experimentierraum'),
	description:
		'Die Werkstatt statt Portfolio: eigene Plattformen, KI-Agenten und Infrastruktur — self-hosted, nicht kommerziell, ehrlich dokumentiert. Ich empfehle nichts, was ich nicht selbst gebaut habe.'
};

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<ExperimentierraumContent>('experimentierraum');
	return {
		content: mergeContent(defaultExperimentierraum, raw),
		meta
	};
};
