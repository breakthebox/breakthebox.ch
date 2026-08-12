// ═══════════════════════════════════════════════════════════
// Verwaltungsrat — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultGovernance, mergeContent } from '$lib/server/content-defaults';
import { pageTitle } from '$lib/config/site';
import type { GovernanceContent } from '$lib/types/content';
import type { PageMeta } from '$lib/types/seo';

const meta: PageMeta = {
	title: pageTitle('Governance'),
	description:
		'Digitale Urteilskraft dauerhaft im Gremium: Brigitte Hulliger als Verwaltungsrätin — IT und KI auf der Wirkungsseite, Verantwortung nach OR 716a.'
};

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<GovernanceContent>('governance');
	return {
		content: mergeContent(defaultGovernance, raw),
		meta
	};
};
