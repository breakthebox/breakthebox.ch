// ═══════════════════════════════════════════════════════════
// Transformation — Server Load
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad } from './$types';
import { getSectionContent } from '$lib/server/db/queries/content';
import { defaultTransformation } from '$lib/server/content-defaults';
import { pageTitle } from '$lib/config/site';
import type { TransformationContent } from '$lib/types/content';
import type { PageMeta } from '$lib/types/seo';

const meta: PageMeta = {
	title: pageTitle('Transformation'),
	description:
		'Transformation, die trägt — IT-, Digital- und KI-Strategie in Stufen, die einzeln bestehen. Für Geschäftsleitungen und Verwaltungsräte.'
};

export const load: PageServerLoad = async () => {
	const raw = await getSectionContent<TransformationContent>('transformation');
	return {
		content: { ...defaultTransformation, ...((raw as Partial<TransformationContent>) ?? {}) },
		meta
	};
};
