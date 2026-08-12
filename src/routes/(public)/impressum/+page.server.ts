// ═══════════════════════════════════════════════════════════
// Impressum — Server Load (nur Meta)
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { pageTitle } from '$lib/config/site';
import * as m from '$lib/paraglide/messages.js';
import type { PageMeta } from '$lib/types/seo';

export const load: PageServerLoad = () => {
	const meta: PageMeta = {
		title: pageTitle('Impressum'),
		description: m.meta_impressum_description()
	};
	return { meta };
};
