// ═══════════════════════════════════════════════════════════
// Kontakt — Server Load (nur Meta)
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { pageTitle } from '$lib/config/site';
import type { PageMeta } from '$lib/types/seo';

const meta: PageMeta = {
	title: pageTitle('Kontakt'),
	description:
		'Kontakt zu Brigitte Hulliger, Break the Box GmbH — IT-Strategie, Verwaltungsrat und KI. Per E-Mail oder Telefon.'
};

export const load: PageServerLoad = () => ({ meta });
