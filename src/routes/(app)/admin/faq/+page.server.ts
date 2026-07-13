// ═══════════════════════════════════════════════════════════
// Zentraler FAQ-Editor — alle FAQ an einem Ort, per Tab.
// Startseite (Sektion 'faq') plus die seitenspezifischen FAQ von
// Transformation, Governance und Keynotes-Seite.
// ═══════════════════════════════════════════════════════════

import type { PageServerLoad, Actions } from './$types';
import { getSectionContent, saveSectionContent } from '$lib/server/db/queries/content';
import {
	defaultFaq,
	defaultTransformation,
	defaultGovernance,
	defaultKeynotesPage,
	mergeContent
} from '$lib/server/content-defaults';
import type {
	FaqContent,
	FaqItem,
	TransformationContent,
	GovernanceContent,
	KeynotesPageContent
} from '$lib/types/content';
import { fail } from '@sveltejs/kit';

const TARGETS = ['faq', 'transformation', 'governance', 'keynotespage'] as const;
type Target = (typeof TARGETS)[number];

export const load: PageServerLoad = async () => {
	const [faq, tf, gov, kp] = await Promise.all([
		getSectionContent<FaqContent>('faq'),
		getSectionContent<TransformationContent>('transformation'),
		getSectionContent<GovernanceContent>('governance'),
		getSectionContent<KeynotesPageContent>('keynotespage')
	]);

	return {
		tabs: {
			faq: (faq ?? defaultFaq).items,
			transformation: mergeContent(defaultTransformation, tf).faq.items,
			governance: mergeContent(defaultGovernance, gov).faq.items,
			keynotespage: mergeContent(defaultKeynotesPage, kp).faq.items
		}
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const target = formData.get('target');
		const json = formData.get('items');

		if (typeof target !== 'string' || !TARGETS.includes(target as Target)) {
			return fail(400, { error: 'Unbekannter FAQ-Bereich.' });
		}
		if (typeof json !== 'string') {
			return fail(400, { error: 'Keine Daten erhalten.', target });
		}

		let items: FaqItem[];
		try {
			items = JSON.parse(json) as FaqItem[];
		} catch {
			return fail(400, { error: 'Ungültiges JSON-Format.', target });
		}

		if (!Array.isArray(items)) {
			return fail(400, { error: 'Ungültige Daten.', target });
		}
		for (const item of items) {
			if (!item.question?.trim() || !item.answer?.trim()) {
				return fail(400, { error: 'Jede Frage braucht eine Frage und eine Antwort.', target });
			}
		}

		const userId = locals.user?.id;

		// Startseiten-FAQ ist eine eigene Sektion; die übrigen leben im
		// jeweiligen Seiten-Content — dort nur das faq-Feld ersetzen.
		if (target === 'faq') {
			await saveSectionContent('faq', { items }, userId);
		} else if (target === 'transformation') {
			const cur = mergeContent(defaultTransformation, await getSectionContent<TransformationContent>('transformation'));
			cur.faq = { items };
			await saveSectionContent('transformation', cur, userId);
		} else if (target === 'governance') {
			const cur = mergeContent(defaultGovernance, await getSectionContent<GovernanceContent>('governance'));
			cur.faq = { items };
			await saveSectionContent('governance', cur, userId);
		} else if (target === 'keynotespage') {
			const cur = mergeContent(defaultKeynotesPage, await getSectionContent<KeynotesPageContent>('keynotespage'));
			cur.faq = { items };
			await saveSectionContent('keynotespage', cur, userId);
		}

		return { success: true, target };
	}
};
